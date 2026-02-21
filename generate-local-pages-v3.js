/**
 * Local SEO Pages Generator v3
 * Anti-cannibalization: each service has unique content, titles, H2s, FAQ
 * Generates 166 cities x 6 services = 996 pages
 */

const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data', 'cities.json');
const { cities, services } = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const outputDir = path.join(__dirname, 'villes');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

// ─── SERVICE-SPECIFIC CONTENT CONFIGS ──────────────────────────────────────
// Each service targets a DIFFERENT search intent to avoid cannibalization

const SERVICE_CONFIGS = {

// ══════════════════════════════════════════════════════════════════════════
// VOYANCE AMOUR — Intent: relationship/love guidance
// ══════════════════════════════════════════════════════════════════════════
'voyance-amour': {
    titleTemplate: '{service} à {city} ({postal_code}) : guidance sentimentale',
    metaTemplate: 'Voyance amour à {city} : consultez un voyant spécialisé en amour, couple et retour affectif. Réponses sur votre vie sentimentale. Consultation immédiate.',
    h1Template: '{service} à {city} : éclairez votre vie sentimentale',
    subtitleTemplate: 'Un voyant spécialisé en amour vous guide à {city} ({postal_code}), {region}',

    h2s: [
        [
            "Pourquoi consulter un voyant amour à {city} ?",
            "En quoi la voyance amour peut vous aider à {city} ?",
            "Voyance sentimentale à {city} : quand la consulter ?"
        ],
        [
            "Les questions sentimentales les plus fréquentes à {city}",
            "Quelles questions d'amour poser à un voyant à {city} ?",
            "Amour, couple, séparation : les sujets abordés en voyance à {city}"
        ],
        [
            "Retour affectif et flamme jumelle : ce que la voyance révèle",
            "Retour de l'être aimé : comment la voyance peut éclairer votre situation",
            "Flamme jumelle et âme sœur : comprendre vos liens karmiques"
        ],
        [
            "Comment se déroule une consultation voyance amour ?",
            "Votre première séance de voyance sentimentale : à quoi s'attendre",
            "Le déroulement d'une consultation de voyance amoureuse"
        ],
        [
            "Trouver un voyant spécialisé en amour à {city}",
            "Comment choisir le bon voyant pour vos questions d'amour à {city} ?",
            "Nos voyants experts en guidance sentimentale à {city}"
        ]
    ],

    contents: [
        [
            `Les questions de cœur sont souvent celles qui nous tourmentent le plus. À {city}, comme partout en France, beaucoup de personnes traversent des périodes de doute sentimental. Une rupture récente, un silence inexpliqué, une relation qui stagne : ces situations créent une charge émotionnelle difficile à porter seul.\n\nLa voyance amour apporte un éclairage différent sur votre situation sentimentale. Elle permet de comprendre les dynamiques invisibles qui influencent votre couple ou votre quête amoureuse. Nos voyants spécialisés à {city} utilisent leurs dons de clairvoyance pour identifier les blocages et les opportunités qui se présentent sur votre chemin affectif.\n\nQue vous habitiez près de {monument} ou dans un autre quartier de {city}, la consultation est accessible immédiatement par téléphone. Pas besoin de vous déplacer pour obtenir des réponses sincères sur votre avenir amoureux.`,

            `À {city}, {specificity}, les habitants ne sont pas épargnés par les tourments du cœur. Les relations amoureuses sont complexes et souvent source de questionnements profonds. Un voyant spécialisé en amour peut vous apporter la clarté dont vous avez besoin.\n\nLa voyance sentimentale ne se limite pas à prédire votre avenir amoureux. Elle vous aide à comprendre les mécanismes relationnels en jeu, à identifier vos propres schémas affectifs et à prendre des décisions éclairées. C'est un outil de guidance, pas une baguette magique.\n\nNos voyants sont sélectionnés pour leur sensibilité et leur expertise dans le domaine sentimental. Ils abordent chaque consultation avec bienveillance et honnêteté, deux qualités indispensables quand on parle d'amour.`
        ],
        [
            `Les consultants de {city} nous posent régulièrement les mêmes types de questions. En tête : "Est-ce qu'il ou elle va revenir ?", "Mon couple va-t-il durer ?", "Vais-je rencontrer quelqu'un bientôt ?". Ces interrogations reflètent des préoccupations universelles.\n\nMais la voyance amour couvre bien plus que ces questions classiques. Vous pouvez aussi aborder la compatibilité avec votre partenaire, les raisons profondes d'une séparation, les obstacles à votre épanouissement sentimental ou encore la nature d'une connexion que vous ressentez avec quelqu'un.\n\nLes habitants de {city} et de {region} consultent aussi pour des situations plus spécifiques : infidélité soupçonnée, relation à distance, triangle amoureux, dépendance affective. Chaque situation est unique et mérite une lecture personnalisée.`,

            `À {city}, les questions d'amour occupent une place centrale dans les consultations de voyance. Parmi les plus courantes : la possibilité d'un retour affectif, l'évolution d'une relation naissante, ou encore la compatibilité amoureuse à long terme.\n\nVotre voyant peut aussi vous éclairer sur des aspects moins évidents de votre vie sentimentale. Par exemple, comprendre pourquoi vous attirez toujours le même type de partenaire, ou décoder les signaux contradictoires que vous envoie une personne qui vous plaît.\n\nChaque question mérite une réponse honnête. Nos voyants à {city} s'engagent à vous donner une lecture sincère, même quand la réponse n'est pas celle que vous espériez. Mieux vaut une vérité constructive qu'une illusion réconfortante.`
        ],
        [
            `Le retour affectif est l'une des demandes les plus fréquentes en voyance amour. Si vous êtes séparé(e) de votre partenaire et que vous espérez le ou la reconquérir, un voyant peut analyser les énergies en jeu et évaluer les chances réelles de retrouvailles.\n\nLa notion de flamme jumelle est aussi très présente dans les consultations. Ce concept désigne une connexion d'âme intense avec une autre personne. Votre voyant peut vous aider à déterminer si la personne qui occupe vos pensées est effectivement votre flamme jumelle ou si cette attirance relève d'un autre type de lien karmique.\n\nAttention : un bon voyant ne vous promettra jamais un retour garanti. Il vous donnera une lecture honnête de la situation et les clés pour avancer, que ce soit vers une réconciliation ou vers un nouveau départ.`,

            `Près de {landmark}, à {city}, ou n'importe où dans la région {region}, les histoires de retour affectif sont nombreuses. La voyance permet d'y voir plus clair sans tomber dans le piège des fausses promesses.\n\nUn voyant sérieux analysera l'état émotionnel de votre ex-partenaire, les blocages qui persistent entre vous et les fenêtres d'opportunité potentielles. Il ne manipulera pas vos espoirs mais vous offrira une lecture lucide de la situation.\n\nQuant aux liens karmiques et aux flammes jumelles, ces notions méritent un éclairage nuancé. Votre voyant peut identifier la nature du lien qui vous unit à cette personne et vous guider sur la meilleure attitude à adopter.`
        ],
        [
            `Une consultation de voyance amour commence toujours par un moment d'écoute. Votre voyant vous laisse exposer votre situation sans jugement. Ensuite, il se connecte à vos énergies et à celles de la personne concernée pour obtenir des informations.\n\nSelon le médium, la lecture peut s'appuyer sur le tarot de Marseille, l'oracle Belline, la médiumnité pure ou l'astrologie. Chaque outil apporte un éclairage complémentaire sur votre situation sentimentale.\n\nLa séance dure généralement entre 20 et 40 minutes. Vous repartez avec des éléments concrets : un timing probable des événements, des conseils d'action et une meilleure compréhension des dynamiques en jeu dans votre vie amoureuse.`,

            `Votre première consultation de voyance amour à {city} est une expérience intime. Le voyant crée un espace de confiance où vous pouvez vous exprimer librement sur vos préoccupations sentimentales.\n\nAprès avoir pris connaissance de votre situation, le voyant utilise ses outils divinatoires pour analyser les énergies qui entourent votre vie amoureuse. Il peut percevoir les intentions de l'autre personne, les obstacles sur votre chemin et les périodes favorables à venir.\n\nConseils pratiques : préparez vos questions à l'avance, soyez honnête sur votre situation et gardez l'esprit ouvert. Une bonne consultation ne confirme pas toujours vos attentes, mais elle vous donne toujours matière à avancer.`
        ],
        [
            `À {city}, plusieurs voyants sont spécialisés dans la guidance sentimentale. Pour faire le bon choix, regardez d'abord les spécialités affichées : "amour", "couple", "retour affectif" ou "relations sentimentales" doivent apparaître dans leur profil.\n\nConsultez aussi les avis des autres utilisateurs. Les témoignages sur des situations similaires à la vôtre sont les plus utiles. Un voyant qui a aidé quelqu'un à traverser une séparation sera probablement pertinent si vous vivez la même chose.\n\nN'hésitez pas à profiter des premières minutes offertes pour tester la connexion avec le voyant. Si vous ne sentez pas de feeling, changez. La confiance est indispensable pour une consultation réussie.`,

            `Le choix du voyant est déterminant pour la qualité de votre consultation à {city}. Un bon voyant amour possède à la fois un don de clairvoyance et une vraie sensibilité aux questions sentimentales.\n\nVérifiez ses outils de prédilection : le tarot de Marseille est particulièrement efficace pour les questions d'amour, tout comme l'oracle Belline. Certains médiums n'utilisent aucun support et se fient uniquement à leur ressenti, ce qui peut être tout aussi percutant.\n\nSur notre plateforme, chaque voyant disponible à {city} et en {region} a été vérifié. Profitez des minutes découverte pour trouver celui ou celle avec qui vous vous sentez en confiance.`
        ]
    ],

    faqs: [
        { q: "Un voyant peut-il prédire le retour de mon ex à {city} ?", a: "Un voyant peut analyser les énergies et tendances de votre situation. Il ne garantit pas un retour mais éclaire les probabilités et vous guide sur l'attitude à adopter." },
        { q: "La voyance amour est-elle fiable pour les questions de couple ?", a: "La voyance amour donne un éclairage complémentaire sur votre situation sentimentale. Elle est d'autant plus fiable que le voyant est expérimenté et honnête dans ses prédictions." },
        { q: "Combien coûte une consultation voyance amour à {city} ?", a: "Les tarifs varient selon les voyants, généralement entre 2 et 5 euros par minute. Des premières minutes offertes permettent de tester le service sans engagement." },
        { q: "Peut-on consulter un voyant amour par téléphone depuis {city} ?", a: "Oui, nos voyants spécialisés en amour sont disponibles par téléphone 24h/24 depuis {city} et partout en France. La consultation est immédiate." },
        { q: "Quelle est la différence entre voyance amour et retour affectif ?", a: "La voyance amour couvre toutes les questions sentimentales. Le retour affectif est un thème spécifique qui concerne la possibilité de retrouver un partenaire après une séparation." }
    ]
},

// ══════════════════════════════════════════════════════════════════════════
// VOYANCE TELEPHONE — Intent: channel/method (phone consultation)
// ══════════════════════════════════════════════════════════════════════════
'voyance-telephone': {
    titleTemplate: 'Voyance par téléphone à {city} ({postal_code}) : consultation immédiate',
    metaTemplate: 'Voyance par téléphone à {city} : consultez un voyant sérieux par téléphone. Réponses immédiates, premières minutes offertes. Disponible 24h/24.',
    h1Template: 'Voyance par téléphone à {city} : consultez un voyant maintenant',
    subtitleTemplate: 'Des voyants expérimentés vous répondent par téléphone à {city} ({postal_code}), {region}',

    h2s: [
        [
            "Pourquoi choisir la voyance par téléphone à {city} ?",
            "Les avantages de la voyance par téléphone pour les habitants de {city}",
            "Voyance téléphone à {city} : une consultation accessible et confidentielle"
        ],
        [
            "Comment fonctionne une consultation de voyance par téléphone ?",
            "Le déroulement d'une séance de voyance par téléphone",
            "Votre première consultation téléphonique de voyance : mode d'emploi"
        ],
        [
            "Voyance par téléphone vs en cabinet : quelles différences à {city} ?",
            "Téléphone ou cabinet de voyance à {city} : que choisir ?",
            "Les atouts du téléphone face à la consultation en cabinet"
        ],
        [
            "Que pouvez-vous demander à un voyant par téléphone ?",
            "Quels sujets aborder lors de votre appel de voyance ?",
            "Amour, travail, finances : les thèmes de consultation par téléphone"
        ],
        [
            "Trouver un voyant par téléphone sérieux à {city}",
            "Comment choisir le bon voyant pour une consultation téléphonique ?",
            "Nos voyants vérifiés disponibles par téléphone à {city}"
        ]
    ],

    contents: [
        [
            `La voyance par téléphone offre une solution pratique et confidentielle pour les habitants de {city}. Pas besoin de chercher un cabinet de voyance en ville, pas de déplacement, pas d'attente. Vous appelez et vous êtes mis en relation avec un voyant en quelques secondes.\n\nCe format s'est imposé comme le mode de consultation le plus populaire en France. Il combine la qualité d'une vraie consultation de voyance avec la discrétion et le confort de votre domicile. Depuis {city} ou n'importe où en {region}, vous accédez au même panel de voyants expérimentés.\n\nLe téléphone présente un autre avantage souvent sous-estimé : il permet au voyant de se concentrer uniquement sur votre voix et vos vibrations, sans être influencé par votre apparence physique ou votre langage corporel. La lecture est plus pure.`,

            `Les habitants de {city}, {specificity}, ont désormais accès à la voyance sans quitter leur domicile. Le téléphone supprime toutes les barrières géographiques et horaires. Que vous habitiez près de {monument} ou en périphérie, le service est identique.\n\nLa confidentialité est un atout majeur. Personne ne vous voit entrer dans un cabinet. Personne ne sait que vous consultez. Cette discrétion est particulièrement appréciée dans des villes comme {city} où tout le monde se croise.\n\nEnfin, le téléphone vous permet de consulter à tout moment : en journée, le soir après le travail, ou même en pleine nuit quand l'angoisse ne vous laisse pas dormir. Nos voyants sont disponibles 24 heures sur 24.`
        ],
        [
            `Le fonctionnement est simple. Vous choisissez un voyant sur notre plateforme en consultant son profil, ses spécialités et les avis des autres consultants. Vous cliquez sur "Appeler" et la mise en relation est immédiate.\n\nLa conversation commence par un temps d'écoute où vous exposez votre situation et vos questions. Le voyant se connecte ensuite à vos énergies pour vous délivrer sa lecture. Certains utilisent le tarot, d'autres la médiumnité pure, d'autres encore la numérologie ou l'astrologie.\n\nUne consultation dure en moyenne 20 à 30 minutes, mais c'est vous qui décidez. Vous pouvez raccrocher à tout moment. La facturation se fait à la minute, avec des premières minutes souvent offertes pour découvrir le service.`,

            `Votre appel de voyance depuis {city} se déroule en trois étapes. D'abord, la sélection du voyant : prenez le temps de lire les profils et les avis pour trouver un praticien qui correspond à vos attentes.\n\nEnsuite, l'appel lui-même. Le voyant vous accueille, vous écoute, puis entame sa lecture. N'hésitez pas à poser des questions précises pour obtenir des réponses concrètes. Plus vos questions sont claires, plus les réponses le seront aussi.\n\nEnfin, le voyant vous donne un résumé des points clés et des conseils d'action. Vous avez la possibilité de rappeler ultérieurement si de nouvelles questions émergent.`
        ],
        [
            `À {city}, trouver un bon voyant en cabinet n'est pas simple. Les praticiens sérieux sont rares et souvent avec des semaines d'attente. Le téléphone résout ce problème en vous connectant instantanément avec des voyants vérifiés et disponibles.\n\nContrairement aux idées reçues, la qualité d'une consultation téléphonique est équivalente, voire supérieure, à celle en cabinet. Le voyant travaille dans un environnement optimal, sans distraction, et peut se concentrer totalement sur votre dossier.\n\nLe rapport qualité-prix est aussi plus avantageux. En cabinet à {city}, comptez entre 50 et 120 euros par consultation. Par téléphone, vous payez uniquement les minutes utilisées et bénéficiez souvent de minutes offertes pour un premier test.`,

            `Les cabinets de voyance se font rares dans les villes françaises, y compris à {city}. Et quand ils existent, il est difficile de vérifier le sérieux du praticien avant de payer. Par téléphone, les avis d'autres clients et le système de notation vous protègent.\n\nLe téléphone vous donne aussi accès à un panel beaucoup plus large. Vous n'êtes plus limité aux deux ou trois voyants installés à {city} : vous choisissez parmi des dizaines de spécialistes dans toute la France.\n\nEn termes de confort, il n'y a pas photo. Pas de trajet, pas de salle d'attente, pas de regard gêné en poussant la porte d'un cabinet. Vous consultez depuis votre canapé, en toute sérénité.`
        ],
        [
            `Par téléphone, vous pouvez aborder tous les thèmes de vie classiques de la voyance. L'amour et les relations sentimentales arrivent en tête des sujets chez les consultants de {city}. Suivent le travail et la carrière, les finances, la famille et la santé.\n\nVous pouvez aussi poser des questions très ciblées : "Est-ce que je vais obtenir cette promotion ?", "Mon déménagement se passera-t-il bien ?", "Comment évolue ma relation avec mon associé ?". Le voyant adapte sa lecture à vos interrogations précises.\n\nCertains consultants à {city} appellent aussi pour des questions plus existentielles : trouver leur voie, comprendre un cycle de vie difficile, ou explorer leurs vies antérieures. La voyance par téléphone couvre un spectre très large de préoccupations.`,

            `Le spectre des questions est très large en voyance par téléphone. Depuis {city} et {region}, les consultants nous posent des questions sur tous les aspects de leur vie.\n\nLe domaine sentimental est le plus demandé : retour d'un ex, compatibilité amoureuse, avenir d'un couple. Le domaine professionnel suit de près : changement de poste, création d'entreprise, relations avec les collègues.\n\nLes questions financières ont aussi leur place : investissement immobilier, période favorable pour un projet, gestion des dettes. Quelle que soit votre préoccupation, un voyant expérimenté saura vous éclairer par téléphone.`
        ],
        [
            `Pour trouver un voyant téléphonique sérieux à {city}, fiez-vous d'abord aux avis vérifiés. Un voyant avec des centaines d'avis positifs et une note élevée a fait ses preuves auprès de consultants réels.\n\nVérifiez aussi les spécialités du voyant. Si votre question concerne l'amour, choisissez un spécialiste du sentimental. Pour le travail, orientez-vous vers un voyant expérimenté en guidance professionnelle.\n\nProfitez des minutes offertes pour tester la connexion avant de vous engager. Si le feeling ne passe pas dans les premières minutes, raccrochez et essayez un autre voyant. L'intuition fonctionne dans les deux sens : vous devez vous sentir en confiance.`,

            `Le choix du voyant est la clé d'une consultation réussie. À {city} et dans toute la région {region}, nos consultants ont accès à un panel de voyants rigoureusement sélectionnés.\n\nChaque voyant de notre plateforme a passé un processus de vérification. Ses dons ont été testés et son éthique professionnelle validée. Vous ne tombez pas sur un charlatan ou un numéro surtaxé sans intérêt.\n\nConseil pratique : avant d'appeler, notez vos questions sur un papier. Cela vous évitera de perdre du temps en début de consultation et vous permettra d'optimiser chaque minute de votre appel.`
        ]
    ],

    faqs: [
        { q: "La voyance par téléphone est-elle aussi fiable qu'en cabinet à {city} ?", a: "Oui, la qualité de la consultation ne dépend pas du canal. Par téléphone, le voyant se concentre sur votre voix et vos vibrations, ce qui donne des résultats équivalents." },
        { q: "Combien coûte une consultation de voyance par téléphone depuis {city} ?", a: "Les tarifs varient de 2 à 5 euros par minute selon le voyant. Des premières minutes sont souvent offertes pour découvrir le service sans engagement." },
        { q: "Peut-on appeler un voyant par téléphone à toute heure depuis {city} ?", a: "Oui, nos voyants sont disponibles 24h/24 et 7j/7. Vous pouvez appeler de jour comme de nuit depuis {city} et toute la France." },
        { q: "Comment savoir si un voyant par téléphone est sérieux ?", a: "Consultez les avis vérifiés, la note globale et l'ancienneté du voyant sur la plateforme. Profitez des minutes offertes pour tester la connexion avant de vous engager." },
        { q: "Faut-il préparer quelque chose avant d'appeler un voyant ?", a: "Notez vos questions à l'avance et trouvez un endroit calme. Plus vos questions sont précises, plus les réponses du voyant seront pertinentes." }
    ]
},

// ══════════════════════════════════════════════════════════════════════════
// VOYANCE AUDIOTEL — Intent: no credit card, anonymous, premium-rate
// ══════════════════════════════════════════════════════════════════════════
'voyance-audiotel': {
    titleTemplate: 'Voyance audiotel à {city} ({postal_code}) : consultation sans carte bancaire',
    metaTemplate: 'Voyance audiotel à {city} : consultation de voyance sans CB, anonyme et immédiate. Appelez et obtenez des réponses. Tarifs clairs et transparents.',
    h1Template: 'Voyance audiotel à {city} : consultez sans carte bancaire',
    subtitleTemplate: 'Consultation de voyance immédiate et anonyme par audiotel à {city} ({postal_code}), {region}',

    h2s: [
        [
            "Qu'est-ce que la voyance audiotel et comment ça fonctionne ?",
            "Voyance audiotel : un accès simple et direct à la voyance",
            "Comment marche la voyance par audiotel à {city} ?"
        ],
        [
            "Pourquoi choisir l'audiotel pour votre voyance à {city} ?",
            "Les avantages de la voyance audiotel à {city}",
            "Voyance audiotel à {city} : confidentialité et simplicité"
        ],
        [
            "Tarifs et facturation de la voyance audiotel",
            "Combien coûte une consultation de voyance audiotel ?",
            "Comprendre la facturation de la voyance par audiotel"
        ],
        [
            "Comment préparer votre appel de voyance audiotel ?",
            "Conseils pour une consultation audiotel réussie",
            "Optimiser votre consultation de voyance audiotel"
        ],
        [
            "Voyance audiotel vs téléphone classique : quelles différences ?",
            "Audiotel ou voyance par téléphone : que choisir à {city} ?",
            "Comparer les modes de consultation de voyance à {city}"
        ]
    ],

    contents: [
        [
            `L'audiotel est un service de voyance accessible par un simple appel téléphonique surtaxé. Contrairement à la voyance par téléphone classique, vous n'avez pas besoin de créer un compte ni de renseigner votre carte bancaire. Vous composez le numéro et vous êtes directement mis en relation avec un voyant.\n\nLe coût de la consultation est automatiquement facturé sur votre prochaine facture téléphonique. Ce mode de paiement, encadré par l'ARCEP, garantit la transparence des tarifs et la protection du consommateur.\n\nDepuis {city}, l'appel se fait comme n'importe quel appel local. Vous composez le numéro, une introduction vous présente le service et les tarifs, puis vous êtes mis en relation avec le voyant de permanence ou un voyant de votre choix.`,

            `La voyance audiotel est le moyen le plus rapide d'accéder à une consultation de voyance à {city}. Pas d'inscription, pas de formulaire, pas de données bancaires à communiquer. Vous prenez votre téléphone, vous composez le numéro et vous consultez.\n\nCe format existe depuis les années 90 en France et a beaucoup évolué. Aujourd'hui, les plateformes audiotel sérieuses proposent des voyants vérifiés et un service encadré par la réglementation des télécoms.\n\nÀ {city}, {specificity}, les habitants apprécient la simplicité de ce format. Il convient parfaitement à ceux qui veulent une réponse rapide sans engagement ni démarche complexe.`
        ],
        [
            `L'audiotel présente plusieurs avantages spécifiques pour les habitants de {city}. Le premier est l'anonymat total. Votre consultation n'apparaît pas sur un relevé bancaire sous un intitulé reconnaissable. Elle se fond dans votre facture téléphonique, ni vu ni connu.\n\nLe deuxième avantage est l'immédiateté. Pas de compte à créer, pas de validation de carte, pas de délai. Vous appelez, vous consultez. C'est particulièrement appréciable quand une question vous taraude en pleine nuit ou un dimanche.\n\nEnfin, l'audiotel ne nécessite pas de connexion internet. Depuis {city}, n'importe quel téléphone fixe ou mobile suffit. C'est un atout pour les personnes moins à l'aise avec le numérique.`,

            `À {city}, comme partout en France, la discrétion est un critère important dans le choix d'un service de voyance. L'audiotel répond parfaitement à cette exigence : aucune donnée personnelle n'est collectée.\n\nLe système audiotel protège votre vie privée. Vous n'avez pas à donner votre nom, votre adresse email ni vos coordonnées bancaires. Le voyant ne connaît ni votre identité ni votre numéro de téléphone.\n\nPrès de {monument} ou dans les quartiers résidentiels de {city}, la voyance audiotel s'adresse à tous les profils : du novice curieux au consultant régulier qui souhaite un accès simple et rapide à la guidance.`
        ],
        [
            `La voyance audiotel est facturée à la minute, avec un tarif annoncé avant le début de la consultation. En général, comptez entre 0,60 et 0,80 euro par minute (tarif hors coût d'appel). Le montant apparaît sur votre facture téléphonique.\n\nLes premiers instants de l'appel sont dédiés à l'accueil et à la présentation du service. Cette partie n'est généralement pas facturée au tarif premium. La facturation au tarif annoncé commence quand vous êtes en ligne avec le voyant.\n\nPour maîtriser votre budget, fixez-vous une durée maximale avant d'appeler. Une consultation de 15 à 20 minutes est généralement suffisante pour obtenir des réponses claires sur une ou deux questions.`,

            `Les tarifs de la voyance audiotel à {city} sont encadrés par la réglementation française. Le coût par minute est annoncé en début d'appel et ne peut pas dépasser un plafond fixé par la loi.\n\nConcrètement, une consultation de 15 minutes vous coûtera entre 9 et 12 euros, directement sur votre facture téléphone. C'est souvent moins cher qu'une consultation en cabinet à {city}, qui démarre rarement en dessous de 40 euros.\n\nPlafonnement : la réglementation limite aussi la durée maximale d'un appel surtaxé. Ce garde-fou protège les consommateurs contre les consultations excessivement longues.`
        ],
        [
            `Pour tirer le meilleur de votre consultation audiotel à {city}, quelques préparatifs simples font la différence. Trouvez un endroit calme où vous ne serez pas interrompu. Les énergies sont plus faciles à capter quand le consultant est serein.\n\nPréparez vos questions à l'avance. En audiotel, chaque minute compte. Avoir une idée claire de ce que vous voulez savoir vous permettra d'aller droit au but et d'obtenir des réponses plus précises.\n\nLimitez-vous à deux ou trois questions par appel. Mieux vaut approfondir quelques sujets que survoler une dizaine de thèmes sans obtenir de réponse satisfaisante.`,

            `Avant de décrocher votre téléphone à {city} pour une consultation audiotel, prenez cinq minutes pour vous préparer. Écrivez vos questions sur un papier. Formulez-les de manière simple et directe.\n\nPrivilégiez un moment où vous êtes au calme, chez vous de préférence. Les consultations faites depuis les transports en commun ou en marchant près de {landmark} donnent rarement de bons résultats. Le voyant a besoin de votre concentration.\n\nSoyez ouvert aux réponses que vous recevez, même si elles ne correspondent pas à vos attentes. Un voyant honnête ne vous dira pas ce que vous voulez entendre, mais ce qu'il perçoit réellement.`
        ],
        [
            `L'audiotel et la voyance par téléphone classique se ressemblent mais fonctionnent différemment. La voyance par téléphone nécessite la création d'un compte et le renseignement d'un moyen de paiement. L'audiotel ne demande rien de tout cela.\n\nEn contrepartie, la voyance par téléphone offre plus de choix dans la sélection du voyant : profils détaillés, avis vérifiés, spécialités affichées. En audiotel, vous êtes souvent mis en relation avec le voyant de permanence.\n\nPour les habitants de {city} qui veulent un accès rapide et anonyme, l'audiotel est idéal. Pour ceux qui préfèrent choisir leur voyant et bénéficier de premières minutes offertes, la voyance par téléphone classique sera plus adaptée.`,

            `À {city}, vous avez le choix entre ces deux formats. L'audiotel est le champion de la simplicité : pas d'inscription, pas de carte bancaire, un appel suffit. Le téléphone classique offre plus de personnalisation : choix du voyant, avis clients, système de fidélité.\n\nLe tarif diffère aussi. L'audiotel se facture sur votre ligne téléphonique, le téléphone classique se facture par carte bancaire. Certains préfèrent l'un, d'autres l'autre, selon leurs habitudes de paiement.\n\nDans les deux cas, la qualité de la voyance est équivalente. Ce qui fait la différence, c'est le praticien, pas le canal. Choisissez le format qui correspond le mieux à vos habitudes et à vos besoins de discrétion.`
        ]
    ],

    faqs: [
        { q: "La voyance audiotel nécessite-t-elle une carte bancaire à {city} ?", a: "Non, c'est son principal avantage. La consultation est facturée directement sur votre facture téléphonique. Aucune donnée bancaire n'est requise." },
        { q: "Combien coûte une consultation de voyance audiotel depuis {city} ?", a: "Entre 0,60 et 0,80 euro par minute en moyenne. Le tarif exact est annoncé au début de l'appel. Une consultation de 15 minutes coûte environ 10 euros." },
        { q: "La voyance audiotel est-elle anonyme ?", a: "Oui, totalement. Vous n'avez pas à donner votre nom ni aucune information personnelle. Le voyant ne connaît pas votre identité." },
        { q: "Peut-on choisir son voyant en audiotel ?", a: "Selon les plateformes, vous pouvez être mis en relation avec le voyant de permanence ou sélectionner un voyant parmi ceux disponibles via un menu vocal." },
        { q: "Y a-t-il un risque de surfacturation avec l'audiotel ?", a: "Non, les tarifs sont encadrés par la réglementation française. Le coût par minute est annoncé avant le début de la consultation et la durée est plafonnée." }
    ]
},

// ══════════════════════════════════════════════════════════════════════════
// VOYANCE GRATUITE — Intent: free tools, discovery, no commitment
// ══════════════════════════════════════════════════════════════════════════
'voyance-gratuite': {
    titleTemplate: 'Voyance gratuite à {city} ({postal_code}) : tirage de tarot et consultation offerte',
    metaTemplate: 'Voyance gratuite à {city} : tirage de tarot gratuit, numérologie et premières minutes offertes avec un voyant. Découvrez votre avenir sans engagement.',
    h1Template: 'Voyance gratuite à {city} : découvrez nos outils sans engagement',
    subtitleTemplate: 'Tirages gratuits et premières minutes offertes pour les habitants de {city} ({postal_code}), {region}',

    h2s: [
        [
            "Quels outils de voyance gratuite sont disponibles à {city} ?",
            "Voyance gratuite à {city} : les outils en ligne à votre disposition",
            "Découvrez la voyance gratuitement depuis {city}"
        ],
        [
            "La voyance gratuite est-elle vraiment fiable ?",
            "Peut-on faire confiance à la voyance gratuite en ligne ?",
            "Voyance gratuite : entre divertissement et vraie guidance"
        ],
        [
            "Comment profiter de minutes offertes avec un vrai voyant ?",
            "Premières minutes gratuites : comment ça marche ?",
            "Tester un voyant gratuitement depuis {city} : le guide"
        ],
        [
            "Tirage de tarot gratuit : comment ça fonctionne ?",
            "Le tirage de tarot en ligne gratuit : guide complet",
            "Tarot gratuit, numérologie, pendule : nos outils expliqués"
        ],
        [
            "Aller plus loin : de la voyance gratuite à la consultation approfondie",
            "Quand passer de la voyance gratuite à une consultation payante ?",
            "Compléter votre tirage gratuit par une consultation personnalisée"
        ]
    ],

    contents: [
        [
            `Depuis {city}, vous avez accès à plusieurs outils de voyance gratuite directement en ligne. Le tirage de tarot gratuit est le plus populaire : vous tirez des cartes du Tarot de Marseille et recevez une interprétation instantanée de votre situation.\n\nNotre calculateur de numérologie gratuite est aussi très utilisé par les habitants de {city}. En entrant votre date de naissance, vous découvrez votre chemin de vie, vos forces, vos défis et vos périodes favorables.\n\nLe pendule oui/non et le tarot oui/non complètent notre offre. Ces outils répondent à une question précise par oui ou par non. Ils sont parfaits pour les moments où vous avez besoin d'une réponse rapide et directe.`,

            `À {city}, {specificity}, de plus en plus de personnes découvrent la voyance par les outils gratuits en ligne. C'est une première approche sans risque ni engagement, idéale pour se familiariser avec les arts divinatoires.\n\nNos tirages de tarot gratuits (tirage en croix et tirage d'amour) sont accessibles 24h/24 depuis n'importe quel appareil. La numérologie gratuite calcule votre profil complet en quelques secondes. Et le pendule virtuel vous donne une réponse instantanée à vos questions oui/non.\n\nCes outils ne remplacent pas une consultation avec un vrai voyant, mais ils offrent un éclairage intéressant et peuvent vous aider à formuler les questions que vous poserez lors d'une séance approfondie.`
        ],
        [
            `La fiabilité de la voyance gratuite dépend de ce que vous en attendez. Les outils en ligne comme le tirage de tarot gratuit fonctionnent sur des algorithmes qui sélectionnent des cartes aléatoirement. L'interprétation est générique mais souvent pertinente.\n\nCes outils ne remplacent pas un voyant en chair et en os. Un vrai médium analyse votre situation spécifique, perçoit vos énergies et adapte sa lecture à votre contexte personnel. Un outil en ligne ne peut pas faire cela.\n\nPour les habitants de {city} qui veulent découvrir la voyance, les outils gratuits sont une excellente porte d'entrée. Pour ceux qui ont besoin de réponses précises et personnalisées, la consultation avec un voyant professionnel reste indispensable.`,

            `La voyance gratuite en ligne offre un premier niveau de guidance accessible à tous les habitants de {city}. Les tirages de tarot et la numérologie donnent des indications générales sur votre situation et vos tendances.\n\nCes outils reposent sur des siècles de tradition. Le Tarot de Marseille, les calculs de numérologie et le pendule sont des supports utilisés depuis des générations par les praticiens de l'art divinatoire.\n\nLa limite de la voyance gratuite, c'est l'absence de personnalisation. L'outil ne connaît pas votre histoire, vos émotions, votre contexte. Pour une lecture vraiment adaptée à votre situation, il faut un échange humain avec un voyant qualifié.`
        ],
        [
            `Plusieurs plateformes proposent des premières minutes offertes avec un voyant professionnel. C'est la meilleure façon de tester un service de voyance depuis {city} sans dépenser un centime.\n\nConcrètement, vous créez un compte, vous sélectionnez un voyant et vous bénéficiez de 5 à 10 minutes gratuites lors de votre premier appel. Ces minutes suffisent pour évaluer le sérieux du voyant et voir s'il capte bien votre énergie.\n\nPour en profiter, préparez une question précise avant d'appeler. Les minutes passent vite. Allez droit au but et jugez la pertinence de la réponse. Si le voyant vous convainc, vous pouvez poursuivre la consultation en payant les minutes suivantes.`,

            `Les habitants de {city} et de {region} peuvent profiter de premières minutes gratuites chez la plupart des plateformes de voyance en ligne. C'est un test grandeur nature qui ne vous engage à rien.\n\nL'offre varie selon les plateformes : certaines proposent 5 minutes, d'autres jusqu'à 10 minutes offertes. Quelques-unes offrent un montant en euros crédité sur votre compte, utilisable avec le voyant de votre choix.\n\nCe système de minutes offertes a un double objectif : vous permettre de tester la qualité du service et vous aider à trouver le voyant qui vous correspond. Profitez-en pour essayer deux ou trois voyants différents.`
        ],
        [
            `Le tirage de tarot gratuit est notre outil le plus consulté à {city}. Il fonctionne en trois étapes : vous vous concentrez sur votre question, vous sélectionnez vos cartes parmi les 22 arcanes majeurs du Tarot de Marseille, et vous recevez l'interprétation.\n\nNous proposons deux types de tirages : le tirage en croix (5 cartes) pour une vision globale de votre situation, et le tirage d'amour (3 cartes) centré sur votre vie sentimentale.\n\nLa numérologie gratuite calcule votre chemin de vie à partir de votre date de naissance. Chaque nombre de 1 à 9 (plus les maîtres nombres 11, 22 et 33) correspond à un profil de personnalité et un parcours de vie. Le pendule oui/non répond à une question fermée en se basant sur les énergies du moment.`,

            `Nos outils de voyance gratuite sont utilisés chaque jour par des milliers de personnes, y compris depuis {city}. Le tirage de tarot de Marseille reste le favori : sélectionnez vos cartes et découvrez ce que l'avenir vous réserve.\n\nLe tarot d'amour est spécialement conçu pour les questions sentimentales. Il utilise un tirage à trois cartes pour éclairer votre passé amoureux, votre présent et votre avenir sentimental.\n\nLa numérologie révèle votre chemin de vie en analysant votre date de naissance. Le pendule oui/non et le tarot oui/non offrent des réponses directes à vos questions fermées. Chaque outil a sa spécificité et sa pertinence selon le type de question que vous vous posez.`
        ],
        [
            `Les outils gratuits sont une découverte. La consultation avec un vrai voyant est une expérience transformatrice. Si votre tirage de tarot gratuit a soulevé des interrogations ou confirmé des intuitions, c'est le moment d'approfondir.\n\nUn voyant professionnel à {city} pourra contextualiser les cartes tirées avec votre situation personnelle. Il percevra des nuances que l'outil en ligne ne peut pas capter. Et il pourra vous donner un timing, des conseils d'action et un regard sur les mois à venir.\n\nProfitez des minutes offertes pour faire la transition en douceur. Commencez par une courte consultation téléphonique pour valider la connexion avec le voyant, puis envisagez une séance plus longue si les premiers échanges vous convainquent.`,

            `Beaucoup de nos consultants de {city} commencent par un tirage gratuit et réalisent qu'ils ont besoin de réponses plus poussées. C'est une progression naturelle dans la découverte de la voyance.\n\nLa consultation payante ne remplace pas l'outil gratuit : elle le complète. Le tirage de tarot vous donne des pistes. Le voyant approfondit ces pistes, les confronte à votre réalité et vous guide vers des actions concrètes.\n\nNotre conseil : utilisez les outils gratuits régulièrement pour suivre les tendances générales, et consultez un voyant quand une question importante se pose. C'est l'association des deux qui donne les meilleurs résultats.`
        ]
    ],

    faqs: [
        { q: "Le tirage de tarot gratuit est-il vraiment gratuit à {city} ?", a: "Oui, nos tirages de tarot en ligne sont totalement gratuits, sans inscription ni carte bancaire. Vous pouvez les faire autant de fois que vous le souhaitez." },
        { q: "Les outils de voyance gratuite donnent-ils des résultats fiables ?", a: "Ils offrent des indications générales basées sur les symboles du tarot ou les calculs de numérologie. Pour une lecture personnalisée, une consultation avec un voyant est recommandée." },
        { q: "Comment obtenir des minutes gratuites avec un voyant depuis {city} ?", a: "Créez un compte sur notre plateforme et bénéficiez de premières minutes offertes lors de votre premier appel. L'offre est valable pour tous les nouveaux inscrits." },
        { q: "Quelle différence entre tirage en croix et tirage d'amour ?", a: "Le tirage en croix (5 cartes) offre une vision globale de votre situation. Le tirage d'amour (3 cartes) se concentre spécifiquement sur votre vie sentimentale." },
        { q: "La numérologie gratuite en ligne est-elle précise ?", a: "Le calcul du chemin de vie est mathématique et donc exact. L'interprétation est générale. Un numérologue professionnel peut aller beaucoup plus loin dans l'analyse." }
    ]
},

// ══════════════════════════════════════════════════════════════════════════
// VOYANCE SMS — Intent: quick, discreet, text-based
// ══════════════════════════════════════════════════════════════════════════
'voyance-sms': {
    titleTemplate: 'Voyance par SMS à {city} ({postal_code}) : réponse rapide et discrète',
    metaTemplate: 'Voyance par SMS à {city} : posez votre question par message et recevez une réponse de voyant en quelques minutes. Discret, rapide, sans engagement.',
    h1Template: 'Voyance par SMS à {city} : posez votre question par message',
    subtitleTemplate: 'Réponses de voyance rapides et discrètes par SMS à {city} ({postal_code}), {region}',

    h2s: [
        [
            "Comment fonctionne la voyance par SMS à {city} ?",
            "Voyance SMS : le principe de la consultation par message",
            "Recevoir une guidance de voyance par SMS depuis {city}"
        ],
        [
            "Les avantages de la voyance par SMS à {city}",
            "Pourquoi choisir la voyance par SMS ?",
            "Voyance SMS : discrétion et rapidité à {city}"
        ],
        [
            "Quelles questions poser à un voyant par SMS ?",
            "Formuler sa question de voyance par SMS : nos conseils",
            "Les meilleures questions à poser en voyance SMS"
        ],
        [
            "Tarifs et fonctionnement de la voyance par SMS",
            "Combien coûte une consultation de voyance par SMS ?",
            "Comprendre la facturation de la voyance SMS"
        ],
        [
            "Voyance SMS ou téléphone : que choisir à {city} ?",
            "SMS ou appel vocal : quel format de voyance privilégier ?",
            "Comparer les modes de consultation de voyance à {city}"
        ]
    ],

    contents: [
        [
            `La voyance par SMS est un format de consultation écrit. Vous envoyez votre question par message texte et un voyant vous répond directement sur votre téléphone. Le tout sans prononcer un mot à voix haute.\n\nDepuis {city}, il suffit d'envoyer un SMS au numéro indiqué avec votre question. Un voyant disponible la reçoit, se connecte à vos énergies à travers votre message et formule une réponse détaillée. Vous recevez cette réponse par SMS dans les minutes qui suivent.\n\nCe format est idéal pour les personnes qui n'osent pas appeler un voyant par téléphone. L'écrit permet de poser sa question sans stress, sans devoir s'exprimer à voix haute, et de relire la réponse autant de fois que nécessaire.`,

            `La voyance par SMS depuis {city} est un service simple et direct. Pas besoin de vous isoler pour passer un appel, pas besoin de parler à voix haute. Un message suffit pour obtenir une guidance de voyance.\n\nLe processus est rapide : vous envoyez votre question, un voyant la reçoit et vous répond par SMS. Le délai de réponse varie de quelques minutes à une heure selon la disponibilité des voyants.\n\nCe format texte a un avantage unique : il laisse une trace écrite. Vous pouvez relire la réponse du voyant autant de fois que vous le souhaitez, contrairement à une consultation téléphonique dont les détails s'oublient vite.`
        ],
        [
            `La discrétion est l'atout numéro un de la voyance par SMS. À {city}, que vous soyez au bureau, dans les transports en commun ou à la maison avec d'autres personnes, personne ne sait que vous consultez un voyant. Vous envoyez un SMS, c'est tout.\n\nDeuxième avantage : la rapidité. Pas de temps d'attente au téléphone, pas de présentation, pas de mise en connexion. Vous posez votre question, le voyant répond. L'échange va droit à l'essentiel.\n\nTroisième point fort : la trace écrite. La réponse du voyant reste sur votre téléphone. Vous pouvez la relire quand vous voulez, la méditer, la comparer avec les événements qui se produisent ensuite. C'est un format qui invite à la réflexion.`,

            `Pour les habitants de {city} et de {region}, la voyance par SMS offre une accessibilité incomparable. Pas besoin de trouver un moment calme pour appeler, pas besoin de se justifier auprès de son entourage. Un message discret et le tour est joué.\n\nLe SMS convient aussi aux personnes timides ou émotives qui redoutent de parler au téléphone. L'écrit crée une distance protectrice qui permet de s'exprimer plus librement sur des sujets intimes.\n\nEnfin, la voyance par SMS est accessible même dans les zones où la connexion internet est faible. Près de {monument} ou dans les zones moins couvertes de {city}, le SMS passe toujours.`
        ],
        [
            `Pour obtenir une réponse pertinente par SMS, la formulation de votre question est déterminante. Soyez précis et concis. Évitez les questions trop vagues comme "Comment va ma vie ?" et préférez une question ciblée : "Mon ex reviendra-t-il vers moi avant l'été ?"\n\nLes questions oui/non fonctionnent bien en SMS : "Vais-je obtenir ce poste ?", "Cette personne est-elle sincère avec moi ?", "Dois-je accepter cette proposition ?". Elles permettent au voyant de se concentrer sur un point précis.\n\nVous pouvez aussi poser des questions ouvertes mais courtes : "Que me réserve le mois prochain en amour ?", "Quelle est la nature de mes blocages professionnels ?". Le voyant adaptera sa réponse au format SMS en allant à l'essentiel.`,

            `Depuis {city}, formulez votre question de voyance SMS de manière directe. Un bon SMS de consultation contient : le sujet (amour, travail, famille), le contexte en une phrase et la question elle-même.\n\nExemple efficace : "Je suis séparée depuis 3 mois, mon ex me recontacte de temps en temps. Va-t-il revenir ?" C'est clair, contextualisé et la question est fermée. Le voyant a tout ce qu'il faut pour vous répondre.\n\nÉvitez les SMS trop longs ou qui contiennent cinq questions en une. Le format SMS impose la concision. Une question par message donne les meilleurs résultats.`
        ],
        [
            `La voyance par SMS est facturée au message envoyé et reçu. Le tarif par SMS est annoncé clairement avant l'envoi. En général, comptez entre 1,50 et 3 euros par SMS, hors coût d'envoi standard de votre opérateur.\n\nLa facturation apparaît sur votre facture téléphonique, comme un SMS surtaxé classique. Pas besoin de carte bancaire ni d'inscription préalable.\n\nUne consultation SMS typique comprend 2 à 4 échanges : votre question, la réponse du voyant, éventuellement une précision de votre part et la réponse finale. Le coût total reste modéré, généralement entre 5 et 12 euros pour un échange complet.`,

            `Les tarifs de la voyance SMS depuis {city} sont transparents et encadrés. Chaque SMS envoyé ou reçu dans le cadre de la consultation a un coût fixe, annoncé en début de service.\n\nComparé aux autres formats, le SMS est souvent le plus économique. Une consultation complète (question + réponse + approfondissement) coûte rarement plus de 10 euros. C'est une option intéressante pour les budgets serrés.\n\nLa facturation sur facture téléphonique offre le même avantage que l'audiotel : pas de trace bancaire identifiable, confidentialité maximale.`
        ],
        [
            `Le SMS et le téléphone répondent à des besoins différents. Le SMS est idéal pour une question précise nécessitant une réponse courte. Le téléphone convient mieux à une situation complexe qui demande un échange approfondi.\n\nSi vous avez besoin de raconter votre histoire, de poser plusieurs questions et d'entendre les nuances de la voix du voyant, le téléphone est plus adapté. Si vous voulez une réponse rapide et discrète à une question ciblée, le SMS est parfait.\n\nÀ {city}, beaucoup de consultants utilisent les deux : le SMS pour les questions ponctuelles au quotidien, et le téléphone pour les grandes consultations quand une situation importante se présente.`,

            `À {city}, les deux formats ont leurs adeptes. Le SMS séduit par sa discrétion et sa rapidité. Le téléphone offre une profondeur et une richesse d'échange inégalées.\n\nLe SMS est plus abordable et ne nécessite aucun moment dédié. Vous pouvez envoyer votre question entre deux rendez-vous ou pendant votre pause. Le téléphone demande de vous isoler et de consacrer 20 à 30 minutes à la consultation.\n\nNotre conseil : testez les deux formats. Certaines questions se prêtent mieux au SMS, d'autres nécessitent la profondeur du téléphone. Avec l'expérience, vous saurez instinctivement quel format choisir.`
        ]
    ],

    faqs: [
        { q: "Combien de temps faut-il pour recevoir une réponse de voyance par SMS à {city} ?", a: "En général, vous recevez la réponse du voyant entre 5 et 30 minutes après l'envoi de votre question. Le délai dépend de la disponibilité des voyants." },
        { q: "La voyance par SMS est-elle fiable ?", a: "La qualité de la voyance ne dépend pas du canal mais du voyant. Nos voyants par SMS sont les mêmes professionnels que ceux disponibles par téléphone." },
        { q: "Combien coûte une voyance par SMS depuis {city} ?", a: "Chaque SMS est facturé entre 1,50 et 3 euros. Une consultation complète (2 à 4 SMS) coûte en moyenne entre 5 et 12 euros sur votre facture téléphone." },
        { q: "Peut-on poser n'importe quelle question par SMS de voyance ?", a: "Oui, vous pouvez aborder tous les thèmes : amour, travail, finances, famille. Privilégiez les questions précises et courtes pour obtenir les meilleures réponses." },
        { q: "La voyance SMS apparaît-elle sur ma facture téléphone ?", a: "Les SMS surtaxés apparaissent sur votre facture mais sans mention du contenu ou du service de voyance. La discrétion est préservée." }
    ]
},

// ══════════════════════════════════════════════════════════════════════════
// VOYANCE CHAT — Intent: real-time text, online, comfortable
// ══════════════════════════════════════════════════════════════════════════
'voyance-chat': {
    titleTemplate: 'Voyance par chat à {city} ({postal_code}) : consultation en direct par écrit',
    metaTemplate: 'Voyance par chat à {city} : échangez en direct avec un voyant par écrit. Consultation en temps réel, confortable et confidentielle. Essayez maintenant.',
    h1Template: 'Voyance par chat à {city} : échangez en direct avec un voyant',
    subtitleTemplate: 'Consultation de voyance en direct par écrit à {city} ({postal_code}), {region}',

    h2s: [
        [
            "Comment fonctionne la voyance par chat à {city} ?",
            "Voyance en ligne par chat : le principe de la consultation écrite",
            "Consultez un voyant en direct par tchat depuis {city}"
        ],
        [
            "Pourquoi choisir le chat pour votre voyance à {city} ?",
            "Les avantages de la voyance par chat",
            "Voyance chat à {city} : confort et confidentialité"
        ],
        [
            "Quels sujets aborder lors d'une voyance par chat ?",
            "Amour, travail, avenir : les thèmes de la voyance par chat",
            "Que demander à un voyant en consultation par chat ?"
        ],
        [
            "Voyance par chat vs téléphone : les différences à connaître",
            "Chat ou téléphone : quel format de voyance vous convient ?",
            "Comparer la voyance par chat et par téléphone à {city}"
        ],
        [
            "Choisir le bon voyant pour une consultation par chat à {city}",
            "Comment trouver un voyant de confiance pour le chat ?",
            "Nos voyants disponibles par chat à {city}"
        ]
    ],

    contents: [
        [
            `La voyance par chat est une consultation en temps réel par écrit. Vous échangez avec un voyant dans une fenêtre de tchat, comme une messagerie instantanée. Chaque message que vous envoyez reçoit une réponse en direct.\n\nDepuis {city}, il suffit de vous connecter sur notre plateforme, de choisir un voyant disponible en chat et de lancer la conversation. Le voyant vous accueille, vous expose votre question, et l'échange commence.\n\nContrairement au SMS où vous envoyez une question et attendez la réponse, le chat est un dialogue fluide en temps réel. Vous pouvez rebondir sur les réponses du voyant, demander des précisions et approfondir les sujets au fil de la conversation.`,

            `Le chat de voyance est une alternative moderne et confortable à la consultation téléphonique. À {city}, {specificity}, de nombreux habitants préfèrent l'écrit à la voix pour aborder des sujets personnels.\n\nLe fonctionnement est intuitif. Vous vous connectez, vous choisissez votre voyant parmi les profils en ligne et vous démarrez la conversation. L'échange se fait en direct, message par message, avec un temps de réponse de quelques secondes à quelques minutes.\n\nLa conversation est structurée comme une vraie consultation : accueil, écoute, lecture et interprétation. La seule différence est le support écrit, qui offre ses propres avantages.`
        ],
        [
            `Le chat combine les avantages du téléphone (échange en direct) et du SMS (discrétion de l'écrit). Depuis {city}, vous consultez sans prononcer un mot. Personne autour de vous ne sait que vous êtes en consultation de voyance.\n\nLe confort de l'écrit permet aussi de mieux formuler vos questions. Vous prenez le temps de réfléchir avant de taper, vous pouvez relire ce que le voyant a écrit et revenir sur un point précédent. La conversation est plus posée que par téléphone.\n\nAutre avantage considérable : l'historique. Toute la conversation est sauvegardée. Vous pouvez relire les prédictions du voyant des semaines plus tard et les comparer avec ce qui s'est réellement passé.`,

            `Les habitants de {city} et de {region} apprécient le chat de voyance pour sa discrétion absolue. Au bureau près de {landmark}, dans les transports ou à la maison, vous consultez sans attirer l'attention.\n\nLe chat est aussi idéal pour les personnes émotives. Par téléphone, il est parfois difficile de retenir ses larmes quand on aborde des sujets douloureux. Par chat, l'émotion est là mais vous gardez le contrôle de l'échange.\n\nEnfin, le chat permet de garder une trace complète de la consultation. C'est un atout précieux pour vérifier les prédictions dans le temps et pour se remémorer les conseils du voyant quand on en a besoin.`
        ],
        [
            `Par chat, vous pouvez aborder exactement les mêmes sujets que par téléphone. Les questions d'amour sont les plus fréquentes chez les consultants de {city} : compatibilité, avenir d'un couple, retour affectif, rencontre amoureuse.\n\nLes questions professionnelles se prêtent aussi très bien au format chat : évolution de carrière, changement de poste, création d'entreprise, relations avec les collègues. L'écrit permet de détailler votre situation avec précision.\n\nLes questions financières, familiales et existentielles sont également bienvenues. Le voyant adapte sa lecture au sujet abordé, quel qu'il soit. Le chat est un format polyvalent qui convient à tous les types de consultation.`,

            `Depuis {city}, les sujets les plus abordés en voyance par chat sont l'amour et le travail. Mais la vraie force du chat, c'est sa capacité à traiter des situations complexes grâce à l'écrit.\n\nPar exemple, si votre question implique plusieurs personnes (triangle amoureux, conflit familial, tension au travail), le chat vous permet de décrire la situation en détail. Le voyant a le temps de bien comprendre les enjeux avant de livrer sa lecture.\n\nVous pouvez aussi envoyer des dates de naissance pour un calcul de compatibilité, ou demander au voyant de préciser une prédiction. Le format écrit favorise la précision et la nuance.`
        ],
        [
            `Le chat et le téléphone offrent une expérience de voyance différente. Le téléphone est plus spontané et émotionnel. Le voyant perçoit les nuances de votre voix, vos hésitations, vos silences. Le chat est plus réfléchi et structuré.\n\nEn termes de profondeur, les deux formats sont équivalents quand le voyant est compétent. Certains voyants préfèrent même le chat car il leur permet de se concentrer davantage sur leur lecture sans être distraits par les émotions vocales du consultant.\n\nLe tarif est généralement similaire, à la minute. Le chat a tendance à durer un peu plus longtemps qu'une conversation téléphonique car l'écrit prend plus de temps. En contrepartie, l'échange est souvent plus complet et plus détaillé.`,

            `À {city}, le choix entre chat et téléphone dépend de votre personnalité et du contexte. Si vous êtes à l'aise à l'oral et que vous pouvez vous isoler, le téléphone offre une connexion plus immédiate.\n\nSi vous préférez prendre le temps de formuler vos pensées, si vous êtes dans un lieu public ou si le sujet est trop émouvant pour en parler de vive voix, le chat est le format idéal.\n\nBeaucoup de consultants de {city} alternent entre les deux formats selon les circonstances. Le chat pour les questions du quotidien, le téléphone pour les grandes consultations. Les deux formats se complètent parfaitement.`
        ],
        [
            `Pour une consultation chat réussie à {city}, le choix du voyant est aussi important que pour le téléphone. Vérifiez que le voyant est marqué comme "disponible en chat" sur son profil.\n\nConsultez les avis des autres utilisateurs, en prêtant attention à ceux qui mentionnent spécifiquement une consultation par chat. Certains voyants sont plus à l'aise à l'écrit qu'à l'oral, et inversement.\n\nProfitez des premières minutes offertes pour tester la réactivité du voyant en chat. Un bon voyant par chat répond rapidement, avec des messages structurés et des prédictions claires. Si les réponses sont trop vagues ou trop longues à venir, essayez un autre praticien.`,

            `À {city}, nos voyants disponibles par chat ont été sélectionnés pour leur capacité à délivrer des consultations de qualité par écrit. L'exercice de la voyance par chat demande des compétences spécifiques : clarté d'expression, réactivité et capacité à maintenir la connexion énergétique à travers l'écrit.\n\nLes spécialités de chaque voyant sont indiquées sur son profil. Choisissez un praticien dont l'expertise correspond à votre question. Un spécialiste de la cartomancie pour les questions d'amour, un numérologue pour les questions de timing, un médium pour les questions spirituelles.\n\nPensez à vérifier les horaires de disponibilité en chat. Certains voyants sont disponibles en journée, d'autres en soirée. Notre plateforme indique en temps réel qui est en ligne.`
        ]
    ],

    faqs: [
        { q: "La voyance par chat est-elle en temps réel à {city} ?", a: "Oui, le chat de voyance est un échange en direct. Vous envoyez un message et le voyant répond en quelques secondes à quelques minutes, comme une messagerie instantanée." },
        { q: "Peut-on garder un historique de sa consultation de voyance par chat ?", a: "Oui, la conversation complète est sauvegardée. Vous pouvez la relire à tout moment pour vérifier les prédictions ou vous remémorer les conseils du voyant." },
        { q: "Combien coûte une voyance par chat depuis {city} ?", a: "La facturation est à la minute, comme par téléphone. Les tarifs varient de 2 à 5 euros par minute selon le voyant. Des premières minutes sont souvent offertes." },
        { q: "Faut-il une application pour consulter un voyant par chat ?", a: "Non, la consultation par chat se fait directement depuis le navigateur de votre téléphone ou ordinateur. Aucune application à installer." },
        { q: "Le chat de voyance est-il confidentiel ?", a: "Oui, les échanges sont privés et sécurisés. Seuls vous et le voyant avez accès à la conversation. Vos données personnelles sont protégées." }
    ]
}

}; // end SERVICE_CONFIGS


