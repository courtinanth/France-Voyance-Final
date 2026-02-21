/**
 * Glossaire Esoterique - Page Generator
 * Generates:
 *   - 1 glossaire pillar page at /glossaire/index.html
 *     (all 60 terms on one page for SEO weight concentration)
 *
 * Run: node generate-glossaire-pages.js
 */

const fs = require('fs');
const path = require('path');

// ─── LOAD DATA ───────────────────────────────────────────────────────────────

const dataPath = path.join(__dirname, 'data', 'glossaire.json');
const { terms } = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const outputDir = path.join(__dirname, 'glossaire');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const SITE_URL = 'https://france-voyance-avenir.fr';

// Sort terms alphabetically
const sortedTerms = [...terms].sort((a, b) => a.term.localeCompare(b.term, 'fr'));

// Group by first letter
const letterGroups = {};
sortedTerms.forEach(t => {
    const letter = t.term.charAt(0).toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (!letterGroups[letter]) letterGroups[letter] = [];
    letterGroups[letter].push(t);
});
const letters = Object.keys(letterGroups).sort((a, b) => a.localeCompare(b, 'fr'));

// Category config
const categoryIcons = {
    'Tarot': 'fa-star',
    'Astrologie': 'fa-moon',
    'Numerologie': 'fa-calculator',
    'Mediumnite': 'fa-eye',
    'Divination': 'fa-crystal-ball',
    'Esoterisme': 'fa-yin-yang',
    'Pratiques': 'fa-hands'
};
const categoryColors = {
    'Tarot': '#8B5CF6',
    'Astrologie': '#3B82F6',
    'Numerologie': '#F59E0B',
    'Mediumnite': '#EC4899',
    'Divination': '#10B981',
    'Esoterisme': '#6366F1',
    'Pratiques': '#D4AF37'
};

// ─── INLINE CSS ─────────────────────────────────────────────────────────────

