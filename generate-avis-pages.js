/**
 * Avis & Comparatifs Pages Generator
 * Generates:
 *   - 5 individual platform review pages at /avis/[slug]/index.html
 *   - 5 comparison pages at /avis/[platformA-vs-platformB]/index.html
 *   - 1 pillar page at /avis/index.html (overwrite)
 *
 * Run: node generate-avis-pages.js
 */

const fs = require('fs');
const path = require('path');

// ─── LOAD DATA ───────────────────────────────────────────────────────────────

const dataPath = path.join(__dirname, 'data', 'platforms.json');
const { platforms, comparisons } = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const outputDir = path.join(__dirname, 'avis');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const SITE_URL = 'https://france-voyance-avenir.fr';

// ─── HELPER: find platform by slug ──────────────────────────────────────────

function getPlatform(slug) {
    return platforms.find(p => p.slug === slug);
}

// ─── HELPER: generate star HTML ─────────────────────────────────────────────

function starsHTML(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    let html = '';
    for (let i = 0; i < full; i++) html += '<i class="fas fa-star"></i>';
    if (half) html += '<i class="fas fa-star-half-alt"></i>';
    for (let i = 0; i < empty; i++) html += '<i class="far fa-star"></i>';
    return html;
}

// ─── INLINE CSS (shared across all avis pages) ─────────────────────────────

const AVIS_INLINE_CSS = `
<style>
    .review-tldr {
        background: linear-gradient(135deg, #1A1A4A 0%, #2D1B69 100%);
        border-left: 5px solid #D4AF37;
        padding: 25px 30px;
        border-radius: 0 12px 12px 0;
        margin: 30px 0;
        color: #fff;
    }
    .review-tldr h3 {
        color: #D4AF37;
        margin-bottom: 12px;
        font-family: 'Playfair Display', serif;
    }
    .review-tldr .tldr-rating {
        font-size: 1.3em;
        margin-bottom: 8px;
    }
    .review-tldr .tldr-rating .star-rating {
        color: #D4AF37;
        margin-left: 8px;
    }
    .review-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        border-radius: 12px;
        overflow: hidden;
        margin: 25px 0;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    .review-table th {
        background: #4A1A6B;
        color: #fff;
        padding: 14px 18px;
        text-align: left;
        font-family: 'Playfair Display', serif;
        font-weight: 600;
        width: 35%;
    }
    .review-table td {
        padding: 14px 18px;
        background: #fff;
        color:#e0e0e0;
        border-bottom: 1px solid #eee;
    }
    .review-table tr:last-child td {
        border-bottom: none;
    }
    .pros-cons {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 25px;
        margin: 30px 0;
    }
    @media (max-width: 768px) {
        .pros-cons { grid-template-columns: 1fr; }
    }
    .pros-box, .cons-box {
        padding: 25px;
        border-radius: 12px;
    }
    .pros-box {
        background: linear-gradient(135deg, #e8f5e9, #f1f8e9);
        border: 1px solid #a5d6a7;
    }
    .cons-box {
        background: linear-gradient(135deg, #fce4ec, #fff3e0);
        border: 1px solid #ef9a9a;
    }
    .pros-box h3 { color: #2e7d32; }
    .cons-box h3 { color: #c62828; }
    .pros-box ul, .cons-box ul {
        list-style: none;
        padding: 0;
    }
    .pros-box li::before {
        content: "\\2713 ";
        color: #2e7d32;
        font-weight: bold;
        margin-right: 8px;
    }
    .cons-box li::before {
        content: "\\2717 ";
        color: #c62828;
        font-weight: bold;
        margin-right: 8px;
    }
    .pros-box li, .cons-box li {
        padding: 6px 0;
        line-height: 1.5;
        color:#e0e0e0;
    }
    .star-rating {
        color: #D4AF37;
        letter-spacing: 2px;
    }
    /* ── Contrast fix: override .content-block p light color on white cards ── */
    .platform-card p,
    .platform-card span,
    .platform-card div,
    .criteria-card p,
    .criteria-card span,
    .profile-card p,
    .profile-card span {
        color:#dcdcdc;
    }
    .platform-card p strong,
    .criteria-card p strong,
    .profile-card p strong {
        color: #222;
    }
    .platform-card h3 { color:#D4AF37; }
    .platform-card .card-rating { color:#D4AF37; font-weight: 600; }
    .platform-card .card-rating .star-rating { color: #D4AF37; }
    .ranking-table td,
    .comparison-table td {
        color:#dcdcdc;
    }
    .ranking-table td a,
    .comparison-table td a {
        color:#D4AF37;
        font-weight: 600;
    }
    .ranking-table tr:first-child td {
        color: #2d0a4e;
        font-weight: 700;
    }
    .comparison-table td:first-child {
        color:#D4AF37;
        font-weight: 600;
    }
    .comparison-table .winner {
        color: #1b5e20;
        font-weight: 700;
    }
    .review-table td {
        color:#dcdcdc;
    }
    .hub-link {
        color:#D4AF37;
    }
    .verdict-box {
        background: linear-gradient(135deg, #4A1A6B 0%, #1A1A4A 100%);
        color: #fff;
        padding: 30px;
        border-radius: 12px;
        margin: 30px 0;
        text-align: center;
        border: 2px solid #D4AF37;
    }
    .verdict-box h3 {
        color: #D4AF37;
        font-family: 'Playfair Display', serif;
        margin-bottom: 15px;
    }
    .verdict-box .verdict-score {
        font-size: 2.5em;
        font-weight: 700;
        color: #D4AF37;
        font-family: 'Playfair Display', serif;
    }
    .platform-card {
        background: #fff;
        color:#e0e0e0;
        border-radius: 12px;
        padding: 25px;
        margin: 20px 0;
        box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        border: 1px solid #eee;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .platform-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.12);
    }
    .platform-card h3 {
        color:#D4AF37;
        font-family: 'Playfair Display', serif;
    }
    .platform-card .card-rating {
        color: #D4AF37;
        font-size: 1.2em;
        margin: 8px 0;
    }
    .comparison-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        border-radius: 12px;
        overflow: hidden;
        margin: 25px 0;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    .comparison-table thead th {
        background: #4A1A6B;
        color: #fff;
        padding: 16px;
        font-family: 'Playfair Display', serif;
        font-weight: 600;
        text-align: center;
    }
    .comparison-table thead th:first-child {
        text-align: left;
    }
    .comparison-table td {
        padding: 14px 16px;
        text-align: center;
        border-bottom: 1px solid #eee;
        background: #fff;
        color:#e0e0e0;
    }
    .comparison-table td:first-child {
        text-align: left;
        font-weight: 600;
        background: #f8f6fc;
        color:#D4AF37;
    }
    .comparison-table tr:last-child td { border-bottom: none; }
    .comparison-table .winner { background: #e8f5e9; font-weight: 600; color: #2e7d32; }
    .verdict-by-profile {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin: 25px 0;
    }
    @media (max-width: 768px) {
        .verdict-by-profile { grid-template-columns: 1fr; }
    }
    .profile-card {
        background: #f8f6fc;
        color:#e0e0e0;
        border-radius: 12px;
        padding: 20px;
        border-left: 4px solid #D4AF37;
    }
    .profile-card h4 {
        color:#D4AF37;
        margin-bottom: 8px;
    }
    .ranking-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        border-radius: 12px;
        overflow: hidden;
        margin: 25px 0;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    .ranking-table thead th {
        background: #4A1A6B;
        color: #fff;
        padding: 14px;
        font-family: 'Playfair Display', serif;
    }
    .ranking-table td {
        padding: 12px 14px;
        border-bottom: 1px solid #eee;
        background: #fff;
        color:#e0e0e0;
        text-align: center;
    }
    .ranking-table td:first-child,
    .ranking-table td:nth-child(2) {
        text-align: left;
    }
    .ranking-table tr:first-child td {
        background: linear-gradient(135deg, #fdf6e3, #fff8e1);
        font-weight: 600;
        color:#D4AF37;
    }
    .criteria-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin: 25px 0;
    }
    @media (max-width: 768px) {
        .criteria-grid { grid-template-columns: 1fr; }
    }
    .criteria-card {
        background: #fff;
        color:#e0e0e0;
        border-radius: 12px;
        padding: 20px;
        border: 1px solid #eee;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    .criteria-card h4 {
        color:#D4AF37;
        margin-bottom: 10px;
    }
    .criteria-card i {
        color: #D4AF37;
        margin-right: 8px;
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
        color:#D4AF37;
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
    .table-responsive {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        margin: 25px 0;
        border-radius: 12px;
    }
    .table-responsive .comparison-table,
    .table-responsive .ranking-table {
        margin: 0;
        min-width: 500px;
    }
    @media (max-width: 768px) {
        .review-table th { width: auto; padding: 10px 12px; font-size: 0.9em; }
        .review-table td { padding: 10px 12px; font-size: 0.9em; }
        .comparison-table thead th { padding: 10px 8px; font-size: 0.85em; }
        .comparison-table td { padding: 10px 8px; font-size: 0.85em; }
        .ranking-table thead th { padding: 10px 8px; font-size: 0.85em; }
        .ranking-table td { padding: 10px 8px; font-size: 0.85em; }
        .verdict-box { padding: 20px; }
        .verdict-box .verdict-score { font-size: 2em; }
        .review-tldr { padding: 20px; }
    }
    @media (max-width: 576px) {
        .review-table th {
            display: block;
            width: 100%;
            border-bottom: none;
            padding-bottom: 4px;
            font-size: 0.85em;
        }
        .review-table td {
            display: block;
            width: 100%;
            padding-top: 4px;
            padding-bottom: 12px;
        }
        .review-table tr {
            display: block;
            border-bottom: 1px solid #eee;
        }
        .review-table tr:last-child { border-bottom: none; }
        .comparison-table thead th { padding: 8px 6px; font-size: 0.8em; }
        .comparison-table td { padding: 8px 6px; font-size: 0.8em; word-break: break-word; }
        .ranking-table thead th { padding: 8px 6px; font-size: 0.8em; }
        .ranking-table td { padding: 8px 6px; font-size: 0.8em; word-break: break-word; }
        .review-tldr { padding: 15px; }
        .review-tldr .tldr-rating { font-size: 1.1em; }
    }
    @media (max-width: 480px) {
        .platform-card h3 { font-size: 1.1rem; }
        .platform-card .card-rating { font-size: 1rem; }
        .platform-card p { font-size: 0.9rem; }
        .criteria-card h4 { font-size: 0.95rem; }
        .criteria-card p { font-size: 0.88rem; }
        .profile-card h4 { font-size: 0.95rem; }
        .profile-card p { font-size: 0.88rem; }
        .verdict-box .verdict-score { font-size: 1.8em; }
        .review-tldr { padding: 12px; }
        .hub-link { padding: 14px 16px; font-size: 0.9rem; }
    }
</style>`;


// ─── SHARED HTML PARTS ──────────────────────────────────────────────────────

