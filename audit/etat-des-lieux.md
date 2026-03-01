# Audit Initial — france-voyance-avenir.fr
## Date : 2026-03-01

---

## 1. Stack Technique
- **CMS** : Site statique HTML/CSS/JS (PAS WordPress)
- **Générateur** : Scripts Node.js (generate-avis-pages.js, generate-blog-pages.js, etc.)
- **Hébergement** : Netlify (fichiers _headers, _redirects)
- **Dépendances** : glob, jsdom (package.json)
- **Fonts** : Playfair Display (titres), Lato (body) — Google Fonts
- **Icons** : Font Awesome 6.4.0
- **Couleurs** : Primary #4A1A6B (violet), Secondary #D4AF37 (or), Accent #1A1A4A (bleu foncé)
- **PWA** : Service worker présent (service-worker.js)

---

## 2. Comparatifs Existants (5 sur 45)

| # | URL | Plateformes comparées |
|---|-----|-----------------------|
| 1 | /avis/wengo-vs-spiriteo/ | Wengo vs Spiriteo |
| 2 | /avis/wengo-vs-jimini/ | Wengo vs Jimini |
| 3 | /avis/wengo-vs-avigora/ | Wengo vs Avigora |
| 4 | /avis/spiriteo-vs-jimini/ | Spiriteo vs Jimini |
| 5 | /avis/spiriteo-vs-avigora/ | Spiriteo vs Avigora |

**Comparatifs manquants : 40 sur 45**

---

## 3. Pages Plateformes Individuelles (10/10 — complet)

| # | Plateforme | URL |
|---|-----------|-----|
| 1 | Cosmospace | /avis/cosmospace/ |
| 2 | Wengo | /avis/wengo/ |
| 3 | Spiriteo | /avis/spiriteo/ |
| 4 | MyDéclick | /avis/mydeclick/ |
| 5 | Jimini | /avis/jimini/ |
| 6 | Avigora | /avis/avigora/ |
| 7 | Kang | /avis/kang/ |
| 8 | Viversum | /avis/viversum/ |
| 9 | Voyance Alice | /avis/voyance-alice/ |
| 10 | Divinatix | /avis/divinatix/ |

---

## 4. Pages contenant "Cosmospace"

- /avis/index.html (page hub — note affichée : 4.8/5)
- /avis/cosmospace/index.html (page dédiée — note dans platforms.json : 3.6/5)
- /data/platforms.json (données structurées)
- generate-avis-pages.js (script de génération)

**ALERTE** : Incohérence de note — platforms.json = 3.6/5 vs page /avis/ = 4.8/5.
La note de référence demandée par le client est 4.8/5. platforms.json doit être mis à jour.

---

## 5. Structure Header Actuel

- Logo : France Voyance Avenir (SVG)
- Navigation : Accueil | Voyance Gratuite (dropdown 9 items) | Arts Divinatoires (dropdown 6 items) | Consultations (dropdown 5 items) | Consulter (dropdown 4 items) | Avis & Comparatifs
- CTA : "Consultation Immédiate" (lien affilié)
- Mobile : Hamburger menu
- Position : sticky, z-index 1000
- **Manquant** : Dropdown Plateformes, dropdown Comparatifs, lien Outils gratuits

---

## 6. Structure Footer Actuel

4 colonnes :
1. **About** : Logo + description
2. **Navigation Rapide** : Voyance Téléphone, Voyance Gratuite, Tarot Amour, Tarot de Marseille, Numérologie, Avis Plateformes, Glossaire, Blog
3. **Informations** : Mentions Légales, Politique de Confidentialité, Politique Cookies, CGU, Contact, Plan du site
4. **Contact** : email

Footer bottom : Copyright + disclaimer + mention affiliés

**Manquant** : Colonne "Comparatifs plateformes", liens individuels vers les 10 plateformes, lien hub comparatifs

---

## 7. Pages Légales Identifiées

| Page | URL | noindex/nofollow |
|------|-----|-----------------|
| Mentions Légales | /legal/mentions-legales/ | Oui |
| Politique Confidentialité | /legal/politique-confidentialite/ | Oui |
| CGU | /legal/cgu/ | Oui |
| Politique Cookies | /legal/politique-cookies/ | Oui |

Les pages légales ont déjà les meta noindex/nofollow.
robots.txt bloque déjà /legal/.
**À faire** : Obfusquer les liens dans le footer (actuellement des `<a href>` classiques).

---

## 8. Pages Alternatives

**Aucune page alternatives n'existe.** 10 pages à créer.

---

## 9. Page Hub Comparatifs

**Pas de page hub dédiée /comparatif/.** La page /avis/ sert actuellement de hub global.
**À créer** : /comparatif/index.html

---

## 10. Problèmes Techniques Repérés

1. **Incohérence Cosmospace** : rating 3.6 dans platforms.json vs 4.8 affiché sur /avis/
2. **Liens légaux non obfusqués** : Les liens footer vers /legal/* sont des <a href> classiques
3. **Pas de colonne Comparatifs dans le footer**
4. **Pas de colonne Plateformes dans le footer**
5. **Pas de dropdown Plateformes dans le header**
6. **40 comparatifs manquants** sur 45
7. **0 pages alternatives** sur 10
8. **Pas de CTAs uniformes** sur les pages de comparatif/avis
9. **Pas de breadcrumbs schema** sur les pages de comparaison existantes
10. **Couleur texte problème** : Certains éléments CSS ont color:#e0e0e0 (gris clair) sur fond blanc — contraste insuffisant

---

## 11. Décisions d'Architecture

- **URL Comparatifs** : Garder le pattern existant /avis/[a]-vs-[b]/ pour tous les comparatifs (ne pas créer /comparatif/[a]-vs-[b]/)
- **Hub Comparatifs** : Créer /comparatif/index.html comme page hub
- **Alternatives** : Créer /alternatives/[plateforme]/ (nouveau répertoire)
- **Données Cosmospace** : Mettre à jour platforms.json avec note 4.8/5

---

## 12. Liens Affiliés Existants

- **Wengo** : https://www.wengo.fr/voyance-astrologie-1270 (isAffiliate: true)
- **Autres plateformes** : Toutes à "#" (isAffiliate: false)
- **CTA principal** : Fonction getAffiliateUrl() dans config.js
- **Cosmospace Audiotel** : 08 92 68 68 82 (code 1211)

---

## 13. Sitemaps

7 sitemaps XML :
- sitemap-core.xml
- sitemap-gratuit.xml
- sitemap-avis.xml
- sitemap-tarot.xml
- sitemap-numerologie.xml
- sitemap-blog.xml
- sitemap-villes.xml
