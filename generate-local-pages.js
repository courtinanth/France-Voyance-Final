/**
 * Local SEO Pages Generator v2
 * Generates 372 pages (93 cities × 4 services) for France Voyance Avenir
 * Uses EXACT same header/footer as homepage for consistency
 */

const fs = require('fs');
const path = require('path');

// Load city data
const dataPath = path.join(__dirname, 'data', 'cities.json');
const { cities, services } = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Output directory
const outputDir = path.join(__dirname, 'villes');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// H2 question templates with variants
const h2Templates = [
    [
        "Pourquoi consulter un voyant pour {service_lower} à {city} ?",
        "Quels sont les avantages d'une consultation de {service_lower} à {city} ?",
        "Comment la {service_lower} peut-elle vous guider à {city} ?",
        "Que peut vous apporter une séance de {service_lower} à {city} ?"
    ],
    [
        "Comment se déroule une consultation de {service_lower} à {city} ?",
        "À quoi s'attendre lors d'une séance de {service_lower} à {city} ?",
        "Quel est le déroulement d'une consultation de {service_lower} à {city} ?",
        "Comment fonctionne la {service_lower} à {city} ?"
    ],
    [
        "Quels thèmes aborder en {service_lower} près de {landmark} ?",
        "Sur quels sujets interroger un voyant à {city} ?",
        "Quelles questions poser lors de votre {service_lower} à {city} ?",
        "Quels domaines de vie explorer en {service_lower} à {city} ?"
    ],
    [
        "Comment choisir le bon voyant pour une {service_lower} à {city} ?",
        "Quels critères pour sélectionner un voyant de {service_lower} à {city} ?",
        "Comment trouver un voyant de confiance pour {service_lower} à {city} ?",
        "Quelles qualités rechercher chez un voyant à {city} ?"
    ]
];

// Content paragraph templates
const contentTemplates = {
    section1: [
        `À {city}, {specificity}, de nombreux habitants cherchent des réponses à leurs questions les plus profondes. La {service_lower} offre une guidance précieuse pour éclairer votre chemin de vie. Que vous résidiez près de {monument} ou dans un autre quartier, nos voyants experts sont disponibles pour vous accompagner.`,
        `Les habitants de {city} peuvent désormais accéder à des consultations de {service_lower} de qualité. Située en {region}, cette ville dynamique abrite une communauté ouverte aux arts divinatoires. Nos médiums qualifiés vous guident avec bienveillance et professionnalisme.`,
        `Depuis {monument}, symbole de {city}, jusqu'aux quartiers les plus éloignés, notre service de {service_lower} est accessible à tous. Profitez d'une consultation personnalisée adaptée à vos besoins spécifiques.`
    ],
    section2: [
        `Votre consultation de {service_lower} à {city} commence par une mise en connexion énergétique. Le voyant se concentre sur votre aura et vos vibrations pour établir un lien spirituel profond. Ensuite, vous pouvez poser vos questions et recevoir des réponses claires et bienveillantes.`,
        `Que vous soyez près de {landmark} ou ailleurs dans la ville, le déroulement reste le même : accueil, écoute, lecture puis interprétation. Nos voyants prennent le temps de vous expliquer chaque symbole et chaque message reçu.`,
        `À {city}, comme partout en France, nos consultations suivent un protocole rigoureux garantissant qualité et confidentialité. Chaque séance est unique et adaptée à votre situation personnelle.`
    ],
    section3: [
        `Lors de votre {service_lower} à {city}, explorez toutes les facettes de votre vie : amour, travail, famille, finances. Près de {monument}, les énergies spirituelles sont particulièrement propices aux révélations profondes.`,
        `Les consultants de {city} nous interrogent souvent sur leurs relations sentimentales, leur évolution professionnelle ou leurs projets de vie. Tous ces thèmes peuvent être abordés lors de votre séance.`,
        `Dans cette ville où {specificity}, les questions existentielles trouvent un écho particulier. Nos voyants vous aident à démêler les fils de votre destin avec précision et compassion.`
    ],
    section4: [
        `Pour votre {service_lower} à {city}, choisissez un voyant dont le profil vous inspire confiance. Consultez les avis, les spécialités et l'expérience de chaque praticien disponible sur notre plateforme.`,
        `À {city}, nous proposons une sélection de voyants vérifiés et expérimentés. Chacun possède des dons particuliers : tarologie, médiumnité, astrologie. Trouvez celui qui correspond à vos attentes.`,
        `Que vous habitiez près de {landmark} ou dans un autre secteur de {city}, nos voyants sont disponibles pour vous. Leur écoute bienveillante et leur expertise vous aideront à avancer sereinement.`
    ]
};