function getHead(title, metaDesc, canonical, extraSchemaLD) {
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

    ${AVIS_INLINE_CSS}

    <noscript><style>.fade-in-up,.fade-in-left,.fade-in-right,.scale-in,.reveal{opacity:1 !important;transform:none !important;transition:none !important}.faq-answer{max-height:none !important;overflow:visible !important;padding:0 24px 20px !important}.faq-icon,.faq-toggle{display:none}.sticky-cta{opacity:1 !important;transform:none !important;pointer-events:auto !important}.testimonial-nav{display:none}.reading-progress-container{display:none}</style></noscript>

    <!-- Schema JSON-LD -->
    <script type="application/ld+json">
    ${JSON.stringify(extraSchemaLD, null, 2)}
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
                            <li><a href="/voyance-gratuite/compatibilite-astrale/">Compatibilité Astrale</a></li>
                            <li><a href="/voyance-gratuite/tirage-runes/">Tirage de Runes</a></li>
                            <li><a href="/glossaire/">Glossaire Ésotérique</a></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link">Arts Divinatoires <i class="fa-solid fa-chevron-down" style="font-size: 0.7em;"></i></a>
                        <ul class="dropdown-menu">
                            <li><a href="/tarot-marseille/">Tarot de Marseille</a></li>
                            <li><a href="/arts-divinatoires/pendule/">Voyance Pendule</a></li>
                            <li><a href="/arts-divinatoires/oracle-belline/">Oracle Belline</a></li>
                            <li><a href="/arts-divinatoires/oracle-ge/">Oracle Gé</a></li>
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
                    <a href="javascript:void(0)" onclick="window.open(getAffiliateUrl(), '_blank'); return false;" class="btn btn-gold" data-affiliate="voyance-telephone">Consultation Immediate</a>
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
                        <li><a href="/consulter/voyance-telephone/">Voyance Téléphone</a></li>
                        <li><a href="/voyance-gratuite/">Voyance Gratuite</a></li>
                        <li><a href="/voyance-gratuite/tarot-d-amour/">Tarot Amour</a></li>
                        <li><a href="/tarot-marseille/">Tarot de Marseille</a></li>
                        <li><a href="/numerologie/">Numérologie</a></li>
                        <li><a href="/avis/">Avis Plateformes</a></li>
                        <li><a href="/glossaire/">Glossaire</a></li>
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
        <a href="javascript:void(0)" onclick="window.open(getAffiliateUrl(), '_blank'); return false;" data-affiliate="telephone" class="btn btn-gold">
            <span class="sticky-cta-icon"><i class="fas fa-phone-alt"></i></span>
            <span>Consulter</span>
        </a>
    </div>

    <script src="/js/animations.js" defer></script>
    <script src="/js/main.js?v=2026"></script>`;
}


// ═══════════════════════════════════════════════════════════════════════════════
// INDIVIDUAL REVIEW PAGE CONTENT
// ═══════════════════════════════════════════════════════════════════════════════

const REVIEW_CONTENT = {
    wengo: {
        introP1: `Wengo est l'une des plateformes de voyance en ligne les plus etablies en France. Fondee en 2007, elle s'est imposee comme un acteur incontournable du secteur grace a un modele transparent base sur les avis verifies et un large panel de praticiens. Avec plus de 500 voyants disponibles et une note moyenne de 4.5/5 basee sur 12 500 avis, la plateforme beneficie d'une reputation solide.`,
        introP2: `Nous avons teste Wengo de maniere approfondie pendant plusieurs semaines pour vous livrer cet avis objectif. Nous avons consulte differents voyants, evalue la qualite des predictions, analyse les tarifs et compare l'experience utilisateur avec les concurrents directs. Voici notre verdict complet.`,
        pricingDetail: `Les tarifs de Wengo varient de 2,00 a 5,00 euros par minute selon le voyant choisi. Les praticiens les plus experimentes et les mieux notes pratiquent generalement des tarifs plus eleves. L'offre de bienvenue propose jusqu'a 10 minutes offertes a l'inscription, ce qui permet de tester le service sans risque financier. Le paiement s'effectue par carte bancaire ou PayPal. Il n'y a pas d'abonnement ni d'engagement : vous payez uniquement les minutes consommees.`,
        clientReview: `Sur les 12 500 avis recueillis, la majorite des utilisateurs saluent la diversite du panel de voyants et la fiabilite du systeme de notation. Les points positifs les plus frequemment mentionnes sont la qualite de l'accueil, la precision des predictions a moyen terme et la reactivite du service client. Les critiques portent principalement sur les tarifs des voyants les plus demandes et sur la qualite variable d'un praticien a l'autre. Le score Trustpilot de 4.2/5 confirme une satisfaction globale elevee.`,
        faq: [
            { q: "Wengo est-il fiable pour la voyance en ligne ?", a: "Oui, Wengo est fiable grace a son systeme d'avis verifies et ses 17 ans d'experience." },
            { q: "Combien coutent les consultations sur Wengo ?", a: "Les tarifs vont de 2 a 5 euros par minute selon le voyant choisi." },
            { q: "Wengo offre-t-il des minutes gratuites ?", a: "Oui, jusqu'a 10 minutes offertes pour les nouveaux inscrits." },
            { q: "Peut-on consulter sur Wengo 24h/24 ?", a: "Oui, des voyants sont disponibles a toute heure, 7 jours sur 7." },
            { q: "Comment sont selectionnes les voyants sur Wengo ?", a: "Les voyants passent un processus de verification et sont notes par les clients." }
        ]
    },
    spiriteo: {
        introP1: `Spiriteo est une plateforme de voyance en ligne lancee en 2015 qui se distingue par un processus de recrutement exigeant pour ses voyants. Plutot que de miser sur la quantite, Spiriteo a fait le choix d'un panel plus restreint mais rigoureusement selectionne. Avec 150 praticiens et une note de 4.0/5 sur 3 200 avis, la plateforme cible les consultants qui privilegient la qualite a la diversite.`,
        introP2: `Notre test de Spiriteo s'est etale sur plusieurs semaines, avec des consultations aupres de differents voyants et une analyse detaillee de l'interface, des tarifs et du service client. L'objectif : determiner si le positionnement premium de Spiriteo se justifie par rapport aux concurrents.`,
        pricingDetail: `Les tarifs de Spiriteo s'echelonnent de 2,90 a 4,90 euros par minute. La fourchette est legerement plus elevee que chez certains concurrents, ce qui se justifie par la selection plus stricte des voyants. L'offre de bienvenue propose 5 premieres minutes offertes. Le paiement s'effectue uniquement par carte bancaire. L'absence de PayPal ou d'audiotel peut etre un frein pour certains utilisateurs.`,
        clientReview: `Les 3 200 avis de Spiriteo revelent une satisfaction globale correcte. Les clients apprecient la qualite moyenne des consultations, jugee superieure a certaines plateformes grand public. Les voyants sont decrits comme professionnels et bienveillants. Les points negatifs evoquent le panel plus restreint (il faut parfois attendre pour consulter un voyant specifique) et les horaires limites a 7h-3h. Le score Trustpilot de 3.8/5 est correct sans etre exceptionnel.`,
        faq: [
            { q: "Spiriteo est-il un site de voyance serieux ?", a: "Oui, Spiriteo selectionne ses voyants avec un processus de recrutement exigeant." },
            { q: "Quel est le prix d'une consultation sur Spiriteo ?", a: "Comptez entre 2,90 et 4,90 euros par minute selon le praticien." },
            { q: "Spiriteo offre-t-il des minutes de decouverte ?", a: "Oui, 5 premieres minutes sont offertes aux nouveaux utilisateurs." },
            { q: "Spiriteo est-il disponible la nuit ?", a: "Oui, jusqu'a 3h du matin, mais pas 24h/24 comme certains concurrents." },
            { q: "Quels moyens de contact propose Spiriteo ?", a: "Le telephone et le chat sont disponibles, mais pas l'email ni l'audiotel." }
        ]
    },
    jimini: {
        introP1: `Jimini est une plateforme de voyance en ligne relativement recente, lancee en 2018. Elle se positionne clairement sur le segment des petits budgets avec des tarifs parmi les plus bas du marche, debutant a 1,90 euro par minute. Avec 80 voyants et une note de 3.8/5 sur 2 800 avis, Jimini s'adresse a ceux qui veulent decouvrir la voyance sans se ruiner.`,
        introP2: `Nous avons teste Jimini pour evaluer si les tarifs attractifs se font au detriment de la qualite. Consultations par telephone, chat et SMS ont ete passees en revue, de meme que la fiabilite des voyants et l'experience utilisateur globale.`,
        pricingDetail: `Le principal argument de Jimini reside dans ses tarifs competitifs : de 1,90 a 3,90 euros par minute. C'est l'un des services les moins chers du marche. L'offre de bienvenue inclut 3 premieres minutes offertes, ce qui est moins genereux que certains concurrents. L'atout majeur est la possibilite de consulter par audiotel, sans carte bancaire. Les consultations par SMS sont egalement disponibles, un format que peu de plateformes proposent.`,
        clientReview: `Les 2 800 avis de Jimini refletent un avis mitige. Les utilisateurs satisfaits saluent les tarifs accessibles et la disponibilite du format SMS. Les critiques portent sur le panel limite de voyants (80+), les horaires restreints (8h-minuit) et une interface jugee un peu datee. Le score Trustpilot de 3.5/5 est en dessous de la moyenne des leaders du marche, ce qui invite a la prudence dans le choix du voyant.`,
        faq: [
            { q: "Jimini propose-t-il la voyance par audiotel ?", a: "Oui, l'audiotel est disponible pour consulter sans carte bancaire." },
            { q: "Quels sont les tarifs de Jimini ?", a: "Les tarifs vont de 1,90 a 3,90 euros par minute, parmi les plus bas du marche." },
            { q: "Jimini offre-t-il des minutes gratuites ?", a: "Oui, 3 premieres minutes offertes pour les nouveaux utilisateurs." },
            { q: "Peut-on consulter par SMS sur Jimini ?", a: "Oui, le SMS est l'un des canaux de consultation proposes par Jimini." },
            { q: "Jimini est-il disponible 24h/24 ?", a: "Non, le service est accessible de 8h a minuit uniquement." }
        ]
    },
    kang: {
        introP1: `Kang est une plateforme de voyance en ligne creee en 2012 qui se specialise principalement dans la mediumnite et la guidance spirituelle. Avec un panel de 60 voyants et une note de 3.5/5 basee sur 1 500 avis, Kang cible un public specifique qui cherche a communiquer avec l'au-dela ou a recevoir une guidance profondement spirituelle.`,
        introP2: `Notre evaluation de Kang s'est concentree sur la qualite des consultations de mediumnite, un domaine ou la plateforme se presente comme specialiste. Nous avons egalement analyse les tarifs, les canaux de consultation et le retour des clients pour dresser un bilan objectif.`,
        pricingDetail: `Les tarifs de Kang se situent dans la fourchette haute du marche : de 2,50 a 5,50 euros par minute. Ce positionnement tarifaire se justifie par la specialisation en mediumnite, un domaine ou les praticiens qualifies sont plus rares. L'offre de bienvenue propose 3 premieres minutes offertes. Le paiement se fait par carte bancaire uniquement. Il est regrettable de ne pas avoir d'option audiotel ou PayPal.`,
        clientReview: `Les 1 500 avis de Kang sont polarises. Les clients convaincus par la mediumnite louent la sensibilite et la precision des mediums de la plateforme. Les clients plus sceptiques jugent les tarifs eleves pour un panel aussi restreint. Le manque de chat en direct et les horaires limites (9h-23h) sont des points de friction recurrents. Le score Trustpilot de 3.3/5 est en dessous de la moyenne du secteur.`,
        faq: [
            { q: "Kang est-il specialise en mediumnite ?", a: "Oui, la mediumnite est la specialite principale de Kang." },
            { q: "Quels sont les tarifs de Kang ?", a: "Comptez entre 2,50 et 5,50 euros par minute, fourchette haute du marche." },
            { q: "Peut-on consulter par chat sur Kang ?", a: "Non, Kang ne propose pas le chat. Seuls le telephone et l'email sont disponibles." },
            { q: "Kang offre-t-il des minutes de decouverte ?", a: "Oui, 3 premieres minutes offertes aux nouveaux clients." },
            { q: "Quels sont les horaires de Kang ?", a: "Le service est accessible de 9h a 23h, horaires limites par rapport aux concurrents." }
        ]
    },
    avigora: {
        introP1: `Avigora est un acteur historique de la voyance en ligne en France, en activite depuis 2010. Avec 120 voyants, une note de 3.7/5 sur 2 100 avis et une disponibilite 24h/24, la plateforme mise sur l'accessibilite permanente et l'option audiotel. Son anciennete lui confere une certaine legitimite, meme si l'interface montre des signes de vieillissement.`,
        introP2: `Notre test d'Avigora a couvert l'ensemble de l'offre : consultations telephoniques, audiotel, qualite des voyants et ergonomie du site. L'objectif etait de determiner si cette plateforme historique reste competitive face a des acteurs plus recents et plus modernes.`,
        pricingDetail: `Les tarifs d'Avigora sont competitifs, allant de 2,00 a 4,50 euros par minute. Le tarif d'entree a 2 euros par minute est l'un des plus bas du marche, au meme niveau que Wengo. L'offre de bienvenue propose 5 premieres minutes offertes. L'atout distinctif est la disponibilite de l'audiotel, qui permet de consulter sans carte bancaire ni inscription. Le paiement par carte bancaire est egalement propose.`,
        clientReview: `Les 2 100 avis d'Avigora revelent une satisfaction moyenne. Les points forts mentionnes sont la disponibilite 24h/24, l'option audiotel et les tarifs d'entree accessibles. Les points faibles concernent l'interface datee du site, le systeme d'avis moins developpe que chez les leaders et la qualite inegale des praticiens. Le score Trustpilot de 3.6/5 est correct mais en retrait par rapport aux plateformes les mieux notees.`,
        faq: [
            { q: "Avigora propose-t-il l'audiotel ?", a: "Oui, l'audiotel est disponible pour consulter sans carte bancaire." },
            { q: "Quels sont les tarifs d'Avigora ?", a: "Les tarifs vont de 2,00 a 4,50 euros par minute selon le voyant." },
            { q: "Avigora est-il disponible 24h/24 ?", a: "Oui, c'est l'un des atouts majeurs de la plateforme." },
            { q: "Avigora offre-t-il des minutes gratuites ?", a: "Oui, 5 premieres minutes offertes pour les nouveaux inscrits." },
            { q: "L'interface d'Avigora est-elle moderne ?", a: "L'interface est fonctionnelle mais datee comparee aux plateformes plus recentes." }
        ]
    },
    cosmospace: {
        introP1: `Cosmospace est un pionnier de la voyance par audiotel en France, en activite depuis 2001. Avec plus de 20 ans d'experience et 200 voyants disponibles, la plateforme a bati sa reputation sur l'accessibilite : pas besoin de carte bancaire, pas d'inscription, il suffit d'un telephone. Note 3.6/5 sur 4 200 avis, Cosmospace reste un acteur incontournable du marche.`,
        introP2: `Nous avons teste Cosmospace pour evaluer si ce veteran de l'audiotel reste competitif face aux plateformes modernes. Qualite des voyants, tarifs, ergonomie : voici notre analyse complete.`,
        pricingDetail: `L'atout principal de Cosmospace est son tarif audiotel a partir de 0,40 euro/min, le plus bas du marche. Les consultations par CB vont de 1,50 a 3,00 euros/min. L'offre decouverte permet de tester le service par audiotel sans engagement. L'absence de necessite d'inscription ou de carte bancaire est un avantage unique pour les consultants ponctuels.`,
        clientReview: `Les 4 200 avis de Cosmospace sont partages. Les utilisateurs fideles apprecient l'accessibilite et les tarifs audiotel imbattables. Les critiques portent sur l'interface tres datee, le manque de transparence dans la selection des voyants et l'absence de chat ou d'email. Le score Trustpilot de 3.2/5 est en dessous de la moyenne du secteur.`,
        faq: [
            { q: "Cosmospace est-il fiable ?", a: "Cosmospace est un acteur historique fiable, mais la qualite des voyants est variable." },
            { q: "Comment consulter sur Cosmospace ?", a: "Par audiotel (sans inscription) ou par telephone avec CB." },
            { q: "Quels sont les tarifs de Cosmospace ?", a: "A partir de 0,40 euro/min en audiotel, jusqu'a 3 euros/min par CB." },
            { q: "Cosmospace est-il disponible 24h/24 ?", a: "Oui, des voyants sont disponibles a toute heure." },
            { q: "Peut-on consulter par chat sur Cosmospace ?", a: "Non, Cosmospace propose uniquement le telephone et l'audiotel." }
        ]
    },
    mydeclick: {
        introP1: `MyDeclick est une plateforme de voyance en ligne lancee en 2019 a Lyon. Elle se distingue par ses consultations en visio et son approche combinant voyance et coaching spirituel. Avec 90 voyants et une note de 3.9/5 sur 1 800 avis, MyDeclick cible un public recherchant une experience plus personnelle et moderne.`,
        introP2: `Notre test de MyDeclick a porte sur la qualite des consultations en visio, un format encore rare dans le secteur. Nous avons egalement evalue les tarifs, l'interface et la pertinence de l'approche coaching.`,
        pricingDetail: `Les tarifs de MyDeclick vont de 2,50 a 4,50 euros par minute. L'offre de bienvenue propose 7 premieres minutes offertes, une offre genereuse qui se situe entre Wengo (10 min) et Spiriteo (5 min). Le paiement s'effectue par carte bancaire ou PayPal. Pas d'option audiotel.`,
        clientReview: `Les 1 800 avis de MyDeclick sont globalement positifs. Les clients apprecient les consultations en visio qui creent un lien plus fort avec le voyant. L'approche coaching est saluee par ceux qui cherchent un accompagnement sur la duree. Les critiques portent sur le panel encore restreint et l'absence de disponibilite 24h/24. Le Trustpilot de 4.0/5 est tres encourageant.`,
        faq: [
            { q: "MyDeclick propose-t-il la visio ?", a: "Oui, c'est l'un des rares sites a proposer des consultations en visioconference." },
            { q: "Quels sont les tarifs de MyDeclick ?", a: "De 2,50 a 4,50 euros par minute, avec 7 minutes offertes." },
            { q: "MyDeclick combine-t-il voyance et coaching ?", a: "Oui, de nombreux praticiens proposent une approche combinee." },
            { q: "MyDeclick est-il disponible 24h/24 ?", a: "Non, le service est disponible de 8h a 1h du matin." },
            { q: "MyDeclick a-t-il une application mobile ?", a: "Oui, une application mobile est disponible pour iOS et Android." }
        ]
    },
    viversum: {
        introP1: `Viversum est une plateforme de voyance d'origine allemande, presente en France depuis 2009. Elle se demarque par une offre decouverte de 15 minutes gratuites, la plus genereuse du marche. Avec 300 voyants et une note de 3.4/5 sur 3 500 avis, Viversum attire principalement par ses tarifs d'entree parmi les plus bas.`,
        introP2: `Notre evaluation de Viversum a porte sur la qualite reelle des consultations, au-dela de l'offre de bienvenue attractive. Nous avons teste plusieurs voyants et analyse l'experience complete pour un avis objectif.`,
        pricingDetail: `Les tarifs de Viversum demarrent a 1,49 euro/min, le deuxieme tarif le plus bas du marche apres Cosmospace. L'offre de 15 minutes gratuites a l'inscription est la meilleure du secteur. Le paiement se fait par carte bancaire uniquement. La combinaison tarifs bas + offre decouverte genereuse en fait l'option la plus economique pour une premiere consultation.`,
        clientReview: `Les 3 500 avis de Viversum sont mitiges. L'offre de 15 minutes est unanimement saluee. Cependant, la qualite des voyants est jugee tres variable, avec parfois des traductions imparfaites (plateforme d'origine allemande). Le service client est parfois lent a repondre. Le Trustpilot de 3.1/5 est parmi les plus bas du classement.`,
        faq: [
            { q: "Viversum offre-t-il vraiment 15 minutes gratuites ?", a: "Oui, c'est l'offre de bienvenue la plus genereuse du marche." },
            { q: "Viversum est-il un site francais ?", a: "Non, Viversum est d'origine allemande mais propose un service en francais." },
            { q: "Quels sont les tarifs de Viversum ?", a: "A partir de 1,49 euro/min, parmi les plus bas du marche." },
            { q: "La qualite des voyants est-elle bonne sur Viversum ?", a: "Variable. Certains voyants sont excellents, d'autres moins precis." },
            { q: "Viversum est-il disponible 24h/24 ?", a: "Oui, des voyants sont disponibles a toute heure du jour et de la nuit." }
        ]
    },
    "voyance-alice": {
        introP1: `Voyance Alice est une plateforme de niche lancee en 2016, specialisee dans la guidance amoureuse. Avec un panel volontairement restreint de 40 voyantes triees sur le volet, elle privilegie la qualite et la bienveillance. Note 3.3/5 sur 950 avis, Voyance Alice s'adresse principalement a un public feminin en quete de reponses sur sa vie sentimentale.`,
        introP2: `Notre test de Voyance Alice a porte sur la pertinence de cette specialisation amoureuse. Nous avons consulte plusieurs voyantes pour evaluer la precision des predictions sentimentales et la qualite de l'accompagnement.`,
        pricingDetail: `Les tarifs de Voyance Alice sont dans la fourchette haute : de 2,90 a 5,90 euros par minute. Ce positionnement premium se justifie par la specialisation et la selection rigoureuse des voyantes. L'offre de bienvenue propose 3 premieres minutes offertes. Le paiement se fait uniquement par carte bancaire, sans option audiotel ou PayPal.`,
        clientReview: `Les 950 avis de Voyance Alice revelent une communaute fidele mais restreinte. Les clientes satisfaites louent l'empathie et la precision des voyantes sur les questions amoureuses. Les critiques portent sur les tarifs eleves, le panel tres limite et les horaires restreints (9h-22h). Le Trustpilot de 3.4/5 est correct pour une plateforme de cette taille.`,
        faq: [
            { q: "Voyance Alice est-elle specialisee en amour ?", a: "Oui, c'est la specialite principale de la plateforme." },
            { q: "Les voyantes de Voyance Alice sont-elles fiables ?", a: "Les voyantes sont selectionnees pour leur expertise en guidance amoureuse." },
            { q: "Quels sont les tarifs de Voyance Alice ?", a: "De 2,90 a 5,90 euros par minute, fourchette haute du marche." },
            { q: "Peut-on consulter un voyant homme sur Voyance Alice ?", a: "Le panel est principalement compose de voyantes, mais quelques voyants sont disponibles." },
            { q: "Voyance Alice offre-t-elle des minutes gratuites ?", a: "Oui, 3 premieres minutes offertes pour decouvrir le service." }
        ]
    },
    divinatix: {
        introP1: `Divinatix est la plus jeune plateforme de notre classement, lancee en 2020 a Paris. Resolument tournee vers le digital, elle ne propose pas de consultation telephonique classique : tout se fait par chat, visio ou email. Avec 50 voyants et une note de 3.2/5 sur 1 200 avis, Divinatix cible un public jeune et connecte.`,
        introP2: `Notre evaluation de Divinatix s'est concentree sur l'experience 100% digitale proposee par la plateforme. Nous avons teste le chat, la visio et l'email pour mesurer la qualite des consultations dans ces formats modernes.`,
        pricingDetail: `Les tarifs de Divinatix sont accessibles, allant de 1,50 a 3,50 euros par minute. L'offre de bienvenue propose 5 premieres minutes offertes. L'originalite reside dans l'acceptation d'Apple Pay en plus de la carte bancaire, un signal de modernite. Pas d'option audiotel ni de telephone classique.`,
        clientReview: `Les 1 200 avis de Divinatix sont encourageants pour une plateforme aussi jeune. Les utilisateurs apprecient l'interface moderne et la possibilite de consulter par chat sans pression telephonique. Les critiques portent sur le panel encore limite, les horaires restreints (10h-minuit) et le manque de recul sur la fiabilite des voyants. Le Trustpilot de 3.0/5 reflete cette jeunesse.`,
        faq: [
            { q: "Divinatix propose-t-il des consultations telephoniques ?", a: "Non, Divinatix est 100% digital : chat, visio et email uniquement." },
            { q: "Quels sont les tarifs de Divinatix ?", a: "De 1,50 a 3,50 euros par minute, tarifs accessibles." },
            { q: "Peut-on payer par Apple Pay sur Divinatix ?", a: "Oui, c'est l'une des rares plateformes a accepter Apple Pay." },
            { q: "Divinatix est-il fiable malgre sa jeunesse ?", a: "La plateforme est serieuse mais recente, il manque encore du recul sur la qualite globale." },
            { q: "Divinatix est-il disponible 24h/24 ?", a: "Non, le service est disponible de 10h a minuit." }
        ]
    }
};


