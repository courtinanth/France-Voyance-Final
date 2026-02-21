/**
 * Deduplicate cities.json - Remove duplicate city entries by slug
 */
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data', 'cities.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const seen = new Set();
const duplicates = [];
const uniqueCities = [];

for (const city of data.cities) {
    if (seen.has(city.slug)) {
        duplicates.push(city.name + ' (' + city.slug + ')');
    } else {
        seen.add(city.slug);
        uniqueCities.push(city);
    }
}

console.log(`\nTotal entries: ${data.cities.length}`);
console.log(`Unique cities: ${uniqueCities.length}`);
console.log(`Duplicates removed: ${duplicates.length}`);

if (duplicates.length > 0) {
    console.log('\nDuplicates removed:');
    duplicates.forEach(d => console.log(`  - ${d}`));
}

// Write back
data.cities = uniqueCities;
fs.writeFileSync(dataPath, JSON.stringify(data, null, 4), 'utf8');
console.log(`\n✅ cities.json updated with ${uniqueCities.length} unique cities.`);
