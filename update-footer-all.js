#!/usr/bin/env node
/**
 * Mass-update footer "Navigation Rapide" across all HTML files:
 * - Add Tarot de Marseille link if missing
 * - Add Glossaire link if missing
 * - Add Avis Plateformes link if missing
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
const htmlFiles = getAllHtmlFiles(rootDir);

let updatedCount = 0;

for (const filePath of htmlFiles) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Find the footer section
  const footerMatch = content.match(/<footer[\s\S]*?<\/footer>/i);
  if (!footerMatch) continue;

  const footer = footerMatch[0];

  // Find the "Navigation Rapide" section in footer
  const navRapideMatch = footer.match(/(Navigation Rapide[\s\S]*?<ul\s+class="footer-links">)([\s\S]*?)(<\/ul>)/);
  if (!navRapideMatch) continue;

  let navLinks = navRapideMatch[2];
  const indentMatch = navLinks.match(/(\s*)<li>/);
  const indent = indentMatch ? indentMatch[1] : '\n                        ';

  // Add Tarot de Marseille if not present
  if (!navLinks.includes('/tarot-marseille/')) {
    navLinks += `${indent}<li><a href="/tarot-marseille/">Tarot de Marseille</a></li>`;
    modified = true;
  }

  // Add Numérologie if not present
  if (!navLinks.includes('/numerologie/') && !navLinks.includes('numerologie-gratuite')) {
    navLinks += `${indent}<li><a href="/numerologie/">Numérologie</a></li>`;
    modified = true;
  }

  // Add Avis Plateformes if not present
  if (!navLinks.includes('/avis/')) {
    navLinks += `${indent}<li><a href="/avis/">Avis Plateformes</a></li>`;
    modified = true;
  }

  // Add Glossaire if not present
  if (!navLinks.includes('/glossaire/')) {
    navLinks += `${indent}<li><a href="/glossaire/">Glossaire</a></li>`;
    modified = true;
  }

  if (modified) {
    const oldFooterSection = navRapideMatch[0];
    const newFooterSection = navRapideMatch[1] + navLinks + navRapideMatch[3];
    content = content.replace(oldFooterSection, newFooterSection);
    fs.writeFileSync(filePath, content, 'utf8');
    updatedCount++;
    console.log(`Updated: ${path.relative(rootDir, filePath)}`);
  }
}

console.log(`\nDone! Files updated: ${updatedCount}`);
