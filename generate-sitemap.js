/**
 * Sitemap Generator for France Voyance Avenir
 * Generates sitemap.xml with all pages including 372 local SEO pages
 */

const fs = require('fs');
const path = require('path');

const baseUrl = 'https://france-voyance-avenir.fr';
const today = new Date().toISOString().split('T')[0];

// Core pages with manual priority
const corePages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/voyance-gratuite/', priority: '0.9', changefreq: 'weekly' },
    { url: '/voyance-gratuite/tarot-amour/', priority: '0.8', changefreq: 'weekly' },
    { url: '/voyance-gratuite/numerologie-gratuite/', priority: '0.8', changefreq: 'weekly' },
    { url: '/voyance-gratuite/pendule-oui-non/', priority: '0.8', changefreq: 'weekly' },
    { url: '/arts-divinatoires/', priority: '0.9', changefreq: 'weekly' },
    { url: '/arts-divinatoires/pendule/', priority: '0.8', changefreq: 'monthly' },
    { url: '/arts-divinatoires/oracle-belline/', priority: '0.8', changefreq: 'monthly' },
    { url: '/arts-divinatoires/oracle-ge/', priority: '0.8', changefreq: 'monthly' },
    { url: '/arts-divinatoires/runes/', priority: '0.8', changefreq: 'monthly' },
    { url: '/arts-divinatoires/cartomancie/', priority: '0.8', changefreq: 'monthly' },
    { url: '/arts-divinatoires/tirage-oui-non/', priority: '0.8', changefreq: 'monthly' },
    { url: '/consultations/', priority: '0.9', changefreq: 'weekly' },
    { url: '/consultations/amour-retour-affectif/', priority: '0.8', changefreq: 'monthly' },
    { url: '/consultations/flamme-jumelle/', priority: '0.8', changefreq: 'monthly' },
    { url: '/consultations/medium-defunts/', priority: '0.8', changefreq: 'monthly' },
    { url: '/consultations/travail-carriere/', priority: '0.8', changefreq: 'monthly' },
    { url: '/consultations/argent-finances/', priority: '0.8', changefreq: 'monthly' },
    { url: '/consulter/voyance-telephone/', priority: '0.8', changefreq: 'weekly' },
    { url: '/consulter/voyance-sms/', priority: '0.8', changefreq: 'weekly' },
    { url: '/consulter/voyance-chat/', priority: '0.8', changefreq: 'weekly' },
    { url: '/consulter/voyance-audiotel/', priority: '0.8', changefreq: 'weekly' },
    { url: '/consultations-voyants/', priority: '0.8', changefreq: 'weekly' },
    { url: '/blog/', priority: '0.7', changefreq: 'weekly' },
    { url: '/contact/', priority: '0.5', changefreq: 'yearly' },
    { url: '/plan-du-site/', priority: '0.4', changefreq: 'monthly' }
];

// Get local pages from /villes/ directory
const villesDir = path.join(__dirname, 'villes');
const localPages = [];

if (fs.existsSync(villesDir)) {
    const files = fs.readdirSync(villesDir).filter(f => f.endsWith('.html'));
    files.forEach(file => {
        localPages.push({
            url: `/villes/${file}`,
            priority: '0.6',
            changefreq: 'monthly'
        });
    });
}

// Generate XML
let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

// Add core pages
xml += '    <!-- Core Pages -->\n';
corePages.forEach(page => {
    xml += `    <url>
        <loc>${baseUrl}${page.url}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>
    </url>\n`;
});

// Add local SEO pages
xml += '\n    <!-- Local SEO Pages (Cities) -->\n';
localPages.forEach(page => {
    xml += `    <url>
        <loc>${baseUrl}${page.url}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>
    </url>\n`;
});

xml += '</urlset>\n';

// Write sitemap
const sitemapPath = path.join(__dirname, 'sitemap.xml');
fs.writeFileSync(sitemapPath, xml, 'utf8');

console.log(`✅ Sitemap generated with ${corePages.length + localPages.length} URLs`);
console.log(`   - ${corePages.length} core pages`);
console.log(`   - ${localPages.length} local pages`);
console.log(`\nOutput: ${sitemapPath}`);
