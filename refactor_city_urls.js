const fs = require('fs');
const path = require('path');
const glob = require('glob');

const rootDir = __dirname;
const villesDir = path.join(rootDir, 'villes');

// 1. Get all city HTML files
const cityFiles = glob.sync('*.html', { cwd: villesDir });

console.log(`Found ${cityFiles.length} city files to refactor.`);

// Map old paths to new paths for link replacement
const linkMap = {};

// 2. Move files and update canonicals
cityFiles.forEach(file => {
    if (file === 'index.html') return; // Skip main index of villes if it exists

    const baseName = path.basename(file, '.html');
    const oldPath = path.join(villesDir, file);
    const newDir = path.join(villesDir, baseName);
    const newPath = path.join(newDir, 'index.html');

    // Create directory
    if (!fs.existsSync(newDir)) {
        fs.mkdirSync(newDir, { recursive: true });
    }

    // Read content
    let content = fs.readFileSync(oldPath, 'utf8');

    // Update Canonical
    // From: href=".../villes/baseName.html"
    // To:   href=".../villes/baseName/"
    const canonicalRegex = new RegExp(`href="https://france-voyance-avenir.fr/villes/${baseName}.html"`, 'g');
    content = content.replace(canonicalRegex, `href="https://france-voyance-avenir.fr/villes/${baseName}/"`);

    // Write to new location
    fs.writeFileSync(newPath, content);

    // Delete old file
    fs.unlinkSync(oldPath);

    // Store mapping for global link update
    // Key: Old absolute link path, Value: New absolute link path
    linkMap[`/villes/${file}`] = `/villes/${baseName}/`;
});

console.log("File structure refactored. Now updating internal links...");

// 3. Update links in ALL HTML files
const allHtmlFiles = glob.sync('**/*.html', { cwd: rootDir, ignore: ['node_modules/**', '.git/**'] });

let updatedFiles = 0;

allHtmlFiles.forEach(file => {
    const filePath = path.join(rootDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    // Iterate over all mapped links and replace
    for (const [oldLink, newLink] of Object.entries(linkMap)) {
        // Replace href="/villes/name.html"
        const linkRegex = new RegExp(`href="${oldLink}"`, 'g');
        if (linkRegex.test(content)) {
            content = content.replace(linkRegex, `href="${newLink}"`);
            hasChanges = true;
        }

        // Also substitute purely potentially used relative links if any (less likely but possible)
        // Ignoring complicated relative path logic for now as absolute paths seem standard here
    }

    if (hasChanges) {
        fs.writeFileSync(filePath, content);
        updatedFiles++;
    }
});

console.log(`Updated links in ${updatedFiles} files.`);
console.log("✅ Refactoring complete.");