// FAQ questions and answers
const faqTemplates = [
    {
        question: "La {service_lower} à {city} est-elle fiable ?",
        answer: "Oui, nos voyants sont rigoureusement sélectionnés et testés. Nous garantissons des consultations de qualité pour tous les habitants de {city} et sa région ({region})."
    },
    {
        question: "Comment réserver une consultation de {service_lower} à {city} ?",
        answer: "Cliquez sur le bouton \"Consulter maintenant\", choisissez votre voyant et démarrez immédiatement votre consultation. Le service est disponible 24h/24 pour {city} et toute la France."
    },
    {
        question: "Combien coûte une {service_lower} à {city} ?",
        answer: "Les tarifs varient selon les voyants et la durée. Nous proposons également des premières minutes offertes pour découvrir nos services sans engagement."
    }
];

// Generate random variant
function getRandomVariant(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Replace placeholders in template
function fillTemplate(template, replacements) {
    let result = template;
    for (const [key, value] of Object.entries(replacements)) {
        result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    }
    return result;
}

// Get nearby cities (same region or random selection)
function getNearbyCities(currentCity, cities, count = 6) {
    const sameRegion = cities.filter(c =>
        c.region === currentCity.region && c.slug !== currentCity.slug
    );

    if (sameRegion.length >= count) {
        return sameRegion.slice(0, count);
    }

    const otherCities = cities.filter(c =>
        c.slug !== currentCity.slug && !sameRegion.includes(c)
    );

    const shuffled = otherCities.sort(() => Math.random() - 0.5);
    const needed = count - sameRegion.length;

    return [...sameRegion, ...shuffled.slice(0, needed)];
}

// Generate HTML for a single page
function generatePage(city, service) {
    const replacements = {
        city: city.name,
        city_slug: city.slug,
        postal_code: city.postalCode,
        region: city.region,
        monument: city.monument,
        landmark: city.landmark,
        specificity: city.specificity,
        service: service.name,
        service_lower: service.name.toLowerCase(),
        service_slug: service.slug,
        pillar_page: service.pillarPage,
        icon: service.icon
    };

    // Generate H2s
    const h2s = h2Templates.map(variants => fillTemplate(getRandomVariant(variants), replacements));

    // Generate content
    const sections = [
        fillTemplate(getRandomVariant(contentTemplates.section1), replacements),
        fillTemplate(getRandomVariant(contentTemplates.section2), replacements),
        fillTemplate(getRandomVariant(contentTemplates.section3), replacements),
        fillTemplate(getRandomVariant(contentTemplates.section4), replacements)
    ];

    // Generate FAQs
    const faqs = faqTemplates.map(faq => ({
        question: fillTemplate(faq.question, replacements),
        answer: fillTemplate(faq.answer, replacements)
    }));

    // Build other services links
    const otherServices = services
        .filter(s => s.slug !== service.slug)
        .map(s => `<a href="/villes/${s.slug}-${city.slug}.html" class="internal-link">${s.name} à ${city.name}</a>`)
        .join('\n                                ');

    // Build nearby cities links (same service, different cities)
    const nearbyCities = getNearbyCities(city, cities, 6)
        .map(c => `<a href="/villes/${service.slug}-${c.slug}.html" class="internal-link">${service.name} à ${c.name}</a>`)
        .join('\n                                ');

    // Google Maps embed URL
    const mapsUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Mairie+${encodeURIComponent(city.name)},France&zoom=13`;

    const html = `<!DOCTYPE html>
<html lang="fr" class="no-js">

<head>
    <script>document.documentElement.classList.remove('no-js');</script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${service.name} à ${city.name} (${city.postalCode}) | Voyance et Arts Divinatoires</title>
    <meta name="description"
        content="Consultez un voyant spécialisé en ${service.name.toLowerCase()} à ${city.name}. Guidance spirituelle et réponses à vos questions. Consultation immédiate disponible.">
    <link rel="canonical" href="https://france-voyance-avenir.fr/villes/${service.slug}-${city.slug}.html">
    <meta name="robots" content="index, follow">
    <link rel="icon" href="/images/favicon.png" type="image/png">

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap"
        rel="stylesheet">

    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="/css/style.css?v=2026">
    <link rel="stylesheet" href="/css/animations.css?v=2026">
    <script src="/js/config.js"></script>

    <!-- Schema JSON-LD -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://france-voyance-avenir.fr/" },
            { "@type": "ListItem", "position": 2, "name": "${service.name}", "item": "https://france-voyance-avenir.fr${service.pillarPage}" },
            { "@type": "ListItem", "position": 3, "name": "${city.name}", "item": "https://france-voyance-avenir.fr/villes/${service.slug}-${city.slug}.html" }
          ]
        },
        {
          "@type": "LocalBusiness",
          "name": "France Voyance Avenir - ${city.name}",
          "description": "${service.name} et consultation de voyance à ${city.name}",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "${city.name}",
            "postalCode": "${city.postalCode}",
            "addressRegion": "${city.region}",
            "addressCountry": "FR"
          },
          "areaServed": "${city.name}",
          "priceRange": "€€"
        },
        {
          "@type": "FAQPage",
          "mainEntity": [
            ${faqs.map(faq => `{
              "@type": "Question",
              "name": "${faq.question}",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "${faq.answer}"
              }
            }`).join(',\n            ')}
          ]
        }
      ]
    }
    </script>
