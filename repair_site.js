const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const extensions = ['.html', '.css', '.js'];

// Walk directory recursively
function walk(dir, callback) {
    fs.readdir(dir, (err, files) => {
        if (err) throw err;
        files.forEach(file => {
            const filepath = path.join(dir, file);
            fs.stat(filepath, (err, stats) => {
                if (err) throw err;
                if (stats.isDirectory()) {
                    if (file !== 'node_modules' && file !== '.git') {
                        walk(filepath, callback);
                    }
                } else if (extensions.includes(path.extname(filepath))) {
                    callback(filepath);
                }
            });
        });
    });
}

const replacements = [
    // LINKS
    { from: /\/consultations-voyants\/consultations-par-telephone\//g, to: '/consulter/voyance-telephone/' },
    { from: /\/consultations-voyants\/consultations-par-sms\//g, to: '/consulter/voyance-sms/' },
    { from: /\/consultations-voyants\/consultations-par-chat\//g, to: '/consulter/voyance-chat/' },
    { from: /\/consultations-voyants\/consultations-par-audiotel\//g, to: '/consulter/voyance-audiotel/' },
    { from: /\/consultations-voyants\//g, to: '/consulter/' },

    // ENCODING ARTIFACTS (Double UTF-8)
    { from: /é/g, to: 'é' },
    { from: /è/g, to: 'è' },
    { from: /à/g, to: 'à' }, // Space artifact might need check
    { from: /â/g, to: 'â' },
    { from: /ê/g, to: 'ê' },
    { from: /î/g, to: 'î' },
    { from: /ô/g, to: 'ô' },
    { from: /û/g, to: 'û' },
    { from: /ù/g, to: 'ù' },
    { from: /ë/g, to: 'ë' },
    { from: /ï/g, to: 'ï' },
    { from: /ç/g, to: 'ç' },
    { from: /oe/g, to: 'oe' },
    { from: /'/g, to: "'" },
    { from: /.../g, to: "..." },
    { from: /«/g, to: "«" },
    { from: /»/g, to: "»" },
    { from: /€/g, to: "€" },
    { from: / /g, to: " " } // Remove NBSP artifact
];

walk(rootDir, (filepath) => {
    fs.readFile(filepath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading ${filepath}:`, err);
            return;
        }

        let content = data;
        let changed = false;

        // 1. Fix Internal Links
        replacements.slice(0, 5).forEach(rep => {
            if (content.match(rep.from)) {
                content = content.replace(rep.from, rep.to);
                changed = true;
            }
        });

        // 2. Fix Encoding
        replacements.slice(5).forEach(rep => {
            if (content.match(rep.from)) {
                content = content.replace(rep.from, rep.to);
                changed = true;
            }
        });

        if (changed) {
            console.log(`Repaired: ${filepath}`);
            fs.writeFile(filepath, content, 'utf8', (err) => {
                if (err) console.error(`Error writing ${filepath}:`, err);
            });
        }
    });
});
