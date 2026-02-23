#!/usr/bin/env node
/**
 * Mass-update navigation across all HTML files:
 * 1. Add "Tarot de Marseille" as first item in Arts Divinatoires dropdown
 * 2. Add "Glossaire Ésotérique" at end of Voyance Gratuite dropdown
 * 3. Normalize Voyance Gratuite dropdown to 8 items (add missing Compatibilité Astrale + Tirage de Runes if needed)
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

// The target Arts Divinatoires dropdown (with Tarot de Marseille added first)
const artsTarget = [
  '<li><a href="/tarot-marseille/">Tarot de Marseille</a></li>',
  '<li><a href="/arts-divinatoires/pendule/">Voyance Pendule</a></li>',
  '<li><a href="/arts-divinatoires/oracle-belline/">Oracle Belline</a></li>',
  '<li><a href="/arts-divinatoires/oracle-ge/">Oracle G\\u00e9</a></li>',
  '<li><a href="/arts-divinatoires/runes/">Tirage Runes</a></li>',
  '<li><a href="/arts-divinatoires/cartomancie/">Cartomancie</a></li>',
];

// The target Voyance Gratuite dropdown (with Glossaire added at end)
const voyanceTarget = [
  '<li><a href="/voyance-gratuite/tarot-gratuit/">Tarot Gratuit</a></li>',
  '<li><a href="/voyance-gratuite/tarot-d-amour/">Tarot Amour</a></li>',
  '<li><a href="/voyance-gratuite/numerologie-gratuite/">Num\\u00e9rologie Gratuite</a></li>',
  '<li><a href="/voyance-gratuite/pendule-oui-non/">Pendule Oui/Non</a></li>',
  '<li><a href="/voyance-gratuite/tarot-oui-non/">Tarot Oui/Non</a></li>',
  '<li><a href="/voyance-gratuite/compatibilite-astrale/">Compatibilit\\u00e9 Astrale</a></li>',
  '<li><a href="/voyance-gratuite/tirage-runes/">Tirage de Runes</a></li>',
  '<li><a href="/glossaire/">Glossaire \\u00c9sot\\u00e9rique</a></li>',
];

const rootDir = __dirname;
const htmlFiles = getAllHtmlFiles(rootDir);

let updatedCount = 0;
let artsUpdated = 0;
let voyanceUpdated = 0;
let skipped = 0;

for (const filePath of htmlFiles) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // --- FIX ARTS DIVINATOIRES ---
  // Match the Arts Divinatoires dropdown and check if Tarot de Marseille is already there
  const artsDropdownRegex = /(Arts\s+Divinatoires[\s\S]*?<ul\s+class="dropdown-menu">)([\s\S]*?)(<\/ul>)/;
  const artsMatch = content.match(artsDropdownRegex);

  if (artsMatch) {
    const dropdownContent = artsMatch[2];

    // Check if Tarot de Marseille is NOT already present
    if (!dropdownContent.includes('/tarot-marseille/')) {
      // Build the new dropdown content with proper indentation
      // Detect the indentation used
      const indentMatch = dropdownContent.match(/(\s*)<li>/);
      const indent = indentMatch ? indentMatch[1] : '\n                        ';

      const newItems = [
        `${indent}<li><a href="/tarot-marseille/">Tarot de Marseille</a></li>`
      ].join('');

      // Insert Tarot de Marseille as the first item
      const newContent = newItems + dropdownContent;
      content = content.replace(artsDropdownRegex, '$1' + newContent + '$3');
      modified = true;
      artsUpdated++;
    }
  }

  // --- FIX VOYANCE GRATUITE ---
  // Match the Voyance Gratuite dropdown
  const voyanceDropdownRegex = /(Voyance\s+Gratuite[\s\S]*?<ul\s+class="dropdown-menu">)([\s\S]*?)(<\/ul>[\s\S]*?Arts\s+Divinatoires)/;
  const voyanceMatch = content.match(voyanceDropdownRegex);

  if (voyanceMatch) {
    let dropdownContent = voyanceMatch[2];

    // Detect indentation
    const indentMatch = dropdownContent.match(/(\s*)<li>/);
    const indent = indentMatch ? indentMatch[1] : '\n                        ';

    // Add Compatibilité Astrale if missing
    if (!dropdownContent.includes('compatibilite-astrale')) {
      dropdownContent += `${indent}<li><a href="/voyance-gratuite/compatibilite-astrale/">Compatibilit\u00e9 Astrale</a></li>`;
      modified = true;
    }

    // Add Tirage de Runes if missing
    if (!dropdownContent.includes('tirage-runes')) {
      dropdownContent += `${indent}<li><a href="/voyance-gratuite/tirage-runes/">Tirage de Runes</a></li>`;
      modified = true;
    }

    // Add Glossaire if missing
    if (!dropdownContent.includes('/glossaire/')) {
      dropdownContent += `${indent}<li><a href="/glossaire/">Glossaire \u00c9sot\u00e9rique</a></li>`;
      modified = true;
      voyanceUpdated++;
    }

    if (modified) {
      content = content.replace(voyanceDropdownRegex, '$1' + dropdownContent + '$3');
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    updatedCount++;
    const rel = path.relative(rootDir, filePath);
    console.log(`Updated: ${rel}`);
  } else {
    skipped++;
  }
}

console.log(`\nDone!`);
console.log(`Files updated: ${updatedCount}`);
console.log(`Arts Divinatoires updated: ${artsUpdated}`);
console.log(`Voyance Gratuite updated: ${voyanceUpdated}`);
console.log(`Files skipped (already up to date or no nav): ${skipped}`);
