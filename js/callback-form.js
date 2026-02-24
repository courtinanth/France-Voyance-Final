// callback-form.js — Formulaire "Faites-vous rappeler" avec envoi vers Google Sheets
(function() {
    'use strict';

    // ========================================
    // CONFIGURATION — Remplacer par l'URL de votre Google Apps Script déployé
    // ========================================
    var GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycby6IhVCqfqwBXN92kZYHfAu1ZJwBOvR4A44F3iE7K_oyz_pQOEl5NBLlowkEbXlB-Jl/exec';

    // Initialise tous les formulaires callback sur la page
    document.addEventListener('DOMContentLoaded', function() {
        var forms = document.querySelectorAll('.callback-form');
        forms.forEach(function(form) {
            form.addEventListener('submit', handleFormSubmit);
        });
    });

    function handleFormSubmit(e) {
        e.preventDefault();

        var form = e.target;
        var submitBtn = form.querySelector('button[type="submit"]');
        var successEl = form.querySelector('[id$="-success"], .cb-success');
        var errorEl = form.querySelector('[id$="-error"], .cb-error');

        // Récupérer les valeurs
        var emailInput = form.querySelector('input[type="email"]');
        var phoneInput = form.querySelector('input[type="tel"]');
        var rgpdInput = form.querySelector('input[type="checkbox"]');

        var email = emailInput ? emailInput.value.trim() : '';
        var phone = phoneInput ? phoneInput.value.trim() : '';

        // Validation
        if (!email || !phone) {
            showMessage(errorEl, 'Veuillez remplir tous les champs.');
            return;
        }

        if (rgpdInput && !rgpdInput.checked) {
            showMessage(errorEl, 'Veuillez accepter la politique de confidentialité.');
            return;
        }

        // Validation email simple
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showMessage(errorEl, 'Veuillez entrer une adresse email valide.');
            return;
        }

        // Validation téléphone
        var phoneClean = phone.replace(/[\s\-\+]/g, '');
        if (phoneClean.length < 10 || !/^\+?\d+$/.test(phoneClean)) {
            showMessage(errorEl, 'Veuillez entrer un numéro de téléphone valide.');
            return;
        }

        // Désactiver le bouton
        var originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="margin-right: 10px;"></i> Envoi en cours...';

        // Masquer les messages précédents
        hideMessage(successEl);
        hideMessage(errorEl);

        // Date et heure françaises
        var now = new Date();
        var dateStr = now.toLocaleDateString('fr-FR', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
        var heureStr = now.toLocaleTimeString('fr-FR', {
            hour: '2-digit', minute: '2-digit'
        });

        // Page source
        var pageSource = window.location.pathname;

        // Données à envoyer
        var formData = new FormData();
        formData.append('date', dateStr);
        formData.append('heure', heureStr);
        formData.append('email', email);
        formData.append('telephone', phone);
        formData.append('page', pageSource);

        // Envoi vers Google Sheets (mode no-cors pour éviter les erreurs CORS avec Apps Script)
        fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: formData
        })
        .then(function() {
            // Avec no-cors la réponse est opaque (status 0) mais les données sont envoyées
            showSuccessAboveForm(form);
            form.reset();
        })
        .catch(function() {
            showMessage(errorEl);
        })
        .finally(function() {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        });
    }

    function showMessage(el, customText) {
        if (!el) return;
        if (customText) {
            el.innerHTML = '<i class="fa-solid fa-circle-exclamation" style="margin-right: 8px;"></i> ' + customText;
        }
        el.style.display = 'block';
        setTimeout(function() {
            el.style.display = 'none';
        }, 8000);
    }

    function hideMessage(el) {
        if (el) el.style.display = 'none';
    }

    function showSuccessAboveForm(form) {
        // Supprimer un ancien message s'il existe
        var existing = form.parentNode.querySelector('.cb-rappel-confirm');
        if (existing) existing.remove();

        var msg = document.createElement('div');
        msg.className = 'cb-rappel-confirm';
        msg.style.cssText = 'margin-bottom: 20px; padding: 18px 20px; background: rgba(46,204,113,0.15); border: 1px solid rgba(46,204,113,0.4); border-radius: 10px; color: #2ecc71; font-size: 1rem; text-align: center; animation: fadeIn 0.3s ease;';
        msg.innerHTML = '<i class="fa-solid fa-circle-check" style="margin-right: 10px; font-size: 1.2rem;"></i> <strong>Merci !</strong> Un de nos voyants va vous rappeler très bientôt.';

        // Insérer au-dessus du formulaire
        form.parentNode.insertBefore(msg, form);

        // Auto-masquer après 10 secondes
        setTimeout(function() {
            msg.style.opacity = '0';
            msg.style.transition = 'opacity 0.5s ease';
            setTimeout(function() { msg.remove(); }, 500);
        }, 10000);
    }
})();
