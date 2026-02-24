#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function getAllHtml(dir) {
  let r = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory() && e.name !== '.git' && e.name !== 'node_modules') {
      r = r.concat(getAllHtml(p));
    } else if (e.isFile() && e.name.endsWith('.html') && e.name !== 'googled3845672a2c3301a.html' && e.name !== 'offline.html') {
      r.push(p);
    }
  }
  return r;
}

const files = getAllHtml(__dirname);
let noLogger = [], unescapedAmp = [], tarotInArts = [], noDefer = [], oldVersion = [], noHoroscope = 0, noCookies = 0;

for (const f of files) {
  const c = fs.readFileSync(f, 'utf8');
  const rel = path.relative(__dirname, f);

  if (!c.includes('logger.js')) noLogger.push(rel);

  if (c.includes('v=2026')) oldVersion.push(rel);

  // Check main.js without defer
  if (c.includes('/js/main.js') && !c.includes('main.js?v=2028" defer')) {
    noDefer.push(rel);
  }

  // Check for unescaped & in nav
  const navMatch = c.match(/<nav class="main-nav">([\s\S]*?)<\/nav>/);
  if (navMatch) {
    const nav = navMatch[1];
    if (/(Amour|Medium|Travail|Argent|Avis) &[^a]/.test(nav)) unescapedAmp.push(rel);
  }

  // Check Tarot de Marseille in Arts Divinatoires dropdown
  const artsMatch = c.match(/Arts\s+Divinatoires[\s\S]*?<ul\s+class="dropdown-menu">([\s\S]*?)<\/ul>/);
  if (artsMatch && artsMatch[1].includes('/tarot-marseille/')) tarotInArts.push(rel);

  // Check footer issues
  if (c.includes('Horoscope du jour')) noHoroscope++;
  if (c.match(/<li><a href="\/legal\/politique-cookies\/">Politique des Cookies<\/a><\/li>/)) noCookies++;
}

console.log('=== VERIFICATION REPORT ===');
console.log('Total files checked: ' + files.length);
console.log('');
console.log('Pages missing logger.js: ' + noLogger.length);
if (noLogger.length > 0) console.log('  ' + noLogger.slice(0, 5).join('\n  ') + (noLogger.length > 5 ? '\n  ...' : ''));
console.log('');
console.log('Pages with v=2026: ' + oldVersion.length);
console.log('');
console.log('Pages with main.js without defer: ' + noDefer.length);
if (noDefer.length > 0) console.log('  ' + noDefer.slice(0, 5).join('\n  '));
console.log('');
console.log('Pages with unescaped & in nav: ' + unescapedAmp.length);
if (unescapedAmp.length > 0) console.log('  ' + unescapedAmp.slice(0, 10).join('\n  '));
console.log('');
console.log('Pages with Tarot de Marseille in Arts Divinatoires dropdown: ' + tarotInArts.length);
if (tarotInArts.length > 0) console.log('  ' + tarotInArts.join('\n  '));
console.log('');
console.log('Pages with "Horoscope du jour": ' + noHoroscope);
console.log('Pages with footer "Politique des Cookies" link: ' + noCookies);