// ═══════════════════════════════════════════════════════════════════════════════
// COMPARISON PAGE CONTENT
// ═══════════════════════════════════════════════════════════════════════════════

const COMPARISON_CONTENT = {
    'wengo-vs-spiriteo': {
        introP1: `Wengo et Spiriteo sont deux plateformes de voyance en ligne francophones qui attirent un public similaire mais avec des approches distinctes. Wengo, fonde en 2007, mise sur le volume avec plus de 500 voyants disponibles. Spiriteo, lance en 2015, privilegien la selection avec un panel de 150 praticiens rigoureusement recrutes.`,
        introP2: `Ce comparatif detaille analyse chaque critere important pour vous aider a choisir la plateforme qui correspond le mieux a vos attentes et a votre budget. Nous avons teste les deux services pour vous livrer un avis fonde sur l'experience.`,
        prixAnalysis: `En termes de prix, Wengo propose une fourchette plus large (2 a 5 euros/min) avec un tarif d'entree plus bas. Spiriteo demarre a 2,90 euros/min, ce qui est legerement plus cher. L'avantage decisif de Wengo reside dans son offre de bienvenue : 10 minutes offertes contre 5 chez Spiriteo. Pour les petits budgets, Wengo est plus accessible.`,
        qualiteAnalysis: `La qualite des voyants est comparable sur les deux plateformes. Spiriteo revendique un processus de selection plus exigeant, mais Wengo compense par un systeme d'avis verifies plus developpe qui permet aux utilisateurs de filtrer les meilleurs praticiens. En pratique, les deux plateformes proposent des consultations de bon niveau.`,
        faciliteAnalysis: `L'interface de Wengo est plus complete avec des profils detailles, des avis verifies et un systeme de filtrage avance. Spiriteo propose une interface plus moderne et epuree mais avec moins de fonctionnalites de recherche. Wengo propose telephone, chat et email. Spiriteo se limite au telephone et au chat.`,
        supportAnalysis: `Le service client de Wengo est reactif et disponible par email. Spiriteo propose egalement un support client reactif. Les deux plateformes gerent correctement les litiges et les remboursements. Wengo a l'avantage de l'anciennete et d'une equipe support plus etoffee.`,
        faq: [
            { q: "Wengo ou Spiriteo, lequel est le moins cher ?", a: "Wengo est legerement moins cher avec un tarif debutant a 2 euros/min contre 2,90 pour Spiriteo." },
            { q: "Quel site a les meilleurs voyants entre Wengo et Spiriteo ?", a: "Les deux plateformes proposent des voyants de qualite. Spiriteo a un recrutement plus strict, Wengo a plus d'avis pour trier." },
            { q: "Wengo ou Spiriteo pour un premier essai de voyance ?", a: "Wengo avec ses 10 minutes offertes contre 5 chez Spiriteo est plus adapte pour decouvrir." },
            { q: "Spiriteo est-il disponible 24h/24 comme Wengo ?", a: "Non, Spiriteo est disponible de 7h a 3h du matin. Wengo est disponible 24h/24." },
            { q: "Peut-on consulter par email sur Spiriteo ?", a: "Non, Spiriteo ne propose pas l'email. Wengo propose telephone, chat et email." }
        ]
    },
    'wengo-vs-jimini': {
        introP1: `Wengo et Jimini representent deux philosophies distinctes de la voyance en ligne. Wengo est le leader historique avec un panel de 500 voyants et une reputation bien etablie. Jimini, plus recent (2018), se positionne comme l'option economique avec des tarifs parmi les plus bas du marche.`,
        introP2: `Cette comparaison vous aidera a choisir entre la completude de Wengo et l'accessibilite tarifaire de Jimini. Les deux plateformes ont des forces et des faiblesses que nous allons detailler critere par critere.`,
        prixAnalysis: `Jimini est clairement plus abordable avec des tarifs debutant a 1,90 euro/min contre 2 euros chez Wengo. Cependant, Wengo offre 10 minutes gratuites a l'inscription contre seulement 3 chez Jimini. Sur une premiere consultation de 20 minutes, le cout reel est donc comparable. L'atout de Jimini est l'audiotel, qui permet de consulter sans carte bancaire.`,
        qualiteAnalysis: `La qualite des voyants chez Wengo est globalement superieure, avec un systeme d'avis verifies plus robuste (12 500 avis contre 2 800). Le panel de Wengo est 6 fois plus large (500 vs 80 voyants), ce qui augmente les chances de trouver le praticien ideal. Jimini compense par des prix plus bas mais le choix est nettement plus restreint.`,
        faciliteAnalysis: `L'interface de Wengo est nettement plus moderne et ergonomique. Les profils de voyants sont detailles, les filtres de recherche performants et la mise en relation est rapide. L'interface de Jimini est fonctionnelle mais datee. En revanche, Jimini propose la consultation par SMS, un format unique que Wengo ne propose pas.`,
        supportAnalysis: `Le service client de Wengo est plus developpe avec une equipe dediee et des temps de reponse rapides. Jimini propose un support correct mais moins etoffe. Pour les litiges, Wengo offre une meilleure protection grace a son systeme de mediation. Jimini a l'avantage de l'audiotel pour les utilisateurs qui preferent eviter la carte bancaire.`,
        faq: [
            { q: "Jimini est-il vraiment moins cher que Wengo ?", a: "Oui, le tarif minimum de Jimini est de 1,90 euro/min contre 2 euros chez Wengo." },
            { q: "Wengo ou Jimini pour consulter par audiotel ?", a: "Jimini propose l'audiotel, Wengo ne le propose pas." },
            { q: "Quel site a le plus de voyants, Wengo ou Jimini ?", a: "Wengo avec 500 voyants contre 80 chez Jimini." },
            { q: "Peut-on consulter par SMS sur Wengo comme sur Jimini ?", a: "Non, le SMS est specifique a Jimini. Wengo propose telephone, chat et email." },
            { q: "Wengo ou Jimini pour un budget serre ?", a: "Jimini pour le tarif brut, mais Wengo offre plus de minutes gratuites au depart." }
        ]
    },
    'wengo-vs-avigora': {
        introP1: `Wengo et Avigora sont deux acteurs historiques de la voyance en ligne en France. Wengo, fonde en 2007, est le leader du marche avec 500 voyants. Avigora, present depuis 2010, compte 120 praticiens et mise sur la disponibilite 24h/24 et l'audiotel.`,
        introP2: `Ce comparatif analyse les differences concretes entre ces deux plateformes pour vous aider a choisir celle qui repond le mieux a vos besoins. Tarifs, qualite, ergonomie, support : nous passons tout en revue.`,
        prixAnalysis: `Les deux plateformes proposent des tarifs d'entree similaires a 2 euros/min. La fourchette haute de Wengo monte a 5 euros/min contre 4,50 chez Avigora. Wengo offre 10 minutes gratuites contre 5 chez Avigora. Les deux proposent le paiement par carte bancaire. Avigora a l'avantage de proposer l'audiotel en complement.`,
        qualiteAnalysis: `Wengo surpasse Avigora sur la qualite grace a un systeme d'avis beaucoup plus developpe (12 500 avis contre 2 100). Le panel de Wengo est 4 fois plus large, offrant plus de diversite dans les specialites. Avigora souffre d'une qualite plus inegale de ses praticiens et d'un systeme d'evaluation moins transparent.`,
        faciliteAnalysis: `L'interface de Wengo est nettement plus moderne et ergonomique, avec des profils de voyants complets, des filtres de recherche et une navigation intuitive. Avigora a une interface vieillissante, moins agreable sur mobile. Les deux sont disponibles 24h/24, ce qui est un atout partage.`,
        supportAnalysis: `Le service client de Wengo est plus reactif et mieux structure. Avigora propose un support correct mais moins accessible. Pour les remboursements et litiges, Wengo offre une meilleure protection consommateur. Avigora compense par l'accessibilite de l'audiotel qui ne necessite aucune inscription.`,
        faq: [
            { q: "Wengo ou Avigora, lequel choisir ?", a: "Wengo pour la qualite et le choix, Avigora pour l'audiotel et la simplicite d'acces." },
            { q: "Avigora propose-t-il l'audiotel comme Wengo ?", a: "Oui, Avigora propose l'audiotel. Wengo ne le propose pas." },
            { q: "Quel site est le plus fiable entre Wengo et Avigora ?", a: "Wengo avec son systeme d'avis verifies et sa note plus elevee est plus fiable." },
            { q: "Les tarifs de Wengo et Avigora sont-ils similaires ?", a: "Oui, les tarifs d'entree sont identiques a 2 euros/min." },
            { q: "Wengo ou Avigora pour la voyance la nuit ?", a: "Les deux sont disponibles 24h/24, mais Wengo a plus de voyants en ligne la nuit." }
        ]
    },
    'spiriteo-vs-jimini': {
        introP1: `Spiriteo et Jimini sont deux plateformes de voyance en ligne de taille moyenne qui s'adressent a des publics differents. Spiriteo mise sur la qualite de selection de ses voyants, tandis que Jimini se demarque par ses tarifs parmi les plus accessibles du marche.`,
        introP2: `Ce comparatif vous aide a trancher entre la rigueur de selection de Spiriteo et l'accessibilite financiere de Jimini. Chaque critere est analyse objectivement pour vous permettre de faire un choix eclaire.`,
        prixAnalysis: `Jimini est clairement le moins cher avec un tarif debutant a 1,90 euro/min contre 2,90 chez Spiriteo. L'ecart est significatif sur une consultation de 30 minutes. Spiriteo offre 5 minutes gratuites contre 3 chez Jimini. Jimini propose en plus l'audiotel, un avantage pour ceux qui preferent eviter la carte bancaire.`,
        qualiteAnalysis: `Spiriteo l'emporte sur la qualite grace a son processus de recrutement plus exigeant. Les voyants de Spiriteo sont decrits comme plus professionnels et plus precis dans leurs predictions. Le panel de Spiriteo est presque deux fois plus large (150 vs 80 voyants). Jimini compense par la diversite de ses canaux de consultation (telephone, chat, SMS).`,
        faciliteAnalysis: `Spiriteo propose une interface plus moderne et plus agreable. La navigation est fluide et les profils de voyants sont bien presentes. Jimini a une interface correcte mais moins soignee. En revanche, Jimini propose la consultation par SMS et audiotel, des formats que Spiriteo ne propose pas.`,
        supportAnalysis: `Le service client de Spiriteo est reactif et bien note par les utilisateurs. Jimini propose un support client moins developpe. Les horaires de Spiriteo (7h-3h) sont plus etendus que ceux de Jimini (8h-minuit). Aucune des deux plateformes n'est disponible 24h/24.`,
        faq: [
            { q: "Spiriteo ou Jimini, lequel est le moins cher ?", a: "Jimini avec un tarif debutant a 1,90 euro/min contre 2,90 chez Spiriteo." },
            { q: "Quel site a les meilleurs voyants entre Spiriteo et Jimini ?", a: "Spiriteo grace a un processus de selection plus rigoureux de ses voyants." },
            { q: "Peut-on consulter par SMS sur Spiriteo ou Jimini ?", a: "Seul Jimini propose la consultation par SMS." },
            { q: "Spiriteo ou Jimini pour la voyance audiotel ?", a: "Seul Jimini propose l'audiotel pour consulter sans carte bancaire." },
            { q: "Lequel est disponible le plus tard, Spiriteo ou Jimini ?", a: "Spiriteo jusqu'a 3h du matin, Jimini jusqu'a minuit." }
        ]
    },
    'spiriteo-vs-avigora': {
        introP1: `Spiriteo et Avigora representent deux generations de plateformes de voyance en ligne. Avigora, fonde en 2010, est un acteur historique misant sur la disponibilite permanente. Spiriteo, lance en 2015, mise sur la qualite de selection de ses voyants et une interface plus moderne.`,
        introP2: `Ce comparatif detaille vous aide a choisir entre l'accessibilite d'Avigora (24h/24, audiotel) et le positionnement qualite de Spiriteo. Les deux plateformes ont des atouts distincts que nous analysons critere par critere.`,
        prixAnalysis: `Avigora propose un tarif d'entree plus bas (2,00 euro/min contre 2,90 chez Spiriteo). Les deux offrent 5 minutes gratuites a l'inscription. Avigora propose en plus l'audiotel, ce qui le rend accessible sans carte bancaire. Sur le rapport qualite-prix, Spiriteo se justifie par une selection plus stricte de ses voyants.`,
        qualiteAnalysis: `Spiriteo l'emporte sur la qualite des voyants. Le recrutement est plus exigeant et les praticiens sont decrits comme plus professionnels. Avigora souffre d'une qualite plus inegale, avec un systeme d'avis moins transparent. Le panel d'Avigora est plus large (120 vs 150 voyants) mais la difference est faible.`,
        faciliteAnalysis: `Spiriteo propose une interface moderne et agreable, bien adaptee au mobile. Avigora a une interface vieillissante qui necessite un rafraichissement. En termes de disponibilite, Avigora gagne avec un service 24h/24 contre 7h-3h pour Spiriteo. Avigora propose egalement l'audiotel que Spiriteo ne propose pas.`,
        supportAnalysis: `Le service client de Spiriteo est globalement mieux note. Avigora propose un support correct mais parfois lent. Les deux plateformes gerent les remboursements de maniere satisfaisante. Avigora a l'avantage de ne necessiter aucune inscription pour l'audiotel, ce qui simplifie l'acces.`,
        faq: [
            { q: "Spiriteo ou Avigora, lequel est disponible 24h/24 ?", a: "Seul Avigora est disponible 24h/24. Spiriteo ferme a 3h du matin." },
            { q: "Quel site a les voyants les plus qualifies ?", a: "Spiriteo, grace a son processus de recrutement plus exigeant." },
            { q: "Peut-on consulter par audiotel sur Spiriteo ?", a: "Non, seul Avigora propose l'option audiotel." },
            { q: "Spiriteo ou Avigora pour les petits budgets ?", a: "Avigora avec un tarif d'entree a 2 euros/min contre 2,90 chez Spiriteo." },
            { q: "Lequel a la meilleure interface mobile ?", a: "Spiriteo, avec une interface plus moderne et mieux adaptee aux smartphones." }
        ]
    }
};


