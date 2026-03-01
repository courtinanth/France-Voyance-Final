var fs = require("fs");
var path = require("path");
var ROOT = "C:/Users/court/Desktop/Siteapps/France-Voyance-Final";

function walkDir(dir) {
  var results = [];
  var entries = fs.readdirSync(dir, { withFileTypes: true });
  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];
    var fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "villes" || entry.name === ".git") continue;
      results = results.concat(walkDir(fullPath));
    } else if (entry.name === "index.html") {
      results.push(fullPath);
    }
  }
  return results;
}

var files = walkDir(ROOT);
var fixedCount = 0;
var ogReaddedCount = 0;

for (var i = 0; i < files.length; i++) {
  var filePath = files[i];
  var html = fs.readFileSync(filePath, "utf-8");
  var original = html;

  // Remove existing OG + Twitter tags (they may have truncated descriptions)
  html = html.replace(/\n\s*<meta property="og:title"[^>]*>/gi, "");
  html = html.replace(/\n\s*<meta property="og:description"[^>]*>/gi, "");
  html = html.replace(/\n\s*<meta property="og:url"[^>]*>/gi, "");
  html = html.replace(/\n\s*<meta property="og:type"[^>]*>/gi, "");
  html = html.replace(/\n\s*<meta property="og:image"[^>]*>/gi, "");
  html = html.replace(/\n\s*<meta property="og:locale"[^>]*>/gi, "");
  html = html.replace(/\n\s*<meta property="og:site_name"[^>]*>/gi, "");
  html = html.replace(/\n\s*<meta name="twitter:card"[^>]*>/gi, "");
  html = html.replace(/\n\s*<meta name="twitter:title"[^>]*>/gi, "");
  html = html.replace(/\n\s*<meta name="twitter:description"[^>]*>/gi, "");
  html = html.replace(/\n\s*<meta name="twitter:image"[^>]*>/gi, "");

  // Now re-add OG/Twitter tags with correct description extraction
  var titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  // Use a smarter regex: match content="..." (double-quoted) specifically
  var descMatch = html.match(/<meta\s+name=["']description["']\s+content="([^"]*)"/i);
  if (!descMatch) {
    // Try single-quoted content
    descMatch = html.match(/<meta\s+name=["']description["']\s+content='([^']*)'/i);
  }
  var canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);

  if (titleMatch && descMatch && canonicalMatch) {
    var title = titleMatch[1].replace(/&/g, "&amp;").replace(/"/g, "&quot;");
    var desc = descMatch[1].replace(/&/g, "&amp;").replace(/"/g, "&quot;");
    var url = canonicalMatch[1].replace(/&/g, "&amp;").replace(/"/g, "&quot;");

    var ogBlock =
      '\n    <meta property="og:title" content="' + title + '">' +
      '\n    <meta property="og:description" content="' + desc + '">' +
      '\n    <meta property="og:url" content="' + url + '">' +
      '\n    <meta property="og:type" content="website">' +
      '\n    <meta property="og:image" content="https://france-voyance-avenir.fr/images/og-default.png">' +
      '\n    <meta property="og:locale" content="fr_FR">' +
      '\n    <meta property="og:site_name" content="France Voyance Avenir">' +
      '\n    <meta name="twitter:card" content="summary_large_image">' +
      '\n    <meta name="twitter:title" content="' + title + '">' +
      '\n    <meta name="twitter:description" content="' + desc + '">' +
      '\n    <meta name="twitter:image" content="https://france-voyance-avenir.fr/images/og-default.png">';

    var descMetaRegex = /(<meta\s+name=["']description["'][^>]*>)/i;
    if (descMetaRegex.test(html)) {
      html = html.replace(descMetaRegex, "$1" + ogBlock);
      ogReaddedCount++;
    }
  }

  if (html !== original) {
    fs.writeFileSync(filePath, html, "utf-8");
    fixedCount++;
  }
}

console.log("Fixed " + fixedCount + " files total");
console.log("OG tags re-added to " + ogReaddedCount + " files");
