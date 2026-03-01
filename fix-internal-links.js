const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

function log(msg) { console.log(msg); }

function findIndexFiles(dir, results) {
  if (!results) results = [];
  var entries = fs.readdirSync(dir, { withFileTypes: true });
  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];
    var fullPath = path.join(dir, entry.name);
    var relPath = path.relative(ROOT, fullPath).replace(/\\/g, '/');
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git' || relPath.startsWith('villes') || relPath.includes('/villes/')) continue;
      findIndexFiles(fullPath, results);
    } else if (entry.name === 'index.html') {
      results.push(fullPath);
    }
  }
  return results;
}

function rel(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, '/');
}

function getUrlPath(filePath) {
  var r = rel(filePath);
  if (r === 'index.html') return '/';
  return '/' + r.replace('/index.html', '/');
}

function fixNavLinks(content) {
  var changed = false;
  var c1 = /<a\s+href="#"\s+class="nav-link">Consultations/g;
  if (c1.test(content)) {
    c1.lastIndex = 0;
    content = content.replace(c1, '<a href=\"/consultations/\" class=\"nav-link\">Consultations');
    changed = true;
    log('  [NAV] Fixed Consultations -> /consultations/');
  }
  var c2 = /<a\s+href="#"\s+class="nav-link">Arts Divinatoires/g;
  if (c2.test(content)) {
    c2.lastIndex = 0;
    content = content.replace(c2, '<a href=\"/arts-divinatoires/\" class=\"nav-link\">Arts Divinatoires');
    changed = true;
    log('  [NAV] Fixed Arts Divinatoires -> /arts-divinatoires/');
  }
  var c3 = /<a\s+href="#"\s+class="nav-link">Consulter/g;
  if (c3.test(content)) {
    c3.lastIndex = 0;
    content = content.replace(c3, '<a href=\"/consulter/voyance-telephone/\" class=\"nav-link\">Consulter');
    changed = true;
    log('  [NAV] Fixed Consulter -> /consulter/voyance-telephone/');
  }
  return { content: content, changed: changed };
}

function buildRelatedLinksHTML(links) {
  var lis = links.map(function(l) {
    return '<li><a href=\"' + l.href + '\" style=\"color:#4A1A6B;text-decoration:none;padding:8px 16px;background:#f8f4ff;border-radius:20px;display:inline-block;font-size:0.95em;transition:background 0.2s;\">' + l.text + '</a></li>';
  }).join('\n');
  return '\n<div class=\"related-links\" style=\"padding:20px 0;margin:30px 0;border-top:1px solid #eee;\">\n' +
    '<h3 style=\"color:#4A1A6B;font-size:1.1em;margin-bottom:15px;\">À découvrir également</h3>\n' +
    '<ul style=\"list-style:none;padding:0;display:flex;flex-wrap:wrap;gap:10px;\">\n' +
    lis + '\n</ul>\n</div>\n';
}

function insertBeforeMainClose(content, htmlToInsert) {
  var idx = content.lastIndexOf('</main>');
  if (idx !== -1) return content.slice(0, idx) + htmlToInsert + content.slice(idx);
  var fi = content.indexOf('<footer');
  if (fi !== -1) return content.slice(0, fi) + htmlToInsert + content.slice(fi);
  return null;
}

