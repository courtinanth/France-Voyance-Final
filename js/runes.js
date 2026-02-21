/**
 * France Voyance Avenir - Runes Divination Tool
 * Interactive Elder Futhark runes drawing
 */

const runesDeck = [
    {
        id: 0, name: "Fehu", symbol: "\u16A0",
        element: "Feu",
        keywords: { upright: ["Richesse", "Abondance", "Prospérité"], reversed: ["Perte", "Avidité", "Échec"] },
        meanings: {
            upright: "Fehu annonce une période de prospérité matérielle et d'abondance. Les efforts passés portent enfin leurs fruits et la chance sourit à vos entreprises. Accueillez cette énergie avec gratitude.",
            reversed: "Fehu inversée met en garde contre les pertes financières ou les investissements hasardeux. L'avidité ou l'attachement excessif aux biens matériels pourrait vous mener à la déception."
        },
        themes: {
            amour: "En amour, Fehu promet une relation enrichissante et épanouissante. Les échanges émotionnels sont généreux et nourrissent le lien.",
            travail: "Côté professionnel, une augmentation, un contrat signé ou une opportunité lucrative se profile. La réussite financière est à portée de main.",
            general: "L'énergie de Fehu vous pousse à cultiver l'abondance sous toutes ses formes. Partagez votre richesse pour en attirer davantage."
        }
    },
    {
        id: 1, name: "Uruz", symbol: "\u16A2",
        element: "Terre",
        keywords: { upright: ["Force", "Santé", "Vitalité"], reversed: ["Faiblesse", "Maladie", "Brutalité"] },
        meanings: {
            upright: "Uruz symbolise la force brute et la vitalité intérieure. Vous disposez d'une énergie considérable pour surmonter les obstacles. C'est le moment d'agir avec détermination.",
            reversed: "Uruz renversée indique un manque d'énergie ou une période de fragilité physique ou mentale. Attention à ne pas forcer les choses ni utiliser la force de manière destructrice."
        },
        themes: {
            amour: "La passion domine votre vie sentimentale. Uruz apporte une connexion physique intense et un désir renouvelé dans le couple.",
            travail: "Votre énergie au travail est remarquable. Vous impressionnez par votre endurance et votre capacité à mener les projets à terme.",
            general: "Uruz vous invite à puiser dans vos réserves de force intérieure. Le courage et la ténacité seront vos meilleurs alliés."
        }
    },
    {
        id: 2, name: "Thurisaz", symbol: "\u16A6",
        element: "Feu",
        keywords: { upright: ["Protection", "Défense", "Réaction"], reversed: ["Danger", "Vulnérabilité", "Conflit"] },
        meanings: {
            upright: "Thurisaz est la rune du gardien. Elle offre une protection puissante contre les menaces extérieures. Un obstacle sera brisé grâce à votre détermination et votre instinct de survie.",
            reversed: "Thurisaz inversée avertit d'un danger imminent ou d'un conflit latent. Vous êtes vulnérable et devez redoubler de prudence avant de prendre des décisions impulsives."
        },
        themes: {
            amour: "En amour, Thurisaz conseille la patience avant d'agir. Une confrontation pourrait être nécessaire pour assainir la relation.",
            travail: "Un défi professionnel se dresse devant vous, mais vous avez les armes pour le surmonter. Restez vigilant face aux rivalités.",
            general: "Thurisaz demande de la réflexion avant l'action. Les forces en jeu sont puissantes et nécessitent du discernement."
        }
    },
    {
        id: 3, name: "Ansuz", symbol: "\u16A8",
        element: "Air",
        keywords: { upright: ["Sagesse", "Communication", "Inspiration"], reversed: ["Manipulation", "Incompréhension", "Tromperie"] },
        meanings: {
            upright: "Ansuz est la rune de la parole divine et de la sagesse. Un message important va vous parvenir, peut-être d'un mentor ou d'une source inattendue. Écoutez avec attention.",
            reversed: "Ansuz renversée signale des problèmes de communication ou des malentendus. Méfiez-vous des faux conseils et des paroles trompeuses qui pourraient vous égarer."
        },
        themes: {
            amour: "La communication est la clé de votre relation. Ansuz favorise les déclarations sincères et les échanges profonds avec l'être aimé.",
            travail: "Un entretien, une présentation ou une négociation tournera en votre faveur. Vos mots ont un pouvoir particulier en ce moment.",
            general: "Ansuz vous connecte à la sagesse ancestrale. Restez ouvert aux signes et aux synchronicités qui jalonnent votre chemin."
        }
    },
    {
        id: 4, name: "Raido", symbol: "\u16B1",
        element: "Air",
        keywords: { upright: ["Voyage", "Mouvement", "Progrès"], reversed: ["Blocage", "Retard", "Désorientation"] },
        meanings: {
            upright: "Raido annonce un mouvement positif dans votre vie, qu'il soit physique ou spirituel. Un voyage ou un changement de direction vous attend. Le chemin est ouvert devant vous.",
            reversed: "Raido inversée indique des retards ou des obstacles sur votre route. Un voyage pourrait être annulé ou perturbé. Revoyez votre itinéraire avant de continuer."
        },
        themes: {
            amour: "Votre relation entre dans une nouvelle phase de croissance. Un voyage ensemble pourrait renforcer les liens affectifs.",
            travail: "Un déplacement professionnel ou un changement de poste se profile. L'évolution de carrière est en marche.",
            general: "Raido vous encourage à avancer avec confiance. Chaque pas vous rapproche de votre destination, même si le chemin semble sinueux."
        }
    },
    {
        id: 5, name: "Kenaz", symbol: "\u16B2",
        element: "Feu",
        keywords: { upright: ["Révélation", "Créativité", "Illumination"], reversed: ["Obscurité", "Illusion", "Stagnation"] },
        meanings: {
            upright: "Kenaz est la torche qui éclaire les ténèbres. Une révélation importante va changer votre perspective. La créativité et l'inspiration sont à leur apogée.",
            reversed: "Kenaz renversée suggère que vous êtes dans le flou ou que vous refusez de voir la vérité. Les illusions vous empêchent de progresser vers la lumière."
        },
        themes: {
            amour: "Une flamme s'allume dans votre vie sentimentale. Kenaz annonce une passion nouvelle ou un regain d'ardeur dans le couple.",
            travail: "Un éclair de génie ou une idée innovante va transformer votre approche professionnelle. La créativité est votre meilleur atout.",
            general: "Kenaz illumine votre chemin intérieur. Suivez cette lumière pour trouver les réponses que vous cherchez."
        }
    },
    {
        id: 6, name: "Gebo", symbol: "\u16B7",
        element: "Air",
        keywords: { upright: ["Don", "Partenariat", "Équilibre"], reversed: ["Déséquilibre", "Obligation", "Dépendance"] },
        meanings: {
            upright: "Gebo représente le don sacré et l'échange équilibré. Un partenariat fructueux ou un cadeau inattendu enrichira votre vie. La générosité attire la générosité.",
            reversed: "Gebo inversée avertit d'un déséquilibre dans les échanges. Vous donnez trop ou pas assez. Attention aux relations où l'un exploite l'autre."
        },
        themes: {
            amour: "L'amour est un échange. Gebo promet une union harmonieuse où chacun donne et reçoit en parts égales.",
            travail: "Un partenariat professionnel sera source de succès mutuel. La collaboration et le travail d'équipe portent leurs fruits.",
            general: "Gebo vous rappelle que tout dans la vie est un échange. Cultivez la réciprocité et la gratitude dans vos relations."
        }
    },
    {
        id: 7, name: "Wunjo", symbol: "\u16B9",
        element: "Terre",
        keywords: { upright: ["Joie", "Harmonie", "Bonheur"], reversed: ["Tristesse", "Aliénation", "Discorde"] },
        meanings: {
            upright: "Wunjo est la rune du bonheur et de l'accomplissement. Une période de joie intense et d'harmonie s'ouvre devant vous. Savourez chaque instant de cette bénédiction.",
            reversed: "Wunjo renversée révèle une période de tristesse ou d'isolement émotionnel. Les conflits perturbent votre équilibre intérieur. Il est temps de chercher la réconciliation."
        },
        themes: {
            amour: "Le bonheur rayonne dans votre vie sentimentale. Wunjo annonce des moments de complicité profonde et de tendresse partagée.",
            travail: "Satisfaction professionnelle et reconnaissance de vos pairs. Vous aimez ce que vous faites et cela se voit dans vos résultats.",
            general: "Wunjo vous invite à célébrer la vie et à partager votre joie avec les autres. Le bonheur se multiplie quand on le partage."
        }
    },
    {
        id: 8, name: "Hagalaz", symbol: "\u16BA",
        element: "Eau",
        keywords: { upright: ["Perturbation", "Transformation", "Épreuve"], reversed: ["Catastrophe", "Stagnation", "Résistance"] },
        meanings: {
            upright: "Hagalaz est la rune de la tempête purificatrice. Un bouleversement inattendu va secouer vos certitudes, mais cette épreuve est nécessaire pour une renaissance profonde.",
            reversed: "Hagalaz inversée intensifie les perturbations. Vous résistez au changement, ce qui aggrave la situation. Acceptez la tempête pour mieux reconstruire ensuite."
        },
        themes: {
            amour: "Une crise relationnelle peut ébranler les fondations du couple. C'est dans l'adversité que se révèle la solidité du lien.",
            travail: "Un changement brutal au travail, restructuration ou perte, est possible. Gardez votre sang-froid pour rebondir rapidement.",
            general: "Hagalaz rappelle que la destruction précède la création. Ce qui est balayé par la tempête n'était pas suffisamment ancré."
        }
    },
    {
        id: 9, name: "Nauthiz", symbol: "\u16BE",
        element: "Feu",
        keywords: { upright: ["Nécessité", "Résistance", "Endurance"], reversed: ["Privation", "Restriction", "Impatience"] },
        meanings: {
            upright: "Nauthiz enseigne la force qui naît de la contrainte. Les limitations actuelles vous poussent à trouver des solutions créatives. La patience et l'endurance seront récompensées.",
            reversed: "Nauthiz renversée amplifie le sentiment de privation et de frustration. Vous vous sentez piégé par les circonstances. Évitez les décisions dictées par le désespoir."
        },
        themes: {
            amour: "La relation traverse une période de restriction. Nauthiz invite à travailler sur les fondations plutôt que de chercher la fuite.",
            travail: "Les ressources sont limitées, mais votre ingéniosité fera la différence. Transformez les contraintes en opportunités.",
            general: "Nauthiz vous enseigne que le besoin est le moteur de l'invention. Acceptez les difficultés comme des catalyseurs de croissance."
        }
    },
    {
        id: 10, name: "Isa", symbol: "\u16C1",
        element: "Eau",
        keywords: { upright: ["Immobilité", "Patience", "Introspection"], reversed: ["Stagnation", "Isolement", "Blocage"] },
        meanings: {
            upright: "Isa est la rune de la glace et du silence. Tout est à l'arrêt et c'est normal. Ce temps de pause est essentiel pour la réflexion intérieure avant de reprendre votre élan.",
            reversed: "Isa inversée signale un blocage persistant qui vous empêche d'avancer. L'isolement devient pesant et la stagnation risque de miner votre moral."
        },
        themes: {
            amour: "La relation connaît une période de froid. Isa conseille de prendre du recul plutôt que de forcer les choses.",
            travail: "Les projets sont en standby. Profitez de cette pause pour planifier et peaufiner votre stratégie future.",
            general: "Isa vous demande d'accepter l'immobilité comme une phase naturelle. Le dégel viendra en son temps."
        }
    },
    {
        id: 11, name: "Jera", symbol: "\u16C3",
        element: "Terre",
        keywords: { upright: ["Récolte", "Cycles", "Récompense"], reversed: ["Retard", "Impatience", "Mauvais timing"] },
        meanings: {
            upright: "Jera est la rune de la récolte et des cycles accomplis. Le temps du labeur touche à sa fin et vous allez enfin récolter les fruits de vos efforts. La patience a porté ses fruits.",
            reversed: "Jera inversée indique que la récolte n'est pas encore prête. Vous êtes impatient, mais précipiter les choses pourrait compromettre le résultat final."
        },
        themes: {
            amour: "La relation mûrit et s'approfondit naturellement. Jera promet une évolution harmonieuse, construite sur la confiance mutuelle.",
            travail: "Un projet de longue haleine aboutit enfin. La promotion, l'augmentation ou la reconnaissance que vous attendiez arrive.",
            general: "Jera vous rappelle que tout a un temps. Respectez les cycles naturels et la récompense viendra d'elle-même."
        }
    },
    {
        id: 12, name: "Eihwaz", symbol: "\u16C7",
        element: "Terre",
        keywords: { upright: ["Endurance", "Défense", "Transformation"], reversed: ["Confusion", "Destruction", "Peur"] },
        meanings: {
            upright: "Eihwaz, l'if éternel, symbolise la connexion entre les mondes. Vous traversez une transformation profonde qui renforcera votre résilience. Tenez bon, l'épreuve forge le caractère.",
            reversed: "Eihwaz renversée indique une période de confusion spirituelle ou de peur face à l'inconnu. Les anciens schémas doivent mourir pour que le nouveau puisse naître."
        },
        themes: {
            amour: "La relation évolue en profondeur. Eihwaz invite à accepter les transformations nécessaires pour grandir ensemble.",
            travail: "Votre persévérance sera mise à l'épreuve. Restez ancré dans vos valeurs et vous traverserez cette période de turbulence.",
            general: "Eihwaz symbolise la colonne vertébrale de votre être. Restez droit et aligné face aux défis qui se présentent."
        }
    },
    {
        id: 13, name: "Pertho", symbol: "\u16C8",
        element: "Eau",
        keywords: { upright: ["Mystère", "Destin", "Révélation"], reversed: ["Secret", "Malchance", "Stagnation"] },
        meanings: {
            upright: "Pertho est la rune du mystère et du destin caché. Un secret va être révélé ou une synchronicité remarquable va se manifester. Faites confiance au processus cosmique.",
            reversed: "Pertho inversée suggère que des secrets vous sont dissimulés ou que le destin semble jouer contre vous. La malchance apparente cache un enseignement profond."
        },
        themes: {
            amour: "Un mystère entoure votre vie sentimentale. Pertho annonce une révélation qui changera votre perception de la relation.",
            travail: "Une opportunité cachée se dévoile. Restez attentif aux indices subtils que l'univers place sur votre chemin professionnel.",
            general: "Pertho vous connecte aux forces mystérieuses du destin. Acceptez l'incertitude comme une porte vers de nouvelles possibilités."
        }
    },
    {
        id: 14, name: "Algiz", symbol: "\u16C9",
        element: "Air",
        keywords: { upright: ["Protection", "Instinct", "Connexion divine"], reversed: ["Vulnérabilité", "Danger caché", "Négligence"] },
        meanings: {
            upright: "Algiz est le bouclier divin qui veille sur vous. Votre instinct de protection est aiguisé et les forces supérieures vous guident. Vous êtes en sécurité sur votre chemin.",
            reversed: "Algiz inversée signale une baisse de vigilance qui pourrait vous exposer à des dangers cachés. Renforcez vos défenses et faites confiance à votre intuition."
        },
        themes: {
            amour: "Algiz protège votre relation contre les influences négatives extérieures. La connexion spirituelle avec votre partenaire se renforce.",
            travail: "Vous êtes protégé dans vos entreprises professionnelles. Faites confiance à votre instinct pour prendre les bonnes décisions.",
            general: "Algiz vous invite à élever votre conscience vers le divin. La protection est assurée quand vous restez aligné avec votre mission de vie."
        }
    },
    {
        id: 15, name: "Sowilo", symbol: "\u16CA",
        element: "Feu",
        keywords: { upright: ["Succès", "Victoire", "Énergie solaire"], reversed: ["Orgueil", "Vanité", "Fausse lumière"] },
        meanings: {
            upright: "Sowilo est le soleil triomphant. Le succès, la victoire et la reconnaissance sont à portée de main. Votre énergie vitale est au maximum et rien ne peut vous arrêter.",
            reversed: "Sowilo renversée met en garde contre l'orgueil et la vanité. Le succès peut aveugler et mener à des décisions imprudentes. Restez humble malgré vos accomplissements."
        },
        themes: {
            amour: "L'amour brille de mille feux. Sowilo promet une période de passion intense et de bonheur rayonnant dans le couple.",
            travail: "La réussite professionnelle est éclatante. Vos projets aboutissent avec succès et votre talent est reconnu par tous.",
            general: "Sowilo vous insuffle une énergie solaire puissante. Utilisez cette lumière intérieure pour illuminer votre chemin et celui des autres."
        }
    },
    {
        id: 16, name: "Tiwaz", symbol: "\u16CF",
        element: "Air",
        keywords: { upright: ["Justice", "Honneur", "Victoire"], reversed: ["Injustice", "Défaite", "Déséquilibre"] },
        meanings: {
            upright: "Tiwaz est la rune du guerrier juste. La victoire vous attend si vous restez fidèle à vos principes. Le sacrifice nécessaire sera récompensé par la justice divine.",
            reversed: "Tiwaz inversée indique une injustice subie ou un manque de courage face à l'adversité. Vous devez retrouver votre honneur et défendre vos convictions."
        },
        themes: {
            amour: "La loyauté et l'engagement sont au coeur de votre relation. Tiwaz appelle à défendre l'amour avec courage et intégrité.",
            travail: "Un combat professionnel sera gagné si vous agissez avec éthique. La justice prévaudra dans les conflits en cours.",
            general: "Tiwaz vous demande de vous battre pour ce qui est juste. Le courage et l'honneur sont les armes de votre victoire."
        }
    },
    {
        id: 17, name: "Berkano", symbol: "\u16D2",
        element: "Terre",
        keywords: { upright: ["Renaissance", "Fertilité", "Croissance"], reversed: ["Stérilité", "Abandon", "Stagnation"] },
        meanings: {
            upright: "Berkano est la rune du bouleau, symbole de renaissance et de fertilité. Un nouveau départ s'annonce, porteur de douceur et de croissance. La vie reprend ses droits.",
            reversed: "Berkano inversée signale des blocages dans la croissance personnelle ou un projet qui ne parvient pas à éclore. Le terrain doit être préparé avant de semer."
        },
        themes: {
            amour: "Une naissance, un mariage ou un renouveau amoureux illumine votre vie sentimentale. Berkano nourrit l'amour avec tendresse.",
            travail: "Un nouveau projet voit le jour et promet une belle croissance. Les bases sont solides pour construire durablement.",
            general: "Berkano vous invite à accueillir le renouveau avec douceur et confiance. Chaque fin est le germe d'un nouveau commencement."
        }
    },
    {
        id: 18, name: "Ehwaz", symbol: "\u16D6",
        element: "Terre",
        keywords: { upright: ["Mouvement", "Confiance", "Partenariat"], reversed: ["Stagnation", "Méfiance", "Trahison"] },
        meanings: {
            upright: "Ehwaz est la rune du cheval fidèle et du mouvement harmonieux. Un partenariat de confiance ou un déplacement bénéfique se profile. Avancez main dans la main avec vos alliés.",
            reversed: "Ehwaz inversée indique une rupture de confiance ou un partenariat qui s'essouffle. La méfiance s'installe et freine votre progression commune."
        },
        themes: {
            amour: "Le couple avance ensemble dans la même direction. Ehwaz renforce la complicité et la confiance mutuelle.",
            travail: "Un partenariat professionnel fluide et productif. La collaboration est la clé de votre réussite actuelle.",
            general: "Ehwaz symbolise le mouvement harmonieux vers l'avant. Faites confiance à vos alliés et avancez ensemble."
        }
    },
    {
        id: 19, name: "Mannaz", symbol: "\u16D7",
        element: "Air",
        keywords: { upright: ["Humanité", "Intelligence", "Coopération"], reversed: ["Égoïsme", "Isolement", "Manipulation"] },
        meanings: {
            upright: "Mannaz représente l'être humain dans sa plénitude. L'intelligence, la coopération et la compréhension mutuelle sont vos forces actuelles. Cherchez le soutien de votre communauté.",
            reversed: "Mannaz renversée signale un repli sur soi excessif ou une tendance à manipuler les autres. L'égoïsme compromet vos relations et votre évolution."
        },
        themes: {
            amour: "La compréhension mutuelle est au coeur de votre relation. Mannaz favorise les échanges intellectuels et émotionnels profonds.",
            travail: "Le travail d'équipe et la collaboration sont essentiels à votre réussite. Valorisez les compétences de chacun.",
            general: "Mannaz vous rappelle que vous faites partie d'un tout. Cultivez vos relations humaines avec sincérité et bienveillance."
        }
    },
    {
        id: 20, name: "Laguz", symbol: "\u16DA",
        element: "Eau",
        keywords: { upright: ["Intuition", "Émotion", "Fluidité"], reversed: ["Confusion", "Peur", "Submersion"] },
        meanings: {
            upright: "Laguz est la rune de l'eau et de l'intuition profonde. Laissez-vous guider par votre ressenti et vos rêves. Le courant vous porte vers votre destination naturelle.",
            reversed: "Laguz inversée indique une submersion émotionnelle ou une confusion intérieure. Vos peurs vous empêchent de suivre le courant naturel de la vie."
        },
        themes: {
            amour: "Les émotions coulent librement dans votre relation. Laguz invite à l'abandon amoureux et à la confiance dans le flux de la vie.",
            travail: "Fiez-vous à votre intuition dans vos décisions professionnelles. Le courant est porteur si vous cessez de nager à contre-courant.",
            general: "Laguz vous connecte à vos profondeurs émotionnelles. Plongez sans crainte dans l'océan de votre subconscient."
        }
    },
    {
        id: 21, name: "Ingwaz", symbol: "\u16DC",
        element: "Eau",
        keywords: { upright: ["Fertilité", "Achèvement", "Repos"], reversed: ["Dispersion", "Inachèvement", "Impuissance"] },
        meanings: {
            upright: "Ingwaz marque l'achèvement d'un cycle et le repos mérité avant le suivant. La graine a été plantée et germe en silence. Tout se met en place naturellement.",
            reversed: "Ingwaz inversée révèle un sentiment d'inachèvement ou de dispersion. L'énergie créative est bloquée et les projets restent en suspens sans aboutir."
        },
        themes: {
            amour: "Un chapitre amoureux se clôture harmonieusement. Ingwaz prépare le terrain pour une nouvelle étape encore plus belle.",
            travail: "Un projet touche à sa fin avec succès. Prenez le temps de vous reposer avant d'entamer le prochain cycle professionnel.",
            general: "Ingwaz vous invite au repos sacré. Le silence entre deux notes fait partie de la musique de votre vie."
        }
    },
    {
        id: 22, name: "Dagaz", symbol: "\u16DE",
        element: "Feu",
        keywords: { upright: ["Éveil", "Percée", "Clarté"], reversed: ["Aveuglement", "Stagnation", "Fin de cycle"] },
        meanings: {
            upright: "Dagaz est l'aube radieuse après la nuit. Une percée spirituelle ou matérielle transforme radicalement votre situation. L'illumination dissipe tous les doutes.",
            reversed: "Dagaz inversée indique un aveuglement volontaire ou une résistance à l'éveil. Vous refusez de voir la lumière qui pointe à l'horizon."
        },
        themes: {
            amour: "Un éveil amoureux bouleverse vos certitudes. Dagaz annonce un coup de foudre ou une prise de conscience transformatrice.",
            travail: "Une percée professionnelle change la donne. Les idées fusent et les projets prennent une nouvelle dimension lumineuse.",
            general: "Dagaz est le signal d'un nouveau jour. Accueillez cette transformation avec ouverture d'esprit et gratitude."
        }
    },
    {
        id: 23, name: "Othala", symbol: "\u16DF",
        element: "Terre",
        keywords: { upright: ["Héritage", "Patrimoine", "Racines"], reversed: ["Déracinement", "Perte", "Exclusion"] },
        meanings: {
            upright: "Othala est la rune de l'héritage ancestral et du foyer. Vos racines vous portent et votre patrimoine, matériel ou spirituel, est une source de force. Honorez ce qui vous a été transmis.",
            reversed: "Othala renversée signale un déracinement ou une perte liée au patrimoine familial. Vous vous sentez coupé de vos origines et en quête d'appartenance."
        },
        themes: {
            amour: "La famille et les traditions renforcent votre relation. Othala favorise l'enracinement du couple et la construction d'un foyer solide.",
            travail: "Un héritage professionnel ou un savoir-faire transmis enrichit votre carrière. Les fondations sont solides pour bâtir l'avenir.",
            general: "Othala vous rappelle l'importance de vos racines. Connaître d'où l'on vient aide à savoir où l'on va."
        }
    }
];