// ─── HELPER FUNCTIONS ──────────────────────────────────────────────────────

function fillTemplate(template, replacements) {
    let result = template;
    for (const [key, value] of Object.entries(replacements)) {
        result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    }
    return result;
}

function getRandomVariant(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function getNearbyCities(currentCity, allCities, count = 6) {
    const sameRegion = allCities.filter(c =>
        c.region === currentCity.region && c.slug !== currentCity.slug
    );
    if (sameRegion.length >= count) return sameRegion.slice(0, count);
    const others = allCities
        .filter(c => c.slug !== currentCity.slug && !sameRegion.includes(c))
        .sort(() => Math.random() - 0.5);
    return [...sameRegion, ...others.slice(0, count - sameRegion.length)];
}

// Seeded random per city+service for deterministic output
function seededRandom(seed) {
    let h = 0;
    for (let i = 0; i < seed.length; i++) {
        h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
}

function seededPick(array, seed) {
    return array[seededRandom(seed) % array.length];
}


// ─── PAGE GENERATION ───────────────────────────────────────────────────────

function generatePage(city, service) {
    const config = SERVICE_CONFIGS[service.slug];
    if (!config) {
        console.error(`No config for service: ${service.slug}`);
        return null;
    }

    const seed = `${service.slug}-${city.slug}`;
    const r = (arr) => seededPick(arr, seed);

    const replacements = {
        city: city.name,
        city_slug: city.slug,
        postal_code: city.postalCode,
        region: city.region,
        monument: city.monument,
        landmark: city.landmark,
        specificity: city.specificity,
        service: service.name,
        service_lower: service.name.toLowerCase(),
        service_slug: service.slug,
        pillar_page: service.pillarPage,
        icon: service.icon
    };

    const fill = (tpl) => fillTemplate(tpl, replacements);

    // Pick variants deterministically
    const title = fill(config.titleTemplate);
    const meta = fill(config.metaTemplate);
    const h1 = fill(config.h1Template);
    const subtitle = fill(config.subtitleTemplate);

    const h2s = config.h2s.map((variants, i) =>
        fill(seededPick(variants, seed + '-h2-' + i))
    );

    const contents = config.contents.map((variants, i) =>
        fill(seededPick(variants, seed + '-content-' + i))
    );

    const faqs = config.faqs.map(f => ({
        question: fill(f.q),
        answer: fill(f.a)
    }));

    // Internal links (directory-based URLs, no .html extension)
    const otherServices = services
        .filter(s => s.slug !== service.slug)
        .map(s => `<a href="/villes/${s.slug}-${city.slug}/" class="internal-link">${s.name} à ${city.name}</a>`)
        .join('\n                                ');

    const nearbyCities = getNearbyCities(city, cities, 6)
        .map(c => `<a href="/villes/${service.slug}-${c.slug}/" class="internal-link">${service.name} à ${c.name}</a>`)
        .join('\n                                ');

    const mapsUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Mairie+${encodeURIComponent(city.name)},France&zoom=13`;

    // Build HTML
    const html = `<!DOCTYPE html>
<html lang="fr" class="no-js">

<head>
    <script>document.documentElement.classList.remove('no-js');</script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${meta}">
    <link rel="canonical" href="https://france-voyance-avenir.fr/villes/${service.slug}-${city.slug}/">
    <meta name="robots" content="index, follow">
    <link rel="icon" href="/images/favicon.png" type="image/png">

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">

    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="/css/style.css?v=2026">
    <link rel="stylesheet" href="/css/animations.css?v=2026">
    <script src="/js/config.js"></script>

    <!-- Schema JSON-LD -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://france-voyance-avenir.fr/" },
            { "@type": "ListItem", "position": 2, "name": "${service.name}", "item": "https://france-voyance-avenir.fr${service.pillarPage}" },
            { "@type": "ListItem", "position": 3, "name": "${city.name}", "item": "https://france-voyance-avenir.fr/villes/${service.slug}-${city.slug}/" }
          ]
        },
        {
          "@type": "Service",
          "name": "${service.name} à ${city.name}",
          "description": "${meta}",
          "provider": {
            "@type": "Organization",
            "name": "France Voyance Avenir",
            "url": "https://france-voyance-avenir.fr/"
          },
          "areaServed": {
            "@type": "City",
            "name": "${city.name}",
            "containedInPlace": {
              "@type": "AdministrativeArea",
              "name": "${city.region}"
            }
          },
          "serviceType": "${service.name}"
        },
        {
          "@type": "FAQPage",
          "mainEntity": [
            ${faqs.map(faq => `{
              "@type": "Question",
              "name": "${faq.question.replace(/"/g, '\\"')}",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "${faq.answer.replace(/"/g, '\\"')}"
              }
            }`).join(',\n            ')}
          ]
        }
      ]
    }
    </script>
