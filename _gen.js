// Generator script - creates fix-static-pages.js
var fs = require("fs");
var p = "C:/Users/court/Desktop/Siteapps/France-Voyance-Final/fix-static-pages.js";
var Q = String.fromCharCode(39);
var NL = "\n";

// Build the script content
var s = "";

s += "/**" + NL;
s += " * fix-static-pages.js" + NL;
s += " * Comprehensive fixer for ALL static HTML pages in France-Voyance-Final" + NL;
s += " */" + NL + NL;

s += "const fs = require(" + Q + "fs" + Q + ");" + NL;
s += "const path = require(" + Q + "path" + Q + ");" + NL + NL;
s += "const ROOT = __dirname;" + NL + NL;

// summary object
s += "const summary = {" + NL;
s += "  ogAdded: [], footerGridFixed: [], mainJsVersionFixed: []," + NL;
s += "  noscriptAdded: [], loggerJsAdded: [], configJsAdded: []," + NL;
s += "  metaDescAdded: [], titleFixed: []," + NL;
s += "  totalFilesProcessed: 0, totalFilesModified: 0," + NL;
s += "};" + NL + NL;

// titleReplacements
s += "const titleReplacements = {" + NL;
s += "  " + Q + "legal/cgu/index.html" + Q + ": {" + NL;
s += "    old: " + Q + "CGU" + Q + "," + NL;
s += "    newTitle: " + Q + "CGU - Conditions G\u00e9n\u00e9rales d" + Q + " + String.fromCharCode(39) + " + Q + "Utilisation | France Voyance" + Q + "," + NL;

fs.writeFileSync(p, "// test");
console.log("test write OK");
