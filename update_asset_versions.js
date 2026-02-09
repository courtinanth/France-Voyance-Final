const fs = require('fs');
const path = require('path');
const glob = require('glob');

const rootDir = __dirname;
const allHtmlFiles = glob.sync('**/*.html', { cwd: rootDir, ignore: ['node_modules/**', '.git/**'] });

console.log(`Scanning ${allHtmlFiles.length} files to update asset versions...`);

let updatedCount = 0;

allHtmlFiles.forEach(file => {
    const filePath = path.join(rootDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    // Replace v=2026 with v=2027
    if (content.includes('v=2026')) {
        content = content.replace(/v=2026/g, 'v=2027');
        hasChanges = true;
    }

    if (hasChanges) {
        fs.writeFileSync(filePath, content);
        updatedCount++;
    }
});

console.log(`✅ Updated asset versions in ${updatedCount} files.`);
