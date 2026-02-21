/**
 * Tarot de Marseille - 22 Arcanes Majeurs Page Generator
 * Generates:
 *   - 22 individual arcane pages at /tarot-marseille/[slug]/index.html
 *   - 1 pillar page at /tarot-marseille/index.html
 *
 * Run: node generate-tarot-pages.js
 */

const fs = require('fs');
const path = require('path');

// ─── LOAD DATA ───────────────────────────────────────────────────────────────

const dataPath = path.join(__dirname, 'data', 'tarot-arcanes.json');
const { arcanes } = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const outputDir = path.join(__dirname, 'tarot-marseille');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const SITE_URL = 'https://france-voyance-avenir.fr';

// ─── INLINE CSS ─────────────────────────────────────────────────────────────

const TAROT_INLINE_CSS = `
<style>
    .arcane-hero {
        display: flex;
        gap: 40px;
        align-items: flex-start;
        margin-bottom: 40px;
    }
    @media (max-width: 768px) {
        .arcane-hero { flex-direction: column; align-items: center; }
    }
    .arcane-image {
        flex-shrink: 0;
        width: 220px;
    }
    .arcane-image img {
        width: 100%;
        border-radius: 12px;
        box-shadow: 0 8px 30px rgba(74, 26, 107, 0.3);
        border: 3px solid #D4AF37;
    }
    .arcane-intro {
        flex: 1;
    }
    .arcane-intro h1 {
        font-family: 'Playfair Display', serif;
        color: #4A1A6B;
        font-size: 2em;
        margin-bottom: 15px;
    }
    .arcane-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-bottom: 20px;
    }
    .arcane-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: #f8f6fc;
        border: 1px solid #e0d4f0;
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 0.9em;
        color: #4A1A6B;
    }
    .arcane-badge i { color: #D4AF37; }
    .keywords-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin: 25px 0;
    }
    @media (max-width: 768px) {
        .keywords-grid { grid-template-columns: 1fr; }
    }
    .keywords-box {
        padding: 20px;
        border-radius: 12px;
    }
    .keywords-upright {
        background: linear-gradient(135deg, #e8f5e9, #f1f8e9);
        border: 1px solid #a5d6a7;
    }
    .keywords-reversed {
        background: linear-gradient(135deg, #fce4ec, #fff3e0);
        border: 1px solid #ef9a9a;
    }
    .keywords-box h3 {
        font-family: 'Playfair Display', serif;
        margin-bottom: 12px;
        font-size: 1.1em;
    }
    .keywords-upright h3 { color: #2e7d32; }
    .keywords-reversed h3 { color: #c62828; }
    .keywords-box .keyword-tag {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 15px;
        font-size: 0.85em;
        margin: 3px;
    }
    .keywords-upright .keyword-tag {
        background: #fff;
        color: #2e7d32;
        border: 1px solid #a5d6a7;
    }
    .keywords-reversed .keyword-tag {
        background: #fff;
        color: #c62828;
        border: 1px solid #ef9a9a;
    }
    .meaning-section {
        margin: 35px 0;
        padding: 30px;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.06);
        border: 1px solid #eee;
    }
    .meaning-section h2 {
        font-family: 'Playfair Display', serif;
        color: #4A1A6B;
        font-size: 1.5em;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 2px solid #D4AF37;
    }
    .meaning-section h2 i {
        color: #D4AF37;
        margin-right: 10px;
    }
    .meaning-tabs {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
    }
    .meaning-tab {
        padding: 8px 20px;
        border-radius: 20px;
        cursor: pointer;
        font-weight: 600;
        font-size: 0.9em;
        border: 2px solid transparent;
        transition: all 0.3s ease;
    }
    .tab-upright {
        background: #e8f5e9;
        color: #2e7d32;
        border-color: #a5d6a7;
    }
    .tab-reversed {
        background: #fce4ec;
        color: #c62828;
        border-color: #ef9a9a;
    }
    .tab-upright.active { background: #2e7d32; color: #fff; }
    .tab-reversed.active { background: #c62828; color: #fff; }
    .meaning-content p {
        margin-bottom: 15px;
        line-height: 1.8;
        color: #333;
    }
    .combinaisons-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin: 20px 0;
    }
    @media (max-width: 768px) {
        .combinaisons-grid { grid-template-columns: 1fr; }
    }
    .combi-card {
        background: #f8f6fc;
        border-radius: 10px;
        padding: 18px;
        border-left: 4px solid #D4AF37;
    }
    .combi-card strong {
        color: #4A1A6B;
        display: block;
        margin-bottom: 6px;
    }
    .combi-card span {
        font-size: 0.92em;
        color: #555;
        line-height: 1.5;
    }
    .conseil-box {
        background: linear-gradient(135deg, #4A1A6B 0%, #1A1A4A 100%);
        color: #fff;
        padding: 30px;
        border-radius: 12px;
        margin: 35px 0;
        text-align: center;
        border: 2px solid #D4AF37;
    }
    .conseil-box h3 {
        color: #D4AF37;
        font-family: 'Playfair Display', serif;
        font-size: 1.3em;
        margin-bottom: 15px;
    }
    .conseil-box p {
        font-size: 1.1em;
        line-height: 1.7;
        font-style: italic;
    }
    .arcane-nav {
        display: flex;
        justify-content: space-between;
        margin: 40px 0 20px;
        gap: 15px;
    }
    .arcane-nav a {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 20px;
        background: #f8f6fc;
        border-radius: 10px;
        color: #4A1A6B;
        text-decoration: none;
        font-weight: 600;
        border: 1px solid #e0d4f0;
        transition: all 0.3s ease;
    }
    .arcane-nav a:hover {
        background: #4A1A6B;
        color: #fff;
    }
    .arcane-nav a i { color: #D4AF37; }
    .pillar-card-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 20px;
        margin: 30px 0;
    }
    .pillar-card {
        background: #fff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        border: 1px solid #eee;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        text-decoration: none;
        color: inherit;
    }
    .pillar-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(74, 26, 107, 0.2);
    }
    .pillar-card img {
        width: 100%;
        aspect-ratio: 3/5;
        object-fit: cover;
    }
    .pillar-card-info {
        padding: 12px 15px;
        text-align: center;
    }
    .pillar-card-info h3 {
        font-family: 'Playfair Display', serif;
        color: #4A1A6B;
        font-size: 0.95em;
        margin-bottom: 4px;
    }
    .pillar-card-info span {
        font-size: 0.8em;
        color: #888;
    }
    .hub-links {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin: 25px 0;
    }
    @media (max-width: 768px) {
        .hub-links { grid-template-columns: 1fr; }
    }
    .hub-link {
        display: block;
        padding: 18px 20px;
        background: #f8f6fc;
        border-radius: 10px;
        color: #4A1A6B;
        text-decoration: none;
        font-weight: 600;
        border: 1px solid #e0d4f0;
        transition: all 0.3s ease;
    }
    .hub-link:hover {
        background: #4A1A6B;
        color: #fff;
        transform: translateY(-2px);
    }
    .hub-link i { color: #D4AF37; margin-right: 10px; }
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

    ${TAROT_INLINE_CSS}

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

// ─── HELPER: escape HTML ────────────────────────────────────────────────────

function esc(str) {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ─── HELPER: convert paragraphs ─────────────────────────────────────────────

function toParas(text) {
    return text.split('\n\n').filter(p => p.trim()).map(p => `<p>${p.trim()}</p>`).join('\n                    ');
}

// ═══════════════════════════════════════════════════════════════════════════════
// INDIVIDUAL ARCANE PAGE
// ═══════════════════════════════════════════════════════════════════════════════

function generateArcanePage(card) {
    const prevCard = arcanes.find(c => c.id === card.id - 1) || arcanes[arcanes.length - 1];
    const nextCard = arcanes.find(c => c.id === card.id + 1) || arcanes[0];

    const title = `${card.name} - Signification Tarot de Marseille | France Voyance Avenir`;
    const metaDesc = `Decouvrez la signification de ${card.name} (arcane ${card.number}) du Tarot de Marseille : interpretation endroit et envers, amour, travail, argent. Guide complet 2026.`;
    const canonical = `/tarot-marseille/${card.slug}/`;

    // Schema.org
    const schema = [
        {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": `${card.name} : Signification et Interpretation au Tarot de Marseille`,
            "description": card.summary,
            "image": `${SITE_URL}${card.image}`,
            "author": { "@type": "Organization", "name": "France Voyance Avenir" },
            "publisher": {
                "@type": "Organization",
                "name": "France Voyance Avenir",
                "logo": { "@type": "ImageObject", "url": `${SITE_URL}/images/logo.svg` }
            },
            "datePublished": "2026-02-01",
            "dateModified": new Date().toISOString().split('T')[0],
            "mainEntityOfPage": { "@type": "WebPage", "@id": `${SITE_URL}${canonical}` }
        },
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": card.faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
            }))
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Accueil", "item": SITE_URL },
                { "@type": "ListItem", "position": 2, "name": "Tarot de Marseille", "item": `${SITE_URL}/tarot-marseille/` },
                { "@type": "ListItem", "position": 3, "name": card.name, "item": `${SITE_URL}${canonical}` }
            ]
        }
    ];

    return `${getHead(title, metaDesc, canonical, schema)}

