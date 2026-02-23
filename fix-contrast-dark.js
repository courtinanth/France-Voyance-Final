#!/usr/bin/env node
/**
 * Fix dark-on-dark contrast issues: #333, #444, #555 text colors
 * and dark purple headings (#4A1A6B) that are invisible on the dark background.
 * Also fix in generator scripts.
 */

const fs = require('fs');
const path = require('path');

function getAllFiles(dir, ext) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git') {
      results = results.concat(getAllFiles(fullPath, ext));
    } else if (entry.isFile() && entry.name.endsWith(ext)) {
      results.push(fullPath);
    }
  }
  return results;
}

const rootDir = __dirname;

// Color replacements for dark-on-dark issues
const replacements = [
  // Dark colors used as text on dark backgrounds
  // #333 -> light readable color
  [/color:\s*#333\b/g, 'color:#e0e0e0'],
  // #444 -> light readable color
  [/color:\s*#444\b/g, 'color:#dcdcdc'],
  // #555 -> light readable color
  [/color:\s*#555\b/g, 'color:#d8d8d8'],
  // Dark purple headings invisible on dark bg
  [/color:\s*#4A1A6B\b/gi, 'color:#D4AF37'],
  // var(--color-text-dark) which is #333 - often used wrongly on dark bg
  // Only replace in inline styles, not in CSS files
];

// Process HTML files
const htmlFiles = getAllFiles(rootDir, '.html');
let htmlUpdated = 0;
let htmlReplacements = 0;

for (const filePath of htmlFiles) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let count = 0;

  for (const [from, to] of replacements) {
    const matches = content.match(from);
    if (matches) {
      // Be careful: only replace color:#333 etc in inline styles (style="..."),
      // not in CSS class definitions that might be for light-background elements.
      // Since these are HTML files with inline styles on dark bg, safe to replace all.
      content = content.replace(from, to);
      count += matches.length;
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    htmlUpdated++;
    htmlReplacements += count;
    console.log(`HTML: ${path.relative(rootDir, filePath)} (${count} fixes)`);
  }
}

// Process JS generator files
const jsFiles = [
  'generate-tarot-pages.js',
  'generate-glossaire-pages.js',
  'generate-avis-pages.js',
  'generate-numerologie-pages.js',
  'generate-local-pages-v3.js',
  'generate-html-sitemap.js'
];

let jsUpdated = 0;
let jsReplacements = 0;

for (const f of jsFiles) {
  const filePath = path.join(rootDir, f);
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let count = 0;

    for (const [from, to] of replacements) {
      const matches = content.match(from);
      if (matches) {
        content = content.replace(from, to);
        count += matches.length;
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      jsUpdated++;
      jsReplacements += count;
      console.log(`JS: ${f} (${count} fixes)`);
    }
  } catch (e) {
    // File doesn't exist, skip
  }
}

console.log(`\nDone!`);
console.log(`HTML files updated: ${htmlUpdated} (${htmlReplacements} fixes)`);
console.log(`JS files updated: ${jsUpdated} (${jsReplacements} fixes)`);