// ═══════════════════════════════════════════════════════════════════════════════
// GENERATE INDIVIDUAL REVIEW PAGE
// ═══════════════════════════════════════════════════════════════════════════════

function generateReviewPage(platform) {
    const p = platform;
    const content = REVIEW_CONTENT[p.slug];
    const canonicalPath = `/avis/${p.slug}/`;

    // Pick 2 alternatives for comparison section
    const alternatives = platforms
        .filter(alt => alt.slug !== p.slug)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 2);

    // Schema
    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Accueil", "item": `${SITE_URL}/` },
                    { "@type": "ListItem", "position": 2, "name": "Avis & Comparatifs", "item": `${SITE_URL}/avis/` },
                    { "@type": "ListItem", "position": 3, "name": `Avis ${p.name}`, "item": `${SITE_URL}${canonicalPath}` }
                ]
            },
            {
                "@type": "Review",
                "name": `Avis ${p.name} 2026`,
                "author": { "@type": "Organization", "name": "France Voyance Avenir" },
                "datePublished": "2026-01-15",
                "dateModified": "2026-02-01",
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": p.rating,
                    "bestRating": 5,
                    "worstRating": 1
                },
                "itemReviewed": {
                    "@type": "Product",
                    "name": p.name,
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": p.rating,
                        "reviewCount": p.ratingCount,
                        "bestRating": 5,
                        "worstRating": 1
                    }
                }
            },
            {
                "@type": "FAQPage",
                "mainEntity": content.faq.map(f => ({
                    "@type": "Question",
                    "name": f.q,
                    "acceptedAnswer": { "@type": "Answer", "text": f.a }
                }))
            }
        ]
    };

    const title = `Avis ${p.name} 2026 : test et avis sur la voyance en ligne`;
    const metaDesc = `Avis ${p.name} voyance : notre test complet de la plateforme. Tarifs, qualite des voyants, avantages et inconvenients. Note ${p.rating}/5 sur ${p.ratingCount} avis.`;

    // CTA logic
    let ctaHtml;
    if (p.isAffiliate) {
        ctaHtml = `<a href="javascript:void(0)" onclick="window.open(getAffiliateUrl(), '_blank'); return false;" data-affiliate="default" class="btn btn-gold btn-xl"><i class="fas fa-star"></i> Essayer ${p.name} - ${p.freeOffer}</a>`;
    } else {
        const wengo = getPlatform('wengo');
        ctaHtml = `<a href="javascript:void(0)" onclick="window.open(getAffiliateUrl(), '_blank'); return false;" data-affiliate="default" class="btn btn-gold btn-xl"><i class="fas fa-star"></i> Decouvrir notre plateforme recommandee - ${wengo.freeOffer}</a>`;
    }

    const html = `${getHead(title, metaDesc, canonicalPath, schema)}

<body>
    ${getHeader()}

    <main>
        <!-- Breadcrumbs -->
        <nav class="breadcrumbs" aria-label="Fil d'Ariane">
            <div class="container">
                <a href="/">Accueil</a>
                <span class="separator">&rsaquo;</span>
                <a href="/avis/">Avis & Comparatifs</a>
                <span class="separator">&rsaquo;</span>
                <span class="current">Avis ${p.name}</span>
            </div>
        </nav>

        <!-- Hero -->
        <section class="local-hero">
            <div class="container">
                <h1 class="fade-in-up">Avis ${p.name} 2026 : test complet de la voyance en ligne</h1>
                <p class="hero-subtitle fade-in-up stagger-1">Notre analyse detaillee apres plusieurs semaines de test</p>
            </div>
        </section>

        <!-- Content -->
        <section class="content-section">
            <div class="container">
                <div class="content-grid">
                    <article class="main-content">

                        <!-- TL;DR Box -->
                        <div class="review-tldr fade-in-up">
                            <h3><i class="fas fa-bolt"></i> L'essentiel en 30 secondes</h3>
                            <div class="tldr-rating">
                                Note : <strong>${p.rating}/5</strong>
                                <span class="star-rating">${starsHTML(p.rating)}</span>
                                (${p.ratingCount.toLocaleString('fr-FR')} avis)
                            </div>
                            <p><strong>Tarifs :</strong> ${p.priceRange}</p>
                            <p><strong>Offre decouverte :</strong> ${p.freeOffer}</p>
                            <p><strong>Pour qui :</strong> ${p.bestFor}</p>
                            <p style="margin-top:12px;">${p.verdict}</p>
                        </div>

                        <!-- Introduction -->
                        <section class="content-block fade-in-up">
                            <h2>Presentation de ${p.name} : ce qu'il faut savoir</h2>
                            <p>${content.introP1}</p>
                            <p>${content.introP2}</p>
                        </section>

                        <!-- Recap Table -->
                        <section class="content-block fade-in-up">
                            <h2>Fiche recapitulative ${p.name}</h2>
                            <table class="review-table">
                                <tr><th>Tarifs</th><td>${p.priceRange}</td></tr>
                                <tr><th>Canaux</th><td>${p.channels.join(', ')}</td></tr>
                                <tr><th>Note globale</th><td><span class="star-rating">${starsHTML(p.rating)}</span> ${p.rating}/5 (${p.ratingCount.toLocaleString('fr-FR')} avis)</td></tr>
                                <tr><th>Nombre de voyants</th><td>${p.nbPractitioners}</td></tr>
                                <tr><th>Disponibilite</th><td>${p.availability}</td></tr>
                                <tr><th>Offre decouverte</th><td>${p.freeOffer}</td></tr>
                                <tr><th>Specialites</th><td>${p.specialties.join(', ')}</td></tr>
                                <tr><th>Moyens de paiement</th><td>${p.paymentMethods.join(', ')}</td></tr>
                                <tr><th>Annee de creation</th><td>${p.yearFounded}</td></tr>
                                <tr><th>Score Trustpilot</th><td>${p.trustpilotScore}</td></tr>
                            </table>
                        </section>

                        <!-- Pros & Cons -->
                        <section class="content-block fade-in-up">
                            <h2>Avantages et inconvenients de ${p.name}</h2>
                            <div class="pros-cons">
                                <div class="pros-box">
                                    <h3><i class="fas fa-thumbs-up"></i> Points forts</h3>
                                    <ul>
                                        ${p.pros.map(pro => `<li>${pro}</li>`).join('\n                                        ')}
                                    </ul>
                                </div>
                                <div class="cons-box">
                                    <h3><i class="fas fa-thumbs-down"></i> Points faibles</h3>
                                    <ul>
                                        ${p.cons.map(con => `<li>${con}</li>`).join('\n                                        ')}
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <!-- Pricing Detail -->
                        <section class="content-block fade-in-up">
                            <h2>Tarifs detailles de ${p.name} en 2026</h2>
                            <p>${content.pricingDetail}</p>
                        </section>

                        <!-- Client Reviews Summary -->
                        <section class="content-block fade-in-up">
                            <h2>Ce que disent les clients de ${p.name}</h2>
                            <p>${content.clientReview}</p>
                        </section>

                        <!-- Verdict -->
                        <div class="verdict-box fade-in-up">
                            <h3><i class="fas fa-gavel"></i> Notre verdict sur ${p.name}</h3>
                            <div class="verdict-score">${p.rating}/5</div>
                            <div class="star-rating" style="font-size:1.5em;margin:10px 0;">${starsHTML(p.rating)}</div>
                            <p>${p.verdict}</p>
                        </div>

                        <!-- Comparison with Alternatives -->
                        <section class="content-block fade-in-up">
                            <h2>${p.name} face a la concurrence</h2>
                            <p>Comment ${p.name} se positionne par rapport aux autres plateformes de voyance en ligne ? Voici un comparatif rapide avec deux alternatives populaires.</p>
                            <div class="table-responsive">
                            <table class="comparison-table">
                                <thead>
                                    <tr>
                                        <th>Critere</th>
                                        <th>${p.name}</th>
                                        ${alternatives.map(a => `<th>${a.name}</th>`).join('\n                                        ')}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Note</td>
                                        <td><span class="star-rating">${starsHTML(p.rating)}</span> ${p.rating}/5</td>
                                        ${alternatives.map(a => `<td><span class="star-rating">${starsHTML(a.rating)}</span> ${a.rating}/5</td>`).join('\n                                        ')}
                                    </tr>
                                    <tr>
                                        <td>Tarifs</td>
                                        <td>${p.priceRange}</td>
                                        ${alternatives.map(a => `<td>${a.priceRange}</td>`).join('\n                                        ')}
                                    </tr>
                                    <tr>
                                        <td>Voyants</td>
                                        <td>${p.nbPractitioners}</td>
                                        ${alternatives.map(a => `<td>${a.nbPractitioners}</td>`).join('\n                                        ')}
                                    </tr>
                                    <tr>
                                        <td>Offre decouverte</td>
                                        <td>${p.freeOffer}</td>
                                        ${alternatives.map(a => `<td>${a.freeOffer}</td>`).join('\n                                        ')}
                                    </tr>
                                    <tr>
                                        <td>Disponibilite</td>
                                        <td>${p.availability}</td>
                                        ${alternatives.map(a => `<td>${a.availability}</td>`).join('\n                                        ')}
                                    </tr>
                                </tbody>
                            </table>
                            </div>
                            <p>Pour un comparatif plus detaille, consultez nos pages de comparaison dediees :</p>
                            <ul>
                                ${alternatives.map(a => {
                                    const compSlug = comparisons.find(c =>
                                        (c.platformA === p.slug && c.platformB === a.slug) ||
                                        (c.platformA === a.slug && c.platformB === p.slug)
                                    );
                                    return compSlug ? `<li><a href="/avis/${compSlug.slug}/">${p.name} vs ${a.name}</a></li>` : '';
                                }).filter(Boolean).join('\n                                ')}
                            </ul>
                        </section>

                        <!-- FAQ -->
                        <section class="faq-section fade-in-up">
                            <h3>Questions frequentes sur ${p.name}</h3>
                            <div class="faq-list">
                                ${content.faq.map(f => `
                                <div class="faq-item">
                                    <button class="faq-question" aria-expanded="false">
                                        <span>${f.q}</span>
                                        <span class="faq-icon">+</span>
                                    </button>
                                    <div class="faq-answer">
                                        <p>${f.a}</p>
                                    </div>
                                </div>`).join('')}
                            </div>
                        </section>

                        <!-- CTA -->
                        <div class="verdict-box fade-in-up" style="margin-top:40px;">
                            <h3><i class="fas fa-rocket"></i> Pret a essayer ?</h3>
                            <p style="margin-bottom:20px;">Profitez de l'offre decouverte pour tester le service sans engagement.</p>
                            ${ctaHtml}
                        </div>

                    </article>

                    <!-- Sidebar -->
                    <aside class="sidebar">
                        <div class="sidebar-sticky">
                            <div class="cta-box fade-in-right">
                                <h3><i class="fas fa-star icon-pulse"></i> ${p.name}</h3>
                                <div class="star-rating" style="margin:8px 0;">${starsHTML(p.rating)}</div>
                                <p>${p.rating}/5 - ${p.ratingCount.toLocaleString('fr-FR')} avis</p>
                                <p style="font-size:0.9em;margin:8px 0;">${p.freeOffer}</p>
                                ${p.isAffiliate
                                    ? `<a href="javascript:void(0)" onclick="window.open(getAffiliateUrl(), '_blank'); return false;" data-affiliate="default" class="btn btn-gold btn-block">Essayer ${p.name}</a>`
                                    : `<a href="javascript:void(0)" onclick="window.open(getAffiliateUrl(), '_blank'); return false;" data-affiliate="default" class="btn btn-gold btn-block">Voir notre recommandation</a>`
                                }
                            </div>

                            <div class="pillar-link-box fade-in-right stagger-1">
                                <h4>Comparatifs</h4>
                                <a href="/avis/" class="pillar-link">
                                    <i class="fas fa-arrow-right"></i> Tous les avis et comparatifs
                                </a>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    </main>

    ${getFooter()}
</body>

</html>`;

    return html;
}


