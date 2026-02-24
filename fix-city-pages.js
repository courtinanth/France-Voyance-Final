#!/usr/bin/env node
/**
 * Fix city pages:
 * 1. Remove "Horoscope du jour" from footer (wrong link)
 * 2. Remove "Politique des Cookies" from footer Info section (inconsistent)
 * 3. Update CSS/JS version from v=2026 to v=2028
 * 4. Add defer to main.js if missing
 * 5. Add logger.js if missing
 * 6. Normalize header nav: ensure "Tarot de Marseille" is in Voyance Gratuite dropdown (not Arts Divinatoires)
 * 7. Use &amp; instead of & in nav links
 */

const fs = require('fs');
const path = require('path');

function getAllHtmlFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git') {
      results = results.concat(getAllHtmlFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const rootDir = __dirname;
const villesDir = path.join(rootDir, 'villes');

if (!fs.existsSync(villesDir)) {
  console.log('No villes directory found');
  process.exit(1);
}

const htmlFiles = getAllHtmlFiles(villesDir);
console.log(`Found ${htmlFiles.length} city pages to fix`);

let updatedCount = 0;

for (const filePath of htmlFiles) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 1. Remove "Horoscope du jour" footer link
  if (content.includes('Horoscope du jour')) {
    content = content.replace(/\s*<li><a href="\/arts-divinatoires\/">Horoscope du jour<\/a><\/li>/g, '');
    modified = true;
  }

  // 2. Remove "Politique des Cookies" footer link
  if (content.includes('Politique des Cookies') || content.includes('politique-cookies')) {
    content = content.replace(/\s*<li><a href="\/legal\/politique-cookies\/">Politique des Cookies<\/a><\/li>/g, '');
    modified = true;
  }

  // 3. Update CSS version v=2026 to v=2028
  if (content.includes('v=2026')) {
    content = content.replace(/v=2026/g, 'v=2028');
    modified = true;
  }

  // 4. Add defer to main.js if missing
  if (content.includes('<script src="/js/main.js') && !content.includes('main.js?v=2028" defer')) {
    content = content.replace(
      /<script src="\/js\/main\.js[^"]*"><\/script>/,
      '<script src="/js/main.js?v=2028" defer></script>'
    );
    modified = true;
  }

  // 5. Add logger.js if missing
  if (!content.includes('logger.js')) {
    content = content.replace(
      /<script src="\/js\/main\.js[^"]*"[^>]*><\/script>/,
      '$&\n    <script src="/js/logger.js" defer></script>'
    );
    modified = true;
  }

  // 6. Fix & to &amp; in nav dropdown links
  // Only in nav area (Amour & Retour -> Amour &amp; Retour, etc.)
  const navRegex = /<nav class="main-nav">([\s\S]*?)<\/nav>/;
  const navMatch = content.match(navRegex);
  if (navMatch) {
    let navContent = navMatch[1];
    // Fix unescaped & in text content (not in URLs or entities)
    const originalNav = navContent;
    navContent = navContent.replace(/Amour & Retour/g, 'Amour &amp; Retour');
    navContent = navContent.replace(/Medium & Défunts/g, 'Medium &amp; Défunts');
    navContent = navContent.replace(/Travail & Carrière/g, 'Travail &amp; Carrière');
    navContent = navContent.replace(/Argent & Finances/g, 'Argent &amp; Finances');
    navContent = navContent.replace(/Avis & Comparatifs/g, 'Avis &amp; Comparatifs');
    if (navContent !== originalNav) {
      content = content.replace(navRegex, '<nav class="main-nav">' + navContent + '</nav>');
      modified = true;
    }
  }

  // 7. Fix header nav: ensure Voyance Gratuite dropdown has "Tarot de Marseille"
  // and it's NOT duplicated in Arts Divinatoires
  const voyanceDropRegex = /(Voyance\s+Gratuite[\s\S]*?<ul\s+class="dropdown-menu">)([\s\S]*?)(<\/ul>[\s\S]*?Arts\s+Divinatoires)/;
  const voyanceMatch = content.match(voyanceDropRegex);
  if (voyanceMatch && !voyanceMatch[2].includes('/tarot-marseille/')) {
    // Add Tarot de Marseille as first item
    const indentMatch = voyanceMatch[2].match(/(\s*)<li>/);
    const indent = indentMatch ? indentMatch[1] : '\n                            ';
    const newItem = `${indent}<li><a href="/tarot-marseille/">Tarot de Marseille</a></li>`;
    const newContent = newItem + voyanceMatch[2];
    content = content.replace(voyanceDropRegex, '$1' + newContent + '$3');
    modified = true;
  }

  // Remove Tarot de Marseille from Arts Divinatoires dropdown (it belongs in Voyance Gratuite)
  const artsDropRegex = /(Arts\s+Divinatoires[\s\S]*?<ul\s+class="dropdown-menu">)([\s\S]*?)(<\/ul>)/;
  const artsMatch = content.match(artsDropRegex);
  if (artsMatch && artsMatch[2].includes('/tarot-marseille/')) {
    let artsContent = artsMatch[2];
    artsContent = artsContent.replace(/\s*<li><a href="\/tarot-marseille\/">Tarot de Marseille<\/a><\/li>/, '');
    content = content.replace(artsDropRegex, '$1' + artsContent + '$3');
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    updatedCount++;
  }
}

console.log(`\nDone! Updated ${updatedCount} of ${htmlFiles.length} city pages.`);
