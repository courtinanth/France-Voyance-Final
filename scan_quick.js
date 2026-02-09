const fs = require('fs');
const path = require('path');

const targetDirs = [
    'consultations',
    'arts-divinatoires',
    'voyance-gratuite',
    'legal',
    'contact',
    'avis',
    'plandusite'
];
const rootFiles = ['index.html', '404.html', 'offline.html'];

const replacementChar = '\uFFFD';

const corruptedWords = new Set();

function scanFile(filePath) {
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes(replacementChar)) {
            const regex = /\S*\uFFFD\S*/g;
            let match;
            while ((match = regex.exec(content)) !== null) {
                corruptedWords.add(match[0]);
            }
        }
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
            scanFile(fullPath);
        }
    }
}

// 1. Scan root files
rootFiles.forEach(file => scanFile(path.join(__dirname, file)));

// 2. Scan target directories
targetDirs.forEach(dir => scanDir(path.join(__dirname, dir)));

console.log(Array.from(corruptedWords).sort().join('\n'));
