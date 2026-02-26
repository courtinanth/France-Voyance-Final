/**
 * Blog Pages Generator
 * Generates:
 *   - Individual article pages at /blog/[slug]/index.html
 *   - Blog index page at /blog/index.html (overwrite)
 *
 * Run: node generate-blog-pages.js
 */

const fs = require('fs');
const path = require('path');

// ─── LOAD DATA ───────────────────────────────────────────────────────────────

const dataPath = path.join(__dirname, 'data', 'blog.json');
const { articles } = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const outputDir = path.join(__dirname, 'blog');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const SITE_URL = 'https://france-voyance-avenir.fr';

// Sort articles by date (newest first)
const sortedArticles = [...articles].sort((a, b) => new Date(b.date) - new Date(a.date));

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function formatDate(dateStr) {
    const months = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function estimateReadTime(html) {
    const text = html.replace(/<[^>]+>/g, '');
    const words = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
}

function getCategoryIcon(cat) {
    const icons = {
        'Astrologie': 'fa-moon',
        'Tarot': 'fa-star',
        'Spiritualite': 'fa-yin-yang',
        'Numerologie': 'fa-calculator',
        'Mediumnite': 'fa-eye',
        'Amour': 'fa-heart',
        'Bien-etre': 'fa-spa',
        'Guides': 'fa-book'
    };
    return icons[cat] || 'fa-feather';
}

function getCategoryColor(cat) {
    const colors = {
        'Astrologie': '#3B82F6',
        'Tarot': '#8B5CF6',
        'Spiritualite': '#10B981',
        'Numerologie': '#F59E0B',
        'Mediumnite': '#EC4899',
        'Amour': '#EF4444',
        'Bien-etre': '#14B8A6',
        'Guides': '#6366F1'
    };
    return colors[cat] || '#D4AF37';
}

// ─── INLINE CSS ──────────────────────────────────────────────────────────────

const BLOG_CSS = `
<style>
    .blog-hero {
        background: linear-gradient(135deg, #1A1A4A 0%, #4A1A6B 100%);
        color: #fff;
        padding: 60px 0;
        text-align: center;
    }
    .blog-hero h1 {
        font-family: 'Playfair Display', serif;
        font-size: 2.5em;
        margin-bottom: 15px;
    }
    .blog-hero p {
        font-size: 1.15em;
        max-width: 650px;
        margin: 0 auto;
        opacity: 0.9;
    }
    .blog-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 30px;
        margin-top: 40px;
    }
    .blog-card {
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(212,175,55,0.2);
        border-radius: 12px;
        overflow: hidden;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .blog-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 30px rgba(74,26,107,0.25);
        border-color: rgba(212,175,55,0.5);
    }
    .blog-card-img {
        width: 100%;
        height: 200px;
        object-fit: cover;
    }
    .blog-card-body {
        padding: 25px;
    }
    .blog-card-meta {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 12px;
        font-size: 0.85em;
        opacity: 0.8;
    }
    .blog-card-meta .cat-badge {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 3px 10px;
        border-radius: 15px;
        font-size: 0.85em;
        font-weight: 600;
        color: #fff;
    }
    .blog-card h3 {
        font-family: 'Playfair Display', serif;
        color: #D4AF37;
        font-size: 1.25em;
        margin-bottom: 10px;
        line-height: 1.4;
    }
    .blog-card h3 a {
        color: inherit;
        text-decoration: none;
    }
    .blog-card h3 a:hover {
        text-decoration: underline;
    }
    .blog-card p.excerpt {
        color: #e0e0e0;
        line-height: 1.6;
        margin-bottom: 15px;
    }
    .blog-card .read-more {
        color: #D4AF37;
        font-weight: 700;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        transition: gap 0.3s ease;
    }
    .blog-card .read-more:hover {
        gap: 10px;
    }

    /* ── Article page ── */
    .article-header {
        text-align: center;
        padding: 50px 0 30px;
    }
    .article-header h1 {
        font-family: 'Playfair Display', serif;
        font-size: 2.3em;
        color: #D4AF37;
        margin-bottom: 20px;
        line-height: 1.3;
    }
    .article-meta {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        gap: 20px;
        font-size: 0.95em;
        opacity: 0.85;
        margin-bottom: 10px;
    }
    .article-meta i {
        color: #D4AF37;
        margin-right: 5px;
    }
    .article-featured-img {
        width: 100%;
        max-height: 450px;
        object-fit: cover;
        border-radius: 12px;
        margin-bottom: 35px;
    }
    .article-content {
        max-width: 800px;
        margin: 0 auto;
        line-height: 1.9;
        font-size: 1.05em;
    }
    .article-content h2 {
        font-family: 'Playfair Display', serif;
        color: #D4AF37;
        font-size: 1.5em;
        margin: 35px 0 15px;
        padding-bottom: 8px;
        border-bottom: 2px solid rgba(212,175,55,0.3);
    }
    .article-content p {
        color: #e0e0e0;
        margin-bottom: 18px;
    }
    .article-content ul, .article-content ol {
        color: #e0e0e0;
        margin: 15px 0 20px 25px;
    }
    .article-content li {
        margin-bottom: 8px;
        line-height: 1.7;
    }
    .article-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 40px 0 30px;
        padding-top: 25px;
        border-top: 1px solid rgba(212,175,55,0.2);
    }
    .article-tags span {
        font-size: 0.85em;
        font-weight: 600;
        color: #D4AF37;
        margin-right: 5px;
    }
    .article-tag {
        display: inline-block;
        padding: 4px 12px;
        background: rgba(74,26,107,0.3);
        border: 1px solid rgba(212,175,55,0.3);
        border-radius: 15px;
        color: #e0e0e0;
        font-size: 0.83em;
        text-decoration: none;
    }
    .article-cta {
        background: linear-gradient(135deg, #4A1A6B 0%, #1A1A4A 100%);
        color: #fff;
        padding: 35px;
        border-radius: 12px;
        text-align: center;
        margin: 40px auto;
        max-width: 800px;
        border: 2px solid #D4AF37;
    }
    .article-cta h3 {
        color: #D4AF37;
        font-family: 'Playfair Display', serif;
        font-size: 1.3em;
        margin-bottom: 12px;
    }
    .article-cta p {
        opacity: 0.9;
        margin-bottom: 20px;
    }
    .related-articles {
        margin-top: 50px;
        padding-top: 30px;
        border-top: 2px solid rgba(212,175,55,0.2);
    }
    .related-articles h2 {
        font-family: 'Playfair Display', serif;
        color: #D4AF37;
        text-align: center;
        margin-bottom: 30px;
    }
    @media (max-width: 768px) {
        .blog-hero h1 { font-size: 1.8em; }
        .blog-grid { grid-template-columns: 1fr; }
        .article-header h1 { font-size: 1.7em; }
        .article-content { font-size: 1em; }
    }
</style>`;

// ─── SHARED HTML PARTS ───────────────────────────────────────────────────────

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
    <link rel="stylesheet" href="/css/style.css?v=2028">

    ${BLOG_CSS}

    <!-- Schema JSON-LD -->
    <script type="application/ld+json">
    ${JSON.stringify(schemaLD, null, 2)}
    </script>
<noscript><style>.fade-in-up,.fade-in-left,.fade-in-right,.scale-in,.reveal{opacity:1 !important;transform:none !important;transition:none !important}.faq-answer{max-height:none !important;overflow:visible !important;padding:0 24px 20px !important}.faq-icon,.faq-toggle{display:none}.sticky-cta{opacity:1 !important;transform:none !important;pointer-events:auto !important}.testimonial-nav{display:none}.reading-progress-container{display:none}</style></noscript>
</head>`;
}

function getNav() {
    return `
<body>

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
                            <li><a href="/tarot-marseille/">Tarot de Marseille</a></li>
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
                            <li><a href="/consultations/amour-retour-affectif/">Amour &amp; Retour Affectif</a></li>
                            <li><a href="/consultations/flamme-jumelle/">Flamme Jumelle</a></li>
                            <li><a href="/consultations/medium-defunts/">Medium &amp; Defunts</a></li>
                            <li><a href="/consultations/travail-carriere/">Travail &amp; Carriere</a></li>
                            <li><a href="/consultations/argent-finances/">Argent &amp; Finances</a></li>
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

                    <li class="nav-item"><a href="/avis/" class="nav-link">Avis &amp; Comparatifs</a></li>
                </ul>

                <div class="header-cta text-center mt-3 mt-lg-0 ml-lg-4">
                    <a href="javascript:void(0)" onclick="window.open(getAffiliateUrl(), '_blank'); return false;" class="btn btn-gold" data-affiliate="voyance-telephone">Consultation Immédiate</a>
                </div>
            </nav>
        </div>
    </header>`;
}

function getFooter() {
    return `
    <footer class="site-footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-col">
                    <div class="logo" style="margin-bottom: 20px;">
                        <i class="fa-solid fa-moon"></i> France Voyance Avenir
                    </div>
                    <p>Votre guide vers les arts divinatoires. Trouvez le voyant qui vous correspond parmi notre sélection de professionnels vérifiés.</p>
                </div>

                <div class="footer-col">
                    <h4>Navigation Rapide</h4>
                    <ul class="footer-links">
                        <li><a href="/consulter/voyance-telephone/">Voyance Téléphone</a></li>
                        <li><a href="/voyance-gratuite/">Voyance Gratuite</a></li>
                        <li><a href="/voyance-gratuite/tarot-d-amour/">Tarot Amour</a></li>
                        <li><a href="/voyance-gratuite/numerologie-gratuite/">Numérologie</a></li>
                        <li><a href="/blog/">Le Blog</a></li>
                        <li><a href="/tarot-marseille/">Tarot de Marseille</a></li>
                        <li><a href="/avis/">Avis Plateformes</a></li>
                        <li><a href="/glossaire/">Glossaire</a></li>
                    </ul>
                </div>

                <div class="footer-col">
                    <h4>Informations</h4>
                    <ul class="footer-links">
                        <li><a href="/legal/mentions-legales/">Mentions Légales</a></li>
                        <li><a href="/legal/politique-confidentialite/">Politique de Confidentialité</a></li>
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
                <p>&copy; 2026 France Voyance Avenir - Tous droits réservés</p>
                <div class="disclaimer">
                    Ce site propose des services de divertissement. Les consultations de voyance ne remplacent pas un avis médical, juridique ou financier professionnel.
                </div>
            </div>
        </div>
    </footer>
    <script src="/js/config.js"></script>
    <script src="/js/animations.js" defer></script>
    <script src="/js/main.js?v=2028" defer></script>
    <script src="/js/logger.js" defer></script>
</body>

</html>`;
}

// ─── GENERATE BLOG INDEX PAGE ────────────────────────────────────────────────

function generateBlogIndex() {
    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Accueil", "item": `${SITE_URL}/` },
                    { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${SITE_URL}/blog/` }
                ]
            },
            {
                "@type": "Organization",
                "name": "France Voyance Avenir",
                "url": `${SITE_URL}/`,
                "logo": `${SITE_URL}/images/logo.svg`,
                "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+33892686882",
                    "contactType": "customer service"
                }
            },
            {
                "@type": "CollectionPage",
                "name": "Blog Voyance & Spiritualité",
                "url": `${SITE_URL}/blog/`,
                "description": "Articles et guides sur la voyance, le tarot, l'astrologie et la spiritualité."
            }
        ]
    };

    const articleCards = sortedArticles.map(article => {
        const catColor = getCategoryColor(article.category);
        const catIcon = getCategoryIcon(article.category);
        return `
                <article class="blog-card fade-in-up">
                    <img src="${article.image}" alt="${article.alt}" class="blog-card-img" loading="lazy">
                    <div class="blog-card-body">
                        <div class="blog-card-meta">
                            <span class="cat-badge" style="background:${catColor}"><i class="fa-solid ${catIcon}"></i> ${article.category}</span>
                            <span><i class="fa-regular fa-calendar"></i> ${formatDate(article.date)}</span>
                            <span><i class="fa-regular fa-clock"></i> ${estimateReadTime(article.content)} min</span>
                        </div>
                        <h3><a href="/blog/${article.slug}/">${article.title}</a></h3>
                        <p class="excerpt">${article.excerpt}</p>
                        <a href="/blog/${article.slug}/" class="read-more">Lire la suite <i class="fa-solid fa-arrow-right"></i></a>
                    </div>
                </article>`;
    }).join('\n');

    const html = `${getHead(
        'Blog Voyance & Spiritualité - France Voyance Avenir',
        'Articles et guides sur la voyance, le tarot, l\'astrologie et la spiritualité. Conseils pratiques et décryptages par nos experts en arts divinatoires.',
        '/blog/',
        schema
    )}
${getNav()}

    <main class="section-padding">
        <div class="container">
            <h1 style="text-align: center; margin-bottom: 15px;">Actualités &amp; Articles Spirituels</h1>
            <p style="text-align: center; max-width: 650px; margin: 0 auto 40px; opacity: 0.85; font-size: 1.1em;">Explorez nos articles sur la voyance, le tarot, l'astrologie et la spiritualité pour approfondir vos connaissances ésotériques.</p>

            <div class="blog-grid">
${articleCards}
            </div>
        </div>
    </main>

${getFooter()}`;

    const indexPath = path.join(outputDir, 'index.html');
    fs.writeFileSync(indexPath, html, 'utf8');
    console.log(`  ✅ Blog index → /blog/index.html (${sortedArticles.length} articles)`);
}