</head>

<body>
    <div class="stars-container"></div>
    <div class="reading-progress-container">
        <div class="reading-progress-bar"></div>
    </div>

    <!-- HEADER - Same as Homepage -->
    <header class="site-header">
        <div class="container header-container">
            <a href="/" class="logo">
                <img src="/images/logo.svg" alt="France Voyance Avenir">
            </a>

            <div class="mobile-toggle">
                <i class="fa-solid fa-bars"></i>
            </div>

            <nav class="main-nav">
                <!-- Logo inside nav for desktop menu -->
                <a href="/" class="nav-logo">
                    <img src="/images/logo.svg" alt="France Voyance Avenir">
                </a>
                <ul>
                    <li class="nav-item"><a href="/" class="nav-link">Accueil</a></li>
                    <li class="nav-item">
                        <a href="/voyance-gratuite/" class="nav-link">Voyance Gratuite <i
                                class="fa-solid fa-chevron-down" style="font-size: 0.7em;"></i></a>
                        <ul class="dropdown-menu">
                            <li><a href="/voyance-gratuite/tarot-gratuit/">Tarot Gratuit</a></li>
                            <li><a href="/voyance-gratuite/tarot-d-amour/">Tarot Amour</a></li>
                            <li><a href="/voyance-gratuite/numerologie-gratuite/">Numérologie Gratuite</a></li>
                            <li><a href="/voyance-gratuite/pendule-oui-non/">Pendule Oui/Non</a></li>
                            <li><a href="/voyance-gratuite/tarot-oui-non/">Tarot Oui/Non</a></li>
                        </ul>
                    </li>

                    <li class="nav-item">
                        <a href="#" class="nav-link">Arts Divinatoires <i class="fa-solid fa-chevron-down"
                                style="font-size: 0.7em;"></i></a>
                        <ul class="dropdown-menu">
                            <li><a href="/arts-divinatoires/pendule/">Voyance Pendule</a></li>
                            <li><a href="/arts-divinatoires/oracle-belline/">Oracle Belline</a></li>
                            <li><a href="/arts-divinatoires/oracle-ge/">Oracle Gé</a></li>
                            <li><a href="/arts-divinatoires/runes/">Tirage Runes</a></li>
                            <li><a href="/arts-divinatoires/cartomancie/">Cartomancie</a></li>
                        </ul>
                    </li>

                    <li class="nav-item">
                        <a href="#" class="nav-link">Consultations <i class="fa-solid fa-chevron-down"
                                style="font-size: 0.7em;"></i></a>
                        <ul class="dropdown-menu">
                            <li><a href="/consultations/amour-retour-affectif/">Amour & Retour Affectif</a></li>
                            <li><a href="/consultations/flamme-jumelle/">Flamme Jumelle</a></li>
                            <li><a href="/consultations/medium-defunts/">Medium & Défunts</a></li>
                            <li><a href="/consultations/travail-carriere/">Travail & Carrière</a></li>
                            <li><a href="/consultations/argent-finances/">Argent & Finances</a></li>
                        </ul>
                    </li>

                    <li class="nav-item">
                        <a href="#" class="nav-link">Consulter <i class="fa-solid fa-chevron-down"
                                style="font-size: 0.7em;"></i></a>
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
                    <a href="javascript:void(0)" onclick="window.open(getAffiliateUrl(), '_blank'); return false;"
                        class="btn btn-gold" data-affiliate="voyance-telephone">Consultation Immédiate</a>
                </div>
            </nav>
        </div>
    </header>

    <main>
        <!-- Breadcrumbs -->
        <nav class="breadcrumbs" aria-label="Fil d'Ariane">
            <div class="container">
                <a href="/">Accueil</a>
                <span class="separator">›</span>
                <a href="${service.pillarPage}">${service.name}</a>
                <span class="separator">›</span>
                <span class="current">${city.name}</span>
            </div>
        </nav>

        <!-- Hero Section -->
        <section class="local-hero">
            <div class="container">
                <h1 class="fade-in-up">${service.name} à ${city.name}</h1>
                <p class="hero-subtitle fade-in-up stagger-1">
                    Consultez un voyant expert en ${service.name.toLowerCase()} à ${city.name} (${city.postalCode}), ${city.region}
                </p>
                <a href="javascript:void(0)" onclick="window.open(getAffiliateUrl(), '_blank'); return false;"
                    data-affiliate="telephone" class="btn btn-gold btn-xl icon-pulse fade-in-up stagger-2">
                    <i class="fas fa-${service.icon}"></i> Consulter maintenant
                </a>
            </div>
        </section>

        <!-- Main Content -->
        <section class="content-section">
            <div class="container">
                <div class="content-grid">
                    <article class="main-content">
                        <section class="content-block fade-in-up">
                            <h2>${h2s[0]}</h2>
                            <p>${sections[0]}</p>
                        </section>

                        <section class="content-block fade-in-up">
                            <h2>${h2s[1]}</h2>
                            <p>${sections[1]}</p>
                        </section>

                        <!-- Google Maps -->
                        <div class="map-container fade-in-up">
                            <h3><i class="fas fa-map-marker-alt"></i> ${service.name} à ${city.name}</h3>
                            <iframe
                                src="${mapsUrl}"
                                width="100%"
                                height="300"
                                style="border:0; border-radius: 12px;"
                                allowfullscreen=""
                                loading="lazy"
                                referrerpolicy="no-referrer-when-downgrade"
                                title="Carte de ${city.name}">
                            </iframe>
                        </div>

                        <section class="content-block fade-in-up">
                            <h2>${h2s[2]}</h2>
                            <p>${sections[2]}</p>
                        </section>

                        <section class="content-block fade-in-up">
                            <h2>${h2s[3]}</h2>
                            <p>${sections[3]}</p>
                        </section>

                        <!-- FAQ Accordion -->
                        <section class="faq-section fade-in-up">
                            <h3>Questions fréquentes sur la ${service.name.toLowerCase()} à ${city.name}</h3>
                            <div class="faq-list">
                                ${faqs.map(faq => `
                                <div class="faq-item">
                                    <button class="faq-question" aria-expanded="false">
                                        <span>${faq.question}</span>
                                        <span class="faq-icon">+</span>
                                    </button>
                                    <div class="faq-answer">
                                        <p>${faq.answer}</p>
                                    </div>
                                </div>`).join('')}
                            </div>
                        </section>

                        <!-- Other Services in Same City -->
                        <section class="internal-links fade-in-up">
                            <h3>Autres services de voyance à ${city.name}</h3>
                            <div class="links-grid">
                                ${otherServices}
                            </div>
                        </section>

                        <!-- Nearby Cities - Same Service -->
                        <section class="nearby-cities fade-in-up">
                            <h3>${service.name} dans d'autres villes</h3>
                            <div class="links-grid">
                                ${nearbyCities}
                            </div>
                        </section>
                    </article>

                    <!-- Sidebar -->
                    <aside class="sidebar">
                        <div class="sidebar-sticky">
                            <div class="cta-box fade-in-right">
                                <h3><i class="fas fa-${service.icon} icon-pulse"></i> ${service.name}</h3>
                                <p>Nos voyants experts vous guident à ${city.name}</p>
                                <a href="javascript:void(0)" onclick="window.open(getAffiliateUrl(), '_blank'); return false;"
                                    data-affiliate="telephone" class="btn btn-gold btn-block">
                                    Consulter maintenant
                                </a>
                            </div>

                            <div class="pillar-link-box fade-in-right stagger-1">
                                <h4>En savoir plus</h4>
                                <a href="${service.pillarPage}" class="pillar-link">
                                    <i class="fas fa-arrow-right"></i> Guide complet ${service.name}
                                </a>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    </main>

    <!-- FOOTER - Same as Homepage -->
    <footer class="site-footer">
        <div class="container">
            <div class="footer-grid">

                <!-- Col 1: A propos -->
                <div class="footer-col">
                    <div class="logo" style="margin-bottom: 20px;">
                        <i class="fa-solid fa-moon"></i> France Voyance Avenir
                    </div>
                    <p>Votre guide vers les arts divinatoires. Trouvez le voyant qui vous correspond parmi notre
                        sélection de professionnels vérifiés.</p>
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
                        <li><a href="/legal/mentions-legales/">Mentions Légales</a></li>
                        <li><a href="/legal/politique-confidentialite/">Politique de Confidentialité</a></li>
                        <li><a href="/legal/politique-cookies/">Politique des Cookies</a></li>
                        <li><a href="/legal/cgu/">CGU</a></li>
                        <li><a href="/contact/">Contact</a></li>
                        <li><a href="/plan-du-site/">Plan du site</a></li>
                    </ul>
                </div>

                <!-- Col 4: Contact -->
                <div class="footer-col">
                    <h4>Contact</h4>
                    <ul class="footer-links">
                        <li><i class="fa-solid fa-envelope"
                                style="margin-right: 10px; color: var(--color-secondary);"></i>
                            contact@france-voyance-avenir.fr</li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="footer-bottom">
            <div class="container">
                <p>&copy; 2026 France Voyance Avenir - Tous droits réservés</p>
                <div class="disclaimer">
                    Ce site propose des services de divertissement. Les consultations de voyance ne remplacent pas un
                    avis médical, juridique ou financier professionnel.
                </div>
                <p class="affiliate-disclosure">
                    * Ce site contient des liens affiliés. En cliquant sur ces liens et en
                    effectuant un achat, nous pouvons recevoir une commission sans frais
                    supplémentaires pour vous. Cela nous aide à maintenir ce site gratuit.
                </p>
            </div>
        </div>
    </footer>

    <!-- Sticky CTA -->
    <div class="sticky-cta">
        <div class="sticky-cta-pulse"></div>
        <a href="javascript:void(0)" onclick="window.open(getAffiliateUrl(), '_blank'); return false;"
            data-affiliate="telephone" class="btn btn-gold">
            <span class="sticky-cta-icon"><i class="fas fa-phone-alt"></i></span>
            <span>Consulter</span>
        </a>
    </div>

    <script src="/js/animations.js" defer></script>
    <script src="/js/main.js?v=2026"></script>
</body>

</html>`;

    return html;
}

// Generate all pages
let pagesGenerated = 0;
const totalPages = cities.length * services.length;

console.log(`\nGenerating ${totalPages} local SEO pages with homepage header/footer...\n`);

for (const service of services) {
    console.log(`\n📁 ${service.name}:`);

    for (const city of cities) {
        const filename = `${service.slug}-${city.slug}.html`;
        const filepath = path.join(outputDir, filename);

        const html = generatePage(city, service);
        fs.writeFileSync(filepath, html, 'utf8');

        pagesGenerated++;
        process.stdout.write(`  ✓ ${filename} (${pagesGenerated}/${totalPages})\r`);
    }

    console.log(`  ✅ ${cities.length} pages created for ${service.name}`);
}

console.log(`\n✨ Successfully generated ${pagesGenerated} local SEO pages!`);
console.log(`📁 Output directory: ${outputDir}\n`);
