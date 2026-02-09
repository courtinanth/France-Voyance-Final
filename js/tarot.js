/**
 * France Voyance Avenir - Tarot Tool
 * Logic for interactive tarot reading
 */

// Full 22 Major Arcana Data provided by User
const tarotDeck = [
    {
        id: 0,
        name: "Le Mat",
        image: "/images/tarot/0-le-mat.png",
        keywords: { upright: "Liberté, nouveaux départs", reversed: "Imprudence, inconscience" },
        meanings: {
            general: { upright: "Le Mat symbolise le début d'un voyage spirituel, l'innocence et la liberté spontanée. C'est le moment de sauter dans l'inconnu avec confiance.", reversed: "Attention à l'insouciance et aux décisions impulsives. Vous pourriez manquer de discernement face à une situation importante." },
            love: { upright: "Une nouvelle aventure amoureuse spontanée et sans attache. Laissez-vous porter par l'instant présent.", reversed: "Instabilité émotionnelle ou refus de s'engager. Une relation peut manquer de sérieux ou de direction." },
            work: { upright: "Osez prendre des risques calculés. Une nouvelle opportunité inattendue pourrait se présenter.", reversed: "Manque de planification ou projets irréalistes. Attention à ne pas négliger les détails importants." }
        }
    },
    {
        id: 1,
        name: "Le Bateleur",
        image: "/images/tarot/1-le-bateleur.png",
        keywords: { upright: "Créativité, habileté", reversed: "Manipulation, manque de confiance" },
        meanings: {
            general: { upright: "Le Bateleur est la carte de la manifestation. Vous avez tous les outils en main pour réussir. C'est le moment d'agir.", reversed: "Révèle un potentiel inexploité ou un manque de confiance en soi. Attention aussi à la manipulation ou à la tromperie." },
            love: { upright: "Un nouveau départ dynamique dans la life sentimentale. Vous avez le charme et l'audace pour séduire.", reversed: "Manque de communication ou jeux de pouvoir. Soyez honnête avec vous-même et votre partenaire." },
            work: { upright: "Lancement de projet favorisé. Utilisez vos talents uniques pour vous démarquer.", reversed: "Procrastination ou dispersion. Vous avez les compétences, mais vous ne les utilisez pas efficacement." }
        }
    },
    {
        id: 2,
        name: "La Papesse",
        image: "/images/tarot/2-la-papesse.png",
        keywords: { upright: "Intuition, sagesse", reversed: "Secrets, savoir caché" },
        meanings: {
            general: { upright: "La Papesse invite à l'écoute de votre voix intérieure. La patience et la réflexion sont vos meilleures alliées actuellement.", reversed: "Vous ignorez votre intuition ou des secrets vous sont cachés. Il faut lever le voile sur la vérité." },
            love: { upright: "Une connexion spirituelle profonde. Relation platonique ou amour secret qui grandit dans le silence.", reversed: "Manque de communication émotionnelle." },
            work: { upright: "Fiez-vous à votre instinct pour prendre des décisions. C'est un temps pour l'étude et l'analyse.", reversed: "Manque d'information ou confusion. Ne signez rien sans avoir tout lu entre les lignes." }
        }
    },
    {
        id: 3,
        name: "L'Impératrice",
        image: "/images/tarot/card_3_l_imperatrice.png",
        keywords: { upright: "Féminité, abondance", reversed: "Dépendance, blocage créatif" },
        meanings: {
            general: { upright: "L'Impératrice incarne la fertilité et la création. Vos projets vont fleurir et porter leurs fruits.", reversed: "Blocage créatif ou dépendance affective. Prenez soin de vous avant de donner aux autres." },
            love: { upright: "Période d'harmonie, de sensualité et de fécondité. L'amour est épanouissant et rassurant.", reversed: "Relations étouffantes ou manque d'affection. Attention à ne pas devenir trop possessif." },
            work: { upright: "Succès matériel et créativité foisonnante. C'est le moment idéal pour lancer une idée.", reversed: "Projets stagnants ou manque d'inspiration. Reconnectez-vous à ce qui vous passionne." }
        }
    },
    {
        id: 4,
        name: "L'Empereur",
        image: "/images/tarot/card_4_l_empereur.png",
        keywords: { upright: "Autorité, structure", reversed: "Rigidité, domination" },
        meanings: {
            general: { upright: "L'Empereur apporte structure et stabilité. Il est temps d'organiser votre vie et de prendre des décisions fermes.", reversed: "Autoritarisme ou manque de discipline. Vous pourriez être trop rigide ou au contraire, manquer de cadre." },
            love: { upright: "Relation stable et protectrice. Un partenaire fiable sur qui l'on peut compter.", reversed: "Domination ou lutte de pouvoir dans le couple. Le besoin de contrôle nuit à l'harmonie." },
            work: { upright: "Leadership, ambition et réalisation concrète. Vous avez l'autorité pour mener à bien vos tâches.", reversed: "Conflits avec l'autorité ou manque d'organisation. Attention à l'obstination." }
        }
    },
    {
        id: 5,
        name: "Le Pape",
        image: "/images/tarot/card_5_le_pape.png",
        keywords: { upright: "Spiritualité, guidance", reversed: "Dogmatisme, conformisme" },
        meanings: {
            general: { upright: "Le Pape représente la tradition et l'enseignement. Cherchez conseil auprès d'une personne sage ou d'un mentor.", reversed: "Rébellion contre les normes ou mauvais conseils. Il est temps de penser par vous-même." },
            love: { upright: "Engagement sérieux, mariage ou union traditionnelle. Valeurs partagées au sein du couple.", reversed: "Conventions sociales pesantes. La relation peut être étouffée par les attentes extérieures." },
            work: { upright: "Travail d'équipe, enseignement ou respect de la hiérarchie. Suivez les règles établies pour réussir.", reversed: "Bureaucratie excessive. Vous vous sentez limité par des règles obsolètes." }
        }
    },
    {
        id: 6,
        name: "L'Amoureux",
        image: "/images/tarot/card_6_l_amoureux.png",
        keywords: { upright: "Choix, amour", reversed: "Indécision, déséquilibre" },
        meanings: {
            general: { upright: "L'Amoureux symbolise un choix crucial à faire avec le cœur. Harmonie et alignement des valeurs.", reversed: "Hésitation, conflit intérieur ou choix difficile. La peur de s'engager bloque l'avancée." },
            love: { upright: "Grand amour, passion et connexion intense. Une décision importante concernant votre vie sentimentale.", reversed: "Déséquilibre dans la relation ou infidélité émotionnelle. Il faut clarifier vos sentiments." },
            work: { upright: "Partenariats fructueux. Vous aimez ce que vous faites et cela se voit.", reversed: "Tensions entre collègues ou choix de carrière difficile. Ne mélangez pas affect et professionnel." }
        }
    },
    {
        id: 7,
        name: "Le Chariot",
        image: "/images/tarot/card_7_le_chariot.png",
        keywords: { upright: "Victoire, détermination", reversed: "Obstacles, manque de direction" },
        meanings: {
            general: { upright: "Le Chariot annonce le succès grâce à la volonté. Foncez, vous avez la maîtrise de la situation.", reversed: "Perte de contrôle ou agressivité. Vous essayez de forcer les choses au lieu de les guider." },
            love: { upright: "Conquête amoureuse ou relation qui avance vite. Vous savez ce que vous voulez.", reversed: "Directions opposées. La relation stagne ou manque d'objectif commun." },
            work: { upright: "Avancement rapide, voyage d'affaires ou réussite ambitieuse. Rien ne vous arrête.", reversed: "Énergies dispersées. Recentrez-vous sur un seul objectif à la fois." }
        }
    },
    {
        id: 8,
        name: "La Justice",
        image: "/images/tarot/card_8_la_justice.png",
        keywords: { upright: "Équilibre, vérité", reversed: "Injustice, malhonnêteté" },
        meanings: {
            general: { upright: "La Justice tranche avec impartialité. Vous récolterez ce que vous avez semé. Recherche d'équilibre.", reversed: "Sentiment d'injustice ou déséquilibre. Attention à ne pas vous mentir à vous-même." },
            love: { upright: "Relation équilibrée et honnête. Officialisation ou décision importante pour le couple.", reversed: "Rancœurs ou manque d'équité. L'un donne plus que l'autre." },
            work: { upright: "Contrats signés, intégrité et décisions justes. Respectez les règles pour réussir.", reversed: "Litiges ou décisions injustes. Revoyez vos contrats et accords." }
        }
    },
    {
        id: 9,
        name: "L'Hermite",
        image: "/images/tarot/card_9_l_hermite.png",
        keywords: { upright: "Introspection, sagesse", reversed: "Isolement, solitude" },
        meanings: {
            general: { upright: "L'Hermite invite au retrait pour trouver sa propre lumière. Temps de pause nécessaire pour réfléchir.", reversed: "Isolement excessif ou refus d'aide. Attention à ne pas vous couper du monde." },
            love: { upright: "Besoin de solitude ou relation mature et réfléchie. Patience est le maître mot.", reversed: "Solitude subie ou éloignement émotionnel. Ne vous renfermez pas sur vous-même." },
            work: { upright: "Recherche approfondie, spécialisation. Travaillez seul pour le moment.", reversed: "Retard ou obsession des détails. Levez la tête du guidon." }
        }
    },
    {
        id: 10,
        name: "La Roue de Fortune",
        image: "/images/tarot/card_10_la_roue_de_fortune.png",
        keywords: { upright: "Changement, destin", reversed: "Malchance, résistance au changement" },
        meanings: {
            general: { upright: "La Roue tourne. Un changement du destin arrive, souvent positif. Soyez prêt à saisir l'opportunité.", reversed: "Résistance au changement ou période de stagnation. Acceptez que tout est cyclique." },
            love: { upright: "Rencontre karmique ou évolution soudaine de la relation. Le destin s'en mêle.", reversed: "Répétition de vieux schémas amoureux. Il est temps de briser le cycle." },
            work: { upright: "Coup de chance ou changement de poste inattendu. Adaptez-vous rapidement.", reversed: "Instabilité ou revers de fortune. Restez prudent et attendez que la roue tourne à nouveau." }
        }
    },
    {
        id: 11,
        name: "La Force",
        image: "/images/tarot/card_11_la_force.png",
        keywords: { upright: "Courage, maîtrise", reversed: "Faiblesse, doute de soi" },
        meanings: {
            general: { upright: "La vraie force est intérieure. Maîtrisez vos instincts avec douceur et compassion.", reversed: "Doute de soi ou réactions impulsives. Ne laissez pas la peur vous dominer." },
            love: { upright: "Relation passionnée mais maîtrisée. Compassion et patience renforcent le lien.", reversed: "Insécurité ou jalousie. Attention aux rapports de force destructeurs." },
            work: { upright: "Détermination calme. Vous surmonterez les obstacles par la persévérance.", reversed: "Épuisement ou manque de conviction. Reposez-vous pour retrouver votre énergie." }
        }
    },
    {
        id: 12,
        name: "Le Pendu",
        image: "/images/tarot/card_12_le_pendu.png",
        keywords: { upright: "Sacrifice, lâcher-prise", reversed: "Stagnation, résistance" },
        meanings: {
            general: { upright: "Changez de perspective. Un temps d'arrêt est nécessaire pour voir la vérité.", reversed: "Résistance inutile ou rôle de victime. Acceptez de lâcher prise pour avancer." },
            love: { upright: "Pause dans la relation pour mieux redémarrer. Sacrifice par amour.", reversed: "Relation stagnante. Vous attendez un changement qui ne vient pas." },
            work: { upright: "Projets en attente. Ne forcez rien, utilisez ce temps pour réévaluer votre stratégie.", reversed: "Frustration et blocages. Vous vous sentez impuissant, mais la solution viendra d'un autre angle." }
        }
    },
    {
        id: 13,
        name: "L'Arcane sans Nom",
        image: "/images/tarot/card_13_l_arcane_sans_nom.png",
        keywords: { upright: "Transformation, fin", reversed: "Résistance, peur du changement" },
        meanings: {
            general: { upright: "Une fin nécessaire pour un renouveau. Transformation radicale et libératrice.", reversed: "Peur du changement ou deuil difficile. Vous vous accrochez au passé." },
            love: { upright: "Fin d'une étape ou rupture salvatrice. Transformation profonde de la relation.", reversed: "Refus de laisser partir une relation terminée. La guérison est retardée." },
            work: { upright: "Changement de carrière radical ou fin de contrat. Une nouvelle porte s'ouvrira.", reversed: "Peur de perdre son emploi ou stagnation. Acceptez l'évolution inévitable." }
        }
    },
    {
        id: 14,
        name: "Tempérance",
        image: "/images/tarot/card_14_temperance.png",
        keywords: { upright: "Équilibre, patience", reversed: "Excès, impatience" },
        meanings: {
            general: { upright: "Tempérance invite à la modération et à la guérison. Trouvez le juste milieu.", reversed: "Déséquilibre ou impatience. Vous allez trop vite ou manquez de mesure." },
            love: { upright: "Relation harmonieuse et paisible. La communication est fluide et douce.", reversed: "Conflits ou manque de compromis. Mettez de l'eau dans votre vin." },
            work: { upright: "Collaboration fructueuse et ambiance sereine. Progressez pas à pas.", reversed: "Concurrence déloyale ou mauvaise gestion du temps. Retrouvez votre calme." }
        }
    },
    {
        id: 15,
        name: "Le Diable",
        image: "/images/tarot/card_15_le_diable.png",
        keywords: { upright: "Passion, attachement", reversed: "Addiction, manipulation" },
        meanings: {
            general: { upright: "Le Diable parle de désirs matériels et physiques intenses. Attention à ne pas devenir esclave de vos passions.", reversed: "Libération d'une dépendance ou prise de conscience. Vous brisez vos chaînes." },
            love: { upright: "Passion dévorante et sexualité intense. Gare à la possessivité.", reversed: "Relation toxique ou manipulation. Il est temps de reprendre votre liberté." },
            work: { upright: "Ambition démesurée et réussite matérielle. Attention à l'éthique.", reversed: "Être coincé dans un emploi qu'on déteste. Cherchez la sortie." }
        }
    },
    {
        id: 16,
        name: "La Maison Dieu",
        image: "/images/tarot/card_16_la_maison_dieu.png",
        keywords: { upright: "Révélation, libération", reversed: "Catastrophe, destruction" },
        meanings: {
            general: { upright: "Un événement soudain vient tout bousculer. C'est une opportunité de reconstruire sur des bases saines.", reversed: "Changement brutal mal vécu. Vous refusez de voir la réalité qui s'effondre." },
            love: { upright: "Coup de foudre ou rupture inattendue. La vérité éclate au grand jour.", reversed: "Crise émotionnelle majeure. Ne vous accrochez pas à ce qui doit partir." },
            work: { upright: "Perte d'emploi soudaine ou restructuration. C'est un mal pour un bien.", reversed: "Conflits destructeurs. Préparez-vous à rebondir ailleurs." }
        }
    },
    {
        id: 17,
        name: "L'Étoile",
        image: "/images/tarot/card_17_l_etoile.png",
        keywords: { upright: "Espoir, inspiration", reversed: "Désespoir, déconnexion" },
        meanings: {
            general: { upright: "L'Étoile apporte espoir et protection. Ayez foi en l'avenir, vous êtes guidé.", reversed: "Perte de foi ou pessimisme. Vous ne voyez plus la lumière au bout du tunnel." },
            love: { upright: "Amour pur et sincère. Guérison des blessures passées.", reversed: "Attentes irréalistes ou déception. Ne perdez pas espoir pour autant." },
            work: { upright: "Inspiration créative et reconnaissance. Vous êtes à la bonne place.", reversed: "Manque d'inspiration ou doute sur vos talents. Retrouvez votre vision." }
        }
    },
    {
        id: 18,
        name: "La Lune",
        image: "/images/tarot/card_18_la_lune.png",
        keywords: { upright: "Intuition, illusion", reversed: "Confusion, peurs" },
        meanings: {
            general: { upright: "La Lune règne sur l'inconscient. Fiez-vous à vos rêves mais méfiez-vous des illusions.", reversed: "Confusion mentale, anxiété ou cauchemars. Distinguez le vrai du faux." },
            love: { upright: "Romantisme mais aussi flou artistique. Tout n'est pas dit.", reversed: "Jalousie infondée ou tromperie. Éclaircissez la situation." },
            work: { upright: "Créativité favorisée mais environnement flou. Naviguez à vue.", reversed: "Malentendus ou erreurs de jugement. Soyez vigilant." }
        }
    },
    {
        id: 19,
        name: "Le Soleil",
        image: "/images/tarot/card_19_le_soleil.png",
        keywords: { upright: "Joie, succès", reversed: "Égo, orgueil" },
        meanings: {
            general: { upright: "Le Soleil est la meilleure carte du jeu. Succès, bonheur et clarté totale.", reversed: "Succès retardé ou orgueil mal placé. Restez humble malgré la réussite." },
            love: { upright: "Bonheur conjugal, mariage ou naissance. L'amour rayonne.", reversed: "Vantardise ou problèmes d'ego dans le couple. Rien de grave cependant." },
            work: { upright: "Réussite éclatante et reconnaissance publique. Profitez de ce moment.", reversed: "Besoin de validation excessive. Croyez en vous sans en faire trop." }
        }
    },
    {
        id: 20,
        name: "Le Jugement",
        image: "/images/tarot/card_20_le_jugement.png",
        keywords: { upright: "Renaissance, révélation", reversed: "Regrets, doutes" },
        meanings: {
            general: { upright: "Le Jugement annonce un appel au réveil. C'est le moment de pardonner et d'avancer.", reversed: "Hésitation ou refus d'entendre l'appel. Vous vous jugez trop sévèrement." },
            love: { upright: "Renouveau dans la relation ou retour d'une personne du passé. Pardon accordé.", reversed: "Rancune tenace. Le passé pèse sur le présent." },
            work: { upright: "Vocation trouvée ou promotion méritée. Vous êtes appelé à plus grand.", reversed: "Manque de confiance en ses capacités. Osez répondre à l'appel." }
        }
    },
    {
        id: 21,
        name: "Le Monde",
        image: "/images/tarot/card_21_le_monde.png",
        keywords: { upright: "Accomplissement, complétude", reversed: "Inachèvement, retards" },
        meanings: {
            general: { upright: "Le Monde marque la fin heureuse d'un cycle. Réalisation totale et succès.", reversed: "Sentiment d'inachevé ou succès qui tarde. Il reste une dernière étape." },
            love: { upright: "Union parfaite, âme sœur. Vous avez trouvé votre place.", reversed: "Sensation de vide malgré la relation. Cherchez la sortie." },
            work: { upright: "Objectif atteint, voyages ou reconnaissance internationale. Consécration.", reversed: "Vous êtes près du but mais bloqué. Persévérez, vous y êtes presque." }
        }
    }
];

