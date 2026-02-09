document.addEventListener('DOMContentLoaded', () => {
    initServiceWorker();
    if (typeof initLogger === 'function') {
        initLogger();
    }
    initMobileMenu();
    initCookieConsent();
});

// =============================================
// Service Worker Registration (PWA)
// =============================================
function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                })
                .catch(err => {
                    console.log('ServiceWorker registration failed: ', err);
                });
        });
    }
}

// =============================================
// Mobile Menu Toggle
// =============================================
function initMobileMenu() {
    console.log('📱 initMobileMenu called');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mainNav = document.querySelector('.main-nav');
    const body = document.body;

    if (!mobileToggle || !mainNav) return;

    // Toggle menu on hamburger click
    mobileToggle.addEventListener('click', (e) => {
        console.log('🍔 Hamburger clicked!');
        e.stopPropagation();
        mainNav.classList.toggle('active');
        body.classList.toggle('menu-open');
        console.log('🍔 Menu classes toggled. Active:', mainNav.classList.contains('active'));

        // Toggle hamburger icon
        const icon = mobileToggle.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    });

    // Mobile Menu Item Handling
    const navLinks = mainNav.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // Only apply mobile logic at the correct breakpoint
            if (window.innerWidth > 992) return;

            // Find the parent item
            const parentItem = this.closest('.nav-item');
            if (!parentItem) return;

            // Check if this item has a dropdown menu
            const submenu = parentItem.querySelector('.dropdown-menu');

            if (submenu) {
                // IT HAS A DROPDOWN - TOGGLE IT
                e.preventDefault();
                e.stopPropagation();

                // Toggle the class on the parent
                parentItem.classList.toggle('dropdown-open');

                // Optional: Close other open dropdowns (accordion behavior)
                const allNavItems = mainNav.querySelectorAll('.nav-item');
                allNavItems.forEach(item => {
                    if (item !== parentItem && item.classList.contains('dropdown-open')) {
                        item.classList.remove('dropdown-open');
                    }
                });
            } else {
                // NO DROPDOWN - IT IS A LINK - NAVIGATE AND CLOSE MENU
                // Allow default click action (navigation) to proceed

                // Close the mobile menu
                mainNav.classList.remove('active');
                body.classList.remove('menu-open');

                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mainNav.contains(e.target) && !mobileToggle.contains(e.target)) {
            mainNav.classList.remove('active');
            body.classList.remove('menu-open');
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
}

// =============================================
// Cookie Consent System - 60 Day Persistence
// =============================================
function initCookieConsent() {
    const COOKIE_NAME = 'fva_cookie_consent';
    const COOKIE_DURATION = 60; // days

    // Check if consent already given
    if (getCookie(COOKIE_NAME)) {
        return; // Already consented
    }

    // Create cookie banner
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.innerHTML = `
        <div class="cookie-content">
            <div class="cookie-text">
                <i class="fas fa-cookie-bite"></i>
                <p>Nous utilisons des cookies pour améliorer votre expérience sur notre site. En continuant à naviguer, vous acceptez notre <a href="/legal/politique-cookies/">politique de cookies</a>.</p>
            </div>
            <div class="cookie-actions">
                <button class="btn btn-outline cookie-settings">Personnaliser</button>
                <button class="btn btn-gold cookie-accept">Accepter</button>
            </div>
        </div>
    `;
    document.body.appendChild(banner);

    // Create settings modal
    const settingsModal = document.createElement('div');
    settingsModal.className = 'cookie-modal';
    settingsModal.innerHTML = `
        <div class="cookie-modal-content">
            <h3><i class="fas fa-cog"></i> Paramètres des cookies</h3>
            <div class="cookie-options">
                <div class="cookie-option">
                    <label>
                        <input type="checkbox" checked disabled>
                        <span class="cookie-option-title">Cookies essentiels</span>
                    </label>
                    <p>Nécessaires au fonctionnement du site. Ne peuvent pas être désactivés.</p>
                </div>
                <div class="cookie-option">
                    <label>
                        <input type="checkbox" id="cookie-analytics" checked>
                        <span class="cookie-option-title">Cookies analytiques</span>
                    </label>
                    <p>Nous aident à comprendre comment vous utilisez le site.</p>
                </div>
                <div class="cookie-option">
                    <label>
                        <input type="checkbox" id="cookie-marketing" checked>
                        <span class="cookie-option-title">Cookies marketing</span>
                    </label>
                    <p>Utilisés pour vous montrer des publicités pertinentes.</p>
                </div>
            </div>
            <div class="cookie-modal-actions">
                <button class="btn btn-outline cookie-reject-all">Tout refuser</button>
                <button class="btn btn-gold cookie-save">Enregistrer mes préférences</button>
            </div>
        </div>
    `;
    document.body.appendChild(settingsModal);

    // Show banner with animation
    setTimeout(() => banner.classList.add('visible'), 500);

    // Event handlers
    banner.querySelector('.cookie-accept').addEventListener('click', () => {
        acceptAllCookies();
        hideBanner();
    });

    banner.querySelector('.cookie-settings').addEventListener('click', () => {
        settingsModal.classList.add('visible');
    });

    settingsModal.querySelector('.cookie-save').addEventListener('click', () => {
        savePreferences();
        hideBanner();
        settingsModal.classList.remove('visible');
    });

    settingsModal.querySelector('.cookie-reject-all').addEventListener('click', () => {
        rejectAllCookies();
        hideBanner();
        settingsModal.classList.remove('visible');
    });

    // Close modal when clicking outside
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.classList.remove('visible');
        }
    });

    function acceptAllCookies() {
        setCookie(COOKIE_NAME, JSON.stringify({
            essential: true,
            analytics: true,
            marketing: true,
            timestamp: Date.now()
        }), COOKIE_DURATION);
    }

    function rejectAllCookies() {
        setCookie(COOKIE_NAME, JSON.stringify({
            essential: true,
            analytics: false,
            marketing: false,
            timestamp: Date.now()
        }), COOKIE_DURATION);
    }

    function savePreferences() {
        setCookie(COOKIE_NAME, JSON.stringify({
            essential: true,
            analytics: document.getElementById('cookie-analytics').checked,
            marketing: document.getElementById('cookie-marketing').checked,
            timestamp: Date.now()
        }), COOKIE_DURATION);
    }

    function hideBanner() {
        banner.classList.remove('visible');
        setTimeout(() => banner.remove(), 300);
    }
}

// Cookie utility functions
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
}


// Duplicate functions (initScrollAnimations, initCounters, initStickyCTA, initReadingProgress, initFAQ)
// have been removed to avoid conflicts with js/animations.js which handles them with better logic.
