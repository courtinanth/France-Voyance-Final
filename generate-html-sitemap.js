/**
 * HTML Sitemap Generator for France Voyance Avenir
 * Generates plan-du-site/index.html with all pages including 372 local SEO pages
 * Usage: node generate-html-sitemap.js
 */

const fs = require('fs');
const path = require('path');

const baseUrl = 'https://france-voyance-avenir.fr';
function b64(s) { return Buffer.from(s).toString("base64"); }
const outputDir = path.join(__dirname, 'plan-du-site');
const villesDir = path.join(__dirname, 'villes');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Core Pages Structure (categorized)
const coreSections = [
    {
        title: "Pages Principales",
        icon: "fa-star",
        links: [
            { text: "Accueil", url: "/" },
            { text: "Voyance Gratuite", url: "/voyance-gratuite/" },
            { text: "Avis Clients", url: "/avis/" },
            { text: "Le Blog", url: "/blog/" },
            { text: "Contact", url: "/contact/" }
        ]
    },
    {
        title: "Arts Divinatoires",
        icon: "fa-eye",
        links: [
            { text: "Tous les arts divinatoires", url: "/arts-divinatoires/" },
            { text: "Voyance Pendule", url: "/arts-divinatoires/pendule/" },
            { text: "Oracle Belline", url: "/arts-divinatoires/oracle-belline/" },
            { text: "Oracle Gé", url: "/arts-divinatoires/oracle-ge/" },
            { text: "Tirage Runes", url: "/arts-divinatoires/runes/" },
            { text: "Cartomancie", url: "/arts-divinatoires/cartomancie/" },
            { text: "Tirage Oui/Non", url: "/arts-divinatoires/tirage-oui-non/" }
        ]
    },
    {
        title: "Outils de Voyance Gratuite",
        icon: "fa-magic",
        links: [
            { text: "Tarot Gratuit", url: "/voyance-gratuite/tarot-gratuit/" },
            { text: "Tarot Amour", url: "/voyance-gratuite/tarot-d-amour/" },
            { text: "Numérologie Gratuite", url: "/voyance-gratuite/numerologie-gratuite/" },
            { text: "Pendule Oui/Non", url: "/voyance-gratuite/pendule-oui-non/" },
            { text: "Tarot Oui/Non", url: "/voyance-gratuite/tarot-oui-non/" }
        ]
    },
    {
        title: "Consultations Spécialisées",
        icon: "fa-user-check",
        links: [
            { text: "Consultations Voyance", url: "/consultations/" },
            { text: "Amour & Retour Affectif", url: "/consultations/amour-retour-affectif/" },
            { text: "Flamme Jumelle", url: "/consultations/flamme-jumelle/" },
            { text: "Medium & Défunts", url: "/consultations/medium-defunts/" },
            { text: "Travail & Carrière", url: "/consultations/travail-carriere/" },
            { text: "Argent & Finances", url: "/consultations/argent-finances/" }
        ]
    },
    {
        title: "Modes de Consultation",
        icon: "fa-phone",
        links: [
            { text: "Voyance par Téléphone", url: "/consulter/voyance-telephone/" },
            { text: "Voyance par SMS", url: "/consulter/voyance-sms/" },
            { text: "Voyance par Chat", url: "/consulter/voyance-chat/" },
            { text: "Voyance Audiotel", url: "/consulter/voyance-audiotel/" }
        ]
    },
    {
        title: "Informations Légales",
        icon: "fa-scale-balanced",
        links: [
            { text: "Mentions Légales", url: "/legal/mentions-legales/" },
            { text: "CGU", url: "/legal/cgu/" },
            { text: "Politique de Confidentialité", url: "/legal/politique-confidentialite/" },
            { text: "Politique des Cookies", url: "/legal/politique-cookies/" },
            { text: "Plan du site", url: "/plan-du-site/" }
        ]
    }
];

// === Load platforms data for Avis/Comparatifs sections ===
const platformsDataPath = path.join(__dirname, 'data', 'platforms.json');
const platformsData = JSON.parse(fs.readFileSync(platformsDataPath, 'utf8'));