<body>
${getHeader()}

    <!-- BREADCRUMB -->
    <section class="breadcrumb-section" style="padding: 15px 0; background: rgba(26,26,74,0.03);">
        <div class="container">
            <nav aria-label="Fil d'Ariane">
                <ol style="display:flex; list-style:none; padding:0; margin:0; font-size:0.9em; gap:8px; flex-wrap:wrap;">
                    <li><a href="/" style="color:#4A1A6B;">Accueil</a></li>
                    <li style="color:#999;">›</li>
                    <li><a href="/tarot-marseille/" style="color:#4A1A6B;">Tarot de Marseille</a></li>
                    <li style="color:#999;">›</li>
                    <li style="color:#888;">${card.name}</li>
                </ol>
            </nav>
        </div>
    </section>

    <!-- MAIN CONTENT -->
    <main class="content-section" style="padding: 50px 0;">
        <div class="container">
            <div class="content-grid">
                <div class="main-content">

                    <!-- Hero -->
                    <div class="arcane-hero">
                        <div class="arcane-image">
                            <img src="${card.image}" alt="${card.name} - Tarot de Marseille" width="220" height="367" loading="eager">
                        </div>
                        <div class="arcane-intro">
                            <h1><i class="fas fa-star" style="color:#D4AF37; margin-right:10px;"></i>${card.name} - Arcane ${card.number}</h1>
                            <div class="arcane-meta">
                                ${card.element ? `<span class="arcane-badge"><i class="fas fa-wind"></i> ${card.element}</span>` : ''}
                                ${card.planet ? `<span class="arcane-badge"><i class="fas fa-globe"></i> ${card.planet}</span>` : ''}
                                ${card.zodiac ? `<span class="arcane-badge"><i class="fas fa-star-of-david"></i> ${card.zodiac}</span>` : ''}
                                <span class="arcane-badge"><i class="fas fa-hashtag"></i> Arcane ${card.number}</span>
                            </div>
                            <p style="line-height:1.8; color:#333;">${card.summary}</p>
                        </div>
                    </div>

                    <!-- Keywords -->
                    <div class="keywords-grid">
                        <div class="keywords-box keywords-upright">
                            <h3><i class="fas fa-arrow-up"></i> Mots-cles a l'endroit</h3>
                            ${card.keywords.upright.map(k => `<span class="keyword-tag">${k}</span>`).join('\n                            ')}
                        </div>
                        <div class="keywords-box keywords-reversed">
                            <h3><i class="fas fa-arrow-down"></i> Mots-cles a l'envers</h3>
                            ${card.keywords.reversed.map(k => `<span class="keyword-tag">${k}</span>`).join('\n                            ')}
                        </div>
                    </div>

                    <!-- Signification Generale -->
                    <div class="meaning-section">
                        <h2><i class="fas fa-book-open"></i> Signification generale de ${card.name}</h2>

                        <h3 style="color:#2e7d32; margin-bottom:15px;"><i class="fas fa-arrow-up" style="margin-right:8px;"></i> A l'endroit</h3>
                        <div class="meaning-content">
                            ${toParas(card.signification.upright)}
                        </div>

                        <h3 style="color:#c62828; margin-top:30px; margin-bottom:15px;"><i class="fas fa-arrow-down" style="margin-right:8px;"></i> A l'envers (renverse)</h3>
                        <div class="meaning-content">
                            ${toParas(card.signification.reversed)}
                        </div>
                    </div>

                    <!-- Amour -->
                    <div class="meaning-section">
                        <h2><i class="fas fa-heart"></i> ${card.name} en Amour</h2>

                        <h3 style="color:#2e7d32; margin-bottom:15px;"><i class="fas fa-arrow-up" style="margin-right:8px;"></i> A l'endroit</h3>
                        <div class="meaning-content">
                            ${toParas(card.amour.upright)}
                        </div>

                        <h3 style="color:#c62828; margin-top:30px; margin-bottom:15px;"><i class="fas fa-arrow-down" style="margin-right:8px;"></i> A l'envers</h3>
                        <div class="meaning-content">
                            ${toParas(card.amour.reversed)}
                        </div>

                        <div style="text-align:center; margin-top:25px;">
                            <a href="javascript:void(0)" onclick="window.open(getAffiliateUrl('amour'), '_blank'); return false;" class="btn btn-gold" data-affiliate="amour" style="display:inline-block; padding:14px 30px; font-size:1em;">
                                <i class="fas fa-heart" style="margin-right:8px;"></i> Consulter un voyant amour
                            </a>
                        </div>
                    </div>

                    <!-- Travail -->
                    <div class="meaning-section">
                        <h2><i class="fas fa-briefcase"></i> ${card.name} au Travail</h2>

                        <h3 style="color:#2e7d32; margin-bottom:15px;"><i class="fas fa-arrow-up" style="margin-right:8px;"></i> A l'endroit</h3>
                        <div class="meaning-content">
                            ${toParas(card.travail.upright)}
                        </div>

                        <h3 style="color:#c62828; margin-top:30px; margin-bottom:15px;"><i class="fas fa-arrow-down" style="margin-right:8px;"></i> A l'envers</h3>
                        <div class="meaning-content">
                            ${toParas(card.travail.reversed)}
                        </div>
                    </div>

                    <!-- Argent -->
                    <div class="meaning-section">
                        <h2><i class="fas fa-coins"></i> ${card.name} en Argent & Finances</h2>

                        <h3 style="color:#2e7d32; margin-bottom:15px;"><i class="fas fa-arrow-up" style="margin-right:8px;"></i> A l'endroit</h3>
                        <div class="meaning-content">
                            ${toParas(card.argent.upright)}
                        </div>

                        <h3 style="color:#c62828; margin-top:30px; margin-bottom:15px;"><i class="fas fa-arrow-down" style="margin-right:8px;"></i> A l'envers</h3>
                        <div class="meaning-content">
                            ${toParas(card.argent.reversed)}
                        </div>
                    </div>

                    <!-- Sante -->
                    <div class="meaning-section">
                        <h2><i class="fas fa-spa"></i> ${card.name} en Sante & Bien-etre</h2>

                        <h3 style="color:#2e7d32; margin-bottom:15px;"><i class="fas fa-arrow-up" style="margin-right:8px;"></i> A l'endroit</h3>
                        <div class="meaning-content">
                            ${toParas(card.sante.upright)}
                        </div>

                        <h3 style="color:#c62828; margin-top:30px; margin-bottom:15px;"><i class="fas fa-arrow-down" style="margin-right:8px;"></i> A l'envers</h3>
                        <div class="meaning-content">
                            ${toParas(card.sante.reversed)}
                        </div>

                        <p style="font-size:0.85em; color:#999; margin-top:20px; font-style:italic;">
                            <i class="fas fa-info-circle"></i> Les interpretations en sante sont donnees a titre indicatif et ne remplacent en aucun cas un avis medical professionnel.
                        </p>
                    </div>

                    <!-- Combinaisons -->
                    <div class="meaning-section">
                        <h2><i class="fas fa-layer-group"></i> Combinaisons de ${card.name} avec d'autres arcanes</h2>
                        <p style="margin-bottom:20px; color:#555;">Lorsque ${card.name} apparait dans un tirage a cote d'autres arcanes, sa signification se nuance et s'enrichit :</p>

                        <div class="combinaisons-grid">
                            ${card.combinaisons.map(c => `
                            <div class="combi-card">
                                <strong><i class="fas fa-plus" style="color:#D4AF37; margin-right:6px;"></i> ${card.name} + ${c.card}</strong>
                                <span>${c.meaning}</span>
                            </div>`).join('')}
                        </div>
                    </div>

                    <!-- Conseil -->
                    <div class="conseil-box">
                        <h3><i class="fas fa-lightbulb" style="margin-right:10px;"></i> Le conseil de ${card.name}</h3>
                        <p>${card.conseil}</p>
                    </div>

                    <!-- CTA -->
                    <div style="text-align:center; margin:40px 0;">
                        <p style="font-size:1.1em; color:#4A1A6B; margin-bottom:20px; font-weight:600;">${card.name} est apparu dans votre tirage ? Obtenez une interpretation personnalisee.</p>
                        <a href="javascript:void(0)" onclick="window.open(getAffiliateUrl('tarot'), '_blank'); return false;" class="btn btn-gold" data-affiliate="tarot" style="display:inline-block; padding:16px 35px; font-size:1.1em;">
                            <i class="fas fa-phone-alt" style="margin-right:10px;"></i> Consulter un tarologue maintenant
                        </a>
                        <p style="font-size:0.85em; color:#999; margin-top:10px;">* Jusqu'a 10 minutes offertes pour votre premiere consultation</p>
                    </div>

                    <!-- FAQ -->
                    <div class="meaning-section">
                        <h2><i class="fas fa-question-circle"></i> Questions frequentes sur ${card.name}</h2>
                        <div class="faq-schema">
                            ${card.faqs.map(faq => `
                            <details style="margin-bottom:15px; border:1px solid #eee; border-radius:10px; overflow:hidden;">
                                <summary style="padding:16px 20px; cursor:pointer; font-weight:600; color:#4A1A6B; background:#f8f6fc; font-size:1em;">
                                    ${faq.question}
                                </summary>
                                <div style="padding:16px 20px; line-height:1.7; color:#444;">
                                    ${faq.answer}
                                </div>
                            </details>`).join('')}
                        </div>
                    </div>

                    <!-- Navigation prev/next -->
                    <div class="arcane-nav">
                        <a href="/tarot-marseille/${prevCard.slug}/">
                            <i class="fas fa-chevron-left"></i> ${prevCard.name}
                        </a>
                        <a href="/tarot-marseille/">
                            <i class="fas fa-th"></i> Tous les arcanes
                        </a>
                        <a href="/tarot-marseille/${nextCard.slug}/">
                            ${nextCard.name} <i class="fas fa-chevron-right"></i>
                        </a>
                    </div>

                </div>

                <!-- SIDEBAR -->
                <aside class="sidebar">
                    <div class="cta-box" style="text-align:center;">
                        <h3 style="font-family:'Playfair Display',serif; color:#4A1A6B; margin-bottom:15px;">
                            <i class="fas fa-star" style="color:#D4AF37;"></i> Tirage gratuit
                        </h3>
                        <p style="color:#555; margin-bottom:20px;">Faites votre tirage de tarot gratuit en ligne et decouvrez ce que les cartes revelent pour vous.</p>
                        <a href="/voyance-gratuite/tarot-gratuit/" class="btn btn-gold" style="display:block; text-align:center; padding:14px; margin-bottom:15px;">
                            <i class="fas fa-magic" style="margin-right:8px;"></i> Tirage Gratuit
                        </a>
                        <a href="/voyance-gratuite/tarot-d-amour/" class="btn" style="display:block; text-align:center; padding:14px; background:#f8f6fc; color:#4A1A6B; border-radius:10px; text-decoration:none; font-weight:600; border:1px solid #e0d4f0;">
                            <i class="fas fa-heart" style="margin-right:8px; color:#D4AF37;"></i> Tirage Amour
                        </a>
                    </div>

                    <div class="cta-box" style="margin-top:25px; text-align:center;">
                        <h3 style="font-family:'Playfair Display',serif; color:#4A1A6B; margin-bottom:15px;">
                            <i class="fas fa-phone-alt" style="color:#D4AF37;"></i> Consultation privee
                        </h3>
                        <p style="color:#555; margin-bottom:15px;">Un tarologue professionnel vous eclaire sur votre tirage et votre avenir.</p>
                        <a href="javascript:void(0)" onclick="window.open(getAffiliateUrl('tarot'), '_blank'); return false;" class="btn btn-gold" data-affiliate="tarot" style="display:block; text-align:center; padding:14px;">
                            <i class="fas fa-phone-alt" style="margin-right:8px;"></i> Appeler un tarologue *
                        </a>
                        <p style="font-size:0.8em; color:#999; margin-top:8px;">* 10 min offertes</p>
                    </div>

                    <div class="cta-box" style="margin-top:25px;">
                        <h3 style="font-family:'Playfair Display',serif; color:#4A1A6B; margin-bottom:15px;">
                            <i class="fas fa-book" style="color:#D4AF37;"></i> Autres arcanes
                        </h3>
                        <ul style="list-style:none; padding:0;">
                            ${arcanes.filter(c => c.id !== card.id).slice(0, 8).map(c => `
                            <li style="margin-bottom:8px;">
                                <a href="/tarot-marseille/${c.slug}/" style="color:#4A1A6B; text-decoration:none; display:flex; align-items:center; gap:8px; padding:6px 0;">
                                    <i class="fas fa-chevron-right" style="color:#D4AF37; font-size:0.7em;"></i> ${c.name}
                                </a>
                            </li>`).join('')}
                        </ul>
                        <a href="/tarot-marseille/" style="display:block; text-align:center; margin-top:12px; color:#4A1A6B; font-weight:600; text-decoration:none;">
                            Voir les 22 arcanes →
                        </a>
                    </div>
                </aside>
            </div>
        </div>
    </main>

