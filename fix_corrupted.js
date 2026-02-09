
const fs = require('fs');
const path = require('path');

const targetDirs = [
    'consultations',
    'arts-divinatoires',
    'voyance-gratuite',
    'legal',
    'contact',
    'avis',
    'plandusite'
];
const rootFiles = ['index.html', '404.html', 'offline.html'];

const replacementChar = '\uFFFD';

const replacements = {
    // Specific Words (Case sensitive & insensitive handling via key)
    "lments": "Éléments",
    "mes": "Âmes",
    "met": "Émet",
    "mises": "Émises",
    "motionnel": "Émotionnel",
    "mouvante": "Émouvante",
    "nergie": "Énergie",
    "nergies": "Énergies",
    "nergtique": "Énergétique",
    "panouissement": "Épanouissement",
    "preuve": "Épreuve",
    "quitable": "Équitable",
    "quivoque": "Équivoque",
    "tablir": "Établir",
    "tape": "Étape",
    "tapes": "Étapes",
    "tat": "État",
    "ternel": "Éternel",
    "tes": "Êtes",
    "tre": "Être",
    "tudie": "Étudie",
    "valuer": "Évaluer",
    "ventuelle": "Éventuelle",
    "viter": "Éviter",
    "vitez": "Évitez",
    "vocateur": "Évocateur",
    "vocatrice": "Évocatrice",
    "vnement": "Événement",
    "tude": "Étude",

    "Russir": "Réussir",
    "Carrire": "Carrière",
    "Immdiate": "Immédiate",
    "Mdium": "Médium",
    "Prdictions": "Prédictions",
    "Sance": "Séance",
    "Tude": "Étude",
    "Dcid": "Décidé",
    "Dcisif": "Décisif",

    // à
    "L-bas": "Là-bas",
    "au-del": "au-delà",
    "voil": "voilà",

    // é / è strings
    "djà": "déjà",
    "l-bas": "là-bas",
    "peut-tre": "peut-être",
    "bientt": "bientôt",
    "sr": "sûr",
    "cot": "coût",
    "terre--terre": "terre-à-terre",
    "prt(e)": "prêt(e)",
    "prte": "prête",
    "vous-mme": "vous-même",
    "mme": "même",

    // Common è/ê/à patterns within words
    "tr\uFFFDs": "très",
    "pr\uFFFDs": "près",
    "succ\uFFFDs": "succès",
    "proc\uFFFDs": "procès",
    "acc\uFFFDs": "accès",
    "excs": "excès",
    "ch\uFFFDre": "chère",
    "fr\uFFFDre": "frère",
    "p\uFFFDre": "père",
    "m\uFFFDre": "mère",
    "lumi\uFFFDre": "lumière",
    "arr\uFFFDre": "arrière",
    "rivi\uFFFDre": "rivière",
    "col\uFFFDre": "colère",
    "myst\uFFFDre": "mystère",
    "f\uFFFDte": "fête",
    "for\uFFFDt": "forêt",
    "int\uFFFDr\uFFFDt": "intérêt",
    "b\uFFFDte": "bête",
    "pr\uFFFDt": "prêt",
    "d\uFFFDj\uFFFD": "déjà",
    "l\uFFFD": "là",

    // Specific partial matches
    "Cr": "Créé",
    "cr": "créé",
    "Mdium": "Médium",
    "mdium": "médium",
    "Prdictions": "Prédictions",
    "prdictions": "prédictions",
    "Sance": "Séance",
    "sance": "séance",
    "renverse": "renversée",
    "Numrologie": "Numérologie",
    "Idalit": "Idéalité",
    "rcent": "récent",
    "Complmentarit": "Complémentarité",
    "Rponse": "Réponse",
    "rponse": "réponse",
    "rceptivit": "réceptivité",
    "rfrence": "référence",
    "rgis": "régis",
    "rles": "rôles",
    "rpond": "répond",
    "rput": "réputé",
    "rseau": "réseau",
    "rserv": "réservé",
    "rside": "réside",
    "rsultat": "résultat",
    "runi": "réuni",
    "russir": "réussir",
    "russite": "réussite",
    "rveil": "réveil",
    "rvle": "révèle",
    "rvlent": "révèlent",
    "rvler": "révéler",
    "s'lever": "s'élever",
    "s'tablit": "s'établit",
    "sacrifi": "sacrifié",
    "sacr": "sacré",
    "scne": "scène",
    "sensibilit": "sensibilité",
    "sign": "signé",
    "simplicit": "simplicité",
    "sicle": "siècle",
    "socit": "société",
    "souhait": "souhaité",
    "spiritualit": "spiritualité",
    "spcialiste": "spécialiste",
    "spcialis": "spécialisé",
    "spcialit": "spécialité",
    "spcifique": "spécifique",
    "stratgie": "stratégie",
    "subtilit": "subtilité",
    "suggrer": "suggérer",
    "supplmentaire": "supplémentaire",
    "synchronicit": "synchronicité",
    "scurisez": "sécurisez",
    "scurit": "sécurité",
    "slection": "sélection",
    "sparation": "séparation",
    "thmatique": "thématique",
    "thme": "thème",
    "tir": "tiré",
    "tranch": "tranché",
    "tlphone": "téléphone",
    "tlphonique": "téléphonique",
    "utilis": "utilisé",
    "visit": "visité",
    "volont": "volonté",
    "vrifiables": "vérifiables",
    "vrifier": "vérifier",
    "vrifi": "vérifié",
    "vrit": "vérité",
    "clair": "éclair",
    "cri": "écri",
    "dcembre": "décembre",
    "fvrier": "février",
    "aot": "août",
    "Dcembre": "Décembre",
    "Fvrier": "Février",
    "Aot": "Août",
    "Dc": "Déc",
    "Fv": "Fév",
};

function fixFile(filePath) {
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    if (!content.includes(replacementChar)) return;

    // 1. Specific string replacements
    for (const [bad, good] of Object.entries(replacements)) {
        content = content.split(bad).join(good);
    }

    // 2. Logic heuristics
    // Isolated replacement char -> 'à'
    content = content.replace(/ \uFFFD /g, ' à ');
    content = content.replace(/'\uFFFD /g, "'à ");

    // 3. Fallback: Everything else -> 'é'
    if (content.includes(replacementChar)) {
        const count = content.split(replacementChar).length - 1;
        console.log(`[Fallback] ${path.basename(filePath)}: Replaced ${count} chars with 'é'`);
        content = content.split(replacementChar).join('é');
    } else {
        console.log(`[Fixed] ${path.basename(filePath)}`);
    }

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
    }
}

function scanDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            scanDir(fullPath);
        } else if (file.endsWith('.html')) {
            fixFile(fullPath);
        }
    }
}

rootFiles.forEach(file => fixFile(path.join(__dirname, file)));
targetDirs.forEach(dir => scanDir(path.join(__dirname, dir)));
console.log("Done.");
