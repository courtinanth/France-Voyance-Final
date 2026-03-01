# Liens Affiliés — État des lieux

## Lien actif
| Plateforme | URL | Status |
|-----------|-----|--------|
| Wengo | https://www.wengo.fr/voyance-astrologie-1270 | ACTIF (isAffiliate: true) |

## Liens manquants (placeholder "#")
| Plateforme | Action requise |
|-----------|---------------|
| Cosmospace | Monetisé via Audiotel (08 92 68 68 82 code 1211) — pas de lien affilié web |
| Spiriteo | [LIEN_AFFILIE_SPIRITEO] à fournir |
| MyDéclick | [LIEN_AFFILIE_MYDECLICK] à fournir |
| Jimini | [LIEN_AFFILIE_JIMINI] à fournir |
| Avigora | [LIEN_AFFILIE_AVIGORA] à fournir |
| Kang | [LIEN_AFFILIE_KANG] à fournir |
| Viversum | [LIEN_AFFILIE_VIVERSUM] à fournir |
| Voyance Alice | [LIEN_AFFILIE_VOYANCE_ALICE] à fournir |
| Divinatix | [LIEN_AFFILIE_DIVINATIX] à fournir |

## Stratégie actuelle
- Tous les CTAs redirigent vers /consultation/ (page audiotel Cosmospace)
- La fonction getAffiliateUrl() dans config.js renvoie toujours "/consultation/"
- Les liens data-affiliate sont réécrits au chargement par config.js

## Note
Pour les nouvelles pages (comparatifs, alternatives), les CTAs utilisent :
- CTA Cosmospace Audiotel : tel:0892686882 (monétisation directe)
- CTA autres plateformes : lien vers /consultation/ (fallback) ou placeholder si lien affilié manquant
