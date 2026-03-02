/**
 * Fix miscellaneous issues across all pages:
 * 1. Ensure animations.css is loaded on all pages (with consistent version)
 * 2. Ensure sticky CTA is present on all pages
 * 3. Fix any href="#" links in nav
 * 4. Standardize animations.css version to v=2029
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const STICKY_CTA = `
    <!-- Sticky CTA -->
    <div class="sticky-cta">
        <div class="sticky-cta-pulse"></div>
        <a href="javascript:void(0)" onclick="window.open(getAffiliateUrl(), '_blank'); return false;" data-affiliate="telephone" class="btn btn-gold">
            <span class="sticky-cta-icon"><i class="fas fa-phone-alt"></i></span>
            <span>Consulter</span>
        </a>
    </div>`;

async function main() {
  const rootDir = __dirname;
  const files = await glob('**/*.html', {
    cwd: rootDir,
    ignore: ['node_modules/**', '.claude/**'],
    absolute: true,
  });

  console.log(`Found ${files.length} HTML files to process.`);

  let stats = {
    addedAnimationsCss: 0,
    fixedAnimationsVersion: 0,
    addedStickyCta: 0,
    fixedHrefHash: 0,
  };

  for (const filePath of files) {
    try {
      let content = fs.readFileSync(filePath, 'utf-8');
      let changed = false;

      // 1. Ensure animations.css is loaded
      if (!content.includes('animations.css')) {
        // Add after style.css
        const styleLink = content.match(/<link\s+rel="stylesheet"\s+href="\/css\/style\.css[^"]*"[^>]*>/);
        if (styleLink) {
          content = content.replace(
            styleLink[0],
            styleLink[0] + '\n <link rel="stylesheet" href="/css/animations.css?v=2029">'
          );
          changed = true;
          stats.addedAnimationsCss++;
        }
      }

      // 2. Standardize animations.css version to v=2029
      const animVersionRegex = /animations\.css\?v=\d+/g;
      if (animVersionRegex.test(content)) {
        const newContent = content.replace(/animations\.css\?v=\d+/g, 'animations.css?v=2029');
        if (newContent !== content) {
          content = newContent;
          changed = true;
          stats.fixedAnimationsVersion++;
        }
      }

      // 3. Add sticky CTA if missing (skip 404 and offline pages)
      const basename = path.basename(filePath, '.html');
      const isSpecialPage = filePath.includes('offline') || filePath.includes('404');

      if (!content.includes('sticky-cta') && !isSpecialPage) {
        // Add before the obf-link script or before </body>
        if (content.includes("e.target.classList.contains('obf-link')")) {
          content = content.replace(
            /<script>document\.addEventListener\('click',function\(e\)\{if\(e\.target\.classList\.contains\('obf-link'\)/,
            STICKY_CTA + '\n\n<script>document.addEventListener(\'click\',function(e){if(e.target.classList.contains(\'obf-link\')'
          );
        } else {
          content = content.replace('</body>', STICKY_CTA + '\n</body>');
        }
        changed = true;
        stats.addedStickyCta++;
      }

      // 4. Fix href="#" in nav links (replace with javascript:void(0) when they have dropdown menus)
      // Only fix nav dropdown parent links that use href="#"
      const hrefHashInNav = /<a\s+href="#"\s+class="nav-link"/g;
      if (hrefHashInNav.test(content)) {
        content = content.replace(
          /<a\s+href="#"\s+class="nav-link"/g,
          '<a href="javascript:void(0)" class="nav-link"'
        );
        changed = true;
        stats.fixedHrefHash++;
      }

      if (changed) {
        fs.writeFileSync(filePath, content, 'utf-8');
      }
    } catch (err) {
      console.error(`Error processing ${filePath}: ${err.message}`);
    }
  }

  console.log(`\nDone!`);
  console.log(`  Added animations.css: ${stats.addedAnimationsCss}`);
  console.log(`  Fixed animations version: ${stats.fixedAnimationsVersion}`);
  console.log(`  Added sticky CTA: ${stats.addedStickyCta}`);
  console.log(`  Fixed href="#" in nav: ${stats.fixedHrefHash}`);
}

main().catch(console.error);
