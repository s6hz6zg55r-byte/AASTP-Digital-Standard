import fs from 'node:fs';

// CHANGE THIS
const filename = 'distanceRules.json';

// Read the JSON
const data = JSON.parse(fs.readFileSync(filename, 'utf8'));

let count = 0;

function migrate(obj) {
    if (Array.isArray(obj)) {
        obj.forEach(migrate);
        return;
    }

    if (obj && typeof obj === 'object') {

        if (
            Object.hasOwn(obj, 'transformations') &&
            Array.isArray(obj.transformations)
        ) {
            obj.transformations = {
                forward: obj.transformations,
                reverse: []
            };

            count++;
        }

        Object.values(obj).forEach(migrate);
    }
}

migrate(data);

fs.writeFileSync(
    filename,
    JSON.stringify(data, null, 4)
);

console.log(`Updated ${count} transformation blocks.`);