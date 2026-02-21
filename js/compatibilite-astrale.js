/**
 * France Voyance Avenir - Compatibilite Astrologique
 * Calculateur interactif de compatibilite entre signes du zodiaque
 */

const CompatibiliteApp = {

    // ============================================================
    // DATA: 12 signes du zodiaque
    // ============================================================
    signes: [
        {
            id: 0, nom: 'Belier', symbol: '\u2648', emoji: '\u2648',
            element: 'Feu', dates: '21 mars - 19 avril', planete: 'Mars',
            traits: ['Courageux', 'Dynamique', 'Impulsif']
        },
        {
            id: 1, nom: 'Taureau', symbol: '\u2649', emoji: '\u2649',
            element: 'Terre', dates: '20 avril - 20 mai', planete: 'Venus',
            traits: ['Fidele', 'Sensuel', 'Determine']
        },
        {
            id: 2, nom: 'Gemeaux', symbol: '\u264A', emoji: '\u264A',
            element: 'Air', dates: '21 mai - 20 juin', planete: 'Mercure',
            traits: ['Curieux', 'Communicatif', 'Adaptable']
        },
        {
            id: 3, nom: 'Cancer', symbol: '\u264B', emoji: '\u264B',
            element: 'Eau', dates: '21 juin - 22 juillet', planete: 'Lune',
            traits: ['Protecteur', 'Intuitif', 'Sensible']
        },
        {
            id: 4, nom: 'Lion', symbol: '\u264C', emoji: '\u264C',
            element: 'Feu', dates: '23 juillet - 22 aout', planete: 'Soleil',
            traits: ['Genereux', 'Charismatique', 'Fier']
        },
        {
            id: 5, nom: 'Vierge', symbol: '\u264D', emoji: '\u264D',
            element: 'Terre', dates: '23 aout - 22 septembre', planete: 'Mercure',
            traits: ['Analytique', 'Perfectionniste', 'Devouee']
        },
        {
            id: 6, nom: 'Balance', symbol: '\u264E', emoji: '\u264E',
            element: 'Air', dates: '23 septembre - 22 octobre', planete: 'Venus',
            traits: ['Diplomate', 'Harmonieux', 'Esthetique']
        },
        {
            id: 7, nom: 'Scorpion', symbol: '\u264F', emoji: '\u264F',
            element: 'Eau', dates: '23 octobre - 21 novembre', planete: 'Pluton',
            traits: ['Passionnee', 'Magnetique', 'Intense']
        },
        {
            id: 8, nom: 'Sagittaire', symbol: '\u2650', emoji: '\u2650',
            element: 'Feu', dates: '22 novembre - 21 decembre', planete: 'Jupiter',
            traits: ['Aventurier', 'Optimiste', 'Philosophe']
        },
        {
            id: 9, nom: 'Capricorne', symbol: '\u2651', emoji: '\u2651',
            element: 'Terre', dates: '22 decembre - 19 janvier', planete: 'Saturne',
            traits: ['Ambitieux', 'Discipline', 'Perseverant']
        },
        {
            id: 10, nom: 'Verseau', symbol: '\u2652', emoji: '\u2652',
            element: 'Air', dates: '20 janvier - 18 fevrier', planete: 'Uranus',
            traits: ['Independant', 'Visionnaire', 'Original']
        },
        {
            id: 11, nom: 'Poissons', symbol: '\u2653', emoji: '\u2653',
            element: 'Eau', dates: '19 fevrier - 20 mars', planete: 'Neptune',
            traits: ['Reveur', 'Empathique', 'Artistique']
        }
    ],

    // ============================================================
    // MATRICE DE COMPATIBILITE 12x12 (scores 0-100)
    // Ordre: Belier, Taureau, Gemeaux, Cancer, Lion, Vierge,
    //        Balance, Scorpion, Sagittaire, Capricorne, Verseau, Poissons
    // ============================================================
    matrice: [
        //  Be  Ta  Ge  Ca  Li  Vi  Ba  Sc  Sa  Cp  Ve  Po
        [78, 42, 83, 47, 95, 53, 72, 65, 93, 50, 80, 55], // Belier
        [42, 82, 38, 90, 68, 92, 75, 88, 35, 95, 52, 85], // Taureau
        [83, 38, 76, 45, 85, 60, 93, 40, 82, 48, 95, 52], // Gemeaux
        [47, 90, 45, 80, 50, 78, 42, 92, 38, 70, 45, 95], // Cancer
        [95, 68, 85, 50, 80, 55, 88, 72, 92, 48, 70, 45], // Lion
        [53, 92, 60, 78, 55, 75, 62, 85, 48, 93, 58, 72], // Vierge
        [72, 75, 93, 42, 88, 62, 70, 55, 78, 50, 90, 48], // Balance
        [65, 88, 40, 92, 72, 85, 55, 82, 52, 78, 60, 90], // Scorpion
        [93, 35, 82, 38, 92, 48, 78, 52, 80, 45, 88, 55], // Sagittaire
        [50, 95, 48, 70, 48, 93, 50, 78, 45, 82, 55, 68], // Capricorne
        [80, 52, 95, 45, 70, 58, 90, 60, 88, 55, 78, 50], // Verseau
        [55, 85, 52, 95, 45, 72, 48, 90, 55, 68, 50, 82]  // Poissons
    ],

    // ============================================================
    // STATE
    // ============================================================
    state: {
        signe1: null,
        signe2: null,
        currentScreen: 'intro'
    },

    // ============================================================
    // INIT
    // ============================================================
    init() {
        this.cacheDOM();
        this.renderSigneGrids();
        this.bindEvents();
    },

    cacheDOM() {
        this.dom = {
            screenIntro: document.getElementById('screen-intro'),
            screenResult: document.getElementById('screen-result'),
            grid1: document.getElementById('signe-grid-1'),
            grid2: document.getElementById('signe-grid-2'),
            btnCalculer: document.getElementById('btn-calculer'),
            resultContainer: document.getElementById('compat-result-container'),
            btnRestart: document.getElementById('btn-restart')
        };
    },

    // ============================================================
    // RENDER: grilles de signes cliquables
    // ============================================================
    renderSigneGrids() {
        if (!this.dom.grid1 || !this.dom.grid2) return;

        const buildGrid = (gridEl, playerNum) => {
            gridEl.innerHTML = '';
            this.signes.forEach((signe, idx) => {
                const card = document.createElement('div');
                card.className = 'sign-card';
                card.dataset.index = idx;
                card.dataset.player = playerNum;
                card.innerHTML = `
                    <div class="sign-card-symbol">${signe.emoji}</div>
                    <div class="sign-card-name">${signe.nom}</div>
                `;
                gridEl.appendChild(card);
            });
        };

        buildGrid(this.dom.grid1, 1);
        buildGrid(this.dom.grid2, 2);
        this.updateCalculerButton();
    },

    // ============================================================
    // EVENTS
    // ============================================================
    bindEvents() {
        // Signe card clicks
        document.querySelectorAll('.sign-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.dataset.index);
                const player = parseInt(e.currentTarget.dataset.player);
                this.selectSigne(idx, player, e.currentTarget);
            });
        });

        // Calculer button
        if (this.dom.btnCalculer) {
            this.dom.btnCalculer.addEventListener('click', () => {
                if (this.state.signe1 !== null && this.state.signe2 !== null) {
                    this.calculerCompatibilite();
                }
            });
        }

        // Restart button
        if (this.dom.btnRestart) {
            this.dom.btnRestart.addEventListener('click', () => {
                this.restart();
            });
        }
    },

    selectSigne(idx, player, cardEl) {
        const gridEl = player === 1 ? this.dom.grid1 : this.dom.grid2;
        gridEl.querySelectorAll('.sign-card').forEach(c => c.classList.remove('selected'));
        cardEl.classList.add('selected');

        if (player === 1) {
            this.state.signe1 = idx;
        } else {
            this.state.signe2 = idx;
        }
        this.updateCalculerButton();
    },

    updateCalculerButton() {
        if (!this.dom.btnCalculer) return;
        if (this.state.signe1 !== null && this.state.signe2 !== null) {
            this.dom.btnCalculer.classList.add('active');
            this.dom.btnCalculer.disabled = false;
        } else {
            this.dom.btnCalculer.classList.remove('active');
            this.dom.btnCalculer.disabled = true;
        }
    },

    // ============================================================
    // CALCUL & NAVIGATION
    // ============================================================
    calculerCompatibilite() {
        const s1 = this.signes[this.state.signe1];
        const s2 = this.signes[this.state.signe2];
        const scoreGlobal = this.matrice[this.state.signe1][this.state.signe2];

        // Derive sub-scores from global + element affinity
        const scores = this.generateSubScores(this.state.signe1, this.state.signe2, scoreGlobal);
        const analysis = this.generateAnalysis(s1, s2, scoreGlobal, scores);

        // Show loading then result
        this.showScreen('result');
        this.renderLoading();

        setTimeout(() => {
            this.renderResult(s1, s2, scoreGlobal, scores, analysis);
        }, 2200);
    },

    showScreen(name) {
        if (this.dom.screenIntro) this.dom.screenIntro.classList.remove('active');
        if (this.dom.screenResult) this.dom.screenResult.classList.remove('active');

        if (name === 'intro' && this.dom.screenIntro) {
            this.dom.screenIntro.classList.add('active');
        } else if (name === 'result' && this.dom.screenResult) {
            this.dom.screenResult.classList.add('active');
        }

        this.state.currentScreen = name;

        // Scroll to top of app
        const container = document.querySelector('.tarot-app-container');
        if (container) {
            const offset = container.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
    },

    restart() {
        this.state.signe1 = null;
        this.state.signe2 = null;
        document.querySelectorAll('.sign-card').forEach(c => c.classList.remove('selected'));
        this.updateCalculerButton();
        this.showScreen('intro');
    },

    // ============================================================
    // SUB-SCORES GENERATION
    // ============================================================
    generateSubScores(idx1, idx2, globalScore) {
        const s1 = this.signes[idx1];
        const s2 = this.signes[idx2];
        const sameElement = s1.element === s2.element;
        const elemCombo = [s1.element, s2.element].sort().join('+');

        // Element affinity modifiers
        const elementBonus = {
            'Air+Feu': 8,
            'Eau+Terre': 8,
            'Air+Air': 5,
            'Feu+Feu': 5,
            'Terre+Terre': 5,
            'Eau+Eau': 5,
            'Air+Eau': -5,
            'Feu+Terre': -5,
            'Feu+Eau': -8,
            'Air+Terre': -3
        };

        const bonus = elementBonus[elemCombo] || 0;

        // Use pseudo-random deterministic variations based on sign indices
        const seed = (idx1 + 1) * (idx2 + 1);
        const v1 = ((seed * 7 + 13) % 21) - 10; // -10 to +10
        const v2 = ((seed * 11 + 3) % 21) - 10;
        const v3 = ((seed * 5 + 17) % 21) - 10;
        const v4 = ((seed * 13 + 7) % 21) - 10;

        const clamp = (val) => Math.max(10, Math.min(98, val));

        return {
            amour: clamp(globalScore + bonus + v1),
            communication: clamp(globalScore + v2 - bonus),
            valeurs: clamp(globalScore + v3 + Math.round(bonus / 2)),
            passion: clamp(globalScore + v4 + bonus + 5)
        };
    },

    // ============================================================
    // TEXT GENERATION (French)
    // ============================================================
    generateAnalysis(s1, s2, globalScore, scores) {
        const elemCombo = [s1.element, s2.element].sort().join('+');
        const sameElement = s1.element === s2.element;

        // --- AMOUR TEXT ---
        let amourText = '';
        if (scores.amour >= 80) {
            amourText = `L'alchimie amoureuse entre ${s1.nom} et ${s2.nom} est exceptionnelle. Vos coeurs vibrent sur la meme frequence et une connexion profonde s'installe naturellement. Cette union possede toutes les qualites pour durer dans le temps si vous cultivez votre complicity.`;
        } else if (scores.amour >= 60) {
            amourText = `L'amour entre ${s1.nom} et ${s2.nom} est prometteur. Vous partagez une attraction reelle et un interet sincere l'un pour l'autre. Avec de la patience et de l'attention mutuelle, cette relation peut s'epanouir magnifiquement.`;
        } else if (scores.amour >= 40) {
            amourText = `La connexion amoureuse entre ${s1.nom} et ${s2.nom} demande des efforts des deux cotes. Vos natures differentes peuvent creer des frictions, mais aussi une complementarite precieuse si vous apprenez a valoriser vos differences.`;
        } else {
            amourText = `L'harmonie amoureuse entre ${s1.nom} et ${s2.nom} represente un veritable defi. Vos energies sont tres differentes et les malentendus sont frequents. Seule une volonte profonde des deux partenaires permettra de surmonter ces obstacles.`;
        }

        // --- COMMUNICATION TEXT ---
        let commText = '';
        if (scores.communication >= 80) {
            commText = `Vous vous comprenez presque sans parler. La communication entre ${s1.nom} et ${s2.nom} est fluide, intuitive et enrichissante. Les echanges intellectuels sont stimulants et les silences sont aussi confortables que les discussions.`;
        } else if (scores.communication >= 60) {
            commText = `Le dialogue entre ${s1.nom} et ${s2.nom} fonctionne bien dans l'ensemble. Quelques ajustements sont necessaires pour eviter les petits malentendus, mais votre capacite d'ecoute mutuelle est un atout precieux.`;
        } else if (scores.communication >= 40) {
            commText = `La communication peut parfois etre compliquee entre ${s1.nom} et ${s2.nom}. Vos modes d'expression sont differents et il arrive que les messages se perdent. Un effort conscient de clarte et de patience est necessaire.`;
        } else {
            commText = `Le dialogue est le point sensible de cette union. ${s1.nom} et ${s2.nom} ont des facons de communiquer tres eloignees. Il est essentiel de developper un langage commun et d'eviter les suppositions pour ne pas accumuler les frustrations.`;
        }

        // --- VALEURS TEXT ---
        let valeursText = '';
        if (sameElement) {
            valeursText = `Partageant le meme element (${s1.element}), ${s1.nom} et ${s2.nom} possedent une base de valeurs communes solide. Vos priorites de vie, vos rythmes et vos aspirations profondes sont naturellement alignes, creant un sentiment de familiarite reconfortant.`;
        } else if (scores.valeurs >= 70) {
            valeursText = `Malgre des elements differents (${s1.element} et ${s2.element}), vos valeurs convergent de maniere etonnante. Vous partagez une vision similaire de la vie, de la famille et de l'engagement, ce qui constitue une base solide pour votre relation.`;
        } else if (scores.valeurs >= 45) {
            valeursText = `Les valeurs de ${s1.nom} (${s1.element}) et ${s2.nom} (${s2.element}) ne sont pas toujours sur la meme longueur d'onde. Certains sujets importants comme l'argent, la famille ou la liberte peuvent necessiter des compromis reguliers.`;
        } else {
            valeursText = `L'element ${s1.element} de ${s1.nom} et l'element ${s2.element} de ${s2.nom} revelent des visions du monde fondamentalement differentes. Les priorites de l'un ne correspondent pas forcement a celles de l'autre. Un dialogue ouvert sur vos attentes profondes est indispensable.`;
        }

        // --- PASSION TEXT ---
        let passionText = '';
        if (scores.passion >= 85) {
            passionText = `L'attraction physique et l'intensite emotionnelle entre ${s1.nom} et ${s2.nom} sont electrisantes. Une chimie irresistible vous attire l'un vers l'autre. La flamme entre vous brule avec une puissance rare et envoutante.`;
        } else if (scores.passion >= 65) {
            passionText = `La passion entre ${s1.nom} et ${s2.nom} est bien presente et agreable. Votre desir mutuel se nourrit de votre complicite. L'attirance est reelle et se renforce avec le temps a mesure que la confiance s'installe.`;
        } else if (scores.passion >= 40) {
            passionText = `La flamme entre ${s1.nom} et ${s2.nom} est douce plutot qu'ardente. La passion demande un peu plus d'effort pour etre entretenue. Sortez de votre zone de confort et osez surprendre l'autre pour raviver les braises.`;
        } else {
            passionText = `L'etincelle physique entre ${s1.nom} et ${s2.nom} n'est pas ce qui definit votre relation. Si d'autres aspects sont forts, la passion peut se developper avec le temps, la patience et une volonte commune d'explorer l'intimite.`;
        }

        // --- STRENGTHS (3 bullet points) ---
        const strengths = this.generateStrengths(s1, s2, globalScore, elemCombo);

        // --- CHALLENGES (3 bullet points) ---
        const challenges = this.generateChallenges(s1, s2, globalScore, elemCombo);

        // --- CONSEIL ---
        const conseil = this.generateConseil(s1, s2, globalScore, elemCombo);

        return {
            amourText,
            commText,
            valeursText,
            passionText,
            strengths,
            challenges,
            conseil
        };
    },

    generateStrengths(s1, s2, score, elemCombo) {
        const pool = {
            'Feu+Feu': [
                'Une energie debordante qui rend chaque moment excitant et vivant.',
                'Un courage partage pour affronter tous les defis de la vie a deux.',
                'Une passion qui ne s\'eteint jamais et qui nourrit votre amour au quotidien.'
            ],
            'Terre+Terre': [
                'Une stabilite inegalable qui rassure et securise les deux partenaires.',
                'Des valeurs solides partagees autour de la famille et de la fidelite.',
                'Une construction commune patiente et durable sur le long terme.'
            ],
            'Air+Air': [
                'Une communication fluide et stimulante, remplie d\'idees brillantes.',
                'Une ouverture d\'esprit mutuelle qui enrichit constamment votre relation.',
                'Un besoin de liberte compris et respecte par les deux partenaires.'
            ],
            'Eau+Eau': [
                'Une comprehension emotionnelle profonde presque telepathique.',
                'Une intuition mutuelle qui vous permet de deviner les besoins de l\'autre.',
                'Un lien affectif d\'une rare intensite qui touche l\'ame.'
            ],
            'Air+Feu': [
                'L\'Air attise les flammes du Feu, creant une dynamique stimulante et creatrice.',
                'Un enthousiasme contagieux qui vous pousse a realiser de grands projets ensemble.',
                'Une relation ou l\'ennui n\'existe pas grace a votre energie combinee.'
            ],
            'Eau+Terre': [
                'La Terre canalise les emotions de l\'Eau avec douceur et solidite.',
                'Un equilibre parfait entre sensibilite et pragmatisme dans le couple.',
                'Une capacite a construire un foyer chaleureux et emotionnellement riche.'
            ],
            'Air+Eau': [
                'La capacite de l\'Air a rationaliser aide l\'Eau a prendre du recul sur ses emotions.',
                'Une curiosite mutuelle pour le monde interieur et exterieur.',
                'Une creativite commune qui peut mener a de belles realisations artistiques.'
            ],
            'Feu+Terre': [
                'Le Feu apporte l\'enthousiasme et l\'energie qui motivent la Terre.',
                'La Terre offre la stabilite dont le Feu a besoin pour concreter ses ambitions.',
                'Une complementarite entre vision et execution qui peut etre tres productive.'
            ],
            'Feu+Eau': [
                'Une intensite emotionnelle et passionnelle rare et enivrante.',
                'La capacite de se transformer mutuellement a travers cette relation.',
                'Un magnetisme irresistible qui cree une union unique et memorable.'
            ],
            'Air+Terre': [
                'L\'Air apporte de la legerete et de l\'innovation aux projets de la Terre.',
                'La Terre ancre les idees parfois dispersees de l\'Air dans la realite.',
                'Un equilibre interessant entre reflexion intellectuelle et action concrete.'
            ]
        };

        return pool[elemCombo] || [
            `La complementarite naturelle entre ${s1.nom} et ${s2.nom} cree une dynamique enrichissante.`,
            'Une curiosite mutuelle qui pousse a decouvrir le monde de l\'autre.',
            'La capacite d\'apprendre l\'un de l\'autre grace a vos differences.'
        ];
    },

    generateChallenges(s1, s2, score, elemCombo) {
        const pool = {
            'Feu+Feu': [
                'Les conflits peuvent etre explosifs et les ego s\'entrechoquent facilement.',
                'Le besoin de dominer peut creer une competition malsaine dans le couple.',
                'L\'impatience mutuelle risque d\'accelerer les decisions sans reflexion.'
            ],
            'Terre+Terre': [
                'La routine peut s\'installer rapidement et etouffer la passion.',
                'La resistance au changement peut empecher l\'evolution du couple.',
                'Un exces de pragmatisme peut negliger la dimension romantique et spontanee.'
            ],
            'Air+Air': [
                'Le manque d\'ancrage emotionnel peut rendre la relation superficielle.',
                'L\'indecision commune peut retarder les engagements importants.',
                'La tendance a intellectualiser les emotions plutot que de les vivre.'
            ],
            'Eau+Eau': [
                'L\'hypersensibilite mutuelle peut amplifier les conflits emotionnels.',
                'Le risque de co-dependance affective est eleve dans cette combinaison.',
                'La difficulte a prendre du recul quand les emotions submergent le couple.'
            ],
            'Air+Feu': [
                'L\'inconstance de l\'Air peut frustrer le Feu qui veut de l\'engagement.',
                'La tendance a bruler les etapes sans consolidation suffisante.',
                'Le manque de profondeur emotionnelle si les echanges restent trop intellectuels.'
            ],
            'Eau+Terre': [
                'La Terre peut sembler insensible face a la vulnerabilite de l\'Eau.',
                'L\'Eau peut trouver la Terre trop rigide et manquant de spontaneite.',
                'Les besoins emotionnels de l\'Eau ne sont pas toujours compris par la Terre.'
            ],
            'Air+Eau': [
                'L\'Air rationalise ce que l\'Eau ressent, creant une deconnexion emotionnelle.',
                'Le besoin de liberte de l\'Air peut blesser le besoin de securite de l\'Eau.',
                'Les differents modes de fonctionnement (tete vs coeur) generent des incomprehensions.'
            ],
            'Feu+Terre': [
                'Le rythme du Feu (rapide) s\'oppose a celui de la Terre (lent), creant des tensions.',
                'Le Feu trouve la Terre trop prudente, la Terre trouve le Feu imprudent.',
                'Les priorites divergent : action immediate contre planification a long terme.'
            ],
            'Feu+Eau': [
                'Le Feu peut assecher les emotions de l\'Eau par son insensibilite apparente.',
                'L\'Eau peut eteindre la flamme du Feu par ses humeurs changeantes.',
                'Les reactions impulsives du Feu se heurtent a la sensibilite extreme de l\'Eau.'
            ],
            'Air+Terre': [
                'L\'Air peut trouver la Terre ennuyeuse et trop previsible.',
                'La Terre peut juger l\'Air superficiel et peu fiable.',
                'Le rythme de vie (stable vs changeant) genere des frictions au quotidien.'
            ]
        };

        return pool[elemCombo] || [
            `Les temperaments differents de ${s1.nom} et ${s2.nom} exigent patience et tolerance.`,
            'La communication peut necessiter un effort conscient pour eviter les malentendus.',
            'Trouver un rythme de vie commun peut prendre du temps et de l\'adaptation.'
        ];
    },

    generateConseil(s1, s2, score, elemCombo) {
        if (score >= 85) {
            return `Votre duo ${s1.nom}-${s2.nom} a toutes les cartes en main pour une belle histoire. Cultivez votre complicite en continuant a surprendre l'autre et a nourrir cette flamme naturelle qui vous unit.`;
        } else if (score >= 70) {
            return `La relation entre ${s1.nom} et ${s2.nom} est pleine de promesses. Concentrez-vous sur vos points forts et abordez vos differences avec curiosite plutot que jugement. Votre amour grandira avec le temps.`;
        } else if (score >= 55) {
            return `${s1.nom} et ${s2.nom} forment un couple qui necessite des ajustements, mais le potentiel est la. La cle repose sur la communication ouverte et la volonte de comprendre le langage emotionnel de l'autre.`;
        } else if (score >= 40) {
            return `L'union ${s1.nom}-${s2.nom} demande un engagement sincere des deux partenaires. Apprenez a voir vos differences comme une source de richesse plutot que de conflit. Un voyant specialise peut vous guider.`;
        } else {
            return `La compatibilite entre ${s1.nom} et ${s2.nom} est un defi, mais pas une impossibilite. L'amour veritable transcende les astres. Consultez un astrologue pour une analyse personnalisee de votre theme natal complet.`;
        }
    },

    // ============================================================
    // SCORE LABEL & COLOR
    // ============================================================
    getScoreLabel(score) {
        if (score >= 90) return 'Exceptionnel';
        if (score >= 75) return 'Tres Compatible';
        if (score >= 60) return 'Compatible';
        if (score >= 45) return 'Neutre';
        if (score >= 30) return 'Delicat';
        return 'Difficile';
    },

    getScoreColor(score) {
        if (score >= 80) return '#2ecc71';
        if (score >= 60) return '#f1c40f';
        if (score >= 40) return '#e67e22';
        return '#e74c3c';
    },

    // ============================================================
    // RENDER: LOADING
    // ============================================================
    renderLoading() {
        if (!this.dom.resultContainer) return;
        this.dom.resultContainer.innerHTML = `
            <div class="compat-loader">
                <div class="compat-loader-circle">
                    <div class="compat-loader-ring"></div>
                    <div class="compat-loader-icon"><i class="fa-solid fa-star-half-stroke"></i></div>
                </div>
                <div class="compat-loader-text">Analyse astrale en cours...</div>
                <div class="compat-loader-sub">Alignement des energies cosmiques</div>
            </div>
        `;
    },

    // ============================================================
    // RENDER: RESULT
    // ============================================================
    renderResult(s1, s2, globalScore, scores, analysis) {
        if (!this.dom.resultContainer) return;

        const scoreColor = this.getScoreColor(globalScore);
        const scoreLabel = this.getScoreLabel(globalScore);

        const renderCategory = (icon, label, score, text) => {
            const color = this.getScoreColor(score);
            return `
                <div class="compat-category">
                    <div class="compat-category-header">
                        <span class="compat-category-icon"><i class="fa-solid ${icon}"></i></span>
                        <span class="compat-category-label">${label}</span>
                        <span class="compat-category-score" style="color: ${color}">${score}%</span>
                    </div>
                    <div class="compat-category-bar">
                        <div class="compat-category-fill" data-width="${score}" style="background: ${color}; width: 0%"></div>
                    </div>
                    <p class="compat-category-text">${text}</p>
                </div>
            `;
        };

        const renderList = (items, icon, colorClass) => {
            return items.map(item => `
                <li class="${colorClass}">
                    <i class="fa-solid ${icon}"></i>
                    <span>${item}</span>
                </li>
            `).join('');
        };

        this.dom.resultContainer.innerHTML = `
            <div class="compat-result-header fade-in">
                <div class="compat-signs-display">
                    <div class="compat-sign-badge">
                        <span class="compat-sign-emoji">${s1.emoji}</span>
                        <span class="compat-sign-name">${s1.nom}</span>
                        <span class="compat-sign-element">${s1.element}</span>
                    </div>
                    <div class="compat-heart-icon">
                        <i class="fa-solid fa-heart"></i>
                    </div>
                    <div class="compat-sign-badge">
                        <span class="compat-sign-emoji">${s2.emoji}</span>
                        <span class="compat-sign-name">${s2.nom}</span>
                        <span class="compat-sign-element">${s2.element}</span>
                    </div>
                </div>

                <div class="compat-gauge-container">
                    <div class="compat-gauge">
                        <svg viewBox="0 0 120 120" class="compat-gauge-svg">
                            <circle cx="60" cy="60" r="52" stroke="rgba(255,255,255,0.1)" stroke-width="10" fill="none"/>
                            <circle cx="60" cy="60" r="52" stroke="${scoreColor}" stroke-width="10" fill="none"
                                stroke-dasharray="${2 * Math.PI * 52}"
                                stroke-dashoffset="${2 * Math.PI * 52}"
                                stroke-linecap="round"
                                class="compat-gauge-progress"
                                data-score="${globalScore}"
                                transform="rotate(-90 60 60)"/>
                        </svg>
                        <div class="compat-gauge-text">
                            <span class="compat-gauge-number" data-target="${globalScore}">0</span>
                            <span class="compat-gauge-percent">%</span>
                        </div>
                    </div>
                    <div class="compat-gauge-label" style="color: ${scoreColor}">${scoreLabel}</div>
                </div>
            </div>

            <div class="compat-categories slide-up">
                <h3><i class="fa-solid fa-chart-bar"></i> Analyse Detaillee</h3>
                ${renderCategory('fa-heart', 'Amour', scores.amour, analysis.amourText)}
                ${renderCategory('fa-comments', 'Communication', scores.communication, analysis.commText)}
                ${renderCategory('fa-scale-balanced', 'Valeurs', scores.valeurs, analysis.valeursText)}
                ${renderCategory('fa-fire-flame-curved', 'Passion', scores.passion, analysis.passionText)}
            </div>

            <div class="compat-strengths-challenges slide-up">
                <div class="compat-strengths">
                    <h4><i class="fa-solid fa-check-circle"></i> Points Forts</h4>
                    <ul>${renderList(analysis.strengths, 'fa-star', 'strength-item')}</ul>
                </div>
                <div class="compat-challenges">
                    <h4><i class="fa-solid fa-exclamation-triangle"></i> Defis</h4>
                    <ul>${renderList(analysis.challenges, 'fa-bolt', 'challenge-item')}</ul>
                </div>
            </div>

            <div class="compat-conseil slide-up">
                <h4><i class="fa-solid fa-wand-magic-sparkles"></i> Conseil de l'Astrologue</h4>
                <p>${analysis.conseil}</p>
            </div>

            <div class="compat-cta slide-up">
                <div class="cta-box">
                    <h3>Envie d'en savoir plus ?</h3>
                    <p>Cette analyse automatique revele les grandes tendances. Pour une etude approfondie de votre theme natal et celui de votre partenaire, consultez un astrologue expert.</p>
                    <a href="javascript:void(0)"
                       onclick="window.open(getAffiliateUrl('amour'), '_blank'); return false;"
                       class="btn btn-gold" data-affiliate="amour">
                       <i class="fa-solid fa-phone-alt"></i> Parler a un Expert Amour
                    </a>
                </div>
                <div style="margin-top: 20px; text-align: center;">
                    <button class="btn btn-outline btn-new-test" id="btn-restart-inner">
                        <i class="fa-solid fa-rotate-right"></i> Nouveau Test
                    </button>
                </div>
            </div>
        `;

        // Bind inner restart
        const innerRestart = document.getElementById('btn-restart-inner');
        if (innerRestart) {
            innerRestart.addEventListener('click', () => this.restart());
        }

        // Animate gauge and bars after short delay
        setTimeout(() => this.animateResults(globalScore), 300);
    },

    // ============================================================
    // ANIMATIONS
    // ============================================================
    animateResults(globalScore) {
        // Animate gauge circle
        const circle = document.querySelector('.compat-gauge-progress');
        if (circle) {
            const circumference = 2 * Math.PI * 52;
            const target = circumference - (circumference * globalScore / 100);
            circle.style.transition = 'stroke-dashoffset 1.5s ease-out';
            circle.style.strokeDashoffset = target;
        }

        // Animate gauge number
        const numEl = document.querySelector('.compat-gauge-number');
        if (numEl) {
            const target = parseInt(numEl.dataset.target);
            let current = 0;
            const duration = 1500;
            const start = performance.now();
            const tick = (now) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                current = Math.round(progress * target);
                numEl.textContent = current;
                if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        }

        // Animate category bars
        document.querySelectorAll('.compat-category-fill').forEach((bar, i) => {
            setTimeout(() => {
                bar.style.transition = 'width 1s ease-out';
                bar.style.width = bar.dataset.width + '%';
            }, 200 + i * 150);
        });
    }
};

// ============================================================
// INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    CompatibiliteApp.init();
});