${getFooter()}
</body>
</html>`;
}


// ═══════════════════════════════════════════════════════════════════════════════
// PILLAR PAGE
// ═══════════════════════════════════════════════════════════════════════════════

function generatePillarPage() {
    const title = 'Tarot de Marseille : Signification des 22 Arcanes Majeurs | France Voyance Avenir';
    const metaDesc = 'Guide complet du Tarot de Marseille : decouvrez la signification des 22 arcanes majeurs, interpretation endroit et envers, amour, travail, argent. Tirage gratuit.';
    const canonical = '/tarot-marseille/';

    const schema = [
        {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Tarot de Marseille : Guide Complet des 22 Arcanes Majeurs",
            "description": metaDesc,
            "author": { "@type": "Organization", "name": "France Voyance Avenir" },
            "publisher": {
                "@type": "Organization",
                "name": "France Voyance Avenir",
                "logo": { "@type": "ImageObject", "url": `${SITE_URL}/images/logo.svg` }
            },
            "datePublished": "2026-02-01",
            "dateModified": new Date().toISOString().split('T')[0],
            "mainEntityOfPage": { "@type": "WebPage", "@id": `${SITE_URL}${canonical}` }
        },
        {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Les 22 Arcanes Majeurs du Tarot de Marseille",
            "numberOfItems": 22,
            "itemListElement": arcanes.map((card, i) => ({
                "@type": "ListItem",
                "position": i + 1,
                "name": card.name,
                "url": `${SITE_URL}/tarot-marseille/${card.slug}/`
            }))
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Accueil", "item": SITE_URL },
                { "@type": "ListItem", "position": 2, "name": "Tarot de Marseille", "item": `${SITE_URL}${canonical}` }
            ]
        },
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "Qu'est-ce que le Tarot de Marseille ?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Le Tarot de Marseille est un jeu de 78 cartes utilise depuis le XVe siecle pour la divination et le developpement personnel. Les 22 arcanes majeurs representent les grandes etapes du parcours de vie et les forces universelles qui influencent notre destinee." }
                },
                {
                    "@type": "Question",
                    "name": "Combien y a-t-il d'arcanes majeurs dans le Tarot de Marseille ?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Le Tarot de Marseille compte 22 arcanes majeurs, numerotes de 0 (Le Mat) a 21 (Le Monde). Chaque arcane possede une symbolique unique et des significations differentes selon qu'il est tire a l'endroit ou a l'envers." }
                },
                {
                    "@type": "Question",
                    "name": "Comment interpreter les arcanes majeurs du Tarot ?",
                    "acceptedAnswer": { "@type": "Answer", "text": "L'interpretation depend de la position de la carte (endroit ou envers), de sa place dans le tirage et des cartes qui l'entourent. Chaque arcane a des significations en amour, travail, argent et sante. Un tarologue professionnel peut vous aider a comprendre les nuances de votre tirage." }
                },
                {
                    "@type": "Question",
                    "name": "Quelle est la carte la plus positive du Tarot de Marseille ?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Le Soleil (arcane XIX) est generalement considere comme la carte la plus positive du Tarot. Elle annonce le bonheur, le succes et la clarte. Le Monde (arcane XXI) est aussi tres favorable, symbolisant l'accomplissement total d'un cycle." }
                },
                {
                    "@type": "Question",
                    "name": "Peut-on tirer le Tarot de Marseille soi-meme ?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Oui, il est tout a fait possible de tirer le Tarot soi-meme. Cependant, l'interpretation requiert de l'experience et de l'intuition. Pour des questions importantes, il est recommande de consulter un tarologue professionnel qui saura lire les subtilites de votre tirage." }
                }
            ]
        }
    ];

    return `${getHead(title, metaDesc, canonical, schema)}