const GLOSSAIRE_CSS = `
<style>
    .glossaire-hero {
        background: linear-gradient(135deg, #1A1A4A 0%, #4A1A6B 100%);
        color: #fff;
        padding: 60px 0;
        text-align: center;
    }
    .glossaire-hero h1 {
        font-family: 'Playfair Display', serif;
        font-size: 2.5em;
        margin-bottom: 20px;
    }
    .glossaire-hero p {
        font-size: 1.2em;
        max-width: 700px;
        margin: 0 auto;
        opacity: 0.9;
    }
    .alpha-nav {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: center;
        padding: 25px 0;
        background: #f8f6fc;
        border-bottom: 2px solid #e0d4f0;
        position: sticky;
        top: 0;
        z-index: 50;
    }
    .alpha-nav a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #fff;
        color: #4A1A6B;
        font-weight: 700;
        font-size: 1em;
        text-decoration: none;
        border: 2px solid #e0d4f0;
        transition: all 0.3s ease;
    }
    .alpha-nav a:hover, .alpha-nav a.active {
        background: #4A1A6B;
        color: #fff;
        border-color: #4A1A6B;
    }
    .alpha-nav a.disabled {
        opacity: 0.3;
        pointer-events: none;
    }
    .letter-section {
        scroll-margin-top: 80px;
    }
    .letter-heading {
        display: flex;
        align-items: center;
        gap: 15px;
        margin: 50px 0 25px;
        padding-bottom: 10px;
        border-bottom: 3px solid #D4AF37;
    }
    .letter-heading span {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 55px;
        height: 55px;
        background: linear-gradient(135deg, #4A1A6B, #1A1A4A);
        color: #D4AF37;
        font-family: 'Playfair Display', serif;
        font-size: 1.8em;
        font-weight: 700;
        border-radius: 12px;
    }
    .letter-heading h2 {
        font-family: 'Playfair Display', serif;
        color: #4A1A6B;
        font-size: 1.3em;
        margin: 0;
    }
    .term-card {
        background: #fff;
        border-radius: 12px;
        padding: 30px;
        margin-bottom: 25px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.06);
        border: 1px solid #eee;
        transition: box-shadow 0.3s ease;
        scroll-margin-top: 90px;
    }
    .term-card:hover {
        box-shadow: 0 6px 20px rgba(74, 26, 107, 0.12);
    }
    .term-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 15px;
        margin-bottom: 15px;
        flex-wrap: wrap;
    }
    .term-card h3 {
        font-family: 'Playfair Display', serif;
        color: #4A1A6B;
        font-size: 1.4em;
        margin: 0;
    }
    .cat-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 5px 14px;
        border-radius: 20px;
        font-size: 0.82em;
        font-weight: 600;
        color: #fff;
        white-space: nowrap;
    }
    .term-short {
        font-size: 1.05em;
        line-height: 1.7;
        color: #444;
        margin-bottom: 15px;
    }
    .term-details summary {
        cursor: pointer;
        color: #4A1A6B;
        font-weight: 600;
        padding: 10px 0;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.95em;
    }
    .term-details summary:hover {
        color: #D4AF37;
    }
    .term-details[open] summary {
        color: #D4AF37;
        margin-bottom: 15px;
        border-bottom: 1px solid #f0f0f0;
        padding-bottom: 10px;
    }
    .term-long p {
        line-height: 1.8;
        color: #333;
        margin-bottom: 15px;
    }
    .related-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 20px;
        padding-top: 15px;
        border-top: 1px solid #f0f0f0;
    }
    .related-tags span {
        font-size: 0.85em;
        font-weight: 600;
        color: #4A1A6B;
        margin-right: 5px;
    }
    .related-tag {
        display: inline-block;
        padding: 4px 12px;
        background: #f8f6fc;
        border: 1px solid #e0d4f0;
        border-radius: 15px;
        color: #4A1A6B;
        font-size: 0.83em;
        text-decoration: none;
        transition: all 0.2s ease;
    }
    .related-tag:hover {
        background: #4A1A6B;
        color: #fff;
    }
    .related-links {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 12px;
    }
    .related-link {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 14px;
        background: linear-gradient(135deg, #4A1A6B, #1A1A4A);
        color: #D4AF37;
        border-radius: 8px;
        font-size: 0.83em;
        font-weight: 600;
        text-decoration: none;
        transition: opacity 0.3s ease;
    }
    .related-link:hover { opacity: 0.85; }
    .cta-between {
        background: linear-gradient(135deg, #4A1A6B 0%, #1A1A4A 100%);
        color: #fff;
        padding: 35px;
        border-radius: 12px;
        text-align: center;
        margin: 40px 0;
        border: 2px solid #D4AF37;
    }
    .cta-between h3 {
        color: #D4AF37;
        font-family: 'Playfair Display', serif;
        font-size: 1.3em;
        margin-bottom: 12px;
    }
    .cta-between p {
        opacity: 0.9;
        margin-bottom: 20px;
        font-size: 1em;
    }
    .cat-filter {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 15px;
    }
    .cat-filter-btn {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 6px 12px;
        border-radius: 8px;
        font-size: 0.8em;
        font-weight: 600;
        cursor: pointer;
        border: 2px solid transparent;
        transition: all 0.3s ease;
        text-decoration: none;
        color: #fff;
    }
    .cat-filter-btn:hover {
        opacity: 0.8;
    }
    .cat-filter-btn.active-filter {
        box-shadow: 0 0 0 2px #D4AF37;
    }
    .sidebar .cta-box {
        margin-bottom: 25px;
    }
    @media (max-width: 768px) {
        .glossaire-hero h1 { font-size: 1.8em; }
        .alpha-nav a { width: 34px; height: 34px; font-size: 0.85em; }
        .term-card { padding: 20px; }
        .letter-heading span { width: 45px; height: 45px; font-size: 1.4em; }
    }
</style>`;

// ─── SHARED HTML PARTS ──────────────────────────────────────────────────────

function getHead(title, metaDesc, canonical, schemaLD) {
    return `<!DOCTYPE html>
<html lang="fr" class="no-js">

<head>
    <script>document.documentElement.classList.remove('no-js');</script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${metaDesc}">
    <link rel="canonical" href="${SITE_URL}${canonical}">
    <meta name="robots" content="index, follow">
    <link rel="icon" href="/images/favicon.png" type="image/png">

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">

    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="/css/style.css?v=2026">
    <link rel="stylesheet" href="/css/animations.css?v=2026">
    <script src="/js/config.js"></script>

    ${GLOSSAIRE_CSS}

    <!-- Schema JSON-LD -->
    <script type="application/ld+json">
    ${JSON.stringify(schemaLD, null, 2)}
    </script>
</head>`;
}

