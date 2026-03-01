const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");

function findIndexFiles(dir) {
  let r = [];
  try {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const fp = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (["node_modules","audit",".git"].includes(e.name)) continue;
        r = r.concat(findIndexFiles(fp));
      } else if (e.name === "index.html") r.push(fp);
    }
  } catch(ex) {}
  return r;
}

const allFiles = findIndexFiles(ROOT);
const mainFiles = allFiles.filter(f => !f.includes(path.sep + "villes" + path.sep));
const villesFiles = allFiles.filter(f => f.includes(path.sep + "villes" + path.sep));
const sampleVilles = villesFiles.slice(0, 3);
const filesToAudit = [...mainFiles, ...sampleVilles];

const P = console.log;
P("=".repeat(70));
P("     FRANCE VOYANCE - UX/UI CONSISTENCY AUDIT REPORT");
P("=".repeat(70));
P("");
P("Total index.html files found: " + allFiles.length);
P("  - Non-villes pages: " + mainFiles.length);
P("  - Villes pages: " + villesFiles.length);
P("  - Sample villes included: " + sampleVilles.length);
P("  - Total pages audited: " + filesToAudit.length);
P("");

const issues = { header:[], footer:[], jsFiles:[], noscript:[], css:[], inlineStyles:[], obfLinks:[] };
function rel(f) { return f.split(ROOT + path.sep).join("").split("\\").join("/"); }
function checkHeader(c, fp) {
  const r = rel(fp), p = [];
  if (!(c.includes(String.fromCharCode(99,108,97,115,115,61,34,108,111,103,111,34)) && c.includes("logo.svg"))) p.push("MISSING: Logo (logo.svg) not found");
  if (!c.includes("mobile-toggle")) p.push("MISSING: Mobile toggle not found");
  const ns = c.indexOf(String.fromCharCode(60,110,97,118,32,99,108,97,115,115,61,34,109,97,105,110,45,110,97,118,34,62));
  const ne = c.indexOf("</nav>", ns > -1 ? ns : 0);
  if (ns === -1) { p.push("MISSING: nav.main-nav not found"); }
  else {
    const nav = c.substring(ns, ne + 6);
    ["Accueil","Voyance Gratuite","Arts Divinatoires","Consultations","Consulter"].forEach(item => {
      if (!nav.includes(item)) p.push("MISSING NAV: " + item + " not found");
    });
    if (!["Plateformes","Comparatifs","Avis"].some(i => nav.includes(i)))
      p.push("MISSING NAV: Last item (Plateformes/Comparatifs/Avis) not found");
    if (!(nav.includes("header-cta") || nav.includes("btn-gold") || nav.includes("Consultation Imm")))
      p.push("MISSING: Header CTA button not found");
  }
  if (p.length) issues.header.push({file:r, problems:p});
  return p.length;
}
function checkFooter(c, fp) {
  const r = rel(fp), p = [];
  const fs2 = c.indexOf("<footer");
  const fe = c.indexOf("</footer>", fs2 > -1 ? fs2 : 0);
  if (fs2 === -1 || fe === -1) {
    p.push("MISSING: footer element not found");
    issues.footer.push({file:r, problems:p}); return p.length;
  }
  const fc = c.substring(fs2, fe + 9);
  if (!fc.includes("footer-grid")) p.push("MISSING: footer-grid class not found");
  const colCount = (fc.match(/footer-col/g) || []).length;
  if (colCount !== 4) p.push("COLUMN COUNT: Found " + colCount + " footer-col(s) instead of expected 4");
  const h4s = [];
  const h4re = new RegExp("<h4>([^<]+)</" + "h4>", "g");
  let m;
  while ((m = h4re.exec(fc)) !== null) h4s.push(m[1]);
  if (h4s.some(t => t.includes("Plateformes"))) {
    ["Plateformes","Comparatifs","Outils gratuits","Informations"].forEach(col => {
      if (!h4s.some(t => t.includes(col))) p.push("MISSING FOOTER COL: " + col + " heading not found");
    });
  } else if (h4s.some(t => t.includes("Navigation Rapide"))) {
    p.push("LAYOUT VARIANT: Uses Nav Rapide/Informations/Contact instead of Plateformes/Comparatifs/Outils gratuits/Informations");
  } else if (h4s.length > 0) {
    p.push("UNKNOWN FOOTER LAYOUT: Headings = [" + h4s.join(", ") + "]");
  } else {
    p.push("WARNING: No h4 column headings found in footer");
  }
  if (!fc.toLowerCase().includes("plan-du-site") && !fc.toLowerCase().includes("plan du site"))
    p.push("MISSING: Plan du site link not found in footer");
  if (!fc.includes("2026")) p.push("COPYRIGHT: Year 2026 not found in footer");
  if (!fc.includes("disclaimer")) p.push("MISSING: Disclaimer section not found in footer");
  if (p.length) issues.footer.push({file:r, problems:p});
  return p.length;
}
function checkJS(c, fp) {
  const r = rel(fp), p = [];
  ["config.js","animations.js","main.js","logger.js"].forEach(js => {
    if (!c.includes(js)) p.push("MISSING JS: " + js + " not referenced");
  });
  if (p.length) issues.jsFiles.push({file:r, problems:p});
  return p.length;
}

function checkNoscript(c, fp) {
  const r = rel(fp), p = [];
  if (!c.includes("<noscript>")) {
    p.push("MISSING: No noscript tag found");
  } else {
    var found = false;
    var idx = 0;
    while (true) {
      var s = c.indexOf("<noscript>", idx);
      if (s === -1) break;
      var e = c.indexOf("</noscript>", s);
      if (e === -1) break;
      var block = c.substring(s, e + 12);
      if (block.includes("<style>") && block.includes("opacity")) { found = true; break; }
      idx = e + 12;
    }
    if (!found) p.push("INCOMPLETE: noscript exists but no style fallback with opacity found");
  }
  if (p.length) issues.noscript.push({file:r, problems:p});
  return p.length;
}

