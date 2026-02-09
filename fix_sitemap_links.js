const fs = require('fs');
const path = require('path');

const sitemapPath = path.join(__dirname, 'sitemap.xml');

if (fs.existsSync(sitemapPath)) {
    let content = fs.readFileSync(sitemapPath, 'utf8');

    // Replace .html with / in <loc> tags
    // Pattern: <loc>.../villes/xxxx.html</loc>
    // We want: <loc>.../villes/xxxx/</loc>

    const regex = /<loc>(.*?\/villes\/.*?)\.html<\/loc>/g;
    let newContent = content.replace(regex, '<loc>$1/</loc>');

    if (newContent !== content) {
        fs.writeFileSync(sitemapPath, newContent);
        console.log('✅ Updated sitemap.xml');
    } else {
        console.log('ℹ️ No changes needed for sitemap.xml');
    }
} else {
    console.error('❌ sitemap.xml not found');
}