function getHeader() {
    return `
    <div class="stars-container"></div>
    <div class="reading-progress-container">
        <div class="reading-progress-bar"></div>
    </div>

    <!-- HEADER -->
    <header class="site-header">
        <div class="container header-container">
            <a href="/" class="logo">
                <img src="/images/logo.svg" alt="France Voyance Avenir">
            </a>

            <div class="mobile-toggle">
                <i class="fa-solid fa-bars"></i>
            </div>

            <nav class="main-nav">
                <a href="/" class="nav-logo">
                    <img src="/images/logo.svg" alt="France Voyance Avenir">
                </a>
                <ul>
                    <li class="nav-item"><a href="/" class="nav-link">Accueil</a></li>
                    <li class="nav-item">
                        <a href="/voyance-gratuite/" class="nav-link">Voyance Gratuite <i class="fa-solid fa-chevron-down" style="font-size: 0.7em;"></i></a>
                        <ul class="dropdown-menu">
                            <li><a href="/voyance-gratuite/tarot-gratuit/">Tarot Gratuit</a></li>
                            <li><a href="/voyance-gratuite/tarot-d-amour/">Tarot Amour</a></li>
                            <li><a href="/voyance-gratuite/numerologie-gratuite/">Numerologie Gratuite</a></li>
                            <li><a href="/voyance-gratuite/pendule-oui-non/">Pendule Oui/Non</a></li>
                            <li><a href="/voyance-gratuite/tarot-oui-non/">Tarot Oui/Non</a></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link">Arts Divinatoires <i class="fa-solid fa-chevron-down" style="font-size: 0.7em;"></i></a>
                        <ul class="dropdown-menu">
                            <li><a href="/arts-divinatoires/pendule/">Voyance Pendule</a></li>
                            <li><a href="/arts-divinatoires/oracle-belline/">Oracle Belline</a></li>
                            <li><a href="/arts-divinatoires/oracle-ge/">Oracle Ge</a></li>
                            <li><a href="/arts-divinatoires/runes/">Tirage Runes</a></li>
                            <li><a href="/arts-divinatoires/cartomancie/">Cartomancie</a></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link">Consultations <i class="fa-solid fa-chevron-down" style="font-size: 0.7em;"></i></a>
                        <ul class="dropdown-menu">
                            <li><a href="/consultations/amour-retour-affectif/">Amour & Retour Affectif</a></li>
                            <li><a href="/consultations/flamme-jumelle/">Flamme Jumelle</a></li>
                            <li><a href="/consultations/medium-defunts/">Medium & Defunts</a></li>
                            <li><a href="/consultations/travail-carriere/">Travail & Carriere</a></li>
                            <li><a href="/consultations/argent-finances/">Argent & Finances</a></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link">Consulter <i class="fa-solid fa-chevron-down" style="font-size: 0.7em;"></i></a>
                        <ul class="dropdown-menu">
                            <li><a href="/consulter/voyance-telephone/">Voyance Telephone</a></li>
                            <li><a href="/consulter/voyance-sms/">Voyance SMS</a></li>
                            <li><a href="/consulter/voyance-chat/">Voyance Chat</a></li>
                            <li><a href="/consulter/voyance-audiotel/">Voyance Audiotel</a></li>
                        </ul>
                    </li>
                    <li class="nav-item"><a href="/avis/" class="nav-link">Avis & Comparatifs</a></li>
                </ul>
                <div class="header-cta text-center mt-3 mt-lg-0 ml-lg-4">
                    <a href="javascript:void(0)" onclick="window.open(getAffiliateUrl('tarot'), '_blank'); return false;" class="btn btn-gold" data-affiliate="tarot">Consultation Immediate</a>
                </div>
            </nav>
        </div>
    </header>`;
}