</head>

<body>
    <div class="stars-container"></div>
    <div class="reading-progress-container">
        <div class="reading-progress-bar"></div>
    </div>

    <!-- HEADER -->
    <header class="site-header">
        <div class="container header-container">
            <a href="/" class="logo">
                <img src="/images/logo.svg" alt="France Voyance Avenir">
            </a>

            <div class="mobile-toggle">
                <i class="fa-solid fa-bars"></i>
            </div>

            <nav class="main-nav">
                <a href="/" class="nav-logo">
                    <img src="/images/logo.svg" alt="France Voyance Avenir">
                </a>
                <ul>
                    <li class="nav-item"><a href="/" class="nav-link">Accueil</a></li>
                    <li class="nav-item">
                        <a href="/voyance-gratuite/" class="nav-link">Voyance Gratuite <i class="fa-solid fa-chevron-down" style="font-size: 0.7em;"></i></a>
                        <ul class="dropdown-menu">
                            <li><a href="/voyance-gratuite/tarot-gratuit/">Tarot Gratuit</a></li>
                            <li><a href="/voyance-gratuite/tarot-d-amour/">Tarot Amour</a></li>
                            <li><a href="/voyance-gratuite/numerologie-gratuite/">Numérologie Gratuite</a></li>
                            <li><a href="/voyance-gratuite/pendule-oui-non/">Pendule Oui/Non</a></li>
                            <li><a href="/voyance-gratuite/tarot-oui-non/">Tarot Oui/Non</a></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link">Arts Divinatoires <i class="fa-solid fa-chevron-down" style="font-size: 0.7em;"></i></a>
                        <ul class="dropdown-menu">
                            <li><a href="/arts-divinatoires/pendule/">Voyance Pendule</a></li>
                            <li><a href="/arts-divinatoires/oracle-belline/">Oracle Belline</a></li>
                            <li><a href="/arts-divinatoires/oracle-ge/">Oracle Gé</a></li>
                            <li><a href="/arts-divinatoires/runes/">Tirage Runes</a></li>
                            <li><a href="/arts-divinatoires/cartomancie/">Cartomancie</a></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link">Consultations <i class="fa-solid fa-chevron-down" style="font-size: 0.7em;"></i></a>
                        <ul class="dropdown-menu">
                            <li><a href="/consultations/amour-retour-affectif/">Amour & Retour Affectif</a></li>
                            <li><a href="/consultations/flamme-jumelle/">Flamme Jumelle</a></li>
                            <li><a href="/consultations/medium-defunts/">Medium & Défunts</a></li>
                            <li><a href="/consultations/travail-carriere/">Travail & Carrière</a></li>
                            <li><a href="/consultations/argent-finances/">Argent & Finances</a></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link">Consulter <i class="fa-solid fa-chevron-down" style="font-size: 0.7em;"></i></a>
                        <ul class="dropdown-menu">
                            <li><a href="/consulter/voyance-telephone/">Voyance Téléphone</a></li>
                            <li><a href="/consulter/voyance-sms/">Voyance SMS</a></li>
                            <li><a href="/consulter/voyance-chat/">Voyance Chat</a></li>
                            <li><a href="/consulter/voyance-audiotel/">Voyance Audiotel</a></li>
                        </ul>
                    </li>
                    <li class="nav-item"><a href="/avis/" class="nav-link">Avis & Comparatifs</a></li>
                </ul>
                <div class="header-cta text-center mt-3 mt-lg-0 ml-lg-4">
                    <a href="javascript:void(0)" onclick="window.open(getAffiliateUrl(), '_blank'); return false;" class="btn btn-gold" data-affiliate="voyance-telephone">Consultation Immédiate</a>
                </div>
            </nav>
        </div>
    </header>

    <main>
        <!-- Breadcrumbs -->
        <nav class="breadcrumbs" aria-label="Fil d'Ariane">
            <div class="container">
                <a href="/">Accueil</a>
                <span class="separator">&rsaquo;</span>
                <a href="${service.pillarPage}">${service.name}</a>
                <span class="separator">&rsaquo;</span>
                <span class="current">${city.name}</span>
            </div>
        </nav>

        <!-- Hero Section -->
        <section class="local-hero">
            <div class="container">
                <h1 class="fade-in-up">${h1}</h1>
                <p class="hero-subtitle fade-in-up stagger-1">${subtitle}</p>
                <a href="javascript:void(0)" onclick="window.open(getAffiliateUrl(), '_blank'); return false;" data-affiliate="telephone" class="btn btn-gold btn-xl icon-pulse fade-in-up stagger-2">
                    <i class="fas fa-${service.icon}"></i> Consulter maintenant
                </a>
            </div>
        </section>

        <!-- Main Content -->
        <section class="content-section">
            <div class="container">
                <div class="content-grid">
                    <article class="main-content">
                        <section class="content-block fade-in-up">
                            <h2>${h2s[0]}</h2>
                            ${contents[0].split('\n').map(p => p.trim() ? `<p>${p}</p>` : '').join('\n                            ')}
                        </section>

                        <section class="content-block fade-in-up">
                            <h2>${h2s[1]}</h2>
                            ${contents[1].split('\n').map(p => p.trim() ? `<p>${p}</p>` : '').join('\n                            ')}
                        </section>

                        <!-- Google Maps -->
                        <div class="map-container fade-in-up">
                            <h3><i class="fas fa-map-marker-alt"></i> ${service.name} à ${city.name}</h3>
                            <iframe
                                src="${mapsUrl}"
                                width="100%"
                                height="300"
                                style="border:0; border-radius: 12px;"
                                allowfullscreen=""
                                loading="lazy"
                                referrerpolicy="no-referrer-when-downgrade"
                                title="Carte de ${city.name}">
                            </iframe>
                        </div>

                        <section class="content-block fade-in-up">
                            <h2>${h2s[2]}</h2>
                            ${contents[2].split('\n').map(p => p.trim() ? `<p>${p}</p>` : '').join('\n                            ')}
                        </section>

                        <section class="content-block fade-in-up">
                            <h2>${h2s[3]}</h2>
                            ${contents[3].split('\n').map(p => p.trim() ? `<p>${p}</p>` : '').join('\n                            ')}
                        </section>

                        <section class="content-block fade-in-up">
                            <h2>${h2s[4]}</h2>
                            ${contents[4].split('\n').map(p => p.trim() ? `<p>${p}</p>` : '').join('\n                            ')}
                        </section>

                        <!-- FAQ Accordion -->
                        <section class="faq-section fade-in-up">
                            <h3>Questions fréquentes sur la ${service.name.toLowerCase()} à ${city.name}</h3>
                            <div class="faq-list">
                                ${faqs.map(faq => `
                                <div class="faq-item">
                                    <button class="faq-question" aria-expanded="false">
                                        <span>${faq.question}</span>
                                        <span class="faq-icon">+</span>
                                    </button>
                                    <div class="faq-answer">
                                        <p>${faq.answer}</p>
                                    </div>
                                </div>`).join('')}
                            </div>
                        </section>

                        <!-- Other Services in Same City -->
                        <section class="internal-links fade-in-up">
                            <h3>Autres services de voyance à ${city.name}</h3>
                            <div class="links-grid">
                                ${otherServices}
                            </div>
                        </section>

                        <!-- Nearby Cities - Same Service -->
                        <section class="nearby-cities fade-in-up">
                            <h3>${service.name} dans d'autres villes</h3>
                            <div class="links-grid">
                                ${nearbyCities}
                            </div>
                        </section>
                    </article>

                    <!-- Sidebar -->
                    <aside class="sidebar">
                        <div class="sidebar-sticky">
                            <div class="cta-box fade-in-right">
                                <h3><i class="fas fa-${service.icon} icon-pulse"></i> ${service.name}</h3>
                                <p>Nos voyants experts vous guident à ${city.name}</p>
                                <a href="javascript:void(0)" onclick="window.open(getAffiliateUrl(), '_blank'); return false;" data-affiliate="telephone" class="btn btn-gold btn-block">
                                    Consulter maintenant
                                </a>
                            </div>

                            <div class="pillar-link-box fade-in-right stagger-1">
                                <h4>En savoir plus</h4>
                                <a href="${service.pillarPage}" class="pillar-link">
                                    <i class="fas fa-arrow-right"></i> Guide complet ${service.name}
                                </a>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    </main>

    <!-- FOOTER -->
    <footer class="site-footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-col">
                    <div class="logo" style="margin-bottom: 20px;">
                        <i class="fa-solid fa-moon"></i> France Voyance Avenir
                    </div>
                    <p>Votre guide vers les arts divinatoires. Trouvez le voyant qui vous correspond parmi notre sélection de professionnels vérifiés.</p>
                </div>
                <div class="footer-col">
                    <h4>Navigation Rapide</h4>
                    <ul class="footer-links">
                        <li><a href="/consulter/voyance-telephone/">Voyance Téléphone</a></li>
                        <li><a href="/voyance-gratuite/">Voyance Gratuite</a></li>
                        <li><a href="/voyance-gratuite/tarot-d-amour/">Tarot Amour</a></li>
                        <li><a href="/arts-divinatoires/">Horoscope du jour</a></li>
                        <li><a href="/voyance-gratuite/numerologie-gratuite/">Numérologie</a></li>
                        <li><a href="/blog/">Le Blog</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Informations</h4>
                    <ul class="footer-links">
                        <li><a href="/legal/mentions-legales/">Mentions Légales</a></li>
                        <li><a href="/legal/politique-confidentialite/">Politique de Confidentialité</a></li>
                        <li><a href="/legal/politique-cookies/">Politique des Cookies</a></li>
                        <li><a href="/legal/cgu/">CGU</a></li>
                        <li><a href="/contact/">Contact</a></li>
                        <li><a href="/plan-du-site/">Plan du site</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Contact</h4>
                    <ul class="footer-links">
                        <li><i class="fa-solid fa-envelope" style="margin-right: 10px; color: var(--color-secondary);"></i> contact@france-voyance-avenir.fr</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <div class="container">
                <p>&copy; 2026 France Voyance Avenir - Tous droits réservés</p>
                <div class="disclaimer">
                    Ce site propose des services de divertissement. Les consultations de voyance ne remplacent pas un avis médical, juridique ou financier professionnel.
                </div>
                <p class="affiliate-disclosure">
                    * Ce site contient des liens affiliés. En cliquant sur ces liens et en effectuant un achat, nous pouvons recevoir une commission sans frais supplémentaires pour vous. Cela nous aide à maintenir ce site gratuit.
                </p>
            </div>
        </div>
    </footer>

    <!-- Sticky CTA -->
    <div class="sticky-cta">
        <div class="sticky-cta-pulse"></div>
        <a href="javascript:void(0)" onclick="window.open(getAffiliateUrl(), '_blank'); return false;" data-affiliate="telephone" class="btn btn-gold">
            <span class="sticky-cta-icon"><i class="fas fa-phone-alt"></i></span>
            <span>Consulter</span>
        </a>
    </div>

    <script src="/js/animations.js" defer></script>
    <script src="/js/main.js?v=2026"></script>
</body>

</html>`;

    return html;
}


// ─── MAIN EXECUTION ────────────────────────────────────────────────────────

let pagesGenerated = 0;
const totalPages = cities.length * services.length;

console.log(`\n🚀 Generator v3 — Anti-cannibalization edition`);
console.log(`📊 ${cities.length} cities × ${services.length} services = ${totalPages} pages\n`);

for (const service of services) {
    console.log(`\n📁 ${service.name} (${service.slug}):`);

    for (const city of cities) {
        const dirName = `${service.slug}-${city.slug}`;
        const dirPath = path.join(outputDir, dirName);
        if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

        const html = generatePage(city, service);
        if (html) {
            fs.writeFileSync(path.join(dirPath, 'index.html'), html, 'utf8');
            pagesGenerated++;
        }

        process.stdout.write(`  ✓ ${pagesGenerated}/${totalPages}\r`);
    }

    console.log(`  ✅ ${cities.length} pages for ${service.name}`);
}

console.log(`\n✨ Generated ${pagesGenerated} pages with service-specific content!`);
console.log(`📁 Output: ${outputDir}\n`);