// Build Avis & Comparatifs sections
const avisSections = [
    {
        title: "Avis Plateformes",
        icon: "fa-star-half-alt",
        links: [
            { text: "Tous les avis", url: "/avis/" },
            ...platformsData.platforms.map(p => ({
                text: `Avis ${p.name}`,
                url: `/avis/${p.slug}/`
            }))
        ]
    },
    {
        title: "Comparatifs",
        icon: "fa-balance-scale",
        links: [
            { text: "Tous les comparatifs", url: "/comparatif/" },
            ...platformsData.comparisons.slice(0, 15).map(c => ({
                text: `${platformsData.platforms.find(p=>p.slug===c.platformA)?.name || c.platformA} vs ${platformsData.platforms.find(p=>p.slug===c.platformB)?.name || c.platformB}`,
                url: `/avis/${c.slug}/`
            }))
        ]
    },
    {
        title: "Alternatives",
        icon: "fa-exchange-alt",
        links: platformsData.platforms.map(p => ({
            text: `Alternatives à ${p.name}`,
            url: `/alternatives/${p.slug}/`
        }))
    }
];

// === Get Local Pages and Group by Letter (FIX: scan directories, not .html files) ===
console.log("Scanning local pages...");
const localDirs = fs.readdirSync(villesDir).filter(f => {
    const fullPath = path.join(villesDir, f);
    return fs.statSync(fullPath).isDirectory() && fs.existsSync(path.join(fullPath, 'index.html'));
});

const citiesDataPath = path.join(__dirname, 'data', 'cities.json');
const { cities, services } = JSON.parse(fs.readFileSync(citiesDataPath, 'utf8'));

const cityMap = new Map();
cities.forEach(city => { cityMap.set(city.slug, city); });

const serviceMap = new Map();
services.forEach(service => { serviceMap.set(service.slug, service); });

const cityGroups = {};

localDirs.forEach(dirName => {
    let matchedService = null;
    let citySlug = '';

    for (const service of services) {
        if (dirName.startsWith(service.slug + '-')) {
            matchedService = service;
            citySlug = dirName.substring(service.slug.length + 1);
            break;
        }
    }

    if (matchedService && citySlug) {
        const cityData = cityMap.get(citySlug);
        if (cityData) {
            const letter = cityData.name.charAt(0).toUpperCase();
            if (!cityGroups[letter]) {
                cityGroups[letter] = [];
            }

            cityGroups[letter].push({
                text: `${matchedService.name} à ${cityData.name}`,
                url: `/villes/${dirName}/`,
                city: cityData.name
            });
        }
    }
});

// Sort letters
const sortedLetters = Object.keys(cityGroups).sort();

// Sort links within each letter
sortedLetters.forEach(letter => {
    cityGroups[letter].sort((a, b) => a.text.localeCompare(b.text));
});


// Generate HTML content
let htmlContent = '';

// 1. Core Pages Section
htmlContent += `
    <section class="section-padding">
        <div class="container">
            <h2 class="text-center mb-5 fade-in-up">Structure du Site</h2>
            <div class="sitemap-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px;">
`;

coreSections.forEach((section, index) => {
    htmlContent += `
                <div class="sitemap-col fade-in-up stagger-${index % 3}">
                    <h3 style="color: var(--color-secondary); border-bottom: 2px solid var(--color-secondary); padding-bottom: 10px; margin-bottom: 20px;">
                        <i class="fa-solid ${section.icon}" style="margin-right: 10px;"></i>${section.title}
                    </h3>
                    <ul class="sitemap-list" style="list-style: none; padding-left: 0;">
    `;

    section.links.forEach(link => {
        htmlContent += `
                        <li style="margin-bottom: 10px;">
                            <a href="${link.url}" style="color: var(--color-text-main); text-decoration: none; transition: all 0.3s; display: flex; align-items: center;">
                                <i class="fa-solid fa-chevron-right" style="margin-right: 10px; color: var(--color-secondary); font-size: 0.8em;"></i>
                                <span class="hover-underline">${link.text}</span>
                            </a>
                        </li>
        `;
    });

    htmlContent += `
                    </ul>
                </div>
    `;
});

htmlContent += `
            </div>
        </div>
    </section>
`;

// 2. Avis, Comparatifs & Alternatives Section
htmlContent += `
    <section class="section-padding" style="background: rgba(255, 255, 255, 0.02);">
        <div class="container">
            <h2 class="text-center mb-5 fade-in-up">Avis, Comparatifs & Alternatives</h2>
            <div class="sitemap-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px;">
`;