function getFooter() {
    return `
    <!-- FOOTER -->
    <footer class="site-footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-col">
                    <div class="logo" style="margin-bottom: 20px;">
                        <i class="fa-solid fa-moon"></i> France Voyance Avenir
                    </div>
                    <p>Votre guide vers les arts divinatoires. Trouvez le voyant qui vous correspond parmi notre selection de professionnels verifies.</p>
                </div>
                <div class="footer-col">
                    <h4>Navigation Rapide</h4>
                    <ul class="footer-links">
                        <li><a href="/consulter/voyance-telephone/">Voyance Telephone</a></li>
                        <li><a href="/voyance-gratuite/">Voyance Gratuite</a></li>
                        <li><a href="/voyance-gratuite/tarot-d-amour/">Tarot Amour</a></li>
                        <li><a href="/tarot-marseille/">Tarot de Marseille</a></li>
                        <li><a href="/voyance-gratuite/numerologie-gratuite/">Numerologie</a></li>
                        <li><a href="/blog/">Le Blog</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Informations</h4>
                    <ul class="footer-links">
                        <li><a href="/legal/mentions-legales/">Mentions Legales</a></li>
                        <li><a href="/legal/politique-confidentialite/">Politique de Confidentialite</a></li>
                        <li><a href="/legal/politique-cookies/">Politique des Cookies</a></li>
                        <li><a href="/legal/cgu/">CGU</a></li>
                        <li><a href="/contact/">Contact</a></li>
                        <li><a href="/plan-du-site/">Plan du site</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Contact</h4>
                    <ul class="footer-links">
                        <li><i class="fa-solid fa-envelope" style="margin-right: 10px; color: var(--color-secondary);"></i> contact@france-voyance-avenir.fr</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <div class="container">
                <p>&copy; 2026 France Voyance Avenir - Tous droits reserves</p>
                <div class="disclaimer">
                    Ce site propose des services de divertissement. Les consultations de voyance ne remplacent pas un avis medical, juridique ou financier professionnel.
                </div>
                <p class="affiliate-disclosure">
                    * Ce site contient des liens affilies. En cliquant sur ces liens et en effectuant un achat, nous pouvons recevoir une commission sans frais supplementaires pour vous. Cela nous aide a maintenir ce site gratuit.
                </p>
            </div>
        </div>
    </footer>

    <!-- Sticky CTA -->
    <div class="sticky-cta">
        <div class="sticky-cta-pulse"></div>
        <a href="javascript:void(0)" onclick="window.open(getAffiliateUrl('tarot'), '_blank'); return false;" data-affiliate="tarot" class="btn btn-gold">
            <span class="sticky-cta-icon"><i class="fas fa-phone-alt"></i></span>
            <span>Consulter</span>
        </a>
    </div>

    <script src="/js/animations.js" defer></script>
    <script src="/js/main.js?v=2026"></script>`;
}

// ─── HELPERS ────────────────────────────────────────────────────────────────

