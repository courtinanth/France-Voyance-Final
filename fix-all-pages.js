#!/usr/bin/env node
/**
 * Fix ALL non-city HTML pages:
 * 1. Remove "Horoscope du jour" from footer (wrong link)
 * 2. Remove "Politique des Cookies" from footer Info section
 * 3. Update CSS/JS version from v=2026 to v=2028
 * 4. Add defer to main.js if missing
 * 5. Add logger.js if missing
 * 6. Fix & to &amp; in nav link text
 * 7. Move "Tarot de Marseille" from Arts Divinatoires dropdown to Voyance Gratuite dropdown
 */

const fs = require('fs');
const path = require('path');

function getAllHtmlFiles(dir, excludeDirs) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (excludeDirs.includes(entry.name) || entry.name === 'node_modules' || entry.name === '.git') continue;
      results = results.concat(getAllHtmlFiles(fullPath, excludeDirs));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      // Skip Google verification file and offline PWA page
      if (entry.name === 'googled3845672a2c3301a.html' || entry.name === 'offline.html') continue;
      results.push(fullPath);
    }
  }
  return results;
}

const rootDir = __dirname;
// Exclude villes (already fixed separately)
const htmlFiles = getAllHtmlFiles(rootDir, ['villes']);
console.log(`Found ${htmlFiles.length} non-city pages to check`);

let updatedCount = 0;
const changes = {};

for (const filePath of htmlFiles) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  const relPath = path.relative(rootDir, filePath);
  const fileChanges = [];

  // 1. Remove "Horoscope du jour" footer link
  const horoscopeRegex = /\s*<li><a href="\/arts-divinatoires\/">Horoscope du jour<\/a><\/li>/g;
  if (horoscopeRegex.test(content)) {
    content = content.replace(horoscopeRegex, '');
    modified = true;
    fileChanges.push('removed Horoscope du jour');
  }

  // 2. Remove "Politique des Cookies" footer link
  const cookiesRegex = /\s*<li><a href="\/legal\/politique-cookies\/">Politique des Cookies<\/a><\/li>/g;
  if (cookiesRegex.test(content)) {
    // Need to re-read since .test() consumed the regex
    content = fs.readFileSync(filePath, 'utf8');
    if (modified) {
      // Re-apply previous fixes
      content = content.replace(/\s*<li><a href="\/arts-divinatoires\/">Horoscope du jour<\/a><\/li>/g, '');
    }
    content = content.replace(/\s*<li><a href="\/legal\/politique-cookies\/">Politique des Cookies<\/a><\/li>/g, '');
    modified = true;
    fileChanges.push('removed Politique des Cookies');
  }

  // 3. Update CSS version v=2026 to v=2028
  if (content.includes('v=2026')) {
    content = content.replace(/v=2026/g, 'v=2028');
    modified = true;
    fileChanges.push('updated v=2026 -> v=2028');
  }

  // 4. Add defer to main.js if missing
  // Match main.js with or without version param, without defer
  const mainJsNoDeferRegex = /<script src="\/js\/main\.js([^"]*)">\s*<\/script>/;
  const mainJsMatch = content.match(mainJsNoDeferRegex);
  if (mainJsMatch && !mainJsMatch[0].includes('defer')) {
    content = content.replace(
      mainJsNoDeferRegex,
      '<script src="/js/main.js?v=2028" defer></script>'
    );
    modified = true;
    fileChanges.push('added defer to main.js');
  }
  // Also ensure version is correct on main.js even if it has defer
  if (content.includes('main.js" defer') || content.includes('main.js?v=2026" defer')) {
    content = content.replace(
      /<script src="\/js\/main\.js[^"]*" defer><\/script>/,
      '<script src="/js/main.js?v=2028" defer></script>'
    );
    // Don't set modified here unless it actually changed
  }

  // 5. Add logger.js if missing
  if (!content.includes('logger.js')) {
    content = content.replace(
      /<script src="\/js\/main\.js[^"]*"[^>]*><\/script>/,
      '$&\n    <script src="/js/logger.js" defer></script>'
    );
    modified = true;
    fileChanges.push('added logger.js');
  }

  // 6. Fix & to &amp; in nav link text (only inside <nav> area)
  const navRegex = /<nav class="main-nav">([\s\S]*?)<\/nav>/;
  const navMatch = content.match(navRegex);
  if (navMatch) {
    let navContent = navMatch[1];
    const originalNav = navContent;
    // Fix all known unescaped ampersands in nav text
    navContent = navContent.replace(/Amour & Retour/g, 'Amour &amp; Retour');
    navContent = navContent.replace(/Medium & Défunts/g, 'Medium &amp; Défunts');
    navContent = navContent.replace(/Medium & Defunts/g, 'Medium &amp; Defunts');
    navContent = navContent.replace(/Travail & Carrière/g, 'Travail &amp; Carrière');
    navContent = navContent.replace(/Travail & Carriere/g, 'Travail &amp; Carriere');
    navContent = navContent.replace(/Argent & Finances/g, 'Argent &amp; Finances');
    navContent = navContent.replace(/Avis & Comparatifs/g, 'Avis &amp; Comparatifs');
    if (navContent !== originalNav) {
      content = content.replace(navRegex, '<nav class="main-nav">' + navContent + '</nav>');
      modified = true;
      fileChanges.push('fixed & -> &amp; in nav');
    }
  }

  // 7. Move "Tarot de Marseille" from Arts Divinatoires to Voyance Gratuite dropdown
  // First: check if it's in Arts Divinatoires dropdown
  const artsDropRegex = /(Arts\s+Divinatoires[\s\S]*?<ul\s+class="dropdown-menu">)([\s\S]*?)(<\/ul>)/;
  const artsMatch = content.match(artsDropRegex);
  if (artsMatch && artsMatch[2].includes('/tarot-marseille/')) {
    let artsContent = artsMatch[2];
    artsContent = artsContent.replace(/\s*<li><a href="\/tarot-marseille\/">Tarot de Marseille<\/a><\/li>/, '');
    content = content.replace(artsDropRegex, '$1' + artsContent + '$3');
    modified = true;
    fileChanges.push('removed Tarot de Marseille from Arts Divinatoires dropdown');
  }

  // Then: ensure it's in Voyance Gratuite dropdown
  const voyanceDropRegex = /(Voyance\s+Gratuite[\s\S]*?<ul\s+class="dropdown-menu">)([\s\S]*?)(<\/ul>[\s\S]*?(?:Arts\s+Divinatoires|Consulter))/;
  const voyanceMatch = content.match(voyanceDropRegex);
  if (voyanceMatch && !voyanceMatch[2].includes('/tarot-marseille/')) {
    // Add Tarot de Marseille as first item in Voyance Gratuite dropdown
    const indentMatch = voyanceMatch[2].match(/(\s*)<li>/);
    const indent = indentMatch ? indentMatch[1] : '\n                            ';
    const newItem = `${indent}<li><a href="/tarot-marseille/">Tarot de Marseille</a></li>`;
    const newContent = newItem + voyanceMatch[2];
    content = content.replace(voyanceDropRegex, '$1' + newContent + '$3');
    modified = true;
    fileChanges.push('added Tarot de Marseille to Voyance Gratuite dropdown');
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    updatedCount++;
    changes[relPath] = fileChanges;
  }
}

console.log(`\nDone! Updated ${updatedCount} of ${htmlFiles.length} pages.\n`);

if (Object.keys(changes).length > 0) {
  console.log('Changes by file:');
  for (const [file, changeList] of Object.entries(changes)) {
    console.log(`  ${file}: ${changeList.join(', ')}`);
  }
}