function getLinksForPage(urlPath) {
  if (urlPath === '/') {
    return [
      { href: '/blog/', text: 'Blog Voyance' },
      { href: '/consultations-voyants/', text: 'Consultations Voyants' }
    ];
  }
  if (urlPath === '/avis/') {
    return [
      { href: '/blog/', text: 'Blog Voyance' },
      { href: '/consultation/', text: 'Consultation Immédiate' },
      { href: '/consultations/', text: 'Nos Consultations' },
      { href: '/consultations-voyants/', text: 'Consultations Voyants' }
    ];
  }
  if (urlPath.startsWith('/avis/')) {
    return [
      { href: '/blog/', text: 'Blog Voyance' },
      { href: '/consultation/', text: 'Consultation Immédiate' },
      { href: '/arts-divinatoires/tirage-oui-non/', text: 'Tirage Oui/Non' },
      { href: '/consultations/', text: 'Nos Consultations' },
      { href: '/consultations-voyants/', text: 'Consultations Voyants' }
    ];
  }
  if (urlPath === '/consultations/') {
    return [
      { href: '/consultation/', text: 'Consultation Immédiate' },
      { href: '/blog/', text: 'Blog Voyance' },
      { href: '/consultations-voyants/', text: 'Consultations Voyants' },
      { href: '/consulter/voyance-telephone/', text: 'Voyance Téléphone' },
      { href: '/arts-divinatoires/tirage-oui-non/', text: 'Tirage Oui/Non Gratuit' }
    ];
  }
  if (urlPath.startsWith('/consultations/') && urlPath !== '/consultations/') {
    return [
      { href: '/consultation/', text: 'Consultation Immédiate' },
      { href: '/blog/', text: 'Blog Voyance' },
      { href: '/consultations/', text: 'Toutes nos Consultations' },
      { href: '/consultations-voyants/', text: 'Consultations Voyants' },
      { href: '/arts-divinatoires/tirage-oui-non/', text: 'Tirage Oui/Non Gratuit' }
    ];
  }
  if (urlPath.startsWith('/consulter/')) {
    return [
      { href: '/consultations/', text: 'Nos Consultations' },
      { href: '/consultation/', text: 'Consultation Immédiate' },
      { href: '/blog/', text: 'Blog Voyance' },
      { href: '/consultations-voyants/', text: 'Consultations Voyants' },
      { href: '/arts-divinatoires/tirage-oui-non/', text: 'Tirage Oui/Non Gratuit' }
    ];
  }
  if (urlPath === '/arts-divinatoires/') {
    return [
      { href: '/arts-divinatoires/tirage-oui-non/', text: 'Tirage Oui/Non' },
      { href: '/consultation/', text: 'Consultation Immédiate' },
      { href: '/blog/', text: 'Blog Voyance' },
      { href: '/consultations/', text: 'Nos Consultations' },
      { href: '/consultations-voyants/', text: 'Consultations Voyants' }
    ];
  }
  if (urlPath.startsWith('/arts-divinatoires/') && urlPath !== '/arts-divinatoires/') {
    return [
      { href: '/arts-divinatoires/', text: 'Arts Divinatoires' },
      { href: '/consultation/', text: 'Consultation Immédiate' },
      { href: '/blog/', text: 'Blog Voyance' },
      { href: '/consultations/', text: 'Nos Consultations' },
      { href: '/consultations-voyants/', text: 'Consultations Voyants' }
    ];
  }
  if (urlPath.startsWith('/voyance-gratuite/')) {
    return [
      { href: '/blog/', text: 'Blog Voyance' },
      { href: '/consultation/', text: 'Consultation Immédiate' },
      { href: '/consultations/', text: 'Nos Consultations' },
      { href: '/consultations-voyants/', text: 'Consultations Voyants' },
      { href: '/arts-divinatoires/tirage-oui-non/', text: 'Tirage Oui/Non' }
    ];
  }
  if (urlPath.startsWith('/alternatives/')) {
    return [
      { href: '/blog/', text: 'Blog Voyance' },
      { href: '/consultation/', text: 'Consultation Immédiate' },
      { href: '/consultations/', text: 'Nos Consultations' },
      { href: '/consultations-voyants/', text: 'Consultations Voyants' },
      { href: '/arts-divinatoires/tirage-oui-non/', text: 'Tirage Oui/Non' }
    ];
  }
  if (urlPath.startsWith('/consultations-voyants/')) {
    return [
      { href: '/consultation/', text: 'Consultation Immédiate' },
      { href: '/consultations/', text: 'Nos Consultations' },
      { href: '/blog/', text: 'Blog Voyance' },
      { href: '/avis/', text: 'Avis Plateformes' },
      { href: '/arts-divinatoires/tirage-oui-non/', text: 'Tirage Oui/Non' }
    ];
  }
  if (urlPath === '/consultation/') {
    return [
      { href: '/consultations/', text: 'Nos Consultations' },
      { href: '/blog/', text: 'Blog Voyance' },
      { href: '/consultations-voyants/', text: 'Consultations Voyants' },
      { href: '/arts-divinatoires/tirage-oui-non/', text: 'Tirage Oui/Non Gratuit' },
      { href: '/avis/', text: 'Avis Plateformes' }
    ];
  }
  if (urlPath === '/blog/') {
    return [
      { href: '/consultation/', text: 'Consultation Immédiate' },
      { href: '/consultations/', text: 'Nos Consultations' },
      { href: '/consultations-voyants/', text: 'Consultations Voyants' },
      { href: '/arts-divinatoires/tirage-oui-non/', text: 'Tirage Oui/Non' }
    ];
  }
  if (urlPath.startsWith('/blog/') && urlPath !== '/blog/') {
    return [
      { href: '/consultation/', text: 'Consultation Immédiate' },
      { href: '/consultations/', text: 'Nos Consultations' },
      { href: '/consultations-voyants/', text: 'Consultations Voyants' },
      { href: '/arts-divinatoires/tirage-oui-non/', text: 'Tirage Oui/Non' },
      { href: '/blog/', text: 'Tous les Articles' }
    ];
  }
  if (urlPath === '/comparatif/') {
    return [
      { href: '/consultation/', text: 'Consultation Immédiate' },
      { href: '/consultations/', text: 'Nos Consultations' },
      { href: '/blog/', text: 'Blog Voyance' },
      { href: '/consultations-voyants/', text: 'Consultations Voyants' }
    ];
  }
  if (urlPath.startsWith('/tarot-marseille/')) {
    return [
      { href: '/consultation/', text: 'Consultation Immédiate' },
      { href: '/blog/', text: 'Blog Voyance' },
      { href: '/consultations/', text: 'Nos Consultations' },
      { href: '/consultations-voyants/', text: 'Consultations Voyants' },
      { href: '/arts-divinatoires/tirage-oui-non/', text: 'Tirage Oui/Non' }
    ];
  }
  if (urlPath.startsWith('/numerologie/')) {
    return [
      { href: '/consultation/', text: 'Consultation Immédiate' },
      { href: '/blog/', text: 'Blog Voyance' },
      { href: '/consultations/', text: 'Nos Consultations' },
      { href: '/consultations-voyants/', text: 'Consultations Voyants' },
      { href: '/arts-divinatoires/tirage-oui-non/', text: 'Tirage Oui/Non' }
    ];
  }
  if (urlPath === '/glossaire/') {
    return [
      { href: '/consultation/', text: 'Consultation Immédiate' },
      { href: '/blog/', text: 'Blog Voyance' },
      { href: '/consultations/', text: 'Nos Consultations' },
      { href: '/consultations-voyants/', text: 'Consultations Voyants' }
    ];
  }
  return [];
}