function esc(str) {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function toParas(text) {
    return text.split('\n\n').filter(p => p.trim()).map(p => `<p>${p.trim()}</p>`).join('\n                        ');
}

function slugify(str) {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ─── GENERATE PILLAR PAGE ───────────────────────────────────────────────────

function generateGlossairePage() {
    const title = 'Glossaire Esoterique : 60 Termes de Voyance et Divination | France Voyance Avenir';
    const metaDesc = 'Glossaire complet de la voyance et de l\'esoterisme : 60 definitions detaillees des termes du Tarot, de l\'astrologie, de la numerologie, de la mediumnite et des arts divinatoires.';
    const canonical = '/glossaire/';

    // Top 10 terms for FAQ schema
    const faqTerms = sortedTerms.slice(0, 10);

    const schema = [
        {
            "@context": "https://schema.org",
            "@type": "DefinedTermSet",
            "name": "Glossaire Esoterique - Voyance et Arts Divinatoires",
            "description": metaDesc,
            "url": `${SITE_URL}/glossaire/`,
            "hasDefinedTerm": sortedTerms.map(t => ({
                "@type": "DefinedTerm",
                "name": t.term,
                "description": t.shortDef,
                "url": `${SITE_URL}/glossaire/#${t.slug}`,
                "inDefinedTermSet": `${SITE_URL}/glossaire/`
            }))
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Accueil", "item": SITE_URL },
                { "@type": "ListItem", "position": 2, "name": "Glossaire Esoterique", "item": `${SITE_URL}/glossaire/` }
            ]
        },
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqTerms.map(t => ({
                "@type": "Question",
                "name": `Qu'est-ce que ${t.term.toLowerCase().startsWith('le ') || t.term.toLowerCase().startsWith('la ') || t.term.toLowerCase().startsWith("l'") ? t.term.toLowerCase() : (/^[aeiouhAEIOUH]/.test(t.term) ? "l'" : "le ") + t.term.toLowerCase()} ?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": t.shortDef
                }
            }))
        }
    ];

    // Build term cards grouped by letter
    let termsHTML = '';
    let ctaCount = 0;
    const ctaMessages = [
        { title: "Besoin d'une guidance personnalisee ?", text: "Nos voyants professionnels vous eclairent sur votre situation avec bienveillance et precision." },
        { title: "Une question vous preoccupe ?", text: "Obtenez des reponses claires et detaillees grace a nos experts en arts divinatoires." },
        { title: "Explorez votre avenir des maintenant", text: "Consultez un voyant de confiance et decouvrez ce que les astres et les cartes revelent pour vous." },
        { title: "Votre premiere consultation offerte", text: "Profitez de 10 minutes gratuites pour decouvrir la voyance par telephone avec un professionnel." }
    ];

    letters.forEach((letter, letterIdx) => {
        const termsInGroup = letterGroups[letter];
        const count = termsInGroup.length;

        termsHTML += `
                    <!-- Lettre ${letter} -->
                    <div class="letter-section" id="letter-${letter}">
                        <div class="letter-heading">
                            <span>${letter}</span>
                            <h2>${count} terme${count > 1 ? 's' : ''} en ${letter}</h2>
                        </div>
`;

        termsInGroup.forEach(t => {
            const icon = categoryIcons[t.category] || 'fa-circle';
            const color = categoryColors[t.category] || '#4A1A6B';
            const relatedTagsHTML = t.relatedTerms.map(rt => {
                const rtSlug = slugify(rt);
                const rtExists = sortedTerms.find(st => st.slug === rtSlug);
                if (rtExists) {
                    return `<a href="#${rtSlug}" class="related-tag">${esc(rt)}</a>`;
                }
                return `<span class="related-tag" style="cursor:default;">${esc(rt)}</span>`;
            }).join('\n                                ');

            const relatedLinksHTML = t.relatedLinks.map(rl =>
                `<a href="${rl.url}" class="related-link"><i class="fas fa-arrow-right"></i> ${esc(rl.text)}</a>`
            ).join('\n                                ');

            termsHTML += `
                        <div class="term-card" id="${t.slug}" data-category="${t.category}">
                            <div class="term-header">
                                <h3><i class="fas ${icon}" style="color:${color}; margin-right:10px; font-size:0.8em;"></i>${esc(t.term)}</h3>
                                <span class="cat-badge" style="background:${color};"><i class="fas ${icon}"></i> ${t.category}</span>
                            </div>
                            <p class="term-short">${esc(t.shortDef)}</p>
                            <details class="term-details">
                                <summary><i class="fas fa-book-open"></i> Lire la definition complete</summary>
                                <div class="term-long">
                                    ${toParas(t.longDef)}
                                </div>
                            </details>
                            <div class="related-tags">
                                <span><i class="fas fa-link"></i> Voir aussi :</span>
                                ${relatedTagsHTML}
                            </div>
                            <div class="related-links">
                                ${relatedLinksHTML}
                            </div>
                        </div>
`;
        });

        termsHTML += `                    </div>\n`;

        // Insert CTA between every 3 letter groups
        if ((letterIdx + 1) % 3 === 0 && letterIdx < letters.length - 1) {
            const cta = ctaMessages[ctaCount % ctaMessages.length];
            ctaCount++;
            termsHTML += `
                    <div class="cta-between">
                        <h3><i class="fas fa-phone-alt" style="margin-right:10px;"></i> ${cta.title}</h3>
                        <p>${cta.text}</p>
                        <a href="javascript:void(0)" onclick="window.open(getAffiliateUrl('tarot'), '_blank'); return false;" class="btn btn-gold" data-affiliate="tarot" style="display:inline-block; padding:14px 30px; font-size:1em;">
                            <i class="fas fa-phone-alt" style="margin-right:8px;"></i> Consulter maintenant
                        </a>
                        <p style="font-size:0.85em; opacity:0.7; margin-top:10px;">* Jusqu'a 10 minutes offertes</p>
                    </div>
`;
        }
    });

    // Alphabetical nav
    const allPossibleLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const alphaNavHTML = allPossibleLetters.map(l => {
        if (letterGroups[l]) {
            return `<a href="#letter-${l}" title="Termes en ${l}">${l}</a>`;
        }
        return `<a class="disabled">${l}</a>`;
    }).join('\n                    ');

    // Sidebar category filter buttons
    const categories = [...new Set(terms.map(t => t.category))];
    const catFilterHTML = categories.map(cat => {
        const icon = categoryIcons[cat] || 'fa-circle';
        const color = categoryColors[cat] || '#4A1A6B';
        return `<button class="cat-filter-btn" style="background:${color};" onclick="filterCategory('${cat}')" data-cat="${cat}"><i class="fas ${icon}"></i> ${cat}</button>`;
    }).join('\n                            ');

    // FAQ section
    const faqHTML = faqTerms.map(t => {
        const article = t.term.toLowerCase().startsWith('le ') || t.term.toLowerCase().startsWith('la ') || t.term.toLowerCase().startsWith("l'") ? t.term.toLowerCase() : (/^[aeiouhAEIOUH]/.test(t.term) ? "l'" : "le ") + t.term.toLowerCase();
        return `
                    <details style="margin-bottom:15px; border:1px solid #eee; border-radius:10px; overflow:hidden;">
                        <summary style="padding:16px 20px; cursor:pointer; font-weight:600; color:#4A1A6B; background:#f8f6fc; font-size:1em;">
                            Qu'est-ce que ${article} ?
                        </summary>
                        <div style="padding:16px 20px; line-height:1.7; color:#444;">
                            ${esc(t.shortDef)}
                            <br><br>
                            <a href="#${t.slug}" style="color:#4A1A6B; font-weight:600; text-decoration:none;">
                                <i class="fas fa-arrow-right" style="margin-right:6px; color:#D4AF37;"></i> Lire la definition complete
                            </a>
                        </div>
                    </details>`;
    }).join('');

    return `${getHead(title, metaDesc, canonical, schema)}

<body>
${getHeader()}

    <!-- BREADCRUMB -->
    <section class="breadcrumb-section" style="padding: 15px 0; background: rgba(26,26,74,0.03);">
        <div class="container">
            <nav aria-label="Fil d'Ariane">
                <ol style="display:flex; list-style:none; padding:0; margin:0; font-size:0.9em; gap:8px;">
                    <li><a href="/" style="color:#4A1A6B;">Accueil</a></li>
                    <li style="color:#999;">&#8250;</li>
                    <li style="color:#888;">Glossaire Esoterique</li>
                </ol>
            </nav>
        </div>
    </section>

    <!-- HERO -->
    <section class="glossaire-hero">
        <div class="container">
            <h1>
                <i class="fas fa-book" style="color:#D4AF37; margin-right:15px;"></i>
                Glossaire Esoterique
            </h1>
            <p>
                Explorez 60 definitions detaillees des termes de la voyance, du Tarot, de l'astrologie, de la numerologie et des arts divinatoires. Votre guide de reference pour comprendre l'univers esoterique.
            </p>
            <div style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap; margin-top:30px;">
                <a href="/voyance-gratuite/tarot-gratuit/" class="btn btn-gold" style="padding:14px 30px; font-size:1em;">
                    <i class="fas fa-magic" style="margin-right:8px;"></i> Tirage Gratuit
                </a>
                <a href="javascript:void(0)" onclick="window.open(getAffiliateUrl('tarot'), '_blank'); return false;" class="btn" data-affiliate="tarot" style="padding:14px 30px; font-size:1em; background:rgba(255,255,255,0.15); color:#fff; border-radius:10px; text-decoration:none; border:2px solid #D4AF37;">
                    <i class="fas fa-phone-alt" style="margin-right:8px;"></i> Consulter un voyant *
                </a>
            </div>
        </div>
    </section>

    <!-- ALPHABETICAL NAV -->
    <nav class="alpha-nav" aria-label="Navigation alphabetique">
        <div class="container" style="display:flex; flex-wrap:wrap; gap:8px; justify-content:center;">
                    ${alphaNavHTML}
        </div>
    </nav>

    <!-- MAIN CONTENT -->
    <main class="content-section" style="padding: 50px 0;">
        <div class="container">

            <!-- Introduction -->
            <div style="max-width:800px; margin:0 auto 40px;">
                <h2 style="font-family:'Playfair Display',serif; color:#4A1A6B; text-align:center; margin-bottom:25px;">Comprendre le vocabulaire esoterique</h2>
                <p style="line-height:1.8; color:#444; margin-bottom:15px;">Le monde de la voyance et de l'esoterisme possede un vocabulaire riche et specifique. Que vous soyez novice en arts divinatoires ou praticien confirme, la maitrise de ces termes est essentielle pour comprendre pleinement les messages de vos consultations et approfondir votre connaissance des sciences occultes.</p>
                <p style="line-height:1.8; color:#444;">Ce glossaire reunit 60 definitions detaillees couvrant le Tarot, l'astrologie, la numerologie, la mediumnite, les pratiques divinatoires et l'esoterisme. Chaque terme est accompagne d'une explication approfondie, de liens vers des termes connexes et de ressources pour aller plus loin.</p>
            </div>

            <div class="content-grid">
                <div class="main-content">

${termsHTML}

                    <!-- FAQ -->
                    <div style="background:#fff; border-radius:12px; padding:30px; box-shadow:0 4px 15px rgba(0,0,0,0.06); border:1px solid #eee; margin-top:40px;">
                        <h2 style="font-family:'Playfair Display',serif; color:#4A1A6B; margin-bottom:25px; padding-bottom:10px; border-bottom:2px solid #D4AF37;">
                            <i class="fas fa-question-circle" style="color:#D4AF37; margin-right:10px;"></i> Questions frequentes
                        </h2>
${faqHTML}
                    </div>

                    <!-- Final CTA -->
                    <div class="cta-between" style="margin-top:40px;">
                        <h3><i class="fas fa-star" style="margin-right:10px;"></i> Pret a explorer votre avenir ?</h3>
                        <p>Maintenant que vous maitrisez le vocabulaire esoterique, consultez un voyant professionnel pour une guidance personnalisee.</p>
                        <a href="javascript:void(0)" onclick="window.open(getAffiliateUrl('tarot'), '_blank'); return false;" class="btn btn-gold" data-affiliate="tarot" style="display:inline-block; padding:16px 35px; font-size:1.1em;">
                            <i class="fas fa-phone-alt" style="margin-right:10px;"></i> Consulter maintenant
                        </a>
                        <p style="font-size:0.85em; opacity:0.7; margin-top:10px;">* Jusqu'a 10 minutes offertes pour votre premiere consultation</p>
                    </div>

                </div>

                <!-- SIDEBAR -->
                <aside class="sidebar">
                    <div class="cta-box" style="text-align:center;">
                        <h3 style="font-family:'Playfair Display',serif; color:#4A1A6B; margin-bottom:15px;">
                            <i class="fas fa-phone-alt" style="color:#D4AF37;"></i> Consultation privee
                        </h3>
                        <p style="color:#555; margin-bottom:15px;">Un voyant professionnel vous eclaire sur votre situation et votre avenir.</p>
                        <a href="javascript:void(0)" onclick="window.open(getAffiliateUrl('tarot'), '_blank'); return false;" class="btn btn-gold" data-affiliate="tarot" style="display:block; text-align:center; padding:14px;">
                            <i class="fas fa-phone-alt" style="margin-right:8px;"></i> Appeler un voyant *
                        </a>
                        <p style="font-size:0.8em; color:#999; margin-top:8px;">* 10 min offertes</p>
                    </div>

                    <div class="cta-box" style="text-align:center;">
                        <h3 style="font-family:'Playfair Display',serif; color:#4A1A6B; margin-bottom:15px;">
                            <i class="fas fa-filter" style="color:#D4AF37;"></i> Filtrer par categorie
                        </h3>
                        <div class="cat-filter">
                            <button class="cat-filter-btn active-filter" style="background:#4A1A6B;" onclick="filterCategory('all')" data-cat="all"><i class="fas fa-list"></i> Tous</button>
                            ${catFilterHTML}
                        </div>
                    </div>

                    <div class="cta-box">
                        <h3 style="font-family:'Playfair Display',serif; color:#4A1A6B; margin-bottom:15px;">
                            <i class="fas fa-magic" style="color:#D4AF37;"></i> Outils gratuits
                        </h3>
                        <ul style="list-style:none; padding:0;">
                            <li style="margin-bottom:10px;">
                                <a href="/voyance-gratuite/tarot-gratuit/" style="color:#4A1A6B; text-decoration:none; display:flex; align-items:center; gap:8px; padding:8px 0; font-weight:500;">
                                    <i class="fas fa-star" style="color:#D4AF37; font-size:0.8em;"></i> Tirage de Tarot Gratuit
                                </a>
                            </li>
                            <li style="margin-bottom:10px;">
                                <a href="/voyance-gratuite/tarot-d-amour/" style="color:#4A1A6B; text-decoration:none; display:flex; align-items:center; gap:8px; padding:8px 0; font-weight:500;">
                                    <i class="fas fa-heart" style="color:#D4AF37; font-size:0.8em;"></i> Tirage Tarot Amour
                                </a>
                            </li>
                            <li style="margin-bottom:10px;">
                                <a href="/voyance-gratuite/numerologie-gratuite/" style="color:#4A1A6B; text-decoration:none; display:flex; align-items:center; gap:8px; padding:8px 0; font-weight:500;">
                                    <i class="fas fa-calculator" style="color:#D4AF37; font-size:0.8em;"></i> Numerologie Gratuite
                                </a>
                            </li>
                            <li style="margin-bottom:10px;">
                                <a href="/voyance-gratuite/pendule-oui-non/" style="color:#4A1A6B; text-decoration:none; display:flex; align-items:center; gap:8px; padding:8px 0; font-weight:500;">
                                    <i class="fas fa-circle-notch" style="color:#D4AF37; font-size:0.8em;"></i> Pendule Oui/Non
                                </a>
                            </li>
                            <li style="margin-bottom:10px;">
                                <a href="/voyance-gratuite/tarot-oui-non/" style="color:#4A1A6B; text-decoration:none; display:flex; align-items:center; gap:8px; padding:8px 0; font-weight:500;">
                                    <i class="fas fa-check-circle" style="color:#D4AF37; font-size:0.8em;"></i> Tarot Oui/Non
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div class="cta-box">
                        <h3 style="font-family:'Playfair Display',serif; color:#4A1A6B; margin-bottom:15px;">
                            <i class="fas fa-compass" style="color:#D4AF37;"></i> Explorer
                        </h3>
                        <ul style="list-style:none; padding:0;">
                            <li style="margin-bottom:10px;">
                                <a href="/tarot-marseille/" style="color:#4A1A6B; text-decoration:none; display:flex; align-items:center; gap:8px; padding:8px 0; font-weight:500;">
                                    <i class="fas fa-chevron-right" style="color:#D4AF37; font-size:0.7em;"></i> Tarot de Marseille
                                </a>
                            </li>
                            <li style="margin-bottom:10px;">
                                <a href="/numerologie/" style="color:#4A1A6B; text-decoration:none; display:flex; align-items:center; gap:8px; padding:8px 0; font-weight:500;">
                                    <i class="fas fa-chevron-right" style="color:#D4AF37; font-size:0.7em;"></i> Numerologie
                                </a>
                            </li>
                            <li style="margin-bottom:10px;">
                                <a href="/arts-divinatoires/runes/" style="color:#4A1A6B; text-decoration:none; display:flex; align-items:center; gap:8px; padding:8px 0; font-weight:500;">
                                    <i class="fas fa-chevron-right" style="color:#D4AF37; font-size:0.7em;"></i> Tirage de Runes
                                </a>
                            </li>
                            <li style="margin-bottom:10px;">
                                <a href="/arts-divinatoires/oracle-belline/" style="color:#4A1A6B; text-decoration:none; display:flex; align-items:center; gap:8px; padding:8px 0; font-weight:500;">
                                    <i class="fas fa-chevron-right" style="color:#D4AF37; font-size:0.7em;"></i> Oracle Belline
                                </a>
                            </li>
                            <li style="margin-bottom:10px;">
                                <a href="/consultations/flamme-jumelle/" style="color:#4A1A6B; text-decoration:none; display:flex; align-items:center; gap:8px; padding:8px 0; font-weight:500;">
                                    <i class="fas fa-chevron-right" style="color:#D4AF37; font-size:0.7em;"></i> Flamme Jumelle
                                </a>
                            </li>
                            <li style="margin-bottom:10px;">
                                <a href="/blog/" style="color:#4A1A6B; text-decoration:none; display:flex; align-items:center; gap:8px; padding:8px 0; font-weight:500;">
                                    <i class="fas fa-chevron-right" style="color:#D4AF37; font-size:0.7em;"></i> Le Blog
                                </a>
                            </li>
                        </ul>
                    </div>
                </aside>
            </div>

        </div>
    </main>

    <!-- Category Filter Script -->
    <script>
    function filterCategory(cat) {
        const cards = document.querySelectorAll('.term-card');
        const sections = document.querySelectorAll('.letter-section');
        const btns = document.querySelectorAll('.cat-filter-btn');

        btns.forEach(b => b.classList.remove('active-filter'));
        document.querySelector('[data-cat="' + cat + '"]').classList.add('active-filter');

        if (cat === 'all') {
            cards.forEach(c => c.style.display = '');
            sections.forEach(s => s.style.display = '');
            return;
        }

        cards.forEach(c => {
            c.style.display = c.dataset.category === cat ? '' : 'none';
        });

        sections.forEach(s => {
            const visibleCards = s.querySelectorAll('.term-card[style=""], .term-card:not([style])');
            const hasVisible = Array.from(s.querySelectorAll('.term-card')).some(c => c.style.display !== 'none');
            s.style.display = hasVisible ? '' : 'none';
        });
    }
    </script>

${getFooter()}
</body>
</html>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// GENERATE
// ═══════════════════════════════════════════════════════════════════════════════

const html = generateGlossairePage();
fs.writeFileSync(path.join(outputDir, 'index.html'), html, 'utf8');

console.log(`Glossaire page generated successfully!`);
console.log(`   - 1 pillar page with ${sortedTerms.length} terms`);
console.log(`   - ${letters.length} letter groups: ${letters.join(', ')}`);
console.log(`\nOutput: ${outputDir}/index.html`);
