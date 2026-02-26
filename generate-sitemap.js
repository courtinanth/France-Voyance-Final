/**
 * Segmented Sitemap Generator for France Voyance Avenir
 *
 * Generates a sitemap index + multiple sub-sitemaps by section.
 * Dynamically discovers all pages by scanning the filesystem.
 * Uses real file modification dates for lastmod.
 *
 * Output:
 *   sitemap.xml           → Sitemap Index (points to sub-sitemaps)
 *   sitemap-core.xml      → Pages principales
 *   sitemap-gratuit.xml   → Outils de voyance gratuite
 *   sitemap-avis.xml      → Avis & comparatifs
 *   sitemap-tarot.xml     → Tarot de Marseille
 *   sitemap-numerologie.xml → Numérologie
 *   sitemap-villes.xml    → Pages villes (local SEO)
 *
 * Usage: node generate-sitemap.js
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://france-voyance-avenir.fr';
const ROOT = __dirname;
const TODAY = new Date().toISOString().split('T')[0];

// ─── Helpers ──────────────────────────────────────────────

function getLastmod(filePath) {
    try {
        const stat = fs.statSync(filePath);
        return stat.mtime.toISOString().split('T')[0];
    } catch {
        return TODAY;
    }
}

function scanDirectory(dir, urlPrefix) {
    const pages = [];
    if (!fs.existsSync(dir)) return pages;

    // Check for index.html in the directory itself
    const indexPath = path.join(dir, 'index.html');
    if (fs.existsSync(indexPath)) {
        pages.push({
            url: urlPrefix.endsWith('/') ? urlPrefix : urlPrefix + '/',
            lastmod: getLastmod(indexPath),
            filePath: indexPath
        });
    }

    // Check sub-directories
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        const subIndex = path.join(dir, entry.name, 'index.html');
        if (fs.existsSync(subIndex)) {
            pages.push({
                url: `${urlPrefix}/${entry.name}/`,
                lastmod: getLastmod(subIndex),
                filePath: subIndex
            });
        }
    }

    return pages;
}

function buildUrlEntry(page) {
    return `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
}

function buildSitemap(pages) {
    const entries = pages.map(buildUrlEntry).join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}

function writeSitemap(filename, pages) {
    const filePath = path.join(ROOT, filename);
    fs.writeFileSync(filePath, buildSitemap(pages), 'utf8');
    return pages.length;
}

// ─── 1. Core Pages ────────────────────────────────────────
// Scans all top-level sections except the ones that get their own sitemap

function collectCorePages() {
    const pages = [];

    // Homepage
    const indexPath = path.join(ROOT, 'index.html');
    if (fs.existsSync(indexPath)) {
        pages.push({
            url: '/',
            lastmod: getLastmod(indexPath),
            changefreq: 'daily',
            priority: '1.0'
        });
    }

    // Sections with high priority pillar pages + sub-pages
    const pillarSections = [
        { dir: 'arts-divinatoires', changefreq: 'weekly', pillarPriority: '0.9', subPriority: '0.8' },
        { dir: 'consultations', changefreq: 'weekly', pillarPriority: '0.9', subPriority: '0.8' },
        { dir: 'consulter', changefreq: 'weekly', pillarPriority: '0.8', subPriority: '0.8' },
    ];

    for (const section of pillarSections) {
        const sectionDir = path.join(ROOT, section.dir);
        const scanned = scanDirectory(sectionDir, `/${section.dir}`);
        for (const page of scanned) {
            const isPillar = page.url === `/${section.dir}/`;
            pages.push({
                ...page,
                changefreq: section.changefreq,
                priority: isPillar ? section.pillarPriority : section.subPriority
            });
        }
    }

    // Consultations-voyants (special nested structure)
    const cvDir = path.join(ROOT, 'consultations-voyants');
    const cvScanned = scanDirectory(cvDir, '/consultations-voyants');
    for (const page of cvScanned) {
        const isPillar = page.url === '/consultations-voyants/';
        pages.push({
            ...page,
            changefreq: 'weekly',
            priority: isPillar ? '0.8' : '0.7'
        });
    }

    // Glossaire
    const glossDir = path.join(ROOT, 'glossaire');
    const glossScanned = scanDirectory(glossDir, '/glossaire');
    for (const page of glossScanned) {
        const isPillar = page.url === '/glossaire/';
        pages.push({
            ...page,
            changefreq: 'monthly',
            priority: isPillar ? '0.7' : '0.5'
        });
    }

    // Utility pages
    const utilityDirs = [
        { dir: 'contact', priority: '0.5', changefreq: 'yearly' },
        { dir: 'plan-du-site', priority: '0.4', changefreq: 'monthly' },
    ];

    for (const util of utilityDirs) {
        const indexFile = path.join(ROOT, util.dir, 'index.html');
        if (fs.existsSync(indexFile)) {
            pages.push({
                url: `/${util.dir}/`,
                lastmod: getLastmod(indexFile),
                changefreq: util.changefreq,
                priority: util.priority
            });
        }
    }

    // Legal pages (low priority but good for SEO trust)
    const legalDir = path.join(ROOT, 'legal');
    const legalScanned = scanDirectory(legalDir, '/legal');
    for (const page of legalScanned) {
        const isPillar = page.url === '/legal/';
        pages.push({
            ...page,
            changefreq: 'yearly',
            priority: '0.3'
        });
    }

    return pages;
}

// ─── 2. Voyance Gratuite ──────────────────────────────────

function collectVoyanceGratuitePages() {
    const dir = path.join(ROOT, 'voyance-gratuite');
    const scanned = scanDirectory(dir, '/voyance-gratuite');

    return scanned.map(page => {
        const isPillar = page.url === '/voyance-gratuite/';
        return {
            ...page,
            changefreq: 'weekly',
            priority: isPillar ? '0.9' : '0.8'
        };
    });
}

// ─── 3. Avis ──────────────────────────────────────────────

function collectAvisPages() {
    const dir = path.join(ROOT, 'avis');
    const scanned = scanDirectory(dir, '/avis');

    return scanned.map(page => {
        const isPillar = page.url === '/avis/';
        const isComparison = page.url.includes('-vs-');
        return {
            ...page,
            changefreq: isPillar ? 'weekly' : 'monthly',
            priority: isPillar ? '0.9' : (isComparison ? '0.7' : '0.8')
        };
    });
}

// ─── 4. Tarot de Marseille ────────────────────────────────

function collectTarotPages() {
    const dir = path.join(ROOT, 'tarot-marseille');
    const scanned = scanDirectory(dir, '/tarot-marseille');

    return scanned.map(page => {
        const isPillar = page.url === '/tarot-marseille/';
        return {
            ...page,
            changefreq: 'monthly',
            priority: isPillar ? '0.9' : '0.7'
        };
    });
}

// ─── 5. Numérologie ───────────────────────────────────────

function collectNumerologiePages() {
    const dir = path.join(ROOT, 'numerologie');
    const scanned = scanDirectory(dir, '/numerologie');

    return scanned.map(page => {
        const isPillar = page.url === '/numerologie/';
        return {
            ...page,
            changefreq: 'monthly',
            priority: isPillar ? '0.9' : '0.7'
        };
    });
}

// ─── 6. Blog ─────────────────────────────────────────────

function collectBlogPages() {
    const dir = path.join(ROOT, 'blog');
    const scanned = scanDirectory(dir, '/blog');

    return scanned.map(page => {
        const isPillar = page.url === '/blog/';
        return {
            ...page,
            changefreq: isPillar ? 'daily' : 'monthly',
            priority: isPillar ? '0.7' : '0.6'
        };
    });
}

// ─── 7. Villes (Local SEO) ───────────────────────────────

function collectVillesPages() {
    const dir = path.join(ROOT, 'villes');
    if (!fs.existsSync(dir)) return [];

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const pages = [];

    for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        const indexFile = path.join(dir, entry.name, 'index.html');
        if (fs.existsSync(indexFile)) {
            pages.push({
                url: `/villes/${entry.name}/`,
                lastmod: getLastmod(indexFile),
                changefreq: 'monthly',
                priority: '0.6'
            });
        }
    }

    // Sort alphabetically for consistency
    pages.sort((a, b) => a.url.localeCompare(b.url));
    return pages;
}

// ─── Generate Sitemap Index ───────────────────────────────

function buildSitemapIndex(sitemaps) {
    const entries = sitemaps
        .filter(s => s.count > 0)
        .map(s => `  <sitemap>
    <loc>${BASE_URL}/${s.filename}</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>`)
        .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>
`;
}

// ─── Main ─────────────────────────────────────────────────

function main() {
    console.log('🗺️  Generating segmented sitemaps...\n');

    const sitemaps = [];

    // Generate each sub-sitemap
    const sections = [
        { filename: 'sitemap-core.xml', label: 'Core', collector: collectCorePages },
        { filename: 'sitemap-gratuit.xml', label: 'Voyance Gratuite', collector: collectVoyanceGratuitePages },
        { filename: 'sitemap-avis.xml', label: 'Avis', collector: collectAvisPages },
        { filename: 'sitemap-tarot.xml', label: 'Tarot', collector: collectTarotPages },
        { filename: 'sitemap-numerologie.xml', label: 'Numérologie', collector: collectNumerologiePages },
        { filename: 'sitemap-blog.xml', label: 'Blog', collector: collectBlogPages },
        { filename: 'sitemap-villes.xml', label: 'Villes', collector: collectVillesPages },
    ];

    let totalUrls = 0;

    for (const section of sections) {
        const pages = section.collector();
        const count = writeSitemap(section.filename, pages);
        sitemaps.push({ filename: section.filename, count });
        totalUrls += count;

        const bar = '█'.repeat(Math.ceil(count / 30)) || '▏';
        console.log(`  ${section.label.padEnd(20)} ${String(count).padStart(4)} URLs  ${bar}`);
    }

    // Generate sitemap index
    const indexXml = buildSitemapIndex(sitemaps);
    fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), indexXml, 'utf8');

    console.log(`\n  ${'─'.repeat(40)}`);
    console.log(`  ${'TOTAL'.padEnd(20)} ${String(totalUrls).padStart(4)} URLs`);
    console.log(`  ${'Sub-sitemaps'.padEnd(20)} ${String(sitemaps.filter(s => s.count > 0).length).padStart(4)} fichiers`);
    console.log(`\n✅ Sitemap index → sitemap.xml`);
    console.log(`📁 Sub-sitemaps  → sitemap-*.xml\n`);
}

main();
