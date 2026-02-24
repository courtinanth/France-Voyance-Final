// config.js — Configuration des consultations audiotel & SMS
const CONSULTATION_CONFIG = {
    // Numéro audiotel affilié
    audiotel: {
        numero: "08 92 68 68 82",
        code: "1211",
        tarif: "0,80€/min + prix appel"
    },
    // SMS affilié
    sms: {
        mot: "VOY1211",
        numero: "71700",
        tarif: "0,99€ par SMS + prix SMS"
    },
    // Page de consultation dédiée
    consultationPage: "/consultation/"
};

// Redirige vers la page consultation (remplace l'ancien système Wengo)
function getAffiliateUrl(type) {
    return CONSULTATION_CONFIG.consultationPage;
}

// Au chargement : redirige tous les anciens liens d'affiliation vers /consultation/
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('a[data-affiliate]').forEach(function(link) {
        link.href = CONSULTATION_CONFIG.consultationPage;
        link.removeAttribute('onclick');
        link.removeAttribute('target');
        link.removeAttribute('rel');
    });
});