// App State
const state = {
    screen: 'intro', // intro, selection, result (lead removed)
    spreadType: 'one-card',
    cardsToSelect: 1,
    selectedCards: [],
    finalSpread: [],
};

// Spread Configurations
const spreads = {
    'one-card': { name: "Tirage 1 Carte", count: 1, labels: ["Réponse"] },
    'three-card': { name: "Tirage 3 Cartes", count: 3, labels: ["Passé", "Présent", "Futur"] },
    'cross': { name: "Tirage en Croix", count: 5, labels: ["Le Pour", "Le Contre", "Le Conseil", "Le Résultat", "La Synthèse"] },
    'love': { name: "Tirage Amour", count: 3, labels: ["Toi", "L'Autre", "La Relation"] }
};

document.addEventListener('DOMContentLoaded', () => {
    initGame();
});

function initGame() {
    // DOM Elements
    const screens = {
        intro: document.getElementById('screen-intro'),
        selection: document.getElementById('screen-selection'),
        // Lead screen removed logically
        result: document.getElementById('screen-result')
    };

    const startBtn = document.getElementById('btn-start');
    const spreadSelect = document.getElementById('spread-type');
    const deckContainer = document.getElementById('deck-container');
    const counterEl = document.getElementById('selection-counter');
    const restartBtns = document.querySelectorAll('.btn-restart');

    // Event Listeners
    startBtn.addEventListener('click', () => {
        state.spreadType = spreadSelect.value;
        state.cardsToSelect = spreads[state.spreadType].count;
        state.selectedCards = [];

        switchScreen('selection');
        setupDeck();
    });

    restartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            switchScreen('intro');
        });
    });

    function switchScreen(screenName) {
        // Hide all screens
        document.querySelectorAll('.app-screen').forEach(el => el.classList.remove('active'));

        if (screens[screenName]) {
            screens[screenName].classList.add('active');
        } else if (screenName === 'result') {
            // Explicitly handle result if mapped differently in HTML but logical here
            document.getElementById('screen-result').classList.add('active');
        }

        state.screen = screenName;
        window.scrollTo(0, 0);
    }

    function setupDeck() {
        deckContainer.innerHTML = '';
        const totalCards = 22;
        counterEl.textContent = `Carte 0/${state.cardsToSelect} sélectionnée(s)`;

        // Create cards specifically for selection UI (backs only)
        for (let i = 0; i < totalCards; i++) {
            const card = document.createElement('div');
            card.classList.add('tarot-card-back');
            card.dataset.index = i;

            // Random slight rotation for messy deck feel
            const rot = Math.random() * 10 - 5;
            card.style.transform = `rotate(${rot}deg)`;

            // Animation delay
            card.style.animationDelay = `${i * 0.05}s`;
            card.classList.add('deal-animation');

            card.addEventListener('click', () => handleCardSelect(card));
            deckContainer.appendChild(card);
        }
    }

    function handleCardSelect(cardEl) {
        if (state.selectedCards.length >= state.cardsToSelect) return;
        if (cardEl.classList.contains('selected')) return;

        // Visual feedback - Fly to bottom center (simulation of "hand")
        cardEl.classList.add('selected');

        // Randomly determine if upright or reversed (50/50)
        const isReversed = Math.random() < 0.5;

        // Pick a unique card randomly
        let cardId;
        do {
            cardId = Math.floor(Math.random() * 22);
        } while (state.selectedCards.some(c => c.id === cardId));

        const cardData = tarotDeck.find(c => c.id === cardId);

        state.selectedCards.push({
            ...cardData,
            isReversed: isReversed
        });

        counterEl.textContent = `Carte ${state.selectedCards.length}/${state.cardsToSelect} sélectionnée(s)`;

        // If all cards selected, move to result screen after delay (skipped lead capture)
        if (state.selectedCards.length === state.cardsToSelect) {
            setTimeout(() => {
                revealResults();
                switchScreen('result');
            }, 1200);
        }
    }



    function revealResults() {
        const spreadContainer = document.getElementById('spread-display');
        const synthesisContainer = document.getElementById('synthesis-display');

        spreadContainer.innerHTML = '';
        synthesisContainer.innerHTML = ''; // Clear previous
        synthesisContainer.style.display = 'none'; // Reset visibility

        const spreadConfig = spreads[state.spreadType];

        state.selectedCards.forEach((card, index) => {
            const positionLabel = spreadConfig.labels[index] || `Carte ${index + 1}`;
            const interpretation = getInterpretation(card, state.spreadType);

            const cardEl = document.createElement('div');
            cardEl.classList.add('result-card');

            const reverseClass = card.isReversed ? 'reversed' : '';
            const reverseLabel = card.isReversed ? ' (Renversée)' : '';

            // Create a pseudo-visual with Roman numeral and icon
            const romanNumerals = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI"];

            cardEl.innerHTML = `
                <div class="result-card-inner">
                    <div class="card-visual ${reverseClass}">
                         <!-- Using a generic tarot card back or art for now if SVG not present -->
                         <div class="card-art">
                            ${card.image && card.image.endsWith('.png')
                    ? `<img src="${card.image}" alt="${card.name}" style="width:100%; height:100%; object-fit:cover;">`
                    : `<span style="font-size: 1.5rem; display:block; margin-bottom:5px;">${romanNumerals[card.id]}</span><i class="fa-solid fa-star-of-david"></i>`
                }
                         </div>
                    </div>
                    <div class="card-info">
                        <span class="card-position">${positionLabel}</span>
                        <h3 style="color: #d4af37;">${card.name}${reverseLabel}</h3>
                        <p class="keywords">${card.isReversed ? card.keywords.reversed : card.keywords.upright}</p>
                        <p class="interpretation">${interpretation}</p>
                    </div>
                </div>
            `;

            // Add slight delay for reveal effect
            cardEl.style.animationDelay = `${index * 0.3}s`;
            cardEl.classList.add('reveal-up');

            spreadContainer.appendChild(cardEl);
        });

        // Save to local storage
        localStorage.setItem('last_tarot_spread', JSON.stringify({
            date: new Date(),
            type: state.spreadType,
            cards: state.selectedCards
        }));

        // Generate and Show Synthesis after cards are revealed
        // synthesisContainer already defined above

        // Add margin-bottom to separate from CTA as requested
        synthesisContainer.style.marginBottom = "60px";

        // 1. Show Loading
        showLoading(synthesisContainer);

        // 2. Simulate Calculation Delay (2.5s)
        setTimeout(() => {
            const synthesisHTML = generateSynthesisHTML(state.selectedCards, state.spreadType);
            synthesisContainer.innerHTML = synthesisHTML;
            synthesisContainer.classList.add('fade-in');

            // Scroll to synthesis
            if (window.innerWidth < 768) {
                synthesisContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 2500 + (state.selectedCards.length * 300));
    }

    function showLoading(container) {
        container.style.display = 'block';
        container.innerHTML = `
            <div class="numerology-loader" style="display:flex; min-height: 200px; padding: 40px 0;">
                <div class="loader-mandala">
                    <div class="loader-ring"></div>
                    <div class="loader-crystal"></div>
                    <div class="loader-orbit"></div>
                </div>
                <div class="loader-text">Connexion Astrale</div>
                <div class="loader-subtext">Interprétation des arcanes en cours...</div>
            </div>
        `;
    }

    function getInterpretation(card, spreadType) {
        const aspect = card.isReversed ? 'reversed' : 'upright';

        if (spreadType === 'love') {
            return card.meanings.love[aspect];
        } else if (spreadType === 'cross') {
            return card.meanings.general[aspect];
        } else {
            return card.meanings.general[aspect];
        }
    }

    function generateSynthesisHTML(cards, spreadType) {
        let title = "Synthèse de votre Tirage";
        let contentHtml = "";
        let adviceText = "";

        // Helper to get name with state
        const getName = (c) => `<strong>${c.name}</strong>` + (c.isReversed ? " (Renversée)" : "");

        if (spreadType === 'one-card') {
            const c = cards[0];
            title = "Réponse de l'Oracle";
            contentHtml = `<p>Votre tirage unique met en lumière l'énergie de ${getName(c)}. ${getInterpretation(c, spreadType)}</p>`;
            adviceText = `Cette carte vous invite à une réflexion immédiate. Son message est direct : ${c.isReversed ? "Attention aux blocages internes." : "Faites confiance à cette vibration positive."}`;

        } else if (spreadType === 'three-card') {
            title = "Passé, Présent, Futur";
            const [c1, c2, c3] = cards;
            // Added mb-3 class style logic
            const pStyle = "margin-bottom: 20px;";
            contentHtml = `
            <p style="${pStyle}">Ce tirage dévoile l'évolution temporelle de votre situation.</p>
            <p style="${pStyle}"><strong>Dans le Passé :</strong><br> ${getName(c1)} a posé les bases. ${getInterpretation(c1, spreadType)}</p>
            <p style="${pStyle}"><strong>Actuellement :</strong><br> L'énergie de ${getName(c2)} domine. C'est votre point d'ancrage. ${getInterpretation(c2, spreadType)}</p>
            <p style="${pStyle}"><strong>Vers le Futur :</strong><br> La situation tend vers ${getName(c3)}. ${getInterpretation(c3, spreadType)}</p>
            `;
            adviceText = `Pour passer harmonieusement de ${c2.name} à ${c3.name}, gardez en tête la leçon du passé (${c1.name}). Le chemin est tracé, mais votre libre arbitre reste maître.`;

        } else if (spreadType === 'love') {
            title = "Analyse Relationnelle";
            const [c1, c2, c3] = cards;
            // Added mb-3 class style logic
            const pStyle = "margin-bottom: 20px;";
            contentHtml = `
            <p style="${pStyle}">Voici l'énergie qui circule entre vous.</p>
            <p style="${pStyle}"><strong>Votre Posture :</strong><br> Vous êtes représenté(e) par ${getName(c1)}. ${getInterpretation(c1, 'love')}</p>
            <p style="${pStyle}"><strong>L'Autre / Le Partenaire :</strong><br> Cette personne apparaît sous les traits de ${getName(c2)}. ${getInterpretation(c2, 'love')}</p>
            <p style="${pStyle}"><strong>La Dynamique du Lien :</strong><br> Entre vous, ${getName(c3)} colore la relation. ${getInterpretation(c3, 'love')}</p>
            `;

            // Simple logic for advice based on reversal
            const revCount = cards.filter(c => c.isReversed).length;
            if (revCount >= 2) {
                adviceText = "Les cartes renversées indiquent des blocages ou des malentendus. La communication est urgente pour dissiper ces ombres.";
            } else {
                adviceText = "Les énergies sont globalement fluides. Nourrissez ce lien avec l'enseignement de " + c3.name + ".";
            }

        } else if (spreadType === 'cross') {
            title = "Tirage en Croix - Analyse Complète";
            const [c1, c2, c3, c4, c5] = cards;

            // Added mb-3 class style logic (inline for now) for distinct paragraph blocks
            const pStyle = "margin-bottom: 20px;";

            contentHtml = `
            <p style="${pStyle}">Une vue d'ensemble de votre questionnement.</p>
            <p style="${pStyle}"><strong>Le Pour (Atouts) :</strong><br> ${getName(c1)} vous soutient avec ses qualités.</p>
            <p style="${pStyle}"><strong>Le Contre (Obstacles) :</strong><br> ${getName(c2)} représente le défi à surmonter ou ce qui vous freine.</p>
            <p style="${pStyle}"><strong>Le Conseil :</strong><br> ${getName(c3)} vous suggère la marche à suivre : ${getInterpretation(c3, spreadType)}</p>
            <p style="${pStyle}"><strong>Le Résultat Probable :</strong><br> ${getName(c4)} montre l'issue si la situation suit son cours actuel.</p>
            <p style="${pStyle}"><strong>La Synthèse :</strong><br> ${getName(c5)} résume l'essence spirituelle du tirage.</p>
            `;
            adviceText = `L'équilibre entre ${c1.name} et ${c2.name} est la clé. Suivez le conseil de ${c3.name} pour atteindre le meilleur potentiel de ${c4.name}.`;
        }

        // Build Final HTML structure matching Numerology style
        return `
            <h3 class="result-title slide-up">${title}</h3>
            <div class="result-keywords slide-up" style="animation-delay: 0.1s; color: var(--color-secondary); margin-bottom: 20px;">
               <i class="fa-solid fa-star-of-david"></i> Arcanes : ${cards.map(c => c.name).join(' • ')}
            </div>
            <div class="result-text slide-up" style="animation-delay: 0.2s">
                ${contentHtml}
                <div style="margin-top: 30px;">
                    <h4><i class="fa-solid fa-lightbulb"></i> Le Conseil de l'Oracle</h4>
                    <div class="tips-box">${adviceText}</div>
                </div>
            </div>
        `;
    }
}
