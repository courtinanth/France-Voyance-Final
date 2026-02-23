#!/usr/bin/env node
/**
 * Fix contrast issues across all HTML files by replacing low-contrast inline colors.
 * Target: any inline style with colors like #888, #999, #aaa on dark backgrounds.
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
let totalReplacements = 0;

// Color replacement map for inline styles - from low contrast to higher contrast
const colorReplacements = [
  // Breadcrumb separators and current page text
  { from: /color:\s*#888\b/g, to: 'color:#d0d0d0' },
  { from: /color:\s*#999\b/g, to: 'color:#d4d4d4' },
  { from: /color:\s*#aaa\b/g, to: 'color:#d8d8d8' },
  { from: /color:\s*#bbb\b/g, to: 'color:#dcdcdc' },
  // Low-opacity rgba whites
  { from: /color:\s*rgba\(255,\s*255,\s*255,\s*0\.3\)/g, to: 'color:rgba(255,255,255,0.65)' },
  { from: /color:\s*rgba\(255,\s*255,\s*255,\s*0\.4\)/g, to: 'color:rgba(255,255,255,0.7)' },
  { from: /color:\s*rgba\(255,\s*255,\s*255,\s*0\.5\)/g, to: 'color:rgba(255,255,255,0.75)' },
  // Very dark grays that appear on dark backgrounds
  { from: /color:\s*#666\b/g, to: 'color:#c0c0c0' },
  { from: /color:\s*#777\b/g, to: 'color:#c8c8c8' },
];

for (const filePath of htmlFiles) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let fileReplacements = 0;

  for (const { from, to } of colorReplacements) {
    const matches = content.match(from);
    if (matches) {
      content = content.replace(from, to);
      fileReplacements += matches.length;
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    updatedCount++;
    totalReplacements += fileReplacements;
    console.log(`Updated: ${path.relative(rootDir, filePath)} (${fileReplacements} replacements)`);
  }
}

console.log(`\nDone!`);
console.log(`Files updated: ${updatedCount}`);
console.log(`Total color replacements: ${totalReplacements}`);
