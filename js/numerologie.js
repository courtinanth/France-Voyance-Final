/**
 * France Voyance Avenir - Numerology Tool
 * Logic for Life Path, Compatibility, Expression Number, and Personal Year
 */

const NumerologyApp = {
    state: {
        activeTab: 'chemin-vie',
        userDate: null,
        partnerDate: null,
    },

    init() {
        this.cacheDOM();
        this.bindEvents();
        // this.renderTabs(); // Removed undefined function
    },

    cacheDOM() {
        this.dom = {
            tabs: document.querySelectorAll('.numerology-tab'),
            contents: document.querySelectorAll('.numerology-content'),

            // Forms
            formLifePath: document.getElementById('form-life-path'),
            formCompatibility: document.getElementById('form-compatibility'),
            formExpression: document.getElementById('form-expression'),
            formYear: document.getElementById('form-year'),

            // Results Containers
            resultLifePath: document.getElementById('result-life-path'),
            resultCompatibility: document.getElementById('result-compatibility'),
            resultExpression: document.getElementById('result-expression'),
            resultYear: document.getElementById('result-year'),
        };
    },

    bindEvents() {
        // Tab Switching
        this.dom.tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const target = e.currentTarget.dataset.target;
                this.switchTab(target);
            });
        });

        // Calculators
        if (this.dom.formLifePath) {
            this.dom.formLifePath.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLifePath();
            });
        }

        if (this.dom.formCompatibility) {
            this.dom.formCompatibility.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCompatibility();
            });
        }

        if (this.dom.formExpression) {
            this.dom.formExpression.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleExpression();
            });
        }

        if (this.dom.formYear) {
            this.dom.formYear.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handlePersonalYear();
            });
        }
    },

    switchTab(tabId) {
        this.dom.tabs.forEach(t => t.classList.remove('active'));
        this.dom.contents.forEach(c => c.classList.remove('active'));

        document.querySelector(`.numerology-tab[data-target="${tabId}"]`).classList.add('active');
        document.getElementById(tabId).classList.add('active');
    },

    /* --- CALCULATORS --- */

    // Helper: Reduce number until single digit or master number (11, 22, 33)
    reduceNumber(num) {
        if (num === 11 || num === 22 || num === 33) return num;

        while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
            num = String(num).split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
        }
        return num;
    },

    // Helper: Simple reduce to single digit (1-9) for compatibility matrix indexing if needed
    // But matrix usually handles masters. Let's start with standard reduce.

    calculateDateSum(day, month, year) {
        // Method: Sum all digits directly (Vertical method often used in modern numerology for consistent results)
        // Or Horizontal: Reduce D, Reduce M, Reduce Y, then sum. 
        // User prompt example: 1+5 + 0+8 + 1+9+8+5 = 37 -> 10 -> 1. 
        // This is "Sum of all digits" method.

        const str = `${day}${month}${year}`;
        let sum = 0;
        for (let char of str) sum += parseInt(char);

        return this.reduceNumber(sum);
    },

    /* --- HANDLERS --- */

    handleLifePath() {
        const d = document.getElementById('lp-day').value;
        const m = document.getElementById('lp-month').value;
        const y = document.getElementById('lp-year').value;

        if (!d || !m || !y) return;

        const pathNum = this.calculateDateSum(d, m, y);
        const data = NUMEROLOGY_DATA.lifePaths[pathNum];

        // 1. Show Loading
        this.showLoading('result-life-path');

        // 2. Simulate Calculation Delay
        setTimeout(() => {
            this.displayResult('result-life-path', `
                <div class="result-number-container fade-in">
                    <div class="glow-circle"></div>
                    <div class="result-number">${pathNum}</div>
                </div>
                <h3 class="result-title slide-up">${data.title}</h3>
                <div class="result-keywords slide-up" style="animation-delay: 0.1s">${data.keywords}</div>
                <div class="result-text slide-up" style="animation-delay: 0.2s">
                    <p>${data.description}</p>
                    <h4>Forces & Défis</h4>
                    <p>${data.strengths}</p>
                    <h4>Mission de Vie</h4>
                    <p>${data.mission}</p>
                     <div class="celebs-box">
                        <strong><i class="fa-solid fa-star"></i> Célébrités :</strong> ${data.celebs}
                    </div>
                </div>
                <div class="cta-box slide-up" style="animation-delay: 0.3s; margin-top:30px;">
                    <p>Vous voulez approfondir ce que cela signifie pour votre avenir ?</p>
                    <a href="../consulter/voyance-telephone.html" class="btn btn-gold">Parler à un expert Numérologue</a>
                </div>
            `);
        }, 2000);
    },

    handleCompatibility() {
        const d1 = document.getElementById('comp-day-1').value;
        const m1 = document.getElementById('comp-month-1').value;
        const y1 = document.getElementById('comp-year-1').value;

        const d2 = document.getElementById('comp-day-2').value;
        const m2 = document.getElementById('comp-month-2').value;
        const y2 = document.getElementById('comp-year-2').value;

        if (!d1 || !m1 || !y1 || !d2 || !m2 || !y2) return;

        const path1 = this.calculateDateSum(d1, m1, y1);
        const path2 = this.calculateDateSum(d2, m2, y2);

        // Normalize masters to single digits for compatibility matrix (common practice unless specific master pairs defined)
        // Or we define logic. Let's map 11->2, 22->4, 33->6 for the matrix lookup, but keep display
        const n1 = (path1 === 11) ? 2 : (path1 === 22) ? 4 : (path1 === 33) ? 6 : path1;
        const n2 = (path2 === 11) ? 2 : (path2 === 22) ? 4 : (path2 === 33) ? 6 : path2;

        const compData = this.getCompatibility(n1, n2);

        this.showLoading('result-compatibility');

        setTimeout(() => {
            this.displayResult('result-compatibility', `
                <div class="comp-header fade-in">
                    <div class="comp-badge">Chemin ${path1}</div>
                    <div class="comp-heart"><i class="fa-solid fa-heart"></i></div>
                    <div class="comp-badge">Chemin ${path2}</div>
                </div>
                
                <div class="comp-score-container slide-up">
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: 0%" data-width="${compData.score}%"></div>
                    </div>
                    <div class="score-text">${compData.score}% - ${compData.label}</div>
                </div>
                
                <div class="result-text slide-up" style="animation-delay: 0.2s">
                    <p>${compData.text}</p>
                    <h4>Conseil pour votre Couple</h4>
                    <p>${compData.advice}</p>
                </div>
            `);

            // Trigger animation
            setTimeout(() => {
                const bar = document.querySelector('.progress-bar-fill');
                if (bar) bar.style.width = bar.dataset.width;
            }, 100);
        }, 2000);
    },

    getCompatibility(n1, n2) {
        // Logic matrix example
        n1 = parseInt(n1, 10);
        n2 = parseInt(n2, 10);

        // Key: Smaller-Larger

        // Key: Smaller-Larger
        const key = n1 < n2 ? `${n1}-${n2}` : `${n2}-${n1}`;
        if (n1 === n2) return { score: 90, label: "Très Compatible", text: "Vous vibrez sur la même fréquence ! Compréhension intuitive et buts communs.", advice: "Attention toutefois à ne pas vous enfermer dans une bulle." };

        const matrix = {
            "1-2": { s: 50, l: "Neutre", t: "Une relation de contrastes. Le 1 est un meneur indépendant, tandis que le 2 est un collaborateur sensible. Pour que cela fonctionne, le 1 doit apprendre la douceur et le 2 doit éviter d'être trop dépendant. C'est un équilibre délicat entre action et émotion.", a: "Le 1 doit écouter sans juger; le 2 doit oser s'affirmer." },
            "1-3": { s: 80, l: "Compatible", t: "Un duo pétillant ! L'énergie du 1 et la créativité du 3 se marient à merveille. Vous ne vous ennuierez jamais ensemble car vous aimez tous deux briller et socialiser. Attention toutefois à ne pas rester trop en surface.", a: "Partagez la scène et laissez de la place à l'autre pour s'exprimer." },
            "1-4": { s: 30, l: "Difficile", t: "Le choc des rythmes. Le 1 veut tout, tout de suite, alors que le 4 a besoin de planifier et de sécuriser chaque étape. Cette différence fondamentale peut créer des frustrations si vous ne respectez pas la méthode de l'autre.", a: "Le 1 doit ralentir et le 4 doit accepter un peu d'imprévu." },
            "1-5": { s: 90, l: "Très Compatible", t: "Le couple aventure ! Vous partagez une soif insatiable de liberté, de mouvement et de nouveauté. Votre relation sera passionnée et jamais routinière. Vous vous comprenez instinctivement dans votre besoin d'indépendance.", a: "Veillez à garder quelques racines communes pour durer." },
            "1-6": { s: 60, l: "Compatible", t: "Une relation protectrice. Le 6 offre un foyer chaleureux dont le 1 a besoin pour se ressourcer après ses conquêtes. Le 1 apporte la sécurité matérielle. Si le 1 accepte la bienveillance du 6 sans se sentir étouffé, c'est gagné.", a: "Le 1 doit montrer sa gratitude; le 6 doit éviter d'être possessif." },
            "1-7": { s: 70, l: "Compatible", t: "L'union des esprits. Vous êtes deux indépendants qui apprécient la solitude. Votre connexion est plus intellectuelle et spirituelle que fusionnelle. Vous respectez l'espace vital de l'autre, ce qui est votre grande force.", a: "N'oubliez pas de nourrir aussi votre lien émotionnel et physique." },
            "1-8": { s: 95, l: "Power Couple", t: "Le couple puissant par excellence. Vous partagez la même ambition et le même dynamisme. Ensemble, vous pouvez bâtir un empire ou réaliser de grands projets. Attention à ne pas transformer votre relation en compétition.", a: "Soyez partenaires, pas rivaux. Célébrez les succès de l'autre." },
            "1-9": { s: 40, l: "Délicat", t: "Des visions opposées. Le 1 est centré sur son ego et son action personnelle, alors que le 9 est tourné vers les autres et l'universel. Le 1 peut trouver le 9 trop vague, et le 9 peut trouver le 1 trop égoïste.", a: "Apprenez l'un de l'autre : le 1 apporte la direction, le 9 la sagesse." },

            "2-3": { s: 75, l: "Sympathique", t: "Une relation douce et joyeuse. L'humour du 3 aide le 2 à dédramatiser, et l'écoute du 2 rassure le 3. Vous aimez recevoir et être entourés. C'est une union sociable et créative, pleine de charme.", a: "Restez attentifs aux humeurs changeantes de l'un et de l'autre." },
            "2-4": { s: 85, l: "Solide", t: "La sécurité avant tout. Vous recherchez tous les deux la stabilité, le confort et un foyer harmonieux. Le 4 apporte la structure que le 2 apprécie tant. C'est une relation faite pour durer, calme et prévisible.", a: "Mettez un peu de fantaisie pour ne pas tomber dans l'ennui." },
            "2-5": { s: 40, l: "Complexe", t: "L'eau et le feu. Le 2 a besoin de présence et de rassurance, tandis que le 5 a besoin d'air et de liberté. Le 2 risque de souffrir des absences du 5, et le 5 de se sentir en cage. Difficile à concilier.", a: "Le 5 doit rassurer souvent; le 2 doit cultiver son indépendance." },
            "2-6": { s: 95, l: "Parfait", t: "L'harmonie totale. Vous partagez les mêmes valeurs : amour, famille, maison, engagement. Vous êtes faits pour vivre ensemble et fonder une famille. Votre foyer sera votre sanctuaire rempli de douceur.", a: "Ne vous isolez pas trop du monde extérieur dans votre cocon." },
            "2-7": { s: 65, l: "Neutre", t: "Un décalage émotionnel. Le 2 est dans le ressenti et la demande affective, alors que le 7 est dans l'analyse et la distance. Le 2 peut se sentir rejeté par la froideur apparente du 7.", a: "Le 7 doit faire l'effort de verbaliser ses sentiments." },
            "2-8": { s: 80, l: "Complémentaire", t: "L'équilibre classique. Le 8 protège et pourvoit aux besoins, tandis que le 2 gère l'intendance et l'émotionnel. Chacun trouve sa place et son rôle. C'est une alliance efficace et sécurisante.", a: "Assurez-vous que l'échange n'est pas uniquement matériel." },
            "2-9": { s: 75, l: "Romantique", t: "Une connexion d'âmes. Vous êtes tous deux sensibles, intuitifs et idéalistes. Votre relation peut être très romantique, presque télépathique. Vous vous comprenez sans parler.", a: "Gardez les pieds sur terre pour gérer le quotidien." },

            "3-4": { s: 35, l: "Difficile", t: "L'improvisation contre l'organisation. Le 3 vit au jour le jour, le 4 planifie tout. Le 4 peut trouver le 3 immature, et le 3 peut trouver le 4 rabat-joie. Les questions d'argent sont souvent source de conflit.", a: "Faites budget à part et respectez vos différences." },
            "3-5": { s: 90, l: "Excitant", t: "La fête permanente ! Vous êtes les meilleurs compagnons de jeu. Voyages, sorties, amis... Vous ne tenez pas en place. Votre vie commune sera une aventure sociale trépidante.", a: "Attention à ne pas fuir les responsabilités." },
            "3-6": { s: 70, l: "Agréable", t: "Une vie de famille joyeuse. Le 3 apporte la créativité, le 6 l'harmonie. Votre maison sera ouverte et accueillante. Le 6 doit juste veiller à ne pas étouffer le 3 par trop de sollicitude.", a: "Le 3 doit assumer sa part des tâches ménagères." },
            "3-7": { s: 50, l: "Neutre", t: "Deux rythmes différents. Le 3 est extraverti et bruyant, le 7 est introverti et silencieux. Le 7 a besoin de calme pour se ressourcer, ce que le 3 ne comprend pas toujours.", a: "Créez des espaces séparés dans la maison." },
            "3-8": { s: 65, l: "Stimulant", t: "L'alliance du talent et de l'argent. Le 8 peut financer et structurer les idées créatives du 3. C'est une excellente combinaison pour un couple qui travaille ensemble.", a: "Le 3 doit montrer qu'il est fiable pour que le 8 respecte ses idées." },
            "3-9": { s: 95, l: "Inspirant", t: "Le couple charismatique. Vous partagez un idéalisme, une ouverture d'esprit et une générosité immenses. Vous êtes faits pour briller ensemble et inspirer les autres.", a: "Attention à bien gérer les détails pratiques du quotidien." },

            "4-5": { s: 20, l: "Très Difficile", t: "Tout vous oppose. Le 4 veut construire des murs, le 5 veut les abattre. Le 4 cherche la sécurité, le 5 le risque. C'est une relation qui demande énormément de tolérance pour fonctionner.", a: "Acceptez que l'autre ne changera pas : trouvez des compromis." },
            "4-6": { s: 85, l: "Solide", t: "La tradition et la fidélité. Vous formez un couple stable, sérieux et loyal. La famille et la maison sont vos priorités absolues. Vous pouvez compter l'un sur l'autre les yeux fermés.", a: "Pensez à injecter un peu de surprise pour éviter la routine." },
            "4-7": { s: 90, l: "Intellectuel", t: "Une entente profonde. Vous partagez le même sérieux, la même honnêteté et le même besoin de calme. Votre confiance est totale. C'est une relation mature et réfléchie.", a: "N'oubliez pas d'exprimer votre chaleur humaine de temps en temps." },
            "4-8": { s: 100, l: "Constructif", t: "Les bâtisseurs d'empire. Ensemble, vous êtes invincibles. Vous avez la même capacité de travail et la même vision concrète. Vous réaliserez de grands projets matériels.", a: "Ne laissez pas le travail dévorer toute votre vie intime." },
            "4-9": { s: 30, l: "Complexe", t: "La logique contre le rêve. Le 4 est rationnel, ancré dans le réel; le 9 est idéaliste, souvent dans la lune. Le 4 peut s'épuiser à ramener le 9 sur terre.", a: "Appréciez vos différences au lieu de les juger." },

            "5-6": { s: 40, l: "Instable", t: "Un désir d'engagement opposé. Le 6 veut officialiser, se marier, s'installer. Le 5 veut rester libre et disponible. Le 6 peut se sentir très insécurisé par l'attitude du 5.", a: "Le 5 doit rassurer le 6 par des actes concrets de fidélité." },
            "5-7": { s: 80, l: "Spirituel", t: "La connexion de l'esprit. Vous aimez refaire le monde ensemble. Vous respectez mutuellement votre indépendance et ne cherchez pas à posséder l'autre.", a: "Partagez vos découvertes intellectuelles pour nourrir le lien." },
            "5-8": { s: 60, l: "Intense", t: "Passion et pouvoir. Une relation physique intense, mais gare aux luttes de pouvoir ! Le 8 veut contrôler, le 5 veut être libre. Ça peut faire des étincelles.", a: "Transformez vos conflits en passion amoureuse." },
            "5-9": { s: 85, l: "Ouvert", t: "Un couple universel. Vous aimez les voyages, les causes humanitaires, la découverte. Vous êtes ouverts d'esprit et tolérants. Une relation moderne et enrichissante.", a: "Veillez à bien gérer l'argent, aucun de vous n'aime ça." },

            "6-7": { s: 55, l: "Neutre", t: "Le cœur et la tête. Le 6 est chaleureux et enveloppant, le 7 est froid et analytique. Le 6 risque de trouver le 7 insensible, alors qu'il est juste réservé.", a: "Le 7 doit faire un effort pour montrer son affection." },
            "6-8": { s: 90, l: "Productif", t: "L'équipe gagnante. Le 8 réussit socialement, le 6 assure l'harmonie privée. C'est un équilibre traditionnel qui fonctionne très bien. Vous vous admirez mutuellement.", a: "Gardez du temps pour la romance pure." },
            "6-9": { s: 95, l: "Harmonieux", t: "L'amour inconditionnel. Vous êtes tous deux dévoués, généreux et aimants. Vous formez un couple idéaliste, prêt à aider les autres. C'est beau et profond.", a: "Attention à ne pas vous sacrifier totalement pour l'autre." },

            "7-8": { s: 50, l: "Divergent", t: "Matériel vs Spirituel. Le 8 est obsédé par la réussite concrète, le 7 par l'élévation spirituelle. Vos centres d'intérêt sont très différents.", a: "Trouvez un terrain d'entente intellectuel." },
            "7-9": { s: 90, l: "Mystique", t: "Une rencontre karmique. Vous partagez une profondeur d'âme et une intuition rares. Votre lien dépasse les mots. Vous pouvez vivre une grande histoire spirituelle.", a: "Restez connectés aux réalités quotidiennes." },

            "8-9": { s: 70, l: "Puissant", t: "L'énergie à l'état pur. Le 8 a la puissance d'action, le 9 a la puissance de l'idéal. Si vous vous alignez sur un but commun, vous pouvez tout changer.", a: "Le 8 doit respecter la sensibilité et les idéaux du 9." }
        };

        const entry = matrix[key];
        if (entry) {
            return {
                score: entry.s,
                label: entry.l,
                text: entry.t,
                advice: entry.a
            };
        }

        return { score: 70, label: "À Découvrir", text: "Une combinaison intéressante qui demande à être explorée. Vous avez chacun des qualités uniques à apporter.", advice: "La communication ouverte sera votre meilleure alliée." };
    },

    handleExpression() {
        const name = document.getElementById('expr-name').value;
        if (!name) return;

        let sum = 0;
        const normalized = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();

        for (let char of normalized) {
            const code = char.charCodeAt(0) - 64; // A=1, B=2...
            if (code >= 1 && code <= 26) {
                // Pythagorean system usually 1-9 repeating
                // 1: A J S
                // 2: B K T
                // 3: C L U
                // 4: D M V
                // 5: E N W
                // 6: F O X
                // 7: G P Y
                // 8: H Q Z
                // 9: I R
                const val = (code % 9 === 0) ? 9 : code % 9;
                sum += val;
            }
        }

        const exprNum = this.reduceNumber(sum);
        // Use dedicated Expression data or fallback to LifePath if missing (though we will add all)
        const data = NUMEROLOGY_DATA.expressionNumbers[exprNum] || NUMEROLOGY_DATA.lifePaths[exprNum];

        this.showLoading('result-expression');

        setTimeout(() => {
            this.displayResult('result-expression', `
                 <div class="result-number-container fade-in">
                    <div class="glow-circle small"></div>
                    <div class="result-number small">${exprNum}</div>
                </div>
                <h3 class="result-title slide-up">Votre Nombre d'Expression : ${exprNum}</h3>
                <div class="result-keywords slide-up" style="animation-delay: 0.1s">"${data.tagline}"</div>
                
                <div class="result-text slide-up" style="animation-delay: 0.2s">
                    <h4><i class="fa-solid fa-user-tag"></i> Votre nature profonde</h4>
                    <p>${data.nature}</p>
                    
                    <h4><i class="fa-solid fa-comments"></i> Votre communication</h4>
                    <p>${data.communication}</p>
                    
                    <h4><i class="fa-solid fa-briefcase"></i> Vos atouts</h4>
                    <p>${data.assets}</p>
                </div>
            `);
        }, 2000);
    },

    handlePersonalYear() {
        const d = document.getElementById('year-day').value;
        const m = document.getElementById('year-month').value;

        if (!d || !m) return;

        const currentYear = new Date().getFullYear();
        // Personal Year = Day + Month + Current Year
        const sum = parseInt(d) + parseInt(m) + currentYear;
        const pYear = this.reduceNumber(sum);

        // Retrieve data from global object, handle fallback if needed
        const data = NUMEROLOGY_DATA.personalYears[pYear] || NUMEROLOGY_DATA.personalYears[this.reduceNumber(pYear)];

        this.showLoading('result-year');

        setTimeout(() => {
            this.displayResult('result-year', `
                 <div class="result-number-container fade-in">
                    <div class="glow-circle small"></div>
                    <div class="result-number small">${pYear}</div>
                </div>
                <h3 class="result-title slide-up">Votre Année Personnelle ${currentYear}</h3>
                <div class="result-keywords slide-up" style="animation-delay: 0.1s">"${data.theme}"</div>
                
                <div class="result-text slide-up" style="animation-delay: 0.2s">
                    <p>${data.description}</p>
                    
                    <h4><i class="fa-solid fa-triangle-exclamation"></i> Vos Défis</h4>
                    <p>${data.challenge}</p>
                    
                    <h4><i class="fa-solid fa-lightbulb"></i> Le Conseil de l'année</h4>
                    <p class="tips-box" style="margin-top: 5px;">${data.advice}</p>
                </div>
            `);
        }, 2000);
    },

    showLoading(elementId) {
        const el = document.getElementById(elementId);
        if (!el) return;

        el.style.display = 'block';
        el.innerHTML = `
            <div class="numerology-loader">
                <div class="loader-mandala">
                    <div class="loader-ring"></div>
                    <div class="loader-crystal"></div>
                    <div class="loader-orbit"></div>
                </div>
                <div class="loader-text">Connexion Astrale</div>
                <div class="loader-subtext">Alignement des planètes en cours...</div>
            </div>
        `;
        // Ensure the loader logic styles are applied (flex display)
        const loader = el.querySelector('.numerology-loader');
        if (loader) loader.style.display = 'flex';

        // Scroll logic (optional but helpful if large)
        // const offsetPosition = el.getBoundingClientRect().top + window.scrollY - 100;
        // window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    },

    displayResult(elementId, html) {
        const el = document.getElementById(elementId);
        if (!el) return;
        el.innerHTML = html;
        el.style.display = 'block';

        // Use timeout to allow DOM update before visual transition
        setTimeout(() => el.classList.add('visible'), 10);

        // Scroll removed as per user request for better mobile UX
    }
}