<body>
${getHeader()}

    <!-- BREADCRUMB -->
    <section class="breadcrumb-section" style="padding: 15px 0; background: rgba(26,26,74,0.03);">
        <div class="container">
            <nav aria-label="Fil d'Ariane">
                <ol style="display:flex; list-style:none; padding:0; margin:0; font-size:0.9em; gap:8px;">
                    <li><a href="/" style="color:#4A1A6B;">Accueil</a></li>
                    <li style="color:#999;">›</li>
                    <li style="color:#888;">Tarot de Marseille</li>
                </ol>
            </nav>
        </div>
    </section>

    <!-- HERO -->
    <section style="background: linear-gradient(135deg, #1A1A4A 0%, #4A1A6B 100%); color:#fff; padding:60px 0; text-align:center;">
        <div class="container">
            <h1 style="font-family:'Playfair Display',serif; font-size:2.5em; margin-bottom:20px;">
                <i class="fas fa-star" style="color:#D4AF37; margin-right:15px;"></i>
                Tarot de Marseille : Les 22 Arcanes Majeurs
            </h1>
            <p style="font-size:1.2em; max-width:700px; margin:0 auto 30px; opacity:0.9;">
                Guide complet de la signification de chaque arcane majeur du Tarot de Marseille. Interpretation endroit, envers, amour, travail et finances.
            </p>
            <div style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap;">
                <a href="/voyance-gratuite/tarot-gratuit/" class="btn btn-gold" style="padding:14px 30px; font-size:1em;">
                    <i class="fas fa-magic" style="margin-right:8px;"></i> Tirage Gratuit
                </a>
                <a href="javascript:void(0)" onclick="window.open(getAffiliateUrl('tarot'), '_blank'); return false;" class="btn" data-affiliate="tarot" style="padding:14px 30px; font-size:1em; background:rgba(255,255,255,0.15); color:#fff; border-radius:10px; text-decoration:none; border:2px solid #D4AF37;">
                    <i class="fas fa-phone-alt" style="margin-right:8px;"></i> Consulter un tarologue *
                </a>
            </div>
        </div>
    </section>

    <!-- MAIN CONTENT -->
    <main class="content-section" style="padding: 50px 0;">
        <div class="container">

            <!-- Introduction -->
            <div style="max-width:800px; margin:0 auto 50px;">
                <h2 style="font-family:'Playfair Display',serif; color:#4A1A6B; text-align:center; margin-bottom:25px;">Comprendre les Arcanes Majeurs</h2>
                <p style="line-height:1.8; color:#444; margin-bottom:15px;">Le Tarot de Marseille est l'un des outils divinatoires les plus anciens et les plus respectes au monde. Ses 22 arcanes majeurs forment le coeur du jeu et representent les grandes forces universelles qui faconnent notre destinee. Du Mat, symbole de liberte et de nouveaux departs, au Monde, carte de l'accomplissement total, chaque arcane raconte une etape du voyage de l'ame.</p>
                <p style="line-height:1.8; color:#444; margin-bottom:15px;">Que vous soyez debutant ou praticien confirme, la connaissance des arcanes majeurs est essentielle pour interpreter correctement un tirage. Chaque carte possede une double signification selon qu'elle apparait a l'endroit ou a l'envers, et son sens se nuance en fonction du domaine de vie concerne : amour, travail, argent ou sante.</p>
                <p style="line-height:1.8; color:#444;">Explorez ci-dessous chaque arcane majeur pour decouvrir sa signification complete, ses conseils et ses combinaisons avec les autres cartes.</p>
            </div>

            <!-- Cards Grid -->
            <h2 style="font-family:'Playfair Display',serif; color:#4A1A6B; text-align:center; margin-bottom:30px;">Les 22 Arcanes Majeurs</h2>

            <div class="pillar-card-grid">
                ${arcanes.map(card => `
                <a href="/tarot-marseille/${card.slug}/" class="pillar-card">
                    <img src="${card.image}" alt="${card.name} - Tarot de Marseille" width="180" height="300" loading="lazy">
                    <div class="pillar-card-info">
                        <h3>${card.name}</h3>
                        <span>Arcane ${card.number}</span>
                    </div>
                </a>`).join('')}
            </div>

            <!-- CTA -->
            <div style="text-align:center; margin:50px 0 40px;">
                <div class="conseil-box">
                    <h3><i class="fas fa-phone-alt" style="margin-right:10px;"></i> Besoin d'une interpretation personnalisee ?</h3>
                    <p style="max-width:600px; margin:0 auto 20px;">Nos tarologues professionnels vous eclairent sur votre tirage et vous guident dans vos decisions de vie.</p>
                    <a href="javascript:void(0)" onclick="window.open(getAffiliateUrl('tarot'), '_blank'); return false;" class="btn btn-gold" data-affiliate="tarot" style="display:inline-block; padding:16px 35px; font-size:1.1em;">
                        <i class="fas fa-phone-alt" style="margin-right:10px;"></i> Consulter maintenant
                    </a>
                    <p style="font-size:0.85em; opacity:0.7; margin-top:10px;">* Jusqu'a 10 minutes offertes pour votre premiere consultation</p>
                </div>
            </div>

            <!-- Related links -->
            <h2 style="font-family:'Playfair Display',serif; color:#4A1A6B; text-align:center; margin-bottom:25px;">Explorez nos outils gratuits</h2>
            <div class="hub-links">
                <a href="/voyance-gratuite/tarot-gratuit/" class="hub-link"><i class="fas fa-magic"></i> Tirage de Tarot Gratuit</a>
                <a href="/voyance-gratuite/tarot-d-amour/" class="hub-link"><i class="fas fa-heart"></i> Tirage Tarot Amour</a>
                <a href="/voyance-gratuite/tarot-oui-non/" class="hub-link"><i class="fas fa-check-circle"></i> Tarot Oui/Non</a>
                <a href="/voyance-gratuite/numerologie-gratuite/" class="hub-link"><i class="fas fa-calculator"></i> Numerologie Gratuite</a>
                <a href="/voyance-gratuite/pendule-oui-non/" class="hub-link"><i class="fas fa-circle-notch"></i> Pendule Oui/Non</a>
                <a href="/arts-divinatoires/cartomancie/" class="hub-link"><i class="fas fa-clone"></i> Cartomancie</a>
            </div>

            <!-- FAQ -->
            <div class="meaning-section" style="margin-top:40px;">
                <h2><i class="fas fa-question-circle"></i> Questions frequentes sur le Tarot de Marseille</h2>
                <div class="faq-schema">
                    <details style="margin-bottom:15px; border:1px solid #eee; border-radius:10px; overflow:hidden;">
                        <summary style="padding:16px 20px; cursor:pointer; font-weight:600; color:#4A1A6B; background:#f8f6fc; font-size:1em;">
                            Qu'est-ce que le Tarot de Marseille ?
                        </summary>
                        <div style="padding:16px 20px; line-height:1.7; color:#444;">
                            Le Tarot de Marseille est un jeu de 78 cartes utilise depuis le XVe siecle pour la divination et le developpement personnel. Les 22 arcanes majeurs representent les grandes etapes du parcours de vie et les forces universelles qui influencent notre destinee. C'est l'outil divinatoire le plus utilise en France et dans le monde.
                        </div>
                    </details>
                    <details style="margin-bottom:15px; border:1px solid #eee; border-radius:10px; overflow:hidden;">
                        <summary style="padding:16px 20px; cursor:pointer; font-weight:600; color:#4A1A6B; background:#f8f6fc; font-size:1em;">
                            Combien y a-t-il d'arcanes majeurs dans le Tarot de Marseille ?
                        </summary>
                        <div style="padding:16px 20px; line-height:1.7; color:#444;">
                            Le Tarot de Marseille compte 22 arcanes majeurs, numerotes de 0 (Le Mat) a 21 (Le Monde). Chaque arcane possede une symbolique unique et des significations differentes selon qu'il est tire a l'endroit ou a l'envers.
                        </div>
                    </details>
                    <details style="margin-bottom:15px; border:1px solid #eee; border-radius:10px; overflow:hidden;">
                        <summary style="padding:16px 20px; cursor:pointer; font-weight:600; color:#4A1A6B; background:#f8f6fc; font-size:1em;">
                            Comment interpreter les arcanes majeurs du Tarot ?
                        </summary>
                        <div style="padding:16px 20px; line-height:1.7; color:#444;">
                            L'interpretation depend de la position de la carte (endroit ou envers), de sa place dans le tirage et des cartes qui l'entourent. Chaque arcane a des significations en amour, travail, argent et sante. Un tarologue professionnel peut vous aider a comprendre les nuances de votre tirage.
                        </div>
                    </details>
                    <details style="margin-bottom:15px; border:1px solid #eee; border-radius:10px; overflow:hidden;">
                        <summary style="padding:16px 20px; cursor:pointer; font-weight:600; color:#4A1A6B; background:#f8f6fc; font-size:1em;">
                            Quelle est la carte la plus positive du Tarot de Marseille ?
                        </summary>
                        <div style="padding:16px 20px; line-height:1.7; color:#444;">
                            Le Soleil (arcane XIX) est generalement considere comme la carte la plus positive du Tarot. Elle annonce le bonheur, le succes et la clarte. Le Monde (arcane XXI) est aussi tres favorable, symbolisant l'accomplissement total d'un cycle.
                        </div>
                    </details>
                    <details style="margin-bottom:15px; border:1px solid #eee; border-radius:10px; overflow:hidden;">
                        <summary style="padding:16px 20px; cursor:pointer; font-weight:600; color:#4A1A6B; background:#f8f6fc; font-size:1em;">
                            Peut-on tirer le Tarot de Marseille soi-meme ?
                        </summary>
                        <div style="padding:16px 20px; line-height:1.7; color:#444;">
                            Oui, il est tout a fait possible de tirer le Tarot soi-meme. Cependant, l'interpretation requiert de l'experience et de l'intuition. Pour des questions importantes, il est recommande de consulter un tarologue professionnel qui saura lire les subtilites de votre tirage.
                        </div>
                    </details>
                </div>
            </div>

        </div>
    </main>

${getFooter()}
</body>
</html>`;
}


// ═══════════════════════════════════════════════════════════════════════════════
// GENERATE ALL PAGES
// ═══════════════════════════════════════════════════════════════════════════════

let generated = 0;

// Individual arcane pages
arcanes.forEach(card => {
    const dirPath = path.join(outputDir, card.slug);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

    const html = generateArcanePage(card);
    fs.writeFileSync(path.join(dirPath, 'index.html'), html, 'utf8');
    generated++;
});

// Pillar page
const pillarHtml = generatePillarPage();
fs.writeFileSync(path.join(outputDir, 'index.html'), pillarHtml, 'utf8');
generated++;

console.log(`✅ Tarot pages generated: ${generated} pages`);
console.log(`   - 22 individual arcane pages`);
console.log(`   - 1 pillar page`);
console.log(`\nOutput: ${outputDir}`);