// ─── GENERATE INDIVIDUAL ARTICLE PAGES ───────────────────────────────────────

function generateArticlePage(article) {
    const readTime = estimateReadTime(article.content);
    const catColor = getCategoryColor(article.category);
    const catIcon = getCategoryIcon(article.category);

    // Get related articles (same category, or latest if not enough)
    const related = sortedArticles
        .filter(a => a.slug !== article.slug)
        .sort((a, b) => {
            if (a.category === article.category && b.category !== article.category) return -1;
            if (b.category === article.category && a.category !== article.category) return 1;
            return new Date(b.date) - new Date(a.date);
        })
        .slice(0, 3);

    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Accueil", "item": `${SITE_URL}/` },
                    { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${SITE_URL}/blog/` },
                    { "@type": "ListItem", "position": 3, "name": article.title, "item": `${SITE_URL}/blog/${article.slug}/` }
                ]
            },
            {
                "@type": "Organization",
                "name": "France Voyance Avenir",
                "url": `${SITE_URL}/`,
                "logo": `${SITE_URL}/images/logo.svg`,
                "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+33892686882",
                    "contactType": "customer service"
                }
            },
            {
                "@type": "Article",
                "headline": article.title,
                "description": article.metaDescription,
                "image": `${SITE_URL}${article.image}`,
                "datePublished": article.date,
                "dateModified": article.date,
                "author": {
                    "@type": "Organization",
                    "name": article.author || "France Voyance Avenir"
                },
                "publisher": {
                    "@type": "Organization",
                    "name": "France Voyance Avenir",
                    "logo": {
                        "@type": "ImageObject",
                        "url": `${SITE_URL}/images/logo.svg`
                    }
                },
                "mainEntityOfPage": {
                    "@type": "WebPage",
                    "@id": `${SITE_URL}/blog/${article.slug}/`
                }
            }
        ]
    };

    const tagsHTML = article.tags && article.tags.length > 0 ? `
            <div class="article-tags">
                <span><i class="fa-solid fa-tags"></i> Tags :</span>
                ${article.tags.map(t => `<span class="article-tag">${t}</span>`).join('\n                ')}
            </div>` : '';

    const relatedHTML = related.length > 0 ? `
            <div class="related-articles">
                <h2>Articles similaires</h2>
                <div class="blog-grid">
                    ${related.map(r => {
                        const rColor = getCategoryColor(r.category);
                        const rIcon = getCategoryIcon(r.category);
                        return `<article class="blog-card">
                        <img src="${r.image}" alt="${r.alt}" class="blog-card-img" loading="lazy">
                        <div class="blog-card-body">
                            <div class="blog-card-meta">
                                <span class="cat-badge" style="background:${rColor}"><i class="fa-solid ${rIcon}"></i> ${r.category}</span>
                                <span><i class="fa-regular fa-calendar"></i> ${formatDate(r.date)}</span>
                            </div>
                            <h3><a href="/blog/${r.slug}/">${r.title}</a></h3>
                            <p class="excerpt">${r.excerpt}</p>
                            <a href="/blog/${r.slug}/" class="read-more">Lire la suite <i class="fa-solid fa-arrow-right"></i></a>
                        </div>
                    </article>`;
                    }).join('\n                    ')}
                </div>
            </div>` : '';

    const html = `${getHead(
        `${article.title} - Blog France Voyance Avenir`,
        article.metaDescription,
        `/blog/${article.slug}/`,
        schema
    )}
${getNav()}

    <main class="section-padding">
        <div class="container">

            <div class="article-header">
                <span class="cat-badge" style="background:${catColor}; display: inline-flex; margin-bottom: 20px;"><i class="fa-solid ${catIcon}"></i> ${article.category}</span>
                <h1>${article.title}</h1>
                <div class="article-meta">
                    <span><i class="fa-regular fa-calendar"></i> ${formatDate(article.date)}</span>
                    <span><i class="fa-regular fa-clock"></i> ${readTime} min de lecture</span>
                    <span><i class="fa-regular fa-user"></i> ${article.author || 'France Voyance Avenir'}</span>
                </div>
            </div>

            <img src="${article.image}" alt="${article.alt}" class="article-featured-img" loading="lazy">

            <div class="article-content">
                ${article.content}
            </div>

            ${tagsHTML}

            <div class="article-cta">
                <h3><i class="fa-solid fa-phone"></i> Une question sur votre avenir ?</h3>
                <p>Nos voyants experts sont disponibles 24h/24 pour une consultation personnalisée.</p>
                <a href="javascript:void(0)" onclick="window.open(getAffiliateUrl(), '_blank'); return false;" class="btn btn-gold" data-affiliate="voyance-telephone">Consulter un voyant maintenant</a>
            </div>

            ${relatedHTML}

        </div>
    </main>

${getFooter()}`;

    // Create article directory and write
    const articleDir = path.join(outputDir, article.slug);
    if (!fs.existsSync(articleDir)) fs.mkdirSync(articleDir, { recursive: true });
    fs.writeFileSync(path.join(articleDir, 'index.html'), html, 'utf8');
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

function main() {
    console.log('📝 Generating blog pages...\n');

    // Generate index
    generateBlogIndex();

    // Generate individual pages
    let count = 0;
    for (const article of sortedArticles) {
        generateArticlePage(article);
        count++;
    }
    console.log(`  ✅ Article pages → ${count} pages generated`);

    // Summary
    console.log(`\n  ${'─'.repeat(40)}`);
    console.log(`  ${'Index'.padEnd(25)} 1 page`);
    console.log(`  ${'Articles'.padEnd(25)} ${count} pages`);
    console.log(`  ${'TOTAL'.padEnd(25)} ${count + 1} pages`);
    console.log(`\n✅ Blog generation complete!\n`);
}

main();