// ═══════════════════════════════════════════════════════════════════════════════
// GENERATE COMPARISON PAGE
// ═══════════════════════════════════════════════════════════════════════════════

function generateComparisonPage(comparison) {
    const c = comparison;
    const pA = getPlatform(c.platformA);
    const pB = getPlatform(c.platformB);
    const content = COMPARISON_CONTENT[c.slug];
    const canonicalPath = `/avis/${c.slug}/`;

    const title = `${pA.name} vs ${pB.name} : quelle voyance en ligne choisir en 2026 ?`;
    const metaDesc = `${c.title} : comparatif complet des deux plateformes de voyance. Tarifs, voyants, avis clients. Decouvrez laquelle choisir en 2026.`;

    // CTA: always link to affiliate (Wengo)
    const wengo = getPlatform('wengo');
    const ctaHtml = `<a href="javascript:void(0)" onclick="window.open(getAffiliateUrl(), '_blank'); return false;" data-affiliate="default" class="btn btn-gold btn-xl"><i class="fas fa-star"></i> Essayer Wengo - ${wengo.freeOffer}</a>`;

    // Determine winner for table highlights
    function winnerClass(criteria) {
        // Simple heuristic based on rating and data
        if (criteria === 'note') return pA.rating >= pB.rating ? 'A' : 'B';
        if (criteria === 'prix') return pA.priceMin <= pB.priceMin ? 'A' : 'B';
        if (criteria === 'voyants') return parseInt(pA.nbPractitioners) >= parseInt(pB.nbPractitioners) ? 'A' : 'B';
        return null;
    }

    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Accueil", "item": `${SITE_URL}/` },
                    { "@type": "ListItem", "position": 2, "name": "Avis & Comparatifs", "item": `${SITE_URL}/avis/` },
                    { "@type": "ListItem", "position": 3, "name": `${pA.name} vs ${pB.name}`, "item": `${SITE_URL}${canonicalPath}` }
                ]
            },
            {
                "@type": "Article",
                "headline": title,
                "author": { "@type": "Organization", "name": "France Voyance Avenir" },
                "datePublished": "2026-01-20",
                "dateModified": "2026-02-01"
            },
            {
                "@type": "ItemList",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": pA.name, "url": `${SITE_URL}/avis/${pA.slug}/` },
                    { "@type": "ListItem", "position": 2, "name": pB.name, "url": `${SITE_URL}/avis/${pB.slug}/` }
                ]
            },
            {
                "@type": "FAQPage",
                "mainEntity": content.faq.map(f => ({
                    "@type": "Question",
                    "name": f.q,
                    "acceptedAnswer": { "@type": "Answer", "text": f.a }
                }))
            }
        ]
    };

    const html = `${getHead(title, metaDesc, canonicalPath, schema)}

<body>
    ${getHeader()}

    <main>
        <!-- Breadcrumbs -->
        <nav class="breadcrumbs" aria-label="Fil d'Ariane">
            <div class="container">
                <a href="/">Accueil</a>
                <span class="separator">&rsaquo;</span>
                <a href="/avis/">Avis & Comparatifs</a>
                <span class="separator">&rsaquo;</span>
                <span class="current">${pA.name} vs ${pB.name}</span>
            </div>
        </nav>

        <!-- Hero -->
        <section class="local-hero">
            <div class="container">
                <h1 class="fade-in-up">${pA.name} vs ${pB.name} : quelle voyance en ligne choisir en 2026 ?</h1>
                <p class="hero-subtitle fade-in-up stagger-1">${c.subtitle}</p>
            </div>
        </section>

        <!-- Content -->
        <section class="content-section">
            <div class="container">
                <div class="content-grid">
                    <article class="main-content">

                        <!-- TL;DR Verdict -->
                        <div class="review-tldr fade-in-up">
                            <h3><i class="fas fa-bolt"></i> Le verdict en bref</h3>
                            <p><strong>Meilleur rapport qualite-prix :</strong> ${c.verdictBudget}</p>
                            <p><strong>Meilleure qualite de voyants :</strong> ${c.verdictQuality}</p>
                            <p><strong>Meilleur choix de voyants :</strong> ${c.verdictChoice}</p>
                            <p><strong>Meilleur pour debuter :</strong> ${c.verdictBeginner}</p>
                        </div>

                        <!-- Introduction -->
                        <section class="content-block fade-in-up">
                            <h2>${pA.name} vs ${pB.name} : deux approches differentes</h2>
                            <p>${content.introP1}</p>
                            <p>${content.introP2}</p>
                        </section>

                        <!-- Big Comparison Table -->
                        <section class="content-block fade-in-up">
                            <h2>Tableau comparatif complet</h2>
                            <div class="table-responsive">
                            <table class="comparison-table">
                                <thead>
                                    <tr>
                                        <th>Critere</th>
                                        <th>${pA.name}</th>
                                        <th>${pB.name}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Note globale</td>
                                        <td${pA.rating >= pB.rating ? ' class="winner"' : ''}><span class="star-rating">${starsHTML(pA.rating)}</span> ${pA.rating}/5</td>
                                        <td${pB.rating >= pA.rating ? ' class="winner"' : ''}><span class="star-rating">${starsHTML(pB.rating)}</span> ${pB.rating}/5</td>
                                    </tr>
                                    <tr>
                                        <td>Nombre d'avis</td>
                                        <td${pA.ratingCount >= pB.ratingCount ? ' class="winner"' : ''}>${pA.ratingCount.toLocaleString('fr-FR')}</td>
                                        <td${pB.ratingCount >= pA.ratingCount ? ' class="winner"' : ''}>${pB.ratingCount.toLocaleString('fr-FR')}</td>
                                    </tr>
                                    <tr>
                                        <td>Tarifs</td>
                                        <td${pA.priceMin <= pB.priceMin ? ' class="winner"' : ''}>${pA.priceRange}</td>
                                        <td${pB.priceMin <= pA.priceMin ? ' class="winner"' : ''}>${pB.priceRange}</td>
                                    </tr>
                                    <tr>
                                        <td>Offre decouverte</td>
                                        <td>${pA.freeOffer}</td>
                                        <td>${pB.freeOffer}</td>
                                    </tr>
                                    <tr>
                                        <td>Nombre de voyants</td>
                                        <td>${pA.nbPractitioners}</td>
                                        <td>${pB.nbPractitioners}</td>
                                    </tr>
                                    <tr>
                                        <td>Canaux</td>
                                        <td>${pA.channels.join(', ')}</td>
                                        <td>${pB.channels.join(', ')}</td>
                                    </tr>
                                    <tr>
                                        <td>Disponibilite</td>
                                        <td>${pA.availability}</td>
                                        <td>${pB.availability}</td>
                                    </tr>
                                    <tr>
                                        <td>Specialites</td>
                                        <td>${pA.specialties.join(', ')}</td>
                                        <td>${pB.specialties.join(', ')}</td>
                                    </tr>
                                    <tr>
                                        <td>Paiement</td>
                                        <td>${pA.paymentMethods.join(', ')}</td>
                                        <td>${pB.paymentMethods.join(', ')}</td>
                                    </tr>
                                    <tr>
                                        <td>Score Trustpilot</td>
                                        <td>${pA.trustpilotScore}</td>
                                        <td>${pB.trustpilotScore}</td>
                                    </tr>
                                    <tr>
                                        <td>Annee creation</td>
                                        <td>${pA.yearFounded}</td>
                                        <td>${pB.yearFounded}</td>
                                    </tr>
                                </tbody>
                            </table>
                            </div>
                        </section>

                        <!-- Analysis by Criteria -->
                        <section class="content-block fade-in-up">
                            <h2>Analyse detaillee : prix et tarifs</h2>
                            <p>${content.prixAnalysis}</p>
                        </section>

                        <section class="content-block fade-in-up">
                            <h2>Qualite des voyants : ${pA.name} vs ${pB.name}</h2>
                            <p>${content.qualiteAnalysis}</p>
                        </section>

                        <section class="content-block fade-in-up">
                            <h2>Facilite d'utilisation et canaux de consultation</h2>
                            <p>${content.faciliteAnalysis}</p>
                        </section>

                        <section class="content-block fade-in-up">
                            <h2>Service client et support</h2>
                            <p>${content.supportAnalysis}</p>
                        </section>

                        <!-- Verdict by Profile -->
                        <section class="content-block fade-in-up">
                            <h2>Notre verdict : qui choisir selon votre profil ?</h2>
                            <div class="verdict-by-profile">
                                <div class="profile-card">
                                    <h4><i class="fas fa-wallet" style="color:#D4AF37;margin-right:8px;"></i> Budget serre</h4>
                                    <p>${c.verdictBudget}</p>
                                </div>
                                <div class="profile-card">
                                    <h4><i class="fas fa-gem" style="color:#D4AF37;margin-right:8px;"></i> Qualite avant tout</h4>
                                    <p>${c.verdictQuality}</p>
                                </div>
                                <div class="profile-card">
                                    <h4><i class="fas fa-users" style="color:#D4AF37;margin-right:8px;"></i> Maximum de choix</h4>
                                    <p>${c.verdictChoice}</p>
                                </div>
                                <div class="profile-card">
                                    <h4><i class="fas fa-seedling" style="color:#D4AF37;margin-right:8px;"></i> Premier essai</h4>
                                    <p>${c.verdictBeginner}</p>
                                </div>
                            </div>
                        </section>

                        <!-- Detailed Review Links -->
                        <section class="content-block fade-in-up">
                            <h2>Lire les avis detailles</h2>
                            <p>Pour une analyse complete de chaque plateforme, consultez nos avis individuels :</p>
                            <ul>
                                <li><a href="/avis/${pA.slug}/">Avis complet ${pA.name} 2026</a></li>
                                <li><a href="/avis/${pB.slug}/">Avis complet ${pB.name} 2026</a></li>
                            </ul>
                        </section>

                        <!-- FAQ -->
                        <section class="faq-section fade-in-up">
                            <h3>Questions frequentes : ${pA.name} vs ${pB.name}</h3>
                            <div class="faq-list">
                                ${content.faq.map(f => `
                                <div class="faq-item">
                                    <button class="faq-question" aria-expanded="false">
                                        <span>${f.q}</span>
                                        <span class="faq-icon">+</span>
                                    </button>
                                    <div class="faq-answer">
                                        <p>${f.a}</p>
                                    </div>
                                </div>`).join('')}
                            </div>
                        </section>

                        <!-- CTA -->
                        <div class="verdict-box fade-in-up" style="margin-top:40px;">
                            <h3><i class="fas fa-rocket"></i> Notre recommandation</h3>
                            <p style="margin-bottom:20px;">Wengo est notre plateforme recommandee pour sa completude, ses avis verifies et son offre decouverte genereuse.</p>
                            ${ctaHtml}
                        </div>

                    </article>

                    <!-- Sidebar -->
                    <aside class="sidebar">
                        <div class="sidebar-sticky">
                            <div class="cta-box fade-in-right">
                                <h3><i class="fas fa-balance-scale icon-pulse"></i> Comparatif</h3>
                                <p style="margin:8px 0;"><strong>${pA.name}</strong> : ${pA.rating}/5</p>
                                <p style="margin:8px 0;"><strong>${pB.name}</strong> : ${pB.rating}/5</p>
                                <a href="javascript:void(0)" onclick="window.open(getAffiliateUrl(), '_blank'); return false;" data-affiliate="default" class="btn btn-gold btn-block">Essayer le mieux note</a>
                            </div>

                            <div class="pillar-link-box fade-in-right stagger-1">
                                <h4>Avis individuels</h4>
                                <a href="/avis/${pA.slug}/" class="pillar-link" style="display:block;margin-bottom:8px;">
                                    <i class="fas fa-arrow-right"></i> Avis ${pA.name}
                                </a>
                                <a href="/avis/${pB.slug}/" class="pillar-link" style="display:block;">
                                    <i class="fas fa-arrow-right"></i> Avis ${pB.name}
                                </a>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    </main>

    ${getFooter()}
</body>

</html>`;

    return html;
}


