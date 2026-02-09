const fs = require('fs');
const path = require('path');

const filesToCheck = [
    'index.html',
    'plan-du-site/index.html'
];

console.log('Scanning for .html links...');

filesToCheck.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        let found = 0;
        lines.forEach((line, index) => {
            if (line.includes('.html')) {
                // Ignore the doctype or common scripts if necessary, but for now show all
                console.log(`[${file}:${index + 1}] ${line.trim()}`);
                found++;
            }
        });
        if (found === 0) {
            console.log(`✅ No .html links found in ${file}`);
        }
    } else {
        console.log(`❌ File not found: ${file}`);
    }
});
