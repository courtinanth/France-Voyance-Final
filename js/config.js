// config.js — Configuration des liens d'affiliation
const AFFILIATE_CONFIG = {
    // URL principale
    mainUrl: "https://www.wengo.fr/voyance-astrologie-1270",

    // URLs par thématique
    urls: {
        default: "https://www.wengo.fr/voyance-astrologie-1270",
        telephone: "https://www.wengo.fr/voyance-astrologie-1270/thema/voyance-telephone",
        chat: "https://www.wengo.fr/voyance-astrologie-1270/thema/voyance-chat",
        tarot: "https://www.wengo.fr/voyance-astrologie-1270/thema/tarot",
        medium: "https://www.wengo.fr/voyance-astrologie-1270/thema/medium",
        amour: "https://www.wengo.fr/voyance-astrologie-1270/thema/voyance-amour",
        astrologie: "https://www.wengo.fr/voyance-astrologie-1270/thema/astrologie",
        numerologie: "https://www.wengo.fr/voyance-astrologie-1270/thema/numerologie"
    },

    // Paramètres UTM (optionnels, laissés vides pour l'instant ou configurables)
    utmSource: "monsite",
    utmMedium: "affiliation",
    utmCampaign: "voyance"
};

// Fonction pour générer l'URL avec UTM
function getAffiliateUrl(type = 'default') {
    const baseUrl = AFFILIATE_CONFIG.urls[type] || AFFILIATE_CONFIG.urls.default;
    // Si besoin d'UTM, décommenter la ligne suivante :
    // const utm = `?utm_source=${AFFILIATE_CONFIG.utmSource}&utm_medium=${AFFILIATE_CONFIG.utmMedium}&utm_campaign=${AFFILIATE_CONFIG.utmCampaign}`;
    // return baseUrl + utm;
    return baseUrl;
}

// Applique les URLs à tous les liens d'affiliation au chargement
document.addEventListener('DOMContentLoaded', function () {
    // Liens génériques
    document.querySelectorAll('a[data-affiliate="default"]').forEach(link => {
        link.href = getAffiliateUrl('default');
    });

    // Liens par thématique
    document.querySelectorAll('a[data-affiliate]').forEach(link => {
        const type = link.getAttribute('data-affiliate');
        // Pour éviter d'écraser si c'est déjà "default" traité au-dessus
        if (type !== 'default') {
            link.href = getAffiliateUrl(type);
        }
    });
});
