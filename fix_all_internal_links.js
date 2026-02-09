const fs = require('fs');
const path = require('path');
const glob = require('glob');

const rootDir = __dirname;
const allHtmlFiles = glob.sync('**/*.html', { cwd: rootDir, ignore: ['node_modules/**', '.git/**'] });

console.log(`Scanning ${allHtmlFiles.length} files for .html links...`);

let updatedCount = 0;

allHtmlFiles.forEach(file => {
    const filePath = path.join(rootDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    // Regex to find href="/villes/something.html" and replace with href="/villes/something/"
    // Using a simpler approach to catch all variations

    // We want to replace `/villes/xxxx.html` with `/villes/xxxx/`
    // The previous regex might have failed on quotes or structure.
    // Let's use a standard replaceAll for the specific pattern .html" -> /" when preceded by /villes/

    // Pattern: /villes/[anything].html
    const regex = /\/villes\/([a-zA-Z0-9-]+)\.html/g;

    let newContent = content.replace(regex, '/villes/$1/');

    if (newContent !== content) {
        content = newContent;
        hasChanges = true;
    }

    if (hasChanges) {
        fs.writeFileSync(filePath, content);
        updatedCount++;
    }
});

console.log(`✅ Updated links in ${updatedCount} files.`);
