const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const skippedDirs = ['.git', 'node_modules', 'villes', 'data', 'images', 'css', 'js', '.gemini'];
const replacementChar = '\uFFFD'; // 

function scanDir(dir, wordsSet) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (!skippedDirs.includes(file)) {
                scanDir(fullPath, wordsSet);
            }
        } else if (file.endsWith('.html')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes(replacementChar)) {
                // Find all words containing 
                const regex = /\S*\S*/g;
                let match;
                while ((match = regex.exec(content)) !== null) {
                    wordsSet.add(match[0]);
                }
            }
        }
    }
}

const corruptedWords = new Set();
scanDir(rootDir, corruptedWords);

console.log("Corrupted words found:");
console.log(Array.from(corruptedWords).sort().join('\n'));