function checkCSS(c, fp) {
  const r = rel(fp), p = [];
  if (!c.includes("style.css?v=2029")) {
    if (c.includes("style.css")) {
      var vm = c.match(/style.css?v=(d+)/);
      if (vm && vm[1] !== "2029") p.push("CSS VERSION MISMATCH: style.css?v=" + vm[1] + " instead of ?v=2029");
      else if (!vm) p.push("CSS VERSION MISSING: style.css found but no ?v= param");
    } else p.push("MISSING: style.css reference not found");
  }
  if (p.length) issues.css.push({file:r, problems:p});
  return p.length;
}

function checkInline(c, fp) {
  const r = rel(fp), p = [];
  // Search for footer-grid divs with inline styles
  var searchStr = "footer-grid";
  var idx = 0;
  while (true) {
    var pos = c.indexOf(searchStr, idx);
    if (pos === -1) break;
    // Find the opening < before this
    var tagStart = c.lastIndexOf("<", pos);
    var tagEnd = c.indexOf(">", pos);
    if (tagStart !== -1 && tagEnd !== -1) {
      var tag = c.substring(tagStart, tagEnd + 1);
      if (tag.includes("style=")) {
        var sm = tag.match(/style="([^"]*)"/);
        if (sm) p.push("INLINE STYLE on footer-grid: " + sm[1]);
      }
    }
    idx = pos + searchStr.length;
  }
  if (p.length) issues.inlineStyles.push({file:r, problems:p});
  return p.length;
}

function checkObf(c, fp) {
  const r = rel(fp), p = [];
  const hasEl = c.includes("obf-link");
  const hasScript = c.includes("atob") && c.includes("obf-link");
  if (hasEl && !hasScript) p.push("CRITICAL: Has obf-link elements but MISSING handler script");
  else if (!hasEl) p.push("NOTE: No obf-link elements or handler script found");
  if (p.length) issues.obfLinks.push({file:r, problems:p});
  return p.length;
}
// === RUN ALL CHECKS ===
let totalIssues = 0;
for (const f of filesToAudit) {
  const c = fs.readFileSync(f, "utf8");
  totalIssues += checkHeader(c, f);
  totalIssues += checkFooter(c, f);
  totalIssues += checkJS(c, f);
  totalIssues += checkNoscript(c, f);
  totalIssues += checkCSS(c, f);
  totalIssues += checkInline(c, f);
  totalIssues += checkObf(c, f);
}

function printSection(title, list) {
  P("");
  P("-".repeat(70));
  P("  " + title);
  P("-".repeat(70));
  if (!list.length) { P("  [PASS] All " + filesToAudit.length + " pages consistent."); return; }
  const groups = {};
  for (const e of list) {
    for (const prob of e.problems) {
      if (!groups[prob]) groups[prob] = [];
      groups[prob].push(e.file);
    }
  }
  P("  [ISSUES] " + list.length + " page(s) affected:");
  for (const [prob, files] of Object.entries(groups)) {
    P("");
    var sev = "FAIL";
    if (prob.startsWith("CRITICAL")) sev = "CRITICAL";
    else if (prob.startsWith("MISSING")) sev = "FAIL";
    else if (prob.startsWith("LAYOUT")) sev = "WARN";
    else if (prob.startsWith("NOTE")) sev = "INFO";
    else if (prob.startsWith("INCOMPLETE")) sev = "WARN";
    else if (prob.startsWith("WARNING")) sev = "WARN";
    P("  [" + sev + "] " + prob);
    P("  Affected (" + files.length + " pages):");
    var show = files.length > 10 ? files.slice(0, 7) : files;
    for (const f of show) P("    -> " + f);
    if (files.length > 10) P("    ... and " + (files.length - 7) + " more page(s)");
  }
}

printSection("CHECK 1: HEADER CONSISTENCY", issues.header);
printSection("CHECK 2: FOOTER CONSISTENCY", issues.footer);
printSection("CHECK 3: REQUIRED JS FILES (config.js, animations.js, main.js, logger.js)", issues.jsFiles);
printSection("CHECK 4: NOSCRIPT STYLE FALLBACK", issues.noscript);
printSection("CHECK 5: CSS REFERENCE (style.css?v=2029)", issues.css);
printSection("CHECK 6: INLINE STYLES ON FOOTER-GRID (mobile risk)", issues.inlineStyles);
printSection("CHECK 7: OBFUSCATED LINKS SCRIPT", issues.obfLinks);

P("");
P("=".repeat(70));
P("                        AUDIT SUMMARY");
P("=".repeat(70));
P("  Pages audited:            " + filesToAudit.length);
P("  Total issues found:       " + totalIssues);
P("");
P("  [1] Header issues:        " + issues.header.length + " page(s)");
P("  [2] Footer issues:        " + issues.footer.length + " page(s)");
P("  [3] Missing JS files:     " + issues.jsFiles.length + " page(s)");
P("  [4] Noscript fallback:    " + issues.noscript.length + " page(s)");
P("  [5] CSS reference:        " + issues.css.length + " page(s)");
P("  [6] Inline footer styles: " + issues.inlineStyles.length + " page(s)");
P("  [7] Obfuscated links:     " + issues.obfLinks.length + " page(s)");
P("");
if (totalIssues === 0) P("  RESULT: ALL CHECKS PASSED - Full UX/UI consistency confirmed.");
else P("  RESULT: " + totalIssues + " inconsistencies detected across " + filesToAudit.length + " pages.");
P("  Review the detailed findings above for remediation priorities.");
P("");