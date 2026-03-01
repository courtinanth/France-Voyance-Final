/**
 * fix-static-pages.js
 * Comprehensive fixer for ALL static HTML pages in France-Voyance-Final
 */

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;

const summary = {
  ogAdded: [], footerGridFixed: [], mainJsVersionFixed: [],
  noscriptAdded: [], loggerJsAdded: [], configJsAdded: [],
  metaDescAdded: [], titleFixed: [],
  totalFilesProcessed: 0, totalFilesModified: 0,
};

const titleReplacements = {
  "legal/cgu/index.html": {
    old: "Conditions Generales d\u0027Utilisation (CGU)",
    newTitle: "CGU - Conditions G\u00e9n\u00e9rales d\u0027Utilisation | France Voyance",
  },
  "legal/mentions-legales/index.html": {
    old: "Mentions Legales - France Voyance Avenir",
    newTitle: "Mentions L\u00e9gales | France Voyance Avenir",
  },
  "legal/politique-confidentialite/index.html": {
    old: "Politique de Confidentialite du Site",
    newTitle: "Politique de Confidentialit\u00e9 | France Voyance Avenir",
  },
  "legal/politique-cookies/index.html": {
    old: "Politique des Cookies du Site",
    newTitle: "Politique des Cookies | France Voyance Avenir",
  },
  "contact/index.html": {
    old: "Contactez France Voyance Avenir",
    newTitle: "Contactez-nous | France Voyance Avenir",
  },
  "consultations-voyants/index.html": {
    old: "Comment Consulter un Voyant en Ligne ?",
    newTitle: "Comment Consulter un Voyant en Ligne | France Voyance",
  },
  "consultations-voyants/voyance-gratuite/index.html": {
    old: "Voyance Gratuite en Ligne : Tirages & Oracles",
    newTitle: "Voyance Gratuite en Ligne : Premi\u00e8re Consultation Offerte",
  },
};

const metaDescriptions = {
  "legal/cgu/index.html":
    "Conditions g\u00e9n\u00e9rales d\u0027utilisation de France Voyance Avenir. D\u00e9couvrez les r\u00e8gles encadrant l\u0027utilisation de notre plateforme de voyance en ligne.",
  "legal/mentions-legales/index.html":
    "Mentions l\u00e9gales de France Voyance Avenir. Informations sur l\u0027\u00e9diteur, l\u0027h\u00e9bergement et les conditions d\u0027utilisation du site.",
  "legal/politique-confidentialite/index.html":
    "Politique de confidentialit\u00e9 de France Voyance Avenir. D\u00e9couvrez comment nous prot\u00e9geons vos donn\u00e9es personnelles.",
  "legal/politique-cookies/index.html":
    "Politique des cookies de France Voyance Avenir. Informations sur les cookies utilis\u00e9s et vos droits.",
  "consultations-voyants/voyance-gratuite/index.html":
    "Profite d\u0027une voyance gratuite en ligne avec nos voyants exp\u00e9riment\u00e9s. Premi\u00e8re consultation offerte, r\u00e9ponses imm\u00e9diates \u00e0 tes questions.",
};

const NOSCRIPT_BLOCK =
  "<noscript><style>.fade-in-up,.fade-in-left,.fade-in-right,.scale-in,.reveal{opacity:1 !important;transform:none !important;transition:none !important}.faq-answer{max-height:none !important;overflow:visible !important;padding:0 24px 20px !important}.faq-icon,.faq-toggle{display:none}.sticky-cta{opacity:1 !important;transform:none !important;pointer-events:auto !important}.testimonial-nav{display:none}.reading-progress-container{display:none}</style></noscript>";

function walkDir(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "villes" || entry.name === ".git") continue;
      results = results.concat(walkDir(fullPath));
    } else if (entry.name === "index.html") {
      results.push(fullPath);
    }
  }
  return results;
}

