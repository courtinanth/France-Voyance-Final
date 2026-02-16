(function () {
    'use strict';

    // ═══════════════════════════════════════════════════════════════
    // ACCESSIBILITY WRAPPER - Respect prefers-reduced-motion
    // ═══════════════════════════════════════════════════════════════
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        document.documentElement.classList.add('reduced-motion');
    }

    // ═══════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════
    document.addEventListener('DOMContentLoaded', () => {
        initScrollAnimations();
        initCounters();
        initStickyCta();
        initTestimonialCarousel();
        initFaqAccordion();
        initReadingProgress();
    });

    // ═══════════════════════════════════════════════════════════════
    // 1. SCROLL FADE-IN ANIMATIONS
    // ═══════════════════════════════════════════════════════════════
    function initScrollAnimations() {
        if (prefersReducedMotion) {
            // Make all elements visible immediately
            document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in').forEach(el => {
                el.classList.add('visible');
            });
            return;
        }

        const animatedElements = document.querySelectorAll(
            '.fade-in-up, .fade-in-left, .fade-in-right, .scale-in'
        );

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));

        // Also handle .reveal class elements for backwards compatibility
        const revealElements = document.querySelectorAll('.reveal');
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // ═══════════════════════════════════════════════════════════════
    // 2. ANIMATED COUNTERS
    // ═══════════════════════════════════════════════════════════════
    function initCounters() {
        const counters = document.querySelectorAll('.counter-number, .counter-value');

        if (counters.length === 0) return;

        if (prefersReducedMotion) {
            // Show final values immediately
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                const prefix = counter.getAttribute('data-prefix') || '';
                const suffix = counter.getAttribute('data-suffix') || '';
                if (target) {
                    counter.textContent = prefix + target.toLocaleString('fr-FR') + suffix;
                }
            });
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        if (!target) return;

        const prefix = element.getAttribute('data-prefix') || '';
        const suffix = element.getAttribute('data-suffix') || '';
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing: ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);

            element.textContent = prefix + current.toLocaleString('fr-FR') + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = prefix + target.toLocaleString('fr-FR') + suffix;
            }
        }

        requestAnimationFrame(update);
    }

    // ═══════════════════════════════════════════════════════════════
    // 3. STICKY CTA
    // ═══════════════════════════════════════════════════════════════
    function initStickyCta() {
        const cta = document.querySelector('.sticky-cta');
        if (!cta) return;

        // Create sentinel element at 300px from top
        const sentinel = document.createElement('div');
        sentinel.style.cssText = 'position: absolute; top: 300px; height: 1px; width: 1px; pointer-events: none;';
        document.body.prepend(sentinel);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    cta.classList.add('visible');
                } else {
                    cta.classList.remove('visible');
                }
            });
        }, { threshold: 0 });

        observer.observe(sentinel);

        // Hide CTA near footer to avoid overlap
        const footer = document.querySelector('footer');
        if (footer) {
            const footerObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        cta.style.opacity = '0';
                        cta.style.pointerEvents = 'none';
                    } else {
                        cta.style.opacity = '';
                        cta.style.pointerEvents = '';
                    }
                });
            }, { threshold: 0.1 });
            footerObserver.observe(footer);
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // 4. TESTIMONIAL CAROUSEL
    // ═══════════════════════════════════════════════════════════════
    function initTestimonialCarousel() {
        const carousel = document.getElementById('testimonialCarousel');
        if (!carousel) return;

        const track = carousel.querySelector('.testimonial-track');
        const cards = carousel.querySelectorAll('.testimonial-card');
        const dotsContainer = document.getElementById('testimonialDots');
        const prevBtn = carousel.querySelector('.prev');
        const nextBtn = carousel.querySelector('.next');

        if (!track || cards.length === 0) return;

        let currentIndex = 0;
        let autoSlideInterval;
        const totalSlides = cards.length;

        // Create dots
        if (dotsContainer) {
            cards.forEach((_, i) => {
                const dot = document.createElement('div');
                dot.classList.add('testimonial-dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            });
        }

        function goToSlide(index) {
            currentIndex = index;
            track.style.transform = `translateX(-${index * 100}%)`;

            if (dotsContainer) {
                dotsContainer.querySelectorAll('.testimonial-dot').forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
            }
        }

        function nextSlide() {
            goToSlide((currentIndex + 1) % totalSlides);
        }

        function prevSlide() {
            goToSlide((currentIndex - 1 + totalSlides) % totalSlides);
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetAutoSlide();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetAutoSlide();
            });
        }

        // Auto-slide every 5 seconds
        function startAutoSlide() {
            if (prefersReducedMotion) return;
            autoSlideInterval = setInterval(nextSlide, 5000);
        }

        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }

        // Pause on hover
        carousel.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
        carousel.addEventListener('mouseleave', startAutoSlide);

        // Swipe support for mobile
        let startX = 0;
        let isDragging = false;

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            const diff = startX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextSlide();
                else prevSlide();
                resetAutoSlide();
            }
            isDragging = false;
        }, { passive: true });

        startAutoSlide();
    }

    // ═══════════════════════════════════════════════════════════════
    // 5. FAQ ACCORDION
    // ═══════════════════════════════════════════════════════════════
    function initFaqAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');
        if (faqItems.length === 0) return;

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (!question) return;

            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                const answer = item.querySelector('.faq-answer');

                // Close all others
                faqItems.forEach(other => {
                    if (other !== item) {
                        other.classList.remove('active');
                        const otherAnswer = other.querySelector('.faq-answer');
                        if (otherAnswer) otherAnswer.style.maxHeight = null;
                        const otherQuestion = other.querySelector('.faq-question');
                        if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
                    }
                });

                // Toggle current
                if (!isActive) {
                    item.classList.add('active');
                    if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
                    question.setAttribute('aria-expanded', 'true');
                } else {
                    item.classList.remove('active');
                    if (answer) answer.style.maxHeight = null;
                    question.setAttribute('aria-expanded', 'false');
                }
            });
        });

        // FAQ JSON-LD is already included statically in each page's <head>
        // generateFaqJsonLd();
    }

    function generateFaqJsonLd() {
        const faqItems = document.querySelectorAll('.faq-item');
        if (faqItems.length === 0) return;

        // Check if FAQ JSON-LD already exists
        const existingFaqScript = document.querySelector('script[type="application/ld+json"]');
        if (existingFaqScript) {
            try {
                const existingData = JSON.parse(existingFaqScript.textContent);
                if (existingData['@graph']?.some(item => item['@type'] === 'FAQPage') ||
                    existingData['@type'] === 'FAQPage') {
                    return; // FAQ JSON-LD already exists
                }
            } catch (e) {
                // Continue if parsing fails
            }
        }

        const faqData = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": []
        };

        faqItems.forEach(item => {
            const questionEl = item.querySelector('.faq-question span:first-child, .faq-question');
            const answerEl = item.querySelector('.faq-answer p');

            if (questionEl && answerEl) {
                const questionText = questionEl.textContent.replace(/[+×]$/, '').trim();
                const answerText = answerEl.textContent.trim();

                if (questionText && answerText) {
                    faqData.mainEntity.push({
                        "@type": "Question",
                        "name": questionText,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": answerText
                        }
                    });
                }
            }
        });

        if (faqData.mainEntity.length > 0) {
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.textContent = JSON.stringify(faqData);
            document.head.appendChild(script);
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // 6. READING PROGRESS BAR
    // ═══════════════════════════════════════════════════════════════
    function initReadingProgress() {
        if (prefersReducedMotion) return;

        const progressBar = document.querySelector('.reading-progress-bar, #readingProgress');
        if (!progressBar) return;

        let ticking = false;

        function updateProgress() {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressBar.style.width = progress + '%';
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateProgress();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

})();