// Spread Configurations
const runesSpreads = {
    'one-rune': { name: "Tirage 1 Rune", count: 1, labels: ["Guidance"], description: "Une rune unique pour une guidance rapide et directe." },
    'three-rune': { name: "Tirage 3 Runes", count: 3, labels: ["Passé", "Présent", "Futur"], description: "Trois runes révèlent l'évolution de votre situation dans le temps." },
    'cross': { name: "Tirage en Croix", count: 5, labels: ["Situation", "Obstacle", "Conseil", "Force cachée", "Résultat"], description: "Cinq runes pour une analyse complète de votre question." }
};

// App State
const runesState = {
    screen: 'intro',
    spreadType: 'one-rune',
    runesToSelect: 1,
    selectedRunes: [],
    availablePositions: [],
    shuffledDeck: []
};

document.addEventListener('DOMContentLoaded', () => {
    initRunesApp();
});

function initRunesApp() {
    // DOM Elements
    const screens = {
        intro: document.getElementById('screen-intro'),
        selection: document.getElementById('screen-selection'),
        result: document.getElementById('screen-result')
    };

    const startBtn = document.getElementById('btn-start-runes');
    const spreadSelect = document.getElementById('rune-spread-type');
    const gridContainer = document.getElementById('rune-grid');
    const counterEl = document.getElementById('rune-selection-counter');
    const restartBtns = document.querySelectorAll('.btn-restart-runes');

    // Event Listeners
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            runesState.spreadType = spreadSelect.value;
            runesState.runesToSelect = runesSpreads[runesState.spreadType].count;
            runesState.selectedRunes = [];

            // Shuffle the deck for position assignment
            runesState.shuffledDeck = [...runesDeck].sort(() => Math.random() - 0.5);

            switchScreen('selection');
            setupRuneGrid();
        });
    }

    if (restartBtns) {
        restartBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                switchScreen('intro');
            });
        });
    }

    function switchScreen(screenName) {
        document.querySelectorAll('.app-screen').forEach(el => el.classList.remove('active'));
        if (screens[screenName]) {
            screens[screenName].classList.add('active');
        }
        runesState.screen = screenName;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function setupRuneGrid() {
        gridContainer.innerHTML = '';
        counterEl.textContent = `Rune 0/${runesState.runesToSelect} sélectionnée(s)`;

        for (let i = 0; i < 24; i++) {
            const stone = document.createElement('div');
            stone.classList.add('rune-stone');
            stone.dataset.index = i;

            // Delay for staggered animation
            stone.style.animationDelay = `${i * 0.04}s`;

            // Front face (symbol - hidden initially)
            const front = document.createElement('div');
            front.classList.add('rune-stone-front');
            front.textContent = runesState.shuffledDeck[i].symbol;

            // Back face (mystery)
            const back = document.createElement('div');
            back.classList.add('rune-stone-back');
            back.innerHTML = '<i class="fa-solid fa-question"></i>';

            stone.appendChild(front);
            stone.appendChild(back);

            stone.addEventListener('click', () => handleRuneSelect(stone, i));
            gridContainer.appendChild(stone);
        }
    }

    function handleRuneSelect(stoneEl, index) {
        if (runesState.selectedRunes.length >= runesState.runesToSelect) return;
        if (stoneEl.classList.contains('selected')) return;

        stoneEl.classList.add('selected', 'flipped');

        // Determine upright or reversed (50/50)
        const isReversed = Math.random() < 0.5;

        const runeData = runesState.shuffledDeck[index];

        runesState.selectedRunes.push({
            ...runeData,
            isReversed: isReversed
        });

        counterEl.textContent = `Rune ${runesState.selectedRunes.length}/${runesState.runesToSelect} sélectionnée(s)`;

        // If all runes selected, proceed to results
        if (runesState.selectedRunes.length === runesState.runesToSelect) {
            setTimeout(() => {
                revealRuneResults();
                switchScreen('result');
            }, 1200);
        }
    }

    function revealRuneResults() {
        const resultsContainer = document.getElementById('rune-results-display');
        const synthesisContainer = document.getElementById('rune-synthesis-display');

        resultsContainer.innerHTML = '';
        synthesisContainer.innerHTML = '';
        synthesisContainer.style.display = 'none';

        const spreadConfig = runesSpreads[runesState.spreadType];

        runesState.selectedRunes.forEach((rune, index) => {
            const positionLabel = spreadConfig.labels[index] || `Rune ${index + 1}`;
            const orientation = rune.isReversed ? 'Inversée' : 'Droite';
            const meaning = rune.isReversed ? rune.meanings.reversed : rune.meanings.upright;
            const keywords = rune.isReversed ? rune.keywords.reversed : rune.keywords.upright;

            const card = document.createElement('div');
            card.classList.add('rune-result');
            card.style.animationDelay = `${index * 0.3}s`;

            card.innerHTML = `
                <div class="rune-result-header">
                    <span class="rune-position-label">${positionLabel}</span>
                    <div class="rune-symbol-display ${rune.isReversed ? 'reversed' : ''}">
                        ${rune.symbol}
                    </div>
                    <h3 class="rune-name">${rune.name} <span class="rune-orientation">(${orientation})</span></h3>
                    <div class="rune-element"><i class="fa-solid fa-${getElementIcon(rune.element)}"></i> ${rune.element}</div>
                    <div class="rune-keywords">${keywords.join(' &bull; ')}</div>
                </div>
                <div class="rune-result-body">
                    <p class="rune-meaning">${meaning}</p>
                    <div class="rune-themes">
                        <div class="rune-theme"><strong><i class="fa-solid fa-heart"></i> Amour :</strong> ${rune.themes.amour}</div>
                        <div class="rune-theme"><strong><i class="fa-solid fa-briefcase"></i> Travail :</strong> ${rune.themes.travail}</div>
                    </div>
                </div>
            `;

            resultsContainer.appendChild(card);
        });

        // Save to local storage
        localStorage.setItem('last_rune_spread', JSON.stringify({
            date: new Date(),
            type: runesState.spreadType,
            runes: runesState.selectedRunes
        }));

        // Generate synthesis
        synthesisContainer.style.marginBottom = "60px";
        showRuneLoading(synthesisContainer);

        setTimeout(() => {
            const synthesisHTML = generateRuneSynthesis(runesState.selectedRunes, runesState.spreadType);
            synthesisContainer.innerHTML = synthesisHTML;
            synthesisContainer.classList.add('fade-in');
        }, 2500 + (runesState.selectedRunes.length * 300));
    }

    function showRuneLoading(container) {
        container.style.display = 'block';
        container.innerHTML = `
            <div class="numerology-loader" style="display:flex; min-height: 200px; padding: 40px 0;">
                <div class="loader-mandala">
                    <div class="loader-ring"></div>
                    <div class="loader-crystal"></div>
                    <div class="loader-orbit"></div>
                </div>
                <div class="loader-text">Lecture des Runes</div>
                <div class="loader-subtext">Les anciens symboles révèlent leur sagesse...</div>
            </div>
        `;
    }

    function getElementIcon(element) {
        const icons = { 'Feu': 'fire', 'Terre': 'mountain', 'Eau': 'water', 'Air': 'wind' };
        return icons[element] || 'star';
    }

    function generateRuneSynthesis(runes, spreadType) {
        let title = "Synthèse de votre Tirage";
        let contentHtml = "";
        let adviceText = "";
        const pStyle = "margin-bottom: 20px;";

        const getName = (r) => `<strong>${r.name}</strong>` + (r.isReversed ? " (Inversée)" : "");

        if (spreadType === 'one-rune') {
            const r = runes[0];
            title = "Message des Runes";
            contentHtml = `<p style="${pStyle}">La rune ${getName(r)} délivre son message avec clarté. ${r.isReversed ? r.meanings.reversed : r.meanings.upright}</p>`;
            adviceText = r.isReversed
                ? "La rune inversée vous invite à la prudence et à l'introspection. Prenez le temps de comprendre ce qui vous freine avant de continuer."
                : "La rune droite confirme une énergie positive et un alignement favorable. Faites confiance à cette impulsion et avancez avec sérénité.";

        } else if (spreadType === 'three-rune') {
            title = "Passé, Présent, Futur";
            const [r1, r2, r3] = runes;
            contentHtml = `
                <p style="${pStyle}">Ce tirage des Nornes dévoile le fil de votre destinée.</p>
                <p style="${pStyle}"><strong>Le Passé (Urd) :</strong><br> ${getName(r1)} a façonné les fondations de votre situation. ${r1.isReversed ? r1.meanings.reversed : r1.meanings.upright}</p>
                <p style="${pStyle}"><strong>Le Présent (Verdandi) :</strong><br> ${getName(r2)} domine l'instant. ${r2.isReversed ? r2.meanings.reversed : r2.meanings.upright}</p>
                <p style="${pStyle}"><strong>Le Futur (Skuld) :</strong><br> ${getName(r3)} dessine la trajectoire. ${r3.isReversed ? r3.meanings.reversed : r3.meanings.upright}</p>
            `;
            adviceText = `L'énergie évolue de ${r1.name} vers ${r3.name}, en passant par la leçon de ${r2.name}. Intégrez chaque enseignement pour naviguer avec sagesse vers votre avenir.`;

        } else if (spreadType === 'cross') {
            title = "Analyse Complète en Croix";
            const [r1, r2, r3, r4, r5] = runes;
            contentHtml = `
                <p style="${pStyle}">Les cinq runes révèlent la cartographie complète de votre situation.</p>
                <p style="${pStyle}"><strong>Situation Actuelle :</strong><br> ${getName(r1)} décrit l'état des lieux. ${r1.isReversed ? r1.meanings.reversed : r1.meanings.upright}</p>
                <p style="${pStyle}"><strong>L'Obstacle :</strong><br> ${getName(r2)} représente ce qui vous bloque. ${r2.isReversed ? r2.meanings.reversed : r2.meanings.upright}</p>
                <p style="${pStyle}"><strong>Le Conseil :</strong><br> ${getName(r3)} vous guide. ${r3.isReversed ? r3.meanings.reversed : r3.meanings.upright}</p>
                <p style="${pStyle}"><strong>Force Cachée :</strong><br> ${getName(r4)} révèle une énergie sous-jacente. ${r4.isReversed ? r4.meanings.reversed : r4.meanings.upright}</p>
                <p style="${pStyle}"><strong>Résultat Probable :</strong><br> ${getName(r5)} montre l'issue la plus probable. ${r5.isReversed ? r5.meanings.reversed : r5.meanings.upright}</p>
            `;

            const reversedCount = runes.filter(r => r.isReversed).length;
            if (reversedCount >= 3) {
                adviceText = "Plusieurs runes inversées indiquent des résistances importantes. Le conseil de " + r3.name + " sera essentiel pour débloquer la situation et atteindre le potentiel de " + r5.name + ".";
            } else {
                adviceText = "L'équilibre entre " + r1.name + " et " + r2.name + " définit le défi. En suivant le conseil de " + r3.name + " et en activant la force cachée de " + r4.name + ", l'issue portée par " + r5.name + " sera favorable.";
            }
        }

        return `
            <h3 class="result-title slide-up">${title}</h3>
            <div class="result-keywords slide-up" style="animation-delay: 0.1s; color: var(--color-secondary); margin-bottom: 20px;">
                <i class="fa-solid fa-gem"></i> Runes : ${runes.map(r => r.symbol + ' ' + r.name).join(' &bull; ')}
            </div>
            <div class="result-text slide-up" style="animation-delay: 0.2s">
                ${contentHtml}
                <div style="margin-top: 30px;">
                    <h4><i class="fa-solid fa-scroll"></i> Le Conseil des Runes</h4>
                    <div class="tips-box">${adviceText}</div>
                </div>
            </div>
        `;
    }
}