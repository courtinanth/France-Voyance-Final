/**
 * Shared HTML templates for header & footer.
 * All page generators should import from this file to ensure consistency.
 */

function getHeader() {
  return `<header class="site-header">
 <div class="container header-container">
 <a href="/" class="logo">
 <img src="/images/logo.svg" alt="France Voyance Avenir" width="220" height="55">
 </a>

 <div class="mobile-toggle">
 <i class="fa-solid fa-bars"></i>
 </div>

 <nav class="main-nav">
 <a href="/" class="nav-logo">
 <img src="/images/logo.svg" alt="France Voyance Avenir" width="220" height="55">
 </a>
 <ul>
 <li class="nav-item"><a href="/" class="nav-link">Accueil</a></li>
 <li class="nav-item">
 <a href="/voyance-gratuite/" class="nav-link">Voyance Gratuite <i class="fa-solid fa-chevron-down" style="font-size: 0.7em;"></i></a>
 <ul class="dropdown-menu">
 <li><a href="/tarot-marseille/">Tarot de Marseille</a></li>
 <li><a href="/voyance-gratuite/tarot-gratuit/">Tarot Gratuit</a></li>
 <li><a href="/voyance-gratuite/tarot-d-amour/">Tarot Amour</a></li>
 <li><a href="/voyance-gratuite/numerologie-gratuite/">Numérologie Gratuite</a></li>
 <li><a href="/voyance-gratuite/pendule-oui-non/">Pendule Oui/Non</a></li>
 <li><a href="/voyance-gratuite/tarot-oui-non/">Tarot Oui/Non</a></li>
 <li><a href="/voyance-gratuite/compatibilite-astrale/">Compatibilité Astrale</a></li>
 <li><a href="/voyance-gratuite/tirage-runes/">Tirage de Runes</a></li>
 <li><a href="/glossaire/">Glossaire Ésotérique</a></li>
 </ul>
 </li>
 <li class="nav-item">
 <a href="/arts-divinatoires/" class="nav-link">Arts Divinatoires <i class="fa-solid fa-chevron-down" style="font-size: 0.7em;"></i></a>
 <ul class="dropdown-menu">
 <li><a href="/arts-divinatoires/pendule/">Voyance Pendule</a></li>
 <li><a href="/arts-divinatoires/oracle-belline/">Oracle Belline</a></li>
 <li><a href="/arts-divinatoires/oracle-ge/">Oracle Gé</a></li>
 <li><a href="/arts-divinatoires/runes/">Tirage Runes</a></li>
 <li><a href="/arts-divinatoires/cartomancie/">Cartomancie</a></li>
 </ul>
 </li>
 <li class="nav-item">
 <a href="/consultations/" class="nav-link">Consultations <i class="fa-solid fa-chevron-down" style="font-size: 0.7em;"></i></a>
 <ul class="dropdown-menu">
 <li><a href="/consultations/amour-retour-affectif/">Amour &amp; Retour Affectif</a></li>
 <li><a href="/consultations/flamme-jumelle/">Flamme Jumelle</a></li>
 <li><a href="/consultations/medium-defunts/">Medium &amp; Défunts</a></li>
 <li><a href="/consultations/travail-carriere/">Travail &amp; Carrière</a></li>
 <li><a href="/consultations/argent-finances/">Argent &amp; Finances</a></li>
 </ul>
 </li>
 <li class="nav-item">
 <a href="/consulter/voyance-telephone/" class="nav-link">Consulter <i class="fa-solid fa-chevron-down" style="font-size: 0.7em;"></i></a>
 <ul class="dropdown-menu">
 <li><a href="/consulter/voyance-telephone/">Voyance Téléphone</a></li>
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
 <li><a href="/avis/mydeclick/">MyDéclick</a></li>
 <li><a href="/avis/viversum/">Viversum</a></li>
 <li><a href="/avis/voyance-alice/">Voyance Alice</a></li>
 <li><a href="/avis/divinatix/">Divinatix</a></li>
 </ul>
 </li>
 <li class="nav-item"><a href="/comparatif/" class="nav-link">Comparatifs</a></li>
 </ul>

 <div class="header-cta text-center mt-3 mt-lg-0 ml-lg-4">
 <a href="javascript:void(0)" onclick="window.open(getAffiliateUrl(), '_blank'); return false;"
 class="btn btn-gold" data-affiliate="voyance-telephone">Consultation Immédiate</a>
 </div>
 </nav>
 </div>
 </header>`;
}

function getFooter() {
  return `<footer class="site-footer">
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
                        <li><a href="/avis/mydeclick/">MyDéclick</a></li>
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
                        <li><a href="/voyance-gratuite/numerologie-gratuite/">Numérologie Gratuite</a></li>
                        <li><a href="/voyance-gratuite/pendule-oui-non/">Pendule Oui/Non</a></li>
                        <li><a href="/voyance-gratuite/compatibilite-astrale/">Compatibilité Astrale</a></li>
                        <li><a href="/glossaire/">Glossaire</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Informations</h4>
                    <ul class="footer-links">
                        <li><span class="obf-link" data-o="L2xlZ2FsL21lbnRpb25zLWxlZ2FsZXMv" role="link" tabindex="0">Mentions Légales</span></li>
                        <li><span class="obf-link" data-o="L2xlZ2FsL3BvbGl0aXF1ZS1jb25maWRlbnRpYWxpdGUv" role="link" tabindex="0">Politique de Confidentialité</span></li>
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
 </footer>`;
}

function getObfScript() {
  return `<script>document.addEventListener('click',function(e){if(e.target.classList.contains('obf-link')||e.target.closest('.obf-link')){var el=e.target.classList.contains('obf-link')?e.target:e.target.closest('.obf-link');window.location.href=atob(el.getAttribute('data-o'));}});</script>`;
}

function getStickyCta() {
  return `<div class="sticky-cta">
        <div class="sticky-cta-pulse"></div>
        <a href="javascript:void(0)" onclick="window.open(getAffiliateUrl(), '_blank'); return false;" data-affiliate="telephone" class="btn btn-gold">
            <span class="sticky-cta-icon"><i class="fas fa-phone-alt"></i></span>
            <span>Consulter</span>
        </a>
    </div>`;
}

module.exports = { getHeader, getFooter, getObfScript, getStickyCta };
