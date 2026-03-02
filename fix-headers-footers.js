/**
 * Fix Headers & Footers
 * Replaces all page headers and footers with the homepage reference version.
 * Also ensures consistent footer-bottom section and obf-link script.
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// ─── Reference Header (from homepage) ───
const HEADER_HTML = `<header class="site-header">
 <div class="container header-container">
 <a href="/" class="logo">
 <img src="/images/logo.svg" alt="France Voyance Avenir" width="220" height="55">
 </a>

 <div class="mobile-toggle">
 <i class="fa-solid fa-bars"></i>
 </div>

 <nav class="main-nav">
 <!-- Logo inside nav for desktop menu -->
 <a href="/" class="nav-logo">
 <img src="/images/logo.svg" alt="France Voyance Avenir" width="220" height="55">
 </a>
 <ul>
 <li class="nav-item"><a href="/" class="nav-link">Accueil</a></li>
 <li class="nav-item">
 <a href="/voyance-gratuite/" class="nav-link">Voyance Gratuite <i
 class="fa-solid fa-chevron-down" style="font-size: 0.7em;"></i></a>
 <ul class="dropdown-menu">
 <li><a href="/tarot-marseille/">Tarot de Marseille</a></li>
 <li><a href="/voyance-gratuite/tarot-gratuit/">Tarot Gratuit</a></li>
 <li><a href="/voyance-gratuite/tarot-d-amour/">Tarot Amour</a></li>
 <li><a href="/voyance-gratuite/numerologie-gratuite/">Num\u00e9rologie Gratuite</a></li>
 <li><a href="/voyance-gratuite/pendule-oui-non/">Pendule Oui/Non</a></li>
 <li><a href="/voyance-gratuite/tarot-oui-non/">Tarot Oui/Non</a></li>
 <li><a href="/voyance-gratuite/compatibilite-astrale/">Compatibilit\u00e9 Astrale</a></li>
 <li><a href="/voyance-gratuite/tirage-runes/">Tirage de Runes</a></li>
 <li><a href="/glossaire/">Glossaire \u00c9sot\u00e9rique</a></li>
 </ul>
 </li>

 <li class="nav-item">
 <a href="/arts-divinatoires/" class="nav-link">Arts Divinatoires <i class="fa-solid fa-chevron-down"
 style="font-size: 0.7em;"></i></a>
 <ul class="dropdown-menu">
 <li><a href="/arts-divinatoires/pendule/">Voyance Pendule</a></li>
 <li><a href="/arts-divinatoires/oracle-belline/">Oracle Belline</a></li>
 <li><a href="/arts-divinatoires/oracle-ge/">Oracle G\u00e9</a></li>
 <li><a href="/arts-divinatoires/runes/">Tirage Runes</a></li>
 <li><a href="/arts-divinatoires/cartomancie/">Cartomancie</a></li>
 </ul>
 </li>

 <li class="nav-item">
 <a href="/consultations/" class="nav-link">Consultations <i class="fa-solid fa-chevron-down"
 style="font-size: 0.7em;"></i></a>
 <ul class="dropdown-menu">
 <li><a href="/consultations/amour-retour-affectif/">Amour &amp; Retour Affectif</a></li>
 <li><a href="/consultations/flamme-jumelle/">Flamme Jumelle</a></li>
 <li><a href="/consultations/medium-defunts/">Medium &amp; D\u00e9funts</a></li>
 <li><a href="/consultations/travail-carriere/">Travail &amp; Carri\u00e8re</a></li>
 <li><a href="/consultations/argent-finances/">Argent &amp; Finances</a></li>
 </ul>
 </li>

 <li class="nav-item">
 <a href="/consulter/voyance-telephone/" class="nav-link">Consulter <i class="fa-solid fa-chevron-down"
 style="font-size: 0.7em;"></i></a>
 <ul class="dropdown-menu">
 <li><a href="/consulter/voyance-telephone/">Voyance T\u00e9l\u00e9phone</a></li>
 <li><a href="/consulter/voyance-sms/">Voyance SMS</a></li>
 <li><a href="/consulter/voyance-chat/">Voyance Chat</a></li>
 <li><a href="/consulter/voyance-audiotel/">Voyance Audiotel</a></li>
 <li><a href="/consulter/voyance-sans-attente-sans-cb/">Voyance Sans Attente</a></li>
 </ul>
 </li>

 <li class="nav-item">
 <a href="/avis/" class="nav-link">Plateformes <i class="fa-solid fa-chevron-down" style="font-size: 0.7em;"></i></a>
 <ul class="dropdown-menu">
 <li><a href="/avis/wengo/">Wengo</a></li>
 <li><a href="/avis/spiriteo/">Spiriteo</a></li>
 <li><a href="/avis/jimini/">Jimini</a></li>
 <li><a href="/avis/kang/">Kang</a></li>
 <li><a href="/avis/avigora/">Avigora</a></li>
 <li><a href="/avis/cosmospace/">Cosmospace</a></li>
 <li><a href="/avis/mydeclick/">MyD\u00e9click</a></li>
 <li><a href="/avis/viversum/">Viversum</a></li>
 <li><a href="/avis/voyance-alice/">Voyance Alice</a></li>
 <li><a href="/avis/divinatix/">Divinatix</a></li>
 </ul>
 </li>
 <li class="nav-item"><a href="/comparatif/" class="nav-link">Comparatifs</a></li>
 </ul>

 <div class="header-cta text-center mt-3 mt-lg-0 ml-lg-4">
 <a href="javascript:void(0)" onclick="window.open(getAffiliateUrl(), '_blank'); return false;"
 class="btn btn-gold" data-affiliate="voyance-telephone">Consultation Imm\u00e9diate</a>
 </div>
 </nav>
 </div>
 </header>`;

// ─── Reference Footer (from homepage) ───
const FOOTER_HTML = `<footer class="site-footer">
 <div class="container">
 <div class="footer-grid">
                <div class="footer-col">
                    <h4>Plateformes de voyance</h4>
                    <ul class="footer-links">
                        <li><a href="/avis/wengo/">Wengo</a></li>
                        <li><a href="/avis/spiriteo/">Spiriteo</a></li>
                        <li><a href="/avis/jimini/">Jimini</a></li>
                        <li><a href="/avis/kang/">Kang</a></li>
                        <li><a href="/avis/avigora/">Avigora</a></li>
                        <li><a href="/avis/cosmospace/">Cosmospace</a></li>
                        <li><a href="/avis/mydeclick/">MyD\u00e9click</a></li>
                        <li><a href="/avis/viversum/">Viversum</a></li>
                        <li><a href="/avis/voyance-alice/">Voyance Alice</a></li>
                        <li><a href="/avis/divinatix/">Divinatix</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Comparatifs</h4>
                    <ul class="footer-links">
                        <li><a href="/comparatif/">Tous les comparatifs</a></li>
                        <li><a href="/avis/cosmospace-vs-wengo/">Cosmospace vs Wengo</a></li>
                        <li><a href="/avis/cosmospace-vs-spiriteo/">Cosmospace vs Spiriteo</a></li>
                        <li><a href="/avis/wengo-vs-spiriteo/">Wengo vs Spiriteo</a></li>
                        <li><a href="/avis/cosmospace-vs-jimini/">Cosmospace vs Jimini</a></li>
                        <li><a href="/avis/wengo-vs-jimini/">Wengo vs Jimini</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Outils gratuits</h4>
                    <ul class="footer-links">
                        <li><a href="/voyance-gratuite/tarot-gratuit/">Tarot Gratuit</a></li>
                        <li><a href="/voyance-gratuite/tarot-d-amour/">Tarot Amour</a></li>
                        <li><a href="/voyance-gratuite/numerologie-gratuite/">Num\u00e9rologie Gratuite</a></li>
                        <li><a href="/voyance-gratuite/pendule-oui-non/">Pendule Oui/Non</a></li>
                        <li><a href="/voyance-gratuite/compatibilite-astrale/">Compatibilit\u00e9 Astrale</a></li>
                        <li><a href="/glossaire/">Glossaire</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Informations</h4>
                    <ul class="footer-links">
                        <li><span class="obf-link" data-o="L2xlZ2FsL21lbnRpb25zLWxlZ2FsZXMv" role="link" tabindex="0">Mentions L\u00e9gales</span></li>
                        <li><span class="obf-link" data-o="L2xlZ2FsL3BvbGl0aXF1ZS1jb25maWRlbnRpYWxpdGUv" role="link" tabindex="0">Politique de Confidentialit\u00e9</span></li>
                        <li><span class="obf-link" data-o="L2xlZ2FsL3BvbGl0aXF1ZS1jb29raWVzLw==" role="link" tabindex="0">Politique des Cookies</span></li>
                        <li><span class="obf-link" data-o="L2xlZ2FsL2NndS8=" role="link" tabindex="0">CGU</span></li>
                        <li><a href="/contact/">Contact</a></li>
                        <li><a href="/plan-du-site/">Plan du site</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
 <div class="container">
 <p>&copy; 2026 France Voyance Avenir - Tous droits r\u00e9serv\u00e9s</p>
 <div class="disclaimer">
 Ce site propose des services de divertissement. Les consultations de voyance ne remplacent pas un
 avis m\u00e9dical, juridique ou financier professionnel.
 </div>
 <p class="affiliate-disclosure">
 * Ce site contient des liens affili\u00e9s. En cliquant sur ces liens et en
 effectuant un achat, nous pouvons recevoir une commission sans frais
 suppl\u00e9mentaires pour vous. Cela nous aide \u00e0 maintenir ce site gratuit.
 </p>
 </div>
 </div>
 </footer>`;

// ─── Obfuscated link script ───
const OBF_SCRIPT = `<script>document.addEventListener('click',function(e){if(e.target.classList.contains('obf-link')||e.target.closest('.obf-link')){var el=e.target.classList.contains('obf-link')?e.target:e.target.closest('.obf-link');window.location.href=atob(el.getAttribute('data-o'));}});</script>`;

async function main() {
  const rootDir = __dirname;

  // Find all HTML files
  const files = await glob('**/*.html', {
    cwd: rootDir,
    ignore: ['node_modules/**', '.claude/**'],
    absolute: true,
  });

  console.log(`Found ${files.length} HTML files to process.`);

  let updated = 0;
  let errors = 0;
  let skipped = 0;

  for (const filePath of files) {
    try {
      let content = fs.readFileSync(filePath, 'utf-8');
      let changed = false;

      // ─── Replace Header ───
      // Match from <header class="site-header"> to </header>
      const headerRegex = /<header\s+class="site-header"[\s\S]*?<\/header>/i;
      if (headerRegex.test(content)) {
        const newContent = content.replace(headerRegex, HEADER_HTML);
        if (newContent !== content) {
          content = newContent;
          changed = true;
        }
      }

      // ─── Replace Footer ───
      // Match from <footer class="site-footer"> to </footer> (including footer-bottom)
      const footerRegex = /<footer\s+class="site-footer"[\s\S]*?<\/footer>/i;
      if (footerRegex.test(content)) {
        const newContent = content.replace(footerRegex, FOOTER_HTML);
        if (newContent !== content) {
          content = newContent;
          changed = true;
        }
      }

      // ─── Ensure obf-link script is present ───
      if (!content.includes("obf-link") || !content.includes("atob(el.getAttribute")) {
        // Already has obf-link handling? If not, add before </body>
        if (!content.includes("e.target.classList.contains('obf-link')")) {
          content = content.replace('</body>', OBF_SCRIPT + '\n</body>');
          changed = true;
        }
      }

      if (changed) {
        fs.writeFileSync(filePath, content, 'utf-8');
        updated++;
        if (updated % 100 === 0) {
          console.log(`  Updated ${updated} files...`);
        }
      } else {
        skipped++;
      }
    } catch (err) {
      console.error(`Error processing ${filePath}: ${err.message}`);
      errors++;
    }
  }

  console.log(`\nDone!`);
  console.log(`  Updated: ${updated}`);
  console.log(`  Skipped (no change): ${skipped}`);
  console.log(`  Errors: ${errors}`);
}

main().catch(console.error);