/* --- DATA --- */

const NUMEROLOGY_DATA = {
    personalYears: {
        1: {
            theme: "Nouveau Départ & Action",
            description: "C'est l'année du commencement. Après une fin de cycle l'an passé, vous voilà devant une page blanche. C'est le moment idéal pour lancer de nouveaux projets, changer de travail ou prendre des initiatives audacieuses. L'énergie est dynamique et vous pousse vers l'autonomie.",
            challenge: "Ne pas attendre que les choses arrivent d'elles-mêmes. Vous devez être le moteur de votre vie cette année. Attention à l'impatience et à l'égoïsme.",
            advice: "Osez ! Semez les graines de ce que vous voulez récolter dans 9 ans. Tout ce que vous commencez maintenant aura un impact durable."
        },
        2: {
            theme: "Patience & Coopération",
            description: "Après l'action de l'année 1, le temps ralentit. C'est une année de gestation où les graines plantées commencent à germer sous la surface. L'accent est mis sur les relations, le couple et la collaboration. Ne forcez rien.",
            challenge: "Gérer votre émotivité et votre impatience. Vous aurez l'impression que les choses n'avancent pas, mais elles s'installent. La diplomatie sera nécessaire.",
            advice: "Collaborez plutôt que d'agir seul. Écoutez votre intuition et soignez vos relations. C'est le moment de consolider vos acquis."
        },
        3: {
            theme: "Communication & Créativité",
            description: "L'énergie repart ! C'est une année joyeuse, sociale et légère. Vous aurez envie de sortir, de voir du monde et de vous exprimer. C'est une excellente période pour les artistes, les créateurs et les commerçants.",
            challenge: "La dispersion. Vous aurez envie de tout faire à la fois. Attention à ne pas gaspiller votre énergie dans des futilités ou des relations superficielles.",
            advice: "Exprimez-vous ! Écrivez, peignez, parlez. Dites oui aux invitations. Laissez entrer la joie et l'optimisme dans votre vie."
        },
        4: {
            theme: "Travail & Construction",
            description: "Retour au sérieux. L'année 4 demande de la rigueur et de l'effort. C'est le moment de construire des fondations solides, de mettre de l'ordre dans ses papiers, sa maison ou sa carrière. On ne rigole pas, on bâtit.",
            challenge: "La sensation de lourdeur ou de limitation. Vous aurez beaucoup de travail et peu de temps libre. Ne vous découragez pas, la récompense sera la stabilité.",
            advice: "Soyez organisé et méthodique. Ne fuyez pas vos responsabilités. Le travail accompli cette année vous sécurisera pour longtemps."
        },
        5: {
            theme: "Changement & Liberté",
            description: "Soufflez, l'étau se desserre ! L'année 5 apporte un vent de liberté et d'imprévu. C'est l'année des voyages, des déménagements, des changements de cap. La routine vole en éclats. Tout bouge, et vite.",
            challenge: "L'instabilité. Il peut être difficile de se concentrer. Attention aux excès de toute sorte (dépenses, plaisirs) et à l'impulsivité dangereuse.",
            advice: "Embrassez le changement. Soyez flexible. C'est le moment de sortir de votre zone de confort et d'oser l'aventure."
        },
        6: {
            theme: "Responsabilité & Harmonie",
            description: "On se pose. L'année 6 est centrée sur le foyer, la famille et l'amour. Les questions domestiques prennent le dessus : mariage, immobilier, enfants ou soin aux parents. Vous recherchez l'harmonie et la beauté.",
            challenge: "Ne pas étouffer les autres par trop de sollicitude. Attention aussi à ne pas vous oublier en vous sacrifiant pour votre tribu. Acceptez que tout ne soit pas parfait.",
            advice: "Prenez soin de votre nid et de ceux que vous aimez. C'est une excellente année pour s'engager, se marier ou rénover sa maison."
        },
        7: {
            theme: "Introspection & Sagesse",
            description: "Une année sabbatique pour l'âme. Vous aurez besoin de solitude et de calme. Le monde extérieur vous intéressera moins que votre monde intérieur. C'est le temps de l'analyse, de l'étude et de la compréhension spirituelle.",
            challenge: "Le sentiment d'isolement ou de mélancolie. Ne vous coupez pas totalement des autres, mais respectez votre besoin de silence. L'argent peut être un peu ralenti.",
            advice: "Méditez, lisez, apprenez. Ne forcez pas la réussite matérielle cette année. La vraie progression se fait à l'intérieur de vous."
        },
        8: {
            theme: "Pouvoir & Réussite",
            description: "Retour aux affaires ! L'année 8 est celle de la récolte matérielle. Si vous avez bien travaillé, c'est l'année du succès, de l'argent et du pouvoir. L'énergie est combative et ambitieuse. On concrétise.",
            challenge: "L'équilibre matériel/spirituel. Attention à l'arrogance ou à l'obsession du gain. La justice immanente (karma) est très active : on récolte ce qu'on a semé.",
            advice: "Foncez, mais restez juste. C'est le moment de demander une augmentation, d'investir ou de prendre des responsabilités. Soyez courageux."
        },
        9: {
            theme: "Bilan & Achèvement",
            description: "La fin du cycle. C'est l'heure du bilan et du grand nettoyage. On finit ce qui doit l'être, on se sépare de ce qui nous encombre (objets, relations, croyances). On fait place nette pour le prochain cycle. C'est une année émotionnelle.",
            challenge: "Lâcher prise. Il est difficile de laisser partir le passé. Ne commencez rien de grand et de nouveau maintenant, cela ne durerait pas.",
            advice: "Faites le vide. Donnez, pardonnez, classez. Préparez-vous intérieurement au renouveau qui arrivera l'année prochaine. Soyez généreux."
        },
        11: {
            theme: "Inspiration & Intuition",
            description: "Une vibration intense. Vous êtes connecté à votre intuition et pouvez avoir des éclairs de génie. C'est une année '1' (Nouveau Départ) mais avec une dimension spirituelle et nerveuse beaucoup plus forte.",
            challenge: "Gérer la tension nerveuse. Votre mental tournera à plein régime. Attention au surmenage. Restez ancré.",
            advice: "Écoutez votre petite voix intérieure. Vos idées peuvent être visionnaires cette année. Inspirez les autres."
        },
        22: {
            theme: "Grande Réalisation",
            description: "Une année '4' (Travail) mais surpuissante. Vous avez la capacité de bâtir des projets qui dépassent votre simple intérêt personnel. C'est le moment de voir grand et de construire pour la communauté.",
            challenge: "Le burn-out. La charge de travail peut être énorme. Ne vous laissez pas écraser par l'ampleur de la tâche.",
            advice: "Structurez vos rêves les plus fous. Vous avez la puissance pour les ancrer dans la matière. Agissez pour le bien commun."
        },
        33: {
            theme: "Service Universel",
            description: "Une année '6' (Responsabilité) vécue dans l'amour inconditionnel. Vous serez appelé à aider, soigner ou guider les autres. Une vibration d'une grande beauté mais exigeante émotionnellement.",
            challenge: "L'hypersensibilité. Protégez votre champ émotionnel tout en restant ouvert.",
            advice: "Soyez un phare pour les autres. Donnez sans attendre de retour, la vie vous le rendra au centuple."
        }
    },
    expressionNumbers: {
        1: {
            tagline: "L'élan de l'initiateur autonome.",
            nature: "Vous possédez une nature indépendante et volontaire. Vous aimez prendre les rênes et initier de nouveaux projets sans attendre l'aide des autres.",
            communication: "Votre parole est directe, franche et parfois autoritaire. Vous allez droit au but, ce qui est efficace mais peut parfois heurter les sensibilités.",
            assets: "Leadership naturel, courage d'entreprendre là où les autres n'osent pas, et une capacité unique à innover."
        },
        2: {
            tagline: "La force de l'union et de l'écoute.",
            nature: "Vous êtes fondamentalement tourné vers l'autre. La collaboration, le partenariat et l'harmonie sociale sont vitaux pour votre équilibre personnel.",
            communication: "Douce et diplomate, vous savez écouter et conseiller. Vous excellez dans l'art de résoudre les conflits sans hausser le ton.",
            assets: "Une grande empathie, un sens du détail psychologique et une capacité à fédérer les gens autour d'un but commun."
        },
        3: {
            tagline: "L'art de communiquer la joie.",
            nature: "Votre personnalité est pétillante, curieuse et expressive. Vous avez besoin de créer, de bouger et d'interagir avec le monde pour vous sentir vivant.",
            communication: "Vous avez un don pour les mots et l'éloquence. Que ce soit par l'humour ou l'art, vous savez captiver votre auditoire et transmettre vos idées.",
            assets: "Un optimisme contagieux, une créativité sans bornes et un charme social qui vous ouvre de nombreuses portes."
        },
        4: {
            tagline: "La rigueur au service de la construction.",
            nature: "Sérieux et méthodique, vous êtes le bâtisseur du zodiaque numérologique. Vous avez besoin d'ordre, de structure et de sécurité pour avancer sereinement.",
            communication: "Pragmatique et factuelle. Vous ne parlez pas pour ne rien dire. Vos engagements sont solides et votre parole est fiable.",
            assets: "Une loyauté à toute épreuve, une discipline de fer et une capacité à concrétiser durablement les projets les plus complexes."
        },
        5: {
            tagline: "La liberté comme boussole.",
            nature: "Vous êtes un esprit libre, aventureux et adaptable. La routine est votre ennemie ; vous cherchez constamment l'expérience, le voyage et la nouveauté.",
            communication: "Rapide, vive et persuasive. Vous aimez débattre et convaincre, et votre esprit vif s'adapte à tous les interlocuteurs.",
            assets: "Un magnétisme personnel, une polyvalence exceptionnelle et le courage de changer de vie du jour au lendemain si nécessaire."
        },
        6: {
            tagline: "L'harmonie et le soin des autres.",
            nature: "Votre expression passe par l'amour, la famille et le sens des responsabilités. Vous êtes le gardien du foyer et cherchez à embellir la vie de vos proches.",
            communication: "Chaleureuse et rassurante. Vous savez trouver les mots qui réconfortent et vos conseils sont souvent recherchés pour leur sagesse.",
            assets: "Un sens artistique développé, une grande générosité de cœur et une fiabilité qui fait de vous le pilier de votre communauté."
        },
        7: {
            tagline: "La quête de vérité intérieure.",
            nature: "Vous êtes un penseur, un analyste ou un spiritualiste. Votre monde intérieur est riche et vous avez besoin de solitude pour approfondir vos connaissances.",
            communication: "Sélective et profonde. Vous ne vous livrez pas facilement, mais quand vous parlez, c'est pour dire des choses essentielles et réfléchies.",
            assets: "Une intelligence aiguisée, une intuition puissante et une capacité à voir au-delà des apparences superficielles."
        },
        8: {
            tagline: "L'ambition de réaliser de grandes choses.",
            nature: "Vous êtes animé par une énergie de réussite et de pouvoir. Vous comprenez le monde matériel et cherchez à y laisser une empreinte concrète et visible.",
            communication: "Directe, énergique et impactante. Vous savez commander et négocier. Votre autorité naturelle impose le respect.",
            assets: "Une vision stratégique, une endurance exceptionnelle face à l'échec et le talent pour transformer les idées en succès financier."
        },
        9: {
            tagline: "L'idéaliste ouvert sur le monde.",
            nature: "Votre expression est teintée d'humanisme et de compassion. Vous voyez grand et vous intéressez aux enjeux collectifs plutôt qu'aux détails égoïstes.",
            communication: "Inspirante et tolérante. Vous parlez avec votre cœur et cherchez à élever les consciences autour de vous par votre exemple.",
            assets: "Une générosité désintéressée, une ouverture d'esprit internationale et un talent pour les vocations artistiques ou humanitaires."
        },
        11: {
            tagline: "L'inspiration visionnaire.",
            nature: "Nombre Maître. Vous possédez une intuition surdéveloppée et une sensibilité à fleur de peau. Vous êtes un canal pour des idées novatrices.",
            communication: "Magnétique et parfois électrique. Vous pouvez inspirer les foules par votre vision, mais attention à la tension nerveuse.",
            assets: "Un charisme spirituel, une créativité avant-gardiste et la capacité de guider les autres vers une nouvelle conscience."
        },
        22: {
            tagline: "Le bâtisseur de l'impossible.",
            nature: "Nombre Maître. Vous alliez l'idéalisme du 11 à la rigueur du 4. Vous avez le potentiel de réaliser des projets d'envergure mondiale.",
            communication: "Pragmatique mais visionnaire. Vous savez expliquer comment transformer un rêve utopique en réalité concrète.",
            assets: "Une puissance de travail colossale, un génie constructif et l'ambition de servir la communauté à grande échelle."
        },
        33: {
            tagline: "Le guide bienveillant.",
            nature: "Nombre Maître rare. Vous incarnez l'amour universel et le service désintéressé. Votre mission est d'apporter guérison et réconfort.",
            communication: "Empathique et douce. Votre présence seule suffit souvent à apaiser. Vous enseignez par l'exemple de votre compassion.",
            assets: "Une dévotion totale, des dons de guérison émotionnelle et une capacité à aimer sans conditions."
        }
    },
    lifePaths: {
        1: {
            title: "Chemin de Vie 1 - Le Leader",
            keywords: "Indépendance, Ambition, Innovation, Volonté",
            description: "Le chemin de vie 1 est celui des pionniers, des initiateurs et des leaders nés. Vous êtes venu ici pour apprendre à vous affirmer, à cultiver votre autonomie et à tracer votre propre voie sans attendre l'approbation des autres. D'une nature individualiste, ambitieuse et créative, vous n'aimez pas suivre les ordres et préférez diriger. Votre énergie est masculine, directe et orientée vers l'action. Vous avez le potentiel pour réaliser de grandes choses, à condition de maîtriser votre ego et d'écouter parfois les autres.",
            strengths: "Grande capacité de travail, courage inné, originalité d'esprit. Vous savez prendre des décisions rapides et tranchées là où d'autres hésitent. Votre volonté est votre moteur le plus puissant.",
            mission: "Oser être pleinement vous-même, initier des projets novateurs et guider les autres par votre exemple de réussite et d'indépendance.",
            celebs: "Steve Jobs, Chaplin, Martin Luther King"
        },
        2: {
            title: "Chemin de Vie 2 - Le Médiateur",
            keywords: "Diplomatie, Sensibilité, Coopération, Patience",
            description: "Le 2 recherche avant tout l'harmonie, la paix et l'union. C'est le chemin de la collaboration et du couple. Contrairement au 1 solitaire, vous avez besoin de l'autre pour vous épanouir. D'une grande sensibilité, vous captez les émotions de votre entourage et cherchez instinctivement à apaiser les tensions. Vous êtes un excellent diplomate, un confident précieux et un partenaire loyal.",
            strengths: "Empathie naturelle, intuition fine, tact et diplomatie. Vous êtes le ciment qui unit les groupes et savez valoriser les autres sans chercher la lumière pour vous-même.",
            mission: "Apporter la paix, soutenir, conseiller et collaborer. Votre défi est d'apprendre à poser vos limites pour ne pas vous oublier au profit des autres.",
            celebs: "Barack Obama, Madonna, Jennifer Aniston"
        },
        3: {
            title: "Chemin de Vie 3 - Le Créatif",
            keywords: "Expression, Optimisme, Communication, Charisme",
            description: "Le 3 est l'enfant joyeux et créatif de la numérologie. C'est le chemin de l'expression personnelle sous toutes ses formes : parole, écriture, art, chant ou jeu. Vous possédez un charme naturel et un optimisme contagieux qui attirent les autres. Vous avez besoin de vie sociale, de beauté et de plaisir pour vous sentir vivant. La routine et le silence vous éteignent.",
            strengths: "Charisme rayonnant, créativité sans fin, sociabilité aisée. Vous savez voir le bon côté des choses même dans l'adversité et avez le don de dédramatiser les situations.",
            mission: "Inspirer les autres par votre joie de vivre, communiquer vos idées et guérir les âmes par le rire, l'art et la parole positive.",
            celebs: "Céline Dion, Katy Perry, Cameron Diaz"
        },
        4: {
            title: "Chemin de Vie 4 - Le Bâtisseur",
            keywords: "Stabilité, Travail, Organisation, Rigueur",
            description: "Le 4 est le pilier, le bâtisseur. C'est le chemin du travail, de la rigueur et de la construction lente mais sûre. Sérieux, méthodique et terre-à-terre, vous avez un besoin vital de sécurité, de structure et d'ordre. Vous n'aimez pas l'imprévu. On peut toujours compter sur vous car vous tenez vos promesses et n'avez pas peur de l'effort.",
            strengths: "Loyauté indéfectible, discipline de fer, sens du détail et de l'organisation. Vous construisez pour durer et offrez une sécurité rassurante à vos proches.",
            mission: "Créer des fondations solides, structurer la matière et apporter de l'ordre, de la méthode et de la sécurité dans un monde chaotique.",
            celebs: "Brad Pitt, Oprah Winfrey, Bill Gates"
        },
        5: {
            title: "Chemin de Vie 5 - Le Libre",
            keywords: "Liberté, Aventure, Changement, Adaptabilité",
            description: "Le 5 est l'aventurier, l'esprit libre qui refuse les cages. C'est le chemin de la liberté, du changement et de l'expérience sensorielle. Curieux de tout, vous avez besoin de voyages, de nouveauté et de mouvement constant. Votre vie est souvent faite de rebondissements inattendus. Vous apprenez par l'expérience directe plutôt que dans les livres.",
            strengths: "Grande adaptabilité, magnétisme physique, courage et audace. Vous savez rebondir après chaque échec et n'avez pas peur de prendre des risques calculés.",
            mission: "Expérimenter la liberté sous toutes ses formes, accepter le changement comme seule constante et montrer aux autres comment vivre sans peur.",
            celebs: "Angelina Jolie, Beyoncé, Mick Jagger"
        },
        6: {
            title: "Chemin de Vie 6 - Le Responsable",
            keywords: "Harmonie, Famille, Service, Amour",
            description: "Le 6 est le chemin de l'amour, de la famille et du service. Vous êtes l'archétype du parent ou du soigneur cosmique. Vous avez un sens inné des responsabilités et recherchez l'harmonie par-dessus tout. L'injustice, la discorde et la laideur vous sont insupportables. Vous êtes prêt à beaucoup de sacrifices pour le bien-être de votre tribu.",
            strengths: "Dévouement total, goût sûr et artistique, fiabilité. Vous êtes un hôte merveilleux et savez créer des espaces chaleureux où chacun se sent aimé.",
            mission: "Apporter l'harmonie, soigner les blessures émotionnelles, embellir le monde et créer un foyer aimant et sécurisant pour votre communauté.",
            celebs: "Albert Einstein, Michael Jackson, Robert De Niro"
        },
        7: {
            title: "Chemin de Vie 7 - Le Chercheur",
            keywords: "Spiritualité, Analyse, Introspection, Sagesse",
            description: "Le 7 est le chemin de la sagesse, de l'analyse et de la spiritualité. C'est le penseur solitaire, le philosophe ou le chercheur. Vous avez besoin de comprendre le 'pourquoi' de l'existence. Souvent introverti ou distant en apparence, vous possédez une vie intérieure d'une richesse incroyable. Vous avez besoin de beaucoup de calme pour vous régénérer.",
            strengths: "Intelligence aiguisée, intuition psychique, perfectionnisme, indépendance. Vous ne vous contentez jamais des apparences et cherchez la vérité cachée.",
            mission: "Transmettre la connaissance, développer votre spiritualité et faire le pont entre la science (le visible) et la métaphysique (l'invisible).",
            celebs: "Johnny Depp, Julia Roberts, Leonardo DiCaprio"
        },
        8: {
            title: "Chemin de Vie 8 - Le Puissant",
            keywords: "Réussite, Ambition, Pouvoir, Matérialisme",
            description: "Le 8 est le chemin de la puissance, de la réussite matérielle et de l'énergie concrète. Ambitieux, combatif et visionnaire, vous êtes fait pour les grandes réalisations, le business ou la politique. Vous comprenez instinctivement les lois de l'argent et du pouvoir. C'est un chemin exigeant qui demande d'équilibrer le spirituel et le matériel.",
            strengths: "Leadership naturel, courage face à l'adversité, vision à long terme, capacité de gestion. Vous avez l'énergie pour déplacer des montagnes.",
            mission: "Utiliser votre pouvoir personnel et vos ressources financières pour bâtir, structurer et générer de l'abondance pour le plus grand nombre.",
            celebs: "Sandra Bullock, Matt Damon, 50 Cent"
        },
        9: {
            title: "Chemin de Vie 9 - L'Humaniste",
            keywords: "Compassion, Idéalisme, Voyage, Altruisme",
            description: "Le 9 est le nombre de l'accomplissement universel. C'est le chemin de l'humaniste, du voyageur de l'âme. Idéaliste, généreux et tolérant, vous ne faites pas de distinction de race ou de classe : vous aimez l'humanité entière. Vous êtes souvent attiré par les causes nobles, l'étranger ou les arts. Vous devez apprendre le détachement et le don de soi.",
            strengths: "Générosité du cœur, absence de préjugés, vision globale, talents artistiques. Vous comprenez intuitivement tous les autres nombres.",
            mission: "Guider les autres par votre sagesse, développer l'amour universel, lâcher prise sur le passé et inspirer le monde par votre compassion.",
            celebs: "Ghandi, Bob Marley, Adele"
        },
        11: {
            title: "Chemin de Vie 11 - Le Maître Inspiré",
            keywords: "Intuition, Idéalisme, Inspiration, Tension",
            description: "Nombre Maître. Le 11 possède l'inspiration du 1 et la sensibilité du 2 décuplées. Vous êtes un canal d'énergie intense, visionnaire et très intuitif.",
            strengths: "Charisme magnétique, vision spirituelle. Vous inspirez les autres sans le vouloir.",
            mission: "Éveiller les consciences et apporter une nouvelle vision spirituelle au monde.",
            celebs: "Michelle Obama, Harry Houdini"
        },
        22: {
            title: "Chemin de Vie 22 - Le Maître Bâtisseur",
            keywords: "Réalisation, Génie, Construction, Puissance",
            description: "Nombre Maître. Le 22 a la vision du 4 mais avec une envergure illimitée. Vous avez le potentiel de réaliser des projets grandioses qui bénéficieront à l'humanité entière.",
            strengths: "Pragmatisme et idéalisme combinés. Vous savez concrétiser les rêves les plus fous.",
            mission: "Bâtir des structures durables qui changeront le monde à grande échelle.",
            celebs: "Dalai Lama, Paul McCartney"
        },
        33: {
            title: "Chemin de Vie 33 - Le Guide",
            keywords: "Amour universel, Sacrifice, Guérison, Compassion",
            description: "Rare Nombre Maître. Le 33 représente l'amour pur. C'est le chemin du 'Christ', celui du sacrifice de soi pour le bien supérieur. Une vibration très haute et difficile à incarner.",
            strengths: "Empathie totale, capacité de guérison. Vous rayonnez d'amour.",
            mission: "Guérir les cœurs et enseigner par l'amour inconditionnel.",
            celebs: "Meryl Streep, Francis Ford Coppola"
        }
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    NumerologyApp.init();
});