// ═══════════════════════════════════════════════════════════════════════════════
// GENERATE PILLAR PAGE (/avis/index.html)
// ═══════════════════════════════════════════════════════════════════════════════

function generatePillarPage() {
    const canonicalPath = '/avis/';
    const title = 'Top 10 des meilleurs sites de voyance en ligne 2026 : comparatif et avis';
    const metaDesc = 'Top 10 des meilleurs sites de voyance en ligne en 2026. Avis verifies, tarifs, avantages et inconvenients de chaque plateforme. Guide complet pour bien choisir.';

    const sortedPlatforms = [...platforms].sort((a, b) => b.rating - a.rating);

    const pillarFaq = [
        { q: "Quel est le meilleur site de voyance en ligne en 2026 ?", a: "Wengo est notre choix numero 1 grace a son panel de 500 voyants, ses avis verifies et ses 10 minutes offertes." },
        { q: "Les sites de voyance en ligne sont-ils fiables ?", a: "Les plateformes serieuses avec avis verifies et voyants selectionnes offrent un service fiable. Mefiez-vous des sites sans transparence." },
        { q: "Combien coute une consultation de voyance en ligne ?", a: "Les tarifs varient de 1,90 a 5,50 euros par minute selon la plateforme et le voyant choisi." },
        { q: "Peut-on essayer la voyance en ligne gratuitement ?", a: "Oui, la plupart des plateformes offrent entre 3 et 10 minutes gratuites aux nouveaux inscrits." },
        { q: "Comment choisir le bon site de voyance ?", a: "Verifiez les avis, comparez les tarifs, testez avec les minutes offertes et choisissez un site avec un panel de voyants diversifie." }
    ];

    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Accueil", "item": `${SITE_URL}/` },
                    { "@type": "ListItem", "position": 2, "name": "Avis & Comparatifs", "item": `${SITE_URL}${canonicalPath}` }
                ]
            },
            {
                "@type": "Article",
                "headline": title,
                "author": { "@type": "Organization", "name": "France Voyance Avenir" },
                "datePublished": "2026-01-10",
                "dateModified": "2026-02-01"
            },
            {
                "@type": "ItemList",
                "itemListElement": sortedPlatforms.map((p, i) => ({
                    "@type": "ListItem",
                    "position": i + 1,
                    "name": p.name,
                    "url": `${SITE_URL}/avis/${p.slug}/`
                }))
            },
            {
                "@type": "FAQPage",
                "mainEntity": pillarFaq.map(f => ({
                    "@type": "Question",
                    "name": f.q,
                    "acceptedAnswer": { "@type": "Answer", "text": f.a }
                }))
            }
        ]
    };

    const wengo = getPlatform('wengo');

    const html = `${getHead(title, metaDesc, canonicalPath, schema)}

<body>
    ${getHeader()}

    <main>
        <!-- Breadcrumbs -->
        <nav class="breadcrumbs" aria-label="Fil d'Ariane">
            <div class="container">
                <a href="/">Accueil</a>
                <span class="separator">&rsaquo;</span>
                <span class="current">Avis & Comparatifs</span>
            </div>
        </nav>

        <!-- Hero -->
        <section class="local-hero">
            <div class="container">
                <h1 class="fade-in-up">Top 10 des meilleurs sites de voyance en ligne en 2026</h1>
                <p class="hero-subtitle fade-in-up stagger-1">Comparatif independant des plateformes de voyance : avis, tarifs et classement</p>
            </div>
        </section>

        <!-- Content -->
        <section class="content-section">
            <div class="container">
                <div class="content-grid">
                    <article class="main-content">

                        <!-- Introduction -->
                        <section class="content-block fade-in-up">
                            <h2>Comment nous evaluons les sites de voyance en ligne</h2>
                            <p>Avec des dizaines de plateformes de voyance en ligne disponibles en France, il n'est pas toujours facile de s'y retrouver. Certaines misent sur le volume de voyants, d'autres sur la selection, d'autres encore sur les prix bas. Notre equipe a teste et analyse les principales plateformes du marche pour vous aider a faire le bon choix.</p>
                            <p>Ce comparatif est base sur plusieurs semaines de tests reels, l'analyse de milliers d'avis clients et une evaluation methodique de chaque critere : tarifs, qualite des voyants, ergonomie, disponibilite, service client et transparence des avis. Nous ne sommes pas sponsorises par les plateformes et nous n'hesitons pas a souligner les points faibles de chacune.</p>
                        </section>

                        <!-- Global Ranking Table -->
                        <section class="content-block fade-in-up">
                            <h2>Top 10 : classement des meilleurs sites de voyance 2026</h2>
                            <div class="table-responsive">
                            <table class="ranking-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Plateforme</th>
                                        <th>Note</th>
                                        <th>Tarifs</th>
                                        <th>Voyants</th>
                                        <th>Offre decouverte</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${sortedPlatforms.map((p, i) => `
                                    <tr>
                                        <td><strong>${i + 1}</strong></td>
                                        <td><a href="/avis/${p.slug}/" style="color:#D4AF37;font-weight:600;">${p.name}</a></td>
                                        <td><span class="star-rating">${starsHTML(p.rating)}</span> ${p.rating}/5</td>
                                        <td>${p.priceRange}</td>
                                        <td>${p.nbPractitioners}</td>
                                        <td>${p.freeOffer}</td>
                                    </tr>`).join('')}
                                </tbody>
                            </table>
                            </div>
                        </section>

                        <!-- Platform Summaries -->
                        ${sortedPlatforms.map((p, i) => `
                        <section class="content-block fade-in-up">
                            <h2>${i + 1}. ${p.name} - ${p.rating}/5</h2>
                            <div class="platform-card">
                                <h3><span class="star-rating">${starsHTML(p.rating)}</span> ${p.name} (${p.yearFounded})</h3>
                                <div class="card-rating">${p.rating}/5 sur ${p.ratingCount.toLocaleString('fr-FR')} avis</div>
                                <p><strong>Tarifs :</strong> ${p.priceRange} | <strong>Voyants :</strong> ${p.nbPractitioners} | <strong>Disponibilite :</strong> ${p.availability}</p>
                                <p>${p.verdict}</p>
                                <p><strong>Ideal pour :</strong> ${p.bestFor}</p>
                                <p style="margin-top:12px;"><a href="/avis/${p.slug}/" class="btn btn-gold" style="display:inline-block;">Lire l'avis complet ${p.name}</a></p>
                            </div>
                        </section>`).join('')}

                        <!-- How We Evaluate -->
                        <section class="content-block fade-in-up">
                            <h2>Nos criteres d'evaluation</h2>
                            <p>Pour etablir ce classement, nous evaluons chaque plateforme selon six criteres principaux, chacun pondere de maniere egale dans la note finale.</p>
                            <div class="criteria-grid">
                                <div class="criteria-card">
                                    <h4><i class="fas fa-euro-sign"></i> Tarifs et rapport qualite-prix</h4>
                                    <p>Nous comparons les fourchettes de prix, les offres de bienvenue et les modes de paiement proposes.</p>
                                </div>
                                <div class="criteria-card">
                                    <h4><i class="fas fa-user-check"></i> Qualite des voyants</h4>
                                    <p>Nous evaluons le processus de selection, les specialites proposees et la precision des consultations.</p>
                                </div>
                                <div class="criteria-card">
                                    <h4><i class="fas fa-laptop"></i> Ergonomie et interface</h4>
                                    <p>Nous testons la navigation, l'experience mobile et la facilite de mise en relation avec un voyant.</p>
                                </div>
                                <div class="criteria-card">
                                    <h4><i class="fas fa-clock"></i> Disponibilite</h4>
                                    <p>Nous verifions les horaires d'ouverture, le nombre de voyants en ligne et les canaux de consultation.</p>
                                </div>
                                <div class="criteria-card">
                                    <h4><i class="fas fa-headset"></i> Service client</h4>
                                    <p>Nous testons la reactivite du support, la gestion des litiges et la politique de remboursement.</p>
                                </div>
                                <div class="criteria-card">
                                    <h4><i class="fas fa-shield-alt"></i> Transparence et avis</h4>
                                    <p>Nous analysons le systeme d'avis clients, la verification des temoignages et la transparence globale.</p>
                                </div>
                            </div>
                        </section>

                        <!-- Links to All Reviews & Comparisons -->
                        <section class="content-block fade-in-up">
                            <h2>Tous nos avis et comparatifs</h2>

                            <h3 style="margin-top:20px;">Avis individuels</h3>
                            <div class="hub-links">
                                ${platforms.map(p => `<a href="/avis/${p.slug}/" class="hub-link"><i class="fas fa-star"></i> Avis ${p.name} 2026</a>`).join('\n                                ')}
                            </div>

                            <h3 style="margin-top:25px;">Comparatifs</h3>
                            <div class="hub-links">
                                ${comparisons.map(c => {
                                    const pA = getPlatform(c.platformA);
                                    const pB = getPlatform(c.platformB);
                                    return `<a href="/avis/${c.slug}/" class="hub-link"><i class="fas fa-balance-scale"></i> ${pA.name} vs ${pB.name}</a>`;
                                }).join('\n                                ')}
                            </div>
                        </section>

                        <!-- FAQ -->
                        <section class="faq-section fade-in-up">
                            <h3>Questions frequentes sur les sites de voyance en ligne</h3>
                            <div class="faq-list">
                                ${pillarFaq.map(f => `
                                <div class="faq-item">
                                    <button class="faq-question" aria-expanded="false">
                                        <span>${f.q}</span>
                                        <span class="faq-icon">+</span>
                                    </button>
                                    <div class="faq-answer">
                                        <p>${f.a}</p>
                                    </div>
                                </div>`).join('')}
                            </div>
                        </section>

                        <!-- CTA -->
                        <div class="verdict-box fade-in-up" style="margin-top:40px;">
                            <h3><i class="fas fa-trophy"></i> Notre choix #1 : Wengo</h3>
                            <div class="verdict-score">${wengo.rating}/5</div>
                            <div class="star-rating" style="font-size:1.5em;margin:10px 0;">${starsHTML(wengo.rating)}</div>
                            <p style="margin-bottom:20px;">${wengo.verdict}</p>
                            <a href="javascript:void(0)" onclick="window.open(getAffiliateUrl(), '_blank'); return false;" data-affiliate="default" class="btn btn-gold btn-xl"><i class="fas fa-star"></i> Essayer Wengo - ${wengo.freeOffer}</a>
                        </div>

                    </article>

                    <!-- Sidebar -->
                    <aside class="sidebar">
                        <div class="sidebar-sticky">
                            <div class="cta-box fade-in-right">
                                <h3><i class="fas fa-trophy icon-pulse"></i> Top 1 : Wengo</h3>
                                <div class="star-rating" style="margin:8px 0;">${starsHTML(wengo.rating)}</div>
                                <p>${wengo.rating}/5 - ${wengo.ratingCount.toLocaleString('fr-FR')} avis</p>
                                <p style="font-size:0.9em;margin:8px 0;">${wengo.freeOffer}</p>
                                <a href="javascript:void(0)" onclick="window.open(getAffiliateUrl(), '_blank'); return false;" data-affiliate="default" class="btn btn-gold btn-block">Essayer Wengo</a>
                            </div>

                            <div class="pillar-link-box fade-in-right stagger-1">
                                <h4>Acces rapide</h4>
                                ${sortedPlatforms.map(p => `
                                <a href="/avis/${p.slug}/" class="pillar-link" style="display:block;margin-bottom:6px;">
                                    <i class="fas fa-arrow-right"></i> Avis ${p.name}
                                </a>`).join('')}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    </main>

    ${getFooter()}
</body>

</html>`;

    return html;
}


// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXECUTION
// ═══════════════════════════════════════════════════════════════════════════════

let pagesGenerated = 0;
const totalPages = platforms.length + comparisons.length + 1;

console.log(`\nAvis Pages Generator`);
console.log(`${platforms.length} reviews + ${comparisons.length} comparisons + 1 pillar = ${totalPages} pages\n`);

// 1. Generate individual review pages
console.log('Generating individual review pages...');
for (const platform of platforms) {
    const dirPath = path.join(outputDir, platform.slug);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

    const html = generateReviewPage(platform);
    fs.writeFileSync(path.join(dirPath, 'index.html'), html, 'utf8');
    pagesGenerated++;
    console.log(`  [OK] /avis/${platform.slug}/index.html`);
}

// 2. Generate comparison pages
console.log('\nGenerating comparison pages...');
for (const comparison of comparisons) {
    const dirPath = path.join(outputDir, comparison.slug);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

    const html = generateComparisonPage(comparison);
    fs.writeFileSync(path.join(dirPath, 'index.html'), html, 'utf8');
    pagesGenerated++;
    console.log(`  [OK] /avis/${comparison.slug}/index.html`);
}

// 3. Generate pillar page
console.log('\nGenerating pillar page...');
const pillarHtml = generatePillarPage();
fs.writeFileSync(path.join(outputDir, 'index.html'), pillarHtml, 'utf8');
pagesGenerated++;
console.log('  [OK] /avis/index.html');

console.log(`\nDone! Generated ${pagesGenerated} pages in /avis/\n`);