function addRelatedLinks(content, filePath) {
  var urlPath = getUrlPath(filePath);
  if (content.includes('class=\"related-links\"')) return { content: content, changed: false };
  var links = getLinksForPage(urlPath);
  if (links.length === 0) return { content: content, changed: false };
  links = links.filter(function(l) { return !content.includes('href=\"' + l.href + '\"'); });
  if (links.length === 0) return { content: content, changed: false };
  var html = buildRelatedLinksHTML(links);
  var result = insertBeforeMainClose(content, html);
  if (result) {
    log('  [LINKS] Added ' + links.length + ' related links: ' + links.map(function(l) { return l.href; }).join(', '));
    return { content: result, changed: true };
  }
  return { content: content, changed: false };
}

function addOrphanPageLinks(content, filePath) {
  var urlPath = getUrlPath(filePath);
  var changed = false;
  var keyPages = ['/', '/consultations/', '/consultation/', '/avis/', '/blog/', '/comparatif/'];
  if (keyPages.indexOf(urlPath) !== -1) {
    if (!content.includes('href=\"/consultations-voyants/\"')) {
      var idx = content.indexOf('<h4>Navigation Rapide</h4>');
      if (idx !== -1) {
        var ulStart = content.indexOf('<ul', idx);
        var ulOpenEnd = content.indexOf('>', ulStart);
        if (ulOpenEnd !== -1) {
          content = content.slice(0, ulOpenEnd + 1) + '\n                        <li><a href=\"/consultations-voyants/\">Consultations Voyants</a></li>' + content.slice(ulOpenEnd + 1);
          changed = true;
          log('  [FOOTER] Added /consultations-voyants/ to Navigation Rapide');
        }
      }
    }
    if (!content.includes('href=\"/consultations-voyants/voyance-gratuite/\"')) {
      var idx2 = content.indexOf('<h4>Navigation Rapide</h4>');
      if (idx2 !== -1) {
        var ulEnd = content.indexOf('</ul>', idx2);
        if (ulEnd !== -1) {
          content = content.slice(0, ulEnd) + '                        <li><a href=\"/consultations-voyants/voyance-gratuite/\">Voyance Gratuite Voyants</a></li>\n' + content.slice(ulEnd);
          changed = true;
          log('  [FOOTER] Added /consultations-voyants/voyance-gratuite/ to footer');
        }
      }
    }
  }
  if (urlPath === '/') {
    if (!content.includes('href=\"/blog/\"')) {
      var idx3 = content.indexOf('<h4>Outils gratuits</h4>');
      if (idx3 !== -1) {
        var ulStart3 = content.indexOf('<ul', idx3);
        var ulOpenEnd3 = content.indexOf('>', ulStart3);
        if (ulOpenEnd3 !== -1) {
          content = content.slice(0, ulOpenEnd3 + 1) + '\n                        <li><a href=\"/blog/\">Blog Voyance</a></li>' + content.slice(ulOpenEnd3 + 1);
          changed = true;
          log('  [FOOTER] Added /blog/ to homepage footer');
        }
      }
    }
  }
  return { content: content, changed: changed };
}