avisSections.forEach((section, index) => {
    htmlContent += `
                <div class="sitemap-col fade-in-up stagger-${index % 3}">
                    <h3 style="color: var(--color-secondary); border-bottom: 2px solid var(--color-secondary); padding-bottom: 10px; margin-bottom: 20px;">
                        <i class="fa-solid ${section.icon}" style="margin-right: 10px;"></i>${section.title}
                    </h3>
                    <ul class="sitemap-list" style="list-style: none; padding-left: 0;">
    `;

    section.links.forEach(link => {
        htmlContent += `
                        <li style="margin-bottom: 10px;">
                            <a href="${link.url}" style="color: var(--color-text-main); text-decoration: none; transition: all 0.3s; display: flex; align-items: center;">
                                <i class="fa-solid fa-chevron-right" style="margin-right: 10px; color: var(--color-secondary); font-size: 0.8em;"></i>
                                <span class="hover-underline">${link.text}</span>
                            </a>
                        </li>
        `;
    });

    htmlContent += `
                    </ul>
                </div>
    `;
});

htmlContent += `
            </div>
        </div>
    </section>
`;

// 3. Local Pages Section (Accordion by Letter)
htmlContent += `
    <section class="section-padding" style="background: rgba(255, 255, 255, 0.02);">
        <div class="container">
            <h2 class="text-center mb-5">Voyance par Ville</h2>
            <p class="text-center mb-5" style="max-width: 700px; margin: 0 auto 50px auto;">
                Retrouvez nos services de voyance, tarologie, médiumnité et astrologie dans plus de 300 villes en France.
            </p>
            
            <div class="city-index-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px;">
`;

sortedLetters.forEach((letter, index) => {
    const pages = cityGroups[letter];
    const delay = index % 5;

    htmlContent += `
        <div class="city-group">
            <h3 class="city-letter" style="color: var(--color-secondary); font-size: 2rem; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 15px; padding-bottom: 5px;">${letter}</h3>
            <ul style="list-style: none; padding: 0;">
    `;

    pages.forEach(page => {
        htmlContent += `
                <li style="margin-bottom: 8px;">
                    <a href="${page.url}" style="color:#d8d8d8; text-decoration: none; font-size: 0.9rem; transition: color 0.2s;">
                        ${page.text}
                    </a>
                </li>
        `;
    });

    htmlContent += `
            </ul>
        </div>
    `;
});

htmlContent += `
            </div>
        </div>
    </section>
`;


