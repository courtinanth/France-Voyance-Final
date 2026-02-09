document.addEventListener('DOMContentLoaded', () => {
    // Configuration enrichie
    const CONFIG = {
        probabilities: {
            yes_clear: 0.45,
            no_clear: 0.45,
            yes_nuance: 0.05,
            no_nuance: 0.05
        },
        // TAROT : Arcane Majeurs (22 cards)
        tarot_cards: [
            { name: "Le Bateleur", isYes: true, desc: "Nouveau départ, potentiel infini.", img: "1-le-bateleur.png" },
            { name: "La Papesse", isYes: true, desc: "Sagesse, intuition, patience.", img: "2-la-papesse.png" },
            { name: "L'Impératrice", isYes: true, desc: "Créativité, abondance, succès.", img: "card_3_l_imperatrice.png" },
            { name: "L'Empereur", isYes: true, desc: "Structure, stabilité, autorité.", img: "card_4_l_empereur.png" },
            { name: "Le Pape", isYes: true, desc: "Conseil, moralité, enseignement.", img: "card_5_le_pape.png" },
            { name: "L'Amoureux", isYes: false, desc: "Hésitation, choix difficile, ambiguïté.", img: "card_6_l_amoureux.png" }, // Balanced to No
            { name: "Le Chariot", isYes: true, desc: "Victoire, volonté, avancement rapide.", img: "card_7_le_chariot.png" },
            { name: "La Justice", isYes: true, desc: "Équilibre, vérité, cause à effet.", img: "card_8_la_justice.png" },
            { name: "L'Ermite", isYes: false, desc: "Retrait, introspection, lenteur.", img: "card_9_l_hermite.png" },
            { name: "La Roue de Fortune", isYes: true, desc: "Changement, cycle, destin.", img: "card_10_la_roue_de_fortune.png" },
            { name: "La Force", isYes: true, desc: "Courage, maîtrise, compassion.", img: "card_11_la_force.png" },
            { name: "Le Pendu", isYes: false, desc: "Sacrifice, blocage, attente.", img: "card_12_le_pendu.png" },
            { name: "L'Arcane sans Nom", isYes: false, desc: "Transformation radicale, fin.", img: "card_13_l_arcane_sans_nom.png" },
            { name: "La Tempérance", isYes: true, desc: "Modération, guérison, équilibre.", img: "card_14_temperance.png" },
            { name: "Le Diable", isYes: false, desc: "Tentation, attachement, illusion.", img: "card_15_le_diable.png" },
            { name: "La Maison Dieu", isYes: false, desc: "Choc, révélation, effondrement.", img: "card_16_la_maison_dieu.png" },
            { name: "L'Étoile", isYes: true, desc: "Espoir, inspiration, sérénité.", img: "card_17_l_etoile.png" },
            { name: "La Lune", isYes: false, desc: "Illusion, peur, subconscient.", img: "card_18_la_lune.png" },
            { name: "Le Soleil", isYes: true, desc: "Joie, succès, vitalité.", img: "card_19_le_soleil.png" },
            { name: "Le Jugement", isYes: true, desc: "Renaissance, appel, absolution.", img: "card_20_le_jugement.png" },
            { name: "Le Monde", isYes: true, desc: "Accomplissement, voyage, totalité.", img: "card_21_le_monde.png" },
            { name: "Le Mat", isYes: false, desc: "Imprudence, insouciance, risque.", img: "0-le-mat.png" } // Balanced to No
        ],
        // RUNES
        runes: [
            { symbol: "ᚠ", name: "Fehu", isYes: true, desc: "Abondance et succès matériel." },
            { symbol: "ᚢ", name: "Uruz", isYes: true, desc: "Force vitale et santé." },
            { symbol: "ᚨ", name: "Ansuz", isYes: true, desc: "Communication divine." },
            { symbol: "ᚲ", name: "Kenaz", isYes: true, desc: "Révélation et créativité." },
            { symbol: "ᚹ", name: "Wunjo", isYes: true, desc: "Joie et harmonie." },
            { symbol: "ᛃ", name: "Jera", isYes: true, desc: "Récolte après l'effort." },
            { symbol: "ᛊ", name: "Sowilo", isYes: true, desc: "Le Soleil, succès garanti." },
            { symbol: "ᛗ", name: "Mannaz", isYes: true, desc: "L'aide sociale et humanité." },
            { symbol: "ᚦ", name: "Thurisaz", isYes: false, desc: "Forces chaotiques, prudence." },
            { symbol: "ᚾ", name: "Nauthiz", isYes: false, desc: "Nécessité et contrainte." },
            { symbol: "ᛁ", name: "Isa", isYes: false, desc: "Stagnation, glace." },
            { symbol: "ᛇ", name: "Eihwaz", isYes: false, desc: "Transformation difficile." },
            { symbol: "ᚺ", name: "Hagalaz", isYes: false, desc: "Perturbation incontrôlable." }
        ],
        messages: {
            piece_yes: ["Face Solaire : OUI.", "La pièce brille : OUI."],
            piece_no: ["Face Lunaire : NON.", "La pièce est tombée côté ombre."],
            // 30 Explanations for YES (Pendule)
            pendule_yes_db: [
                "L'ascendant solaire confirme votre intuition : la voie est libre et lumineuse.",
                "Les énergies telluriques sont en parfaite harmonie, c'est un grand OUI.",
                "Jupiter favorise votre expansion dans ce domaine, la réponse est favorable.",
                "Le pendule tourne dans le sens des aiguilles d'une montre, validant votre requête.",
                "Vos guides spirituels acquiescent avec bienveillance.",
                "La synchronicité est parfaite, l'univers s'aligne pour un OUI éclatant.",
                "Comme la Pleine Lune illumine la nuit, la réponse éclaire votre chemin : OUI.",
                "Le flux vibratoire est constant et puissant, indiquant une issue positive.",
                "Vénus apporte sa douceur et son approbation à votre question.",
                "Les obstacles se dissolvent sous la protection de vos anges gardiens.",
                "La roue du karma tourne en votre faveur.",
                "C'est une affirmation cosmique, résonnant avec votre chemin de vie.",
                "L'énergie est fluide, ascendante et créatrice : OUI.",
                "Le pendule oscille avec vigueur, marquant une certitude absolue.",
                "Les aspects planétaires actuels soutiennent cette réalisation.",
                "Votre troisième œil avait déjà perçu cette vérité positive.",
                "La réponse est aussi claire que l'eau de roche : OUI.",
                "L'univers conspire pour votre réussite dans cette affaire.",
                "Une porte s'ouvre sur un horizon prometteur.",
                "La résonance est forte et harmonieuse, fiez-vous à ce OUI.",
                "Les énergies subtiles se cristallisent pour concrétiser ce souhait.",
                "C'est un OUI empreint de sagesse et de maturité.",
                "La vibration est haute, signe d'abondance et de succès.",
                "Le pendule ne laisse aucune place au doute : c'est positif.",
                "Les influences astrales sont parfaitement alignées.",
                "Votre âme connaît déjà la réponse, et le pendule la confirme : OUI.",
                "L'équilibre est atteint, permettant la réalisation de ce désir.",
                "Le mouvement est solaire, expansif et généreux.",
                "Rien ne s'oppose à cette issue favorable.",
                "La lumière triomphe des ombres sur cette question."
            ],
            // 30 Explanations for NO (Pendule)
            pendule_no_db: [
                "Saturne impose ses limites et demande de la patience : c'est NON pour l'instant.",
                "Le pendule oscille en sens inverse, bloquant cette direction.",
                "Les énergies sont actuellement discordantes, la prudence est de mise.",
                "Ne forcez pas le destin, la réponse est clairement négative.",
                "Mercure rétrograde suggère des malentendus, mieux vaut s'abstenir.",
                "Un blocage karmique semble freiner cette issue.",
                "L'univers vous protège en vous refusant cette voie.",
                "La Lune noire jette un voile d'illusion, méfiez-vous.",
                "Le pendule reste statique ou dit NON, respectez ce signal.",
                "Ce n'est pas aligné avec votre mission d'âme actuelle.",
                "Les vibrations sont trop basses pour permettre une réussite.",
                "Il y a des éléments cachés qui rendent cette option défavorable.",
                "Attendez un nouveau cycle lunaire, pour l'heure c'est un refus.",
                "Votre intuition vous mettait déjà en garde, le pendule confirme.",
                "Les vents sont contraires, ne naviguez pas dans cette direction.",
                "Un obstacle majeur, encore invisible, barre la route.",
                "Ce refus est une bénédiction déguisée.",
                "L'énergie se dissipe au lieu de se concentrer : c'est NON.",
                "Le moment n'est pas propice, les astres sont en dissonance.",
                "Il vaut mieux lâcher prise et accepter ce refus.",
                "Le pendule indique un conflit d'intérêts énergétiques.",
                "La voie est sans issue pour le moment.",
                "Préservez votre lumière, ne vous engagez pas là-dedans.",
                "Le vide énergétique autour de cette question indique un NON.",
                "Des influences extérieures perturbent l'harmonie nécessaire.",
                "La sagesse commande de renoncer à cette attente.",
                "Le cycle n'est pas achevé, la réponse est donc négative.",
                "Une énergie de stagnation prédomine.",
                "Ce n'est pas le chemin prévu pour votre évolution.",
                "Le pendule tranche net : c'est un NON ferme."
            ]
        }
    };

    // DOM Elements
    const questionInput = document.getElementById('question-input');
    const methodOptions = document.querySelectorAll('.yn-method-option');
    const submitBtn = document.getElementById('submit-btn');
    const resultContainer = document.querySelector('.yn-result-container');
    const visualizationArea = document.querySelector('.yn-visualization');
    const tarotContainer = document.getElementById('tarot-advanced-flow');

    // Result Elements (Standard)
    const resultAnswer = document.querySelector('.yn-big-answer');
    const resultNuance = document.querySelector('.yn-nuance-text');
    const resultInterpretation = document.querySelector('.yn-interpretation');

    // Loading Element
    const loadingText = document.getElementById('loading-text');

    // Advanced Tarot Elements
    const tfResult = document.getElementById('tf-advanced-result');
    const steps = document.querySelectorAll('.tf-step');
    const btnShuffle = document.getElementById('btn-shuffle');
    const spreadArea = document.querySelector('.tf-spread-area');
    const pickCount = document.getElementById('tf-pick-count');
    const slotsHand = document.getElementById('slots-hand');
    const slotsPos = document.getElementById('slots-pos');
    const slotsNeg = document.getElementById('slots-neg');
    const selectInstruction = document.getElementById('tf-select-instruction');
    const finalCardsContainer = document.getElementById('final-cards-container');
    const gaugeFill = document.getElementById('tf-gauge-fill');
    const tfPercent = document.getElementById('tf-percent');
    const tfVerdict = document.getElementById('tf-verdict');
    const tfSynthesis = document.getElementById('tf-synthesis-text');
    const tfListPos = document.getElementById('tf-list-pos');
    const tfListNeg = document.getElementById('tf-list-neg');
    const tfRestartBtn = document.getElementById('tf-restart-btn');

    const canvas = document.getElementById('particles-canvas');
    let ctx = canvas ? canvas.getContext('2d') : null;

    // State Variables
    let currentMethod = 'tarot'; // Default, will be overwritten by init()
    let tarotState = {
        deck: [],
        hand: [],     // 8 cards
        pos: [],      // 3 cards
        neg: [],      // 3 cards
        final: [],    // 2 cards
        phase: 'shuffle' // shuffle, pick, select_pos, select_neg, reveal
    };

    function init() {
        // Auto-detect method from container
        const container = document.querySelector('.yn-tool-container');
        if (container && container.dataset.tool) {
            currentMethod = container.dataset.tool;
            // Mark option active if exists (though hidden)
            methodOptions.forEach(o => {
                if (o.dataset.method === currentMethod) o.classList.add('active');
                else o.classList.remove('active');
            });
        }

        methodOptions.forEach(opt => {
            opt.addEventListener('click', () => {
                methodOptions.forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
                currentMethod = opt.dataset.method;
                handleMethodChange();
            });
        });

        if (submitBtn) submitBtn.addEventListener('click', handleStandardPrediction);
        if (questionInput) questionInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleStandardPrediction();
        });

        // Advanced Tarot Events
        if (btnShuffle) btnShuffle.addEventListener('click', startTarotShuffle);
        if (tfRestartBtn) tfRestartBtn.addEventListener('click', resetTool);

        // Force Visual Update immediately
        handleMethodChange();
    }

    function handleMethodChange() {
        resetTool();
        // Hide/Show correct Logic Container
        if (currentMethod === 'tarot') {
            if (submitBtn) submitBtn.style.display = 'none';
            if (visualizationArea) visualizationArea.style.display = 'none';
            if (tarotContainer) tarotContainer.style.display = 'block';
            if (tfResult) tfResult.style.display = 'none';
            if (resultContainer) resultContainer.style.display = 'none';
            initTarotFlow();
        } else {
            if (submitBtn) {
                submitBtn.style.display = 'block';
                submitBtn.disabled = false;
            }
            if (visualizationArea) visualizationArea.style.display = 'flex';
            if (tarotContainer) tarotContainer.style.display = 'none';
            if (tfResult) tfResult.style.display = 'none';
            if (resultContainer) resultContainer.style.display = 'none';
            updateVisualizationBase(currentMethod);
        }
    }

    // --- STANDARD LOGIC (Pendule/Piece/Runes) ---
    function updateVisualizationBase(method) {
        document.querySelectorAll('.visual-element').forEach(el => el.classList.remove('active'));
        let elId = `visual-${method}`;
        const el = document.getElementById(elId);
        if (el) el.classList.add('active');
    }

    function handleStandardPrediction() {
        const question = questionInput.value.trim();
        if (question.length < 3) {
            alert("Veuillez poser une question complète.");
            return;
        }
        submitBtn.disabled = true;
        questionInput.disabled = true;

        // Simple Logic for non-tarot
        const rand = Math.random();
        const isYes = rand > 0.5;
        let prediction = { isYes: isYes, type: isYes ? 'yes_clear' : 'no_clear', mainText: isYes ? 'OUI' : 'NON', subText: '', description: '' };

        // Fill details based on method
        if (currentMethod === 'runes') {
            const rune = CONFIG.runes[Math.floor(Math.random() * CONFIG.runes.length)];
            prediction.isYes = rune.isYes;
            prediction.mainText = rune.isYes ? "OUI" : "NON";
            prediction.subText = rune.name;
            prediction.description = rune.desc;
            prediction.meta = rune;
        } else if (currentMethod === 'pendule') {
            // Advanced Pendule Logic from 60 sentences DB
            const pool = isYes ? CONFIG.messages.pendule_yes_db : CONFIG.messages.pendule_no_db;
            // Pick random based on "sense of question" (Random for now as we have no NLP)
            // To simulate "based on question", we can use a hash of the question string to seed the random index?
            // Actually, truly random is better for variety as users might ask same question slightly differently.
            prediction.description = pool[Math.floor(Math.random() * pool.length)];
            prediction.mainText = isYes ? "OUI" : "NON";
        } else {
            // Coin
            const pool = isYes ? CONFIG.messages.piece_yes : CONFIG.messages.piece_no;
            prediction.description = pool[Math.floor(Math.random() * pool.length)];
        }

        // Show Loading Text for Pendule
        if (currentMethod === 'pendule' && loadingText) {
            loadingText.style.display = 'block';
        }

        runStandardAnimation(currentMethod, prediction).then(() => {
            if (loadingText) loadingText.style.display = 'none';
            displayStandardResult(prediction, question);
        });
    }

    function runStandardAnimation(method, prediction) {
        return new Promise((resolve) => {
            if (method === 'pendule') {
                const el = document.querySelector('.pendulum-string');
                const weight = document.querySelector('.pendulum-weight');
                const labelYes = document.getElementById('label-yes');
                const labelNo = document.getElementById('label-no');

                // Reset labels
                if (labelYes) labelYes.style.opacity = '0.3';
                if (labelNo) labelNo.style.opacity = '0.3';

                if (el && weight) {
                    // 1. Thinking Phase
                    el.style.animation = 'swing-search 1s ease-in-out infinite';

                    setTimeout(() => {
                        // 2. Result Phase
                        el.style.animation = 'none';
                        void el.offsetWidth;

                        if (prediction.isYes) {
                            el.style.animation = 'swing-yes 2s ease-in-out forwards';
                            if (labelYes) labelYes.style.opacity = '1';
                        } else {
                            el.style.animation = 'swing-no 2s ease-in-out forwards';
                            if (labelNo) labelNo.style.opacity = '1';
                        }

                        setTimeout(resolve, 2000);
                    }, 3000);
                } else resolve();

            } else {
                // Other methods... simplified for brevity if needed or keep standard
                // ... existing code for piece/runes ...
                if (method === 'piece') {
                    const el = document.querySelector('.coin');
                    if (el) {
                        el.classList.add('tossing');
                        setTimeout(() => {
                            el.classList.remove('tossing');
                            el.style.transform = `rotateX(${720 + (prediction.isYes ? 0 : 180)}deg)`;
                            setTimeout(resolve, 1000);
                        }, 1500);
                    } else resolve();
                } else if (method === 'runes') {
                    const rune = document.querySelector('.rune-stone');
                    if (rune) {
                        rune.classList.remove('falling');
                        void rune.offsetWidth;
                        rune.innerHTML = prediction.meta.symbol;
                        rune.style.color = prediction.isYes ? '#81C784' : '#E57373';
                        rune.classList.add('falling');
                        setTimeout(resolve, 1200);
                    } else resolve();
                } else {
                    resolve();
                }
            }
        });
    }

    function displayStandardResult(prediction, question) {
        // User requested "clean paragraph" and no scroll
        const rCont = document.querySelector('.yn-result-container:not(#tf-advanced-result)');

        if (rCont) {
            // Using a cleaner HTML structure
            // We'll inject HTML directly to format it nicely as requested "paragraphe propre"

            // Build the content
            const htmlContent = `
                <div style="padding: 20px; border: 1px solid var(--color-gold); border-radius: 10px; background: rgba(0,0,0,0.2);">
                    <p style="text-align: center; font-family: 'Playfair Display', serif; font-size: 1.2rem; color: #fff; line-height: 1.6;">
                        <span style="display: block; font-size: 1.5rem; color: ${prediction.isYes ? '#2ecc71' : '#e74c3c'}; font-weight: bold; margin-bottom: 10px;">
                            ${prediction.mainText}
                        </span>
                        ${prediction.description}
                    </p>
                    <div style="text-align: center; margin-top:20px; display: flex; flex-direction: column; align-items: center; gap: 15px;">
                        <a href="/consulter/voyance-telephone/" class="yn-btn-action" style="text-decoration: none; display: inline-block; padding: 10px 25px; font-size: 0.9rem; background: #fff; color: var(--color-primary); margin: 0; max-width: 250px;">
                            <i class="fa-solid fa-phone" style="margin-right: 8px;"></i> Parler à un voyant
                        </a>
                        <button onclick="location.reload()" class="btn btn-outline" style="font-size: 0.8rem; padding: 5px 15px;">Nouvelle Question</button>
                    </div>
                </div>
            `;

            rCont.innerHTML = htmlContent;

            rCont.classList.add('show');
            rCont.style.display = 'block';
            // NO AUTO SCROLL
        }
    }

    // --- ADVANCED TAROT LOGIC ---
    function initTarotFlow() {
        showStep('tf-step-shuffle');
        tarotState = { deck: [], hand: [], pos: [], neg: [], final: [], phase: 'shuffle' };
        // Clean UI
        if (spreadArea) spreadArea.innerHTML = '';
        if (slotsHand) slotsHand.innerHTML = '';
        if (slotsPos) {
            slotsPos.innerHTML = '';
            if (slotsPos.previousElementSibling) slotsPos.previousElementSibling.innerText = 'Atouts (0/3)';
        }
        if (slotsNeg) {
            slotsNeg.innerHTML = '';
            if (slotsNeg.previousElementSibling) slotsNeg.previousElementSibling.innerText = 'Blocages (0/3)';
        }
        if (finalCardsContainer) finalCardsContainer.innerHTML = '';
        tfGaugeReset();

        // Stop shuffling anim if any
        const deck = document.querySelector('.tf-card-deck');
        if (deck) deck.classList.remove('shuffling');
    }

    function showStep(id) {
        steps.forEach(s => s.classList.remove('active'));
        const el = document.getElementById(id);
        if (el) el.classList.add('active');
    }

    function startTarotShuffle() {
        btnShuffle.disabled = true;
        const deckEl = document.querySelector('.tf-card-deck');
        if (deckEl) deckEl.classList.add('shuffling');

        // USER REQUEST: Simulate shuffling (wait for animation)
        setTimeout(() => {
            if (deckEl) deckEl.classList.remove('shuffling');
            btnShuffle.disabled = false;

            // Proceed to pick
            startTarotPick();

        }, 1500); // 1.5s shuffle
    }

    function startTarotPick() {
        // Generate Deck
        tarotState.deck = [...CONFIG.tarot_cards].sort(() => Math.random() - 0.5);

        showStep('tf-step-pick');
        tarotState.phase = 'pick';
        if (pickCount) pickCount.innerText = '8';

        // Spread 22 cards in a grid (6x4 approx) to ensure accessibility
        if (spreadArea) {
            spreadArea.innerHTML = '';
            const cols = 6;
            const rows = 4;
            const xStep = 100 / cols;
            const yStep = 100 / rows;

            for (let i = 0; i < 22; i++) {
                let card = document.createElement('div');
                card.className = 'tf-spread-card';

                // Grid position
                const col = i % cols;
                const row = Math.floor(i / cols);

                // Add slight randomness within the cell
                const randomX = (Math.random() - 0.5) * 5; // +/- 2.5%
                const randomY = (Math.random() - 0.5) * 5; // +/- 2.5%

                // Center in cell
                const left = (col * xStep) + (xStep / 2) + randomX;
                const top = (row * yStep) + (yStep / 2) + randomY;

                card.style.left = `${left}%`;
                card.style.top = `${top}%`;
                card.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 20 - 10}deg)`; // Slight rotation

                card.onclick = () => {
                    if (tarotState.hand.length < 8) {
                        card.classList.add('picked');
                        tarotState.hand.push(tarotState.deck[i]);
                        pickCount.innerText = 8 - tarotState.hand.length;

                        if (tarotState.hand.length === 8) {
                            setTimeout(startSelectionPhase, 500);
                        }
                    }
                };
                spreadArea.appendChild(card);
            }
        }
    }

    function startSelectionPhase() {
        showStep('tf-step-selection');
        tarotState.phase = 'select_pos';
        if (selectInstruction) {
            selectInstruction.innerText = "Sélectionnez 3 cartes qui représentent vos atouts (Positif).";
            selectInstruction.style.color = "#2ecc71";
        }

        // Render Hand
        renderHand();
    }

    function renderHand() {
        if (!slotsHand) return;
        slotsHand.innerHTML = '';
        tarotState.hand.forEach((card, idx) => {
            let el = document.createElement('div');
            el.className = 'tf-play-card';
            // Insert Image AND Name
            el.innerHTML = `
                <div style="height: 100%; position: relative;">
                    <img src="/images/tarot/${card.img}" alt="${card.name}" style="width:100%;height:100%;object-fit:cover;border-radius:4px;">
                    <div class="tf-card-label">${card.name}</div>
                </div>
            `;
            el.onclick = () => handleCardSelect(card, idx);
            slotsHand.appendChild(el);
        });
    }

    function handleCardSelect(card, idx) {
        // Move from Hand to Target Zone
        if (tarotState.phase === 'select_pos') {
            if (tarotState.pos.length < 3) {
                tarotState.pos.push(card);
                tarotState.hand.splice(idx, 1);
                addCardToSlot(slotsPos, 'selected-pos', card);

                // Update Counter
                if (slotsPos && slotsPos.previousElementSibling) {
                    slotsPos.previousElementSibling.innerText = `Atouts (${tarotState.pos.length}/3)`;
                }

                renderHand();

                if (tarotState.pos.length === 3) {
                    tarotState.phase = 'select_neg';
                    if (selectInstruction) {
                        selectInstruction.innerText = "Maintenant, sélectionnez 3 cartes pour vos blocages (Négatif).";
                        selectInstruction.style.color = "#e74c3c";
                    }
                }
            }
        } else if (tarotState.phase === 'select_neg') {
            if (tarotState.neg.length < 3) {
                tarotState.neg.push(card);
                tarotState.hand.splice(idx, 1);
                addCardToSlot(slotsNeg, 'selected-neg', card);

                // Update Counter
                if (slotsNeg && slotsNeg.previousElementSibling) {
                    slotsNeg.previousElementSibling.innerText = `Blocages (${tarotState.neg.length}/3)`;
                }

                renderHand();

                if (tarotState.neg.length === 3) {
                    // Start Reveal
                    setTimeout(startRevealPhase, 500);
                }
            }
        }
    }

    function addCardToSlot(container, className, card) {
        if (!container) return;
        let el = document.createElement('div');
        el.className = `tf-play-card ${className}`;
        if (card) {
            el.innerHTML = `<img src="/images/tarot/${card.img}" alt="${card.name}" style="width:100%;height:100%;object-fit:cover;border-radius:4px;">`;
        }
        container.appendChild(el);
    }

    function startRevealPhase() {
        tarotState.final = tarotState.hand; // Remaining 2 cards
        showStep('tf-step-reveal');

        // Render 2 final cards hidden
        if (finalCardsContainer) {
            finalCardsContainer.innerHTML = '';

            tarotState.final.forEach((card, i) => {
                let wrapper = document.createElement('div');
                wrapper.className = 'tf-final-card spinning'; // Add spinning class immediately

                // Add slight variation to rotation
                wrapper.style.animationDelay = `${i * 0.2}s`;

                wrapper.innerHTML = `
                    <div class="tf-final-card-inner">
                        <div class="tf-face-back">★</div>
                        <div class="tf-face-front" style="padding:0; overflow:hidden;">
                            <img src="/images/tarot/${card.img}" alt="${card.name}" style="width:100%; height:100%; object-fit:cover; border-radius:8px;">
                            <div style="position:absolute; bottom:0; left:0; width:100%; background:rgba(0,0,0,0.7); color:#fff; font-size:0.8rem; padding:5px;">
                                ${card.name}
                            </div>
                        </div>
                    </div>
                `;
                finalCardsContainer.appendChild(wrapper);
            });
        }

        // USER REQUEST: Spin for 3 seconds
        setTimeout(() => {
            document.querySelectorAll('.tf-final-card').forEach((c, i) => {
                c.classList.remove('spinning'); // Stop spin
                // Ensure they face back first
                c.style.transform = 'rotateY(0deg)';

                // Flip reveal
                setTimeout(() => c.classList.add('flipped'), i * 300 + 100);
            });

            setTimeout(calculateAndShowResult, 2000);
        }, 3000);
    }

    function calculateAndShowResult() {
        // Fix for "Aucun résultat ne s'affiche"
        // Ensure container is visible
        if (tarotContainer) tarotContainer.style.display = 'none';

        // IMPORTANT: Add 'show' class to ensure visibility in CSS
        if (tfResult) {
            tfResult.classList.add('show');
            tfResult.style.display = 'block';
        }

        // SCORING LOGIC
        let score = 50;

        tarotState.pos.forEach(c => score += (c.isYes ? 15 : 5));
        tarotState.neg.forEach(c => score -= (c.isYes ? 5 : 15));
        tarotState.final.forEach(c => score += (c.isYes ? 20 : -20));

        score = Math.max(0, Math.min(100, score));

        // Synthesis
        const verdict = score > 55 ? 'OUI' : (score < 45 ? 'NON' : 'MITIGÉ');
        const color = score > 55 ? '#2ecc71' : (score < 45 ? '#e74c3c' : '#f39c12');

        if (tfVerdict) {
            tfVerdict.innerText = verdict;
            // Removed color assignment to prevent Green text on Green background
            // tfVerdict.style.color = color;
            tfVerdict.style.color = '#fff'; // Ensure white for contrast
        }

        // Gauge Anim
        setTimeout(() => {
            if (gaugeFill) {
                gaugeFill.style.width = `${score}%`;
                gaugeFill.style.background = color;
            }

            let curr = 0;
            // Prevent infinite loop if score is 0
            if (score > 0) {
                let timer = setInterval(() => {
                    curr++;
                    if (tfPercent) tfPercent.innerText = `${curr}%`;
                    if (curr >= score) clearInterval(timer);
                }, 20);
            } else {
                if (tfPercent) tfPercent.innerText = '0%';
            }
        }, 500);

        // Text Generation
        let text = `Votre tirage met en lumière une situation complexe. `;
        if (tarotState.pos[0]) text += `Vos atouts principaux résident dans l'énergie de <strong>${tarotState.pos[0].name}</strong>, qui vous pousse à avancer. `;
        if (tarotState.neg[0]) text += `Cependant, <strong>${tarotState.neg[0].name}</strong> représente un frein qu'il ne faut pas ignorer. `;
        if (tarotState.final[0] && tarotState.final[1]) text += `L'issue probable, portée par <strong>${tarotState.final[0].name}</strong> et <strong>${tarotState.final[1].name}</strong>, `;

        if (score > 60) text += "indique un dénouement très favorable si vous gardez confiance.";
        else if (score < 40) text += "suggère de la prudence. Les étoiles ne sont pas alignées pour l'instant.";
        else text += "reste incertaine. Tout dépendra de votre volonté à surmonter les obstacles identifiés.";

        if (tfSynthesis) tfSynthesis.innerHTML = text;

        // Lists
        if (tfListPos) tfListPos.innerHTML = tarotState.pos.map(c => `<li>${c.name} : ${c.desc}</li>`).join('');
        if (tfListNeg) tfListNeg.innerHTML = tarotState.neg.map(c => `<li>${c.name} : ${c.desc}</li>`).join('');

        // Scroll to result
        // Scroll to result - REMOVED per user request
        // if (tfResult) tfResult.scrollIntoView({ behavior: 'smooth' });
    }

    function tfGaugeReset() {
        if (gaugeFill) gaugeFill.style.width = '0%';
        if (tfPercent) tfPercent.innerText = '0%';
    }

    function resetTool() {
        if (submitBtn) submitBtn.disabled = false;
        if (questionInput) questionInput.disabled = false;
        if (resultContainer) resultContainer.classList.remove('show');
        if (tfResult) {
            tfResult.classList.remove('show'); // Important
            tfResult.style.display = 'none';
        }
        if (loadingText) loadingText.style.display = 'none';

        // Reset animations
        const pString = document.querySelector('.pendulum-string');
        if (pString) pString.style.animation = 'swing-idle 3s ease-in-out infinite';

        if (currentMethod === 'tarot') {
            if (tarotContainer) tarotContainer.style.display = 'block';
            initTarotFlow();
        } else {
            if (tarotContainer) tarotContainer.style.display = 'none';
            if (visualizationArea) visualizationArea.style.display = 'flex';
            resetStandardAnimations();
        }
    }

    function resetStandardAnimations() {
        const c = document.querySelector('.coin');
        if (c) c.style.transform = 'rotateX(0)';
    }

    init();
});