function main() {
  console.log('='.repeat(70));
  console.log('  FRANCE VOYANCE - Internal Link Fixer');
  console.log('='.repeat(70));
  console.log('');
  var files = findIndexFiles(ROOT);
  console.log('Found ' + files.length + ' index.html files (excluding /villes/).\n');
  var totalNavFixes = 0, totalLinkAdds = 0, totalFooterFixes = 0, filesModified = 0;
  for (var fi = 0; fi < files.length; fi++) {
    var filePath = files[fi];
    var content = fs.readFileSync(filePath, 'utf-8');
    var fileChanged = false;
    log('Processing: ' + rel(filePath));
    var navResult = fixNavLinks(content);
    if (navResult.changed) { content = navResult.content; fileChanged = true; totalNavFixes++; }
    var linkResult = addRelatedLinks(content, filePath);
    if (linkResult.changed) { content = linkResult.content; fileChanged = true; totalLinkAdds++; }
    var orphanResult = addOrphanPageLinks(content, filePath);
    if (orphanResult.changed) { content = orphanResult.content; fileChanged = true; totalFooterFixes++; }
    if (fileChanged) {
      fs.writeFileSync(filePath, content, 'utf-8');
      filesModified++;
      log('  >> FILE SAVED');
    } else {
      log('  (no changes needed)');
    }
    log('');
  }
  console.log('\n' + '='.repeat(70));
  console.log('  SUMMARY');
  console.log('='.repeat(70));
  console.log('Total files scanned:    ' + files.length);
  console.log('Files modified:         ' + filesModified);
  console.log('Nav link fixes:         ' + totalNavFixes + ' files');
  console.log('Related-links added:    ' + totalLinkAdds + ' files');
  console.log('Footer enhancements:    ' + totalFooterFixes + ' files');
  console.log('='.repeat(70));
  console.log('\n--- INTERNAL LINK ANALYSIS (post-fix) ---\n');
  var targetPages = ['/consultations/', '/consultation/', '/blog/', '/consultations-voyants/',
    '/consultations-voyants/voyance-gratuite/', '/arts-divinatoires/',
    '/arts-divinatoires/tirage-oui-non/', '/consulter/voyance-telephone/', '/avis/'];
  for (var ti = 0; ti < targetPages.length; ti++) {
    var tgt = targetPages[ti];
    var incomingCount = 0;
    for (var fj = 0; fj < files.length; fj++) {
      var fp = files[fj];
      var up = getUrlPath(fp);
      if (up === tgt) continue;
      var c = fs.readFileSync(fp, 'utf-8');
      if (c.includes('href=\"' + tgt + '\"')) incomingCount++;
    }
    var status = incomingCount >= 5 ? 'OK' : 'NEEDS MORE';
    console.log('  ' + tgt.padEnd(50) + ' ' + incomingCount + ' incoming links  [' + status + ']');
  }
}

main();
