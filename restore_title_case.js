
const fs = require('fs');
const path = require('path');

const targetDirs = ['consulter'];

function repairFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // Fix Titling
    content = content.replace(/La confidentialité/g, "La Confidentialité");
    content = content.replace(/la confidentialité/g, "la confidentialité"); // maintain lowercase in text if needed (heuristic)
    // Actually, simply:
    content = content.replace(/<h3>La confidentialité<\/h3>/g, "<h3>La Confidentialité</h3>");

    if (content !== originalContent) {
        console.log(`[Fixed Case] ${path.basename(filePath)}`);
        fs.writeFileSync(filePath, content, 'utf8');
    }
}

function scanDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            scanDir(fullPath);
        } else if (file.endsWith('.html')) {
            repairFile(fullPath);
        }
    }
}

targetDirs.forEach(dir => scanDir(path.join(__dirname, dir)));
console.log("Case fix done.");