// Full Page Template
const fullHtml = `<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Plan du site - France Voyance Avenir</title>
    <meta name="description" content="Plan du site complet de France Voyance Avenir. Accédez facilement à toutes nos pages : consultations, voyance gratuite, blog, et services par ville.">
    <meta name="robots" content="noindex"> <!-- Sitemap page often noindex to prefer actual pages, but user might want index. Let's keep minimal or remove if desired. Keeping default usually ok, but 'noindex' prevents it from cluttering SERP snippets usually. -->
    
    <link rel="icon" href="/images/favicon.png" type="image/png">
    <link rel="canonical" href="https://france-voyance-avenir.fr/plan-du-site/">

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

    <style>
        .hover-underline:hover {
            color: var(--color-secondary);
            text-decoration: underline;
        }
        .city-group a:hover {
            color: var(--color-secondary) !important;
            padding-left: 5px;
        }
    </style>
</head>

<body>
    <div class="stars-container"></div>
    
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
                            <li><a href="/voyance-gratuite/numerologie-gratuite/">Numérologie Gratuite</a></li>
                            <li><a href="/voyance-gratuite/pendule-oui-non/">Pendule Oui/Non</a></li>
                            <li><a href="/voyance-gratuite/tarot-oui-non/">Tarot Oui/Non</a></li>
                        </ul>
                    </li>

                    <li class="nav-item">
                        <a href="#" class="nav-link">Arts Divinatoires <i class="fa-solid fa-chevron-down" style="font-size: 0.7em;"></i></a>
                        <ul class="dropdown-menu">
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
                            <li><a href="/consultations/medium-defunts/">Medium & Défunts</a></li>
                            <li><a href="/consultations/travail-carriere/">Travail & Carrière</a></li>
                            <li><a href="/consultations/argent-finances/">Argent & Finances</a></li>
                        </ul>
                    </li>

                    <li class="nav-item">
                        <a href="#" class="nav-link">Consulter <i class="fa-solid fa-chevron-down" style="font-size: 0.7em;"></i></a>
                        <ul class="dropdown-menu">
                            <li><a href="/consulter/voyance-telephone/">Voyance Téléphone</a></li>
                            <li><a href="/consulter/voyance-sms/">Voyance SMS</a></li>
                            <li><a href="/consulter/voyance-chat/">Voyance Chat</a></li>
                            <li><a href="/consulter/voyance-audiotel/">Voyance Audiotel</a></li>
                        </ul>
                    </li>

                    <li class="nav-item"><a href="/avis/" class="nav-link">Avis & Comparatifs</a></li>
                </ul>

                <div class="header-cta text-center mt-3 mt-lg-0 ml-lg-4">
                    <a href="javascript:void(0)" onclick="window.open(getAffiliateUrl(), '_blank'); return false;" class="btn btn-gold" data-affiliate="voyance-telephone">Consultation Immédiate</a>
                </div>
            </nav>
        </div>
    </header>

    <main>
        <!-- Hero Section -->
        <section class="hero" style="min-height: 40vh; display: flex; align-items: center; justify-content: center; text-align: center;">
            <div class="container">
                <h1 class="reveal">Plan du Site</h1>
                <p class="reveal reveal-delay-1">Retrouvez toutes les pages de France Voyance Avenir en un clin d'œil.</p>
            </div>
        </section>

        <!-- SITEMAP CONTENT -->
        ${htmlContent}

    </main>

    <!-- FOOTER -->
    <footer class="site-footer">
        <div class="container">
            <div class="footer-grid">

                <!-- Col 1: A propos -->
                <div class="footer-col">
                    <div class="logo" style="margin-bottom: 20px;">
                        <i class="fa-solid fa-moon"></i> France Voyance Avenir
                    </div>
                    <p>Votre guide vers les arts divinatoires. Trouvez le voyant qui vous correspond parmi notre sélection de professionnels vérifiés.</p>
                </div>

                <!-- Col 2: Navigation Rapide -->
                <div class="footer-col">
                    <h4>Navigation Rapide</h4>
                    <ul class="footer-links">
                        <li><a href="/consulter/voyance-telephone/">Voyance Téléphone</a></li>
                        <li><a href="/voyance-gratuite/">Voyance Gratuite</a></li>
                        <li><a href="/voyance-gratuite/tarot-d-amour/">Tarot Amour</a></li>
                        <li><a href="/arts-divinatoires/">Horoscope du jour</a></li>
                        <li><a href="/voyance-gratuite/numerologie-gratuite/">Numérologie</a></li>
                        <li><a href="/blog/">Le Blog</a></li>
                    </ul>
                </div>

                <!-- Col 3: Informations -->
                <div class="footer-col">
                    <h4>Informations</h4>
                    <ul class="footer-links">
                        <li><span class="obf-link" data-o="${b64('/legal/mentions-legales/')}" role="link" tabindex="0">Mentions Légales</span></li>
                        <li><span class="obf-link" data-o="${b64('/legal/politique-confidentialite/')}" role="link" tabindex="0">Politique de Confidentialité</span></li>
                        <li><span class="obf-link" data-o="${b64('/legal/politique-cookies/')}" role="link" tabindex="0">Politique des Cookies</span></li>
                        <li><span class="obf-link" data-o="${b64('/legal/cgu/')}" role="link" tabindex="0">CGU</span></li>
                        <li><a href="/contact/">Contact</a></li>
                        <li><a href="/plan-du-site/">Plan du site</a></li>
                    </ul>
                </div>

                <!-- Col 4: Contact -->
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
                <p>&copy; 2026 France Voyance Avenir - Tous droits réservés</p>
                <div class="disclaimer">
                    Ce site propose des services de divertissement. Les consultations de voyance ne remplacent pas un avis médical, juridique ou financier professionnel.
                </div>
                <p class="affiliate-disclosure">
                    * Ce site contient des liens affiliés. En cliquant sur ces liens et en effectuant un achat, nous pouvons recevoir une commission sans frais supplémentaires pour vous. Cela nous aide à maintenir ce site gratuit.
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

    <script>document.addEventListener('click',function(e){if(e.target.classList.contains('obf-link')||e.target.closest('.obf-link')){var el=e.target.classList.contains('obf-link')?e.target:e.target.closest('.obf-link');window.location.href=atob(el.getAttribute('data-o'));}});</script>
    <script src="/js/animations.js" defer></script>
    <script src="/js/main.js?v=2026"></script>
</body>

</html>`;

fs.writeFileSync(path.join(outputDir, 'index.html'), fullHtml);
console.log(`✅ Plan du site generated successfully at plan-du-site/index.html`);