function getRelativePath(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, "/");
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function escapeAttr(str) {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function processFile(filePath) {
  const relPath = getRelativePath(filePath);
  let html = fs.readFileSync(filePath, "utf-8");
  const original = html;
  const changes = [];

  // TASK 8: Fix short titles
  if (titleReplacements[relPath]) {
    const tr = titleReplacements[relPath];
    const titleRegex = new RegExp("<title>" + escapeRegex(tr.old) + "</title>", "i");
    if (titleRegex.test(html)) {
      html = html.replace(titleRegex, "<title>" + tr.newTitle + "</title>");
      changes.push("Title fixed");
      summary.titleFixed.push(relPath);
    }
  }

  // TASK 7: Add meta descriptions where missing
  if (metaDescriptions[relPath]) {
    if (!/<meta\s+name=["']description["']/i.test(html)) {
      const desc = metaDescriptions[relPath];
      const metaDescTag = "\n    <meta name=\"description\" content=\"" + desc + "\">";
      html = html.replace(/(<title>[^<]*<\/title>)/, "$1" + metaDescTag);
      changes.push("Meta description added");
      summary.metaDescAdded.push(relPath);
    }
  }

  // TASK 1: Add OpenGraph + Twitter Cards
  if (!/<meta\s+property=["']og:title["']/i.test(html)) {
    const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
    const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
    const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);

    if (titleMatch && descMatch && canonicalMatch) {
      const title = titleMatch[1];
      const desc = descMatch[1];
      const url = canonicalMatch[1];

      const ogBlock =
        "\n    <meta property=\"og:title\" content=\"" + escapeAttr(title) + "\">" +
        "\n    <meta property=\"og:description\" content=\"" + escapeAttr(desc) + "\">" +
        "\n    <meta property=\"og:url\" content=\"" + escapeAttr(url) + "\">" +
        "\n    <meta property=\"og:type\" content=\"website\">" +
        "\n    <meta property=\"og:image\" content=\"https://france-voyance-avenir.fr/images/og-default.png\">" +
        "\n    <meta property=\"og:locale\" content=\"fr_FR\">" +
        "\n    <meta property=\"og:site_name\" content=\"France Voyance Avenir\">" +
        "\n    <meta name=\"twitter:card\" content=\"summary_large_image\">" +
        "\n    <meta name=\"twitter:title\" content=\"" + escapeAttr(title) + "\">" +
        "\n    <meta name=\"twitter:description\" content=\"" + escapeAttr(desc) + "\">" +
        "\n    <meta name=\"twitter:image\" content=\"https://france-voyance-avenir.fr/images/og-default.png\">";

      const descMetaRegex = /(<meta\s+name=["']description["'][^>]*>)/i;
      if (descMetaRegex.test(html)) {
        html = html.replace(descMetaRegex, "$1" + ogBlock);
        changes.push("OG + Twitter Card tags added");
        summary.ogAdded.push(relPath);
      }
    }
  }

  // TASK 2: Remove inline styles from footer-grid divs
  const footerGridPattern = /<div\s+class=["']footer-grid["']\s+style=["'][^"']*["']\s*>/gi;
  if (footerGridPattern.test(html)) {
    html = html.replace(/<div\s+class=["']footer-grid["']\s+style=["'][^"']*["']\s*>/gi, "<div class=\"footer-grid\">");
    changes.push("Footer-grid inline style removed");
    summary.footerGridFixed.push(relPath);
  }

  // TASK 3: Standardize main.js version
  if (/main\.js\?v=202[0-8]/.test(html)) {
    html = html.replace(/main\.js\?v=202[0-8]/g, "main.js?v=2029");
    changes.push("main.js version updated to v=2029");
    summary.mainJsVersionFixed.push(relPath);
  }

  // TASK 4: Add noscript fallback where missing
  const hasNoscriptStyle = /<noscript>\s*<style>/i.test(html);
  if (!hasNoscriptStyle) {
    html = html.replace(/<\/head>/i, NOSCRIPT_BLOCK + "\n</head>");
    changes.push("Noscript fallback added");
    summary.noscriptAdded.push(relPath);
  }

  // TASK 5: Add logger.js where missing
  if (/main\.js/i.test(html) && !/logger\.js/i.test(html)) {
    const mainJsScriptRegex = /(<script\s+src=["'][^"']*main\.js[^"']*["'][^>]*><\/script>)/i;
    if (mainJsScriptRegex.test(html)) {
      html = html.replace(mainJsScriptRegex, "$1\n<script src=\"/js/logger.js\" defer></script>");
      changes.push("logger.js added");
      summary.loggerJsAdded.push(relPath);
    }
  }

  // TASK 6: Add config.js where missing
  if (/animations\.js/i.test(html) && !/config\.js/i.test(html)) {
    const animJsScriptRegex = /(<script\s+src=["'][^"']*animations\.js["'][^>]*><\/script>)/i;
    if (animJsScriptRegex.test(html)) {
      html = html.replace(animJsScriptRegex, "<script src=\"/js/config.js\"></script>\n$1");
      changes.push("config.js added");
      summary.configJsAdded.push(relPath);
    }
  }

  // Write back if changed
  summary.totalFilesProcessed++;
  if (html !== original) {
    fs.writeFileSync(filePath, html, "utf-8");
    summary.totalFilesModified++;
    console.log("  MODIFIED: " + relPath);
    changes.forEach(function(c) { console.log("    - " + c); });
  }
}

// Main
console.log("=== Static Pages Fixer ===\n");
console.log("Scanning for index.html files (excluding /villes/ and /node_modules/)...\n");

const files = walkDir(ROOT);
console.log("Found " + files.length + " index.html files to process.\n");

for (const file of files) {
  processFile(file);
}

// Print Summary
console.log("\n========================================");
console.log("           SUMMARY");
console.log("========================================");
console.log("Total files scanned:      " + summary.totalFilesProcessed);
console.log("Total files modified:     " + summary.totalFilesModified);
console.log("");
console.log("[1] OG/Twitter tags added:     " + summary.ogAdded.length + " files");
if (summary.ogAdded.length) summary.ogAdded.forEach(function(f) { console.log("      - " + f); });
console.log("[2] Footer-grid style removed: " + summary.footerGridFixed.length + " files");
if (summary.footerGridFixed.length) summary.footerGridFixed.forEach(function(f) { console.log("      - " + f); });
console.log("[3] main.js version fixed:     " + summary.mainJsVersionFixed.length + " files");
if (summary.mainJsVersionFixed.length) summary.mainJsVersionFixed.forEach(function(f) { console.log("      - " + f); });
console.log("[4] Noscript fallback added:   " + summary.noscriptAdded.length + " files");
if (summary.noscriptAdded.length) summary.noscriptAdded.forEach(function(f) { console.log("      - " + f); });
console.log("[5] logger.js added:           " + summary.loggerJsAdded.length + " files");
if (summary.loggerJsAdded.length) summary.loggerJsAdded.forEach(function(f) { console.log("      - " + f); });
console.log("[6] config.js added:           " + summary.configJsAdded.length + " files");
if (summary.configJsAdded.length) summary.configJsAdded.forEach(function(f) { console.log("      - " + f); });
console.log("[7] Meta descriptions added:   " + summary.metaDescAdded.length + " files");
if (summary.metaDescAdded.length) summary.metaDescAdded.forEach(function(f) { console.log("      - " + f); });
console.log("[8] Short titles fixed:        " + summary.titleFixed.length + " files");
if (summary.titleFixed.length) summary.titleFixed.forEach(function(f) { console.log("      - " + f); });
console.log("\nDone!");
