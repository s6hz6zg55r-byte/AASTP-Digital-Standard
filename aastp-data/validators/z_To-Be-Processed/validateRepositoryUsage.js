const fs = require("fs");

const { loadJson } = require("../utils/loadJson");

const pesTypes = loadJson("pesTypes.json");
const esTypes = loadJson("esTypes.json");
const structures = loadJson("structures.json");
const interactionDimensions = loadJson("interactionDimensions.json");
const interactionRules = loadJson("interactions.json");
const effects = loadJson("effects.json");
const hazardCategories = loadJson("hazardCategories.json");
const distanceRules = loadJson("distanceRules.json");
const protectionLevels = loadJson("protectionLevels.json");
const constraints = loadJson("constraints.json");

/* --------------------------------------------------
 * Usage Tracking
 * -------------------------------------------------- */

const usage = {
  effects: new Map(),
  hazards: new Map(),
  distanceRules: new Map(),
  protectionLevels: new Map(),
  constraints: new Map(),
  structures: new Map(),
  orientationTypes: new Map()
};

function increment(map, id) {
  map.set(id, (map.get(id) || 0) + 1);
}

/* --------------------------------------------------
 * Initialise Usage Maps
 * -------------------------------------------------- */

for (const effect of effects.effects) {
  if (effect.active === false) {
    continue;
  }
  usage.effects.set(effect.id, 0);
}

for (const hazard of hazardCategories.hazardDivisions) {

  if (hazard.active === false) {
    continue;
  }

  usage.hazards.set(hazard.id, 0);
}

for (const rule of distanceRules.distanceRules) {
  usage.distanceRules.set(rule.id, 0);
}

for (const level of protectionLevels.protection_levels) {
  usage.protectionLevels.set(level.id, 0);
}

for (const constraint of constraints.constraints) {
  usage.constraints.set(constraint.id, 0);
}

for (const structure of structures.structures) {
  usage.structures.set(structure.id, 0);
}

for (const orientationTypeId of Object.keys(
  interactionDimensions.orientationTypes
)) {
  usage.orientationTypes.set(orientationTypeId, 0);
}

/* --------------------------------------------------
 * Structures Used By PES / ES
 * -------------------------------------------------- */

for (const pes of pesTypes.pes_types) {
  increment(usage.structures, pes.structure);
}

for (const es of esTypes.es_types) {
  increment(usage.structures, es.structure);
}

/* --------------------------------------------------
 * Orientation Types Used By Structures
 * -------------------------------------------------- */

for (const structure of structures.structures) {

  increment(
    usage.orientationTypes,
    structure.orientationType
  );
}

/* --------------------------------------------------
 * Interaction Usage
 * -------------------------------------------------- */

for (const interaction of Object.values(
  interactionRules.interactionRules
)) {

  for (const [effectId, rules] of Object.entries(
    interaction.effects
  )) {

    increment(usage.effects, effectId);

    for (const rule of rules) {

      increment(
        usage.hazards,
        rule.hazard
      );

      if (rule.status) {
        continue;
      }

      increment(
        usage.distanceRules,
        rule.distanceRule
      );

      increment(
        usage.protectionLevels,
        rule.protectionLevel
      );

      for (const constraint of rule.constraints) {

        increment(
          usage.constraints,
          constraint
        );
      }
    }
  }
}

/* --------------------------------------------------
 * Reporting
 * -------------------------------------------------- */

let warningCount = 0;

function reportUnused(title, map) {

  const unused = [...map.entries()]
    .filter(([_, count]) => count === 0);

  if (unused.length === 0) {
    return;
  }

  console.log(`\n${title}`);
  console.log("-".repeat(title.length));

  for (const [id] of unused) {

    console.warn(`⚠ Unused ${id}`);
    warningCount++;
  }
}

reportUnused(
  "Unused Effects",
  usage.effects
);

reportUnused(
  "Unused Hazards",
  usage.hazards
);

reportUnused(
  "Unused Distance Rules",
  usage.distanceRules
);

reportUnused(
  "Unused Protection Levels",
  usage.protectionLevels
);

reportUnused(
  "Unused Constraints",
  usage.constraints
);

reportUnused(
  "Unused Structures",
  usage.structures
);

reportUnused(
  "Unused Orientation Types",
  usage.orientationTypes
);

/* --------------------------------------------------
 * Summary
 * -------------------------------------------------- */

console.log("\nRepository Usage Summary");
console.log("------------------------");

console.log(
  `Effects: ${usage.effects.size}`
);

console.log(
  `Hazards: ${usage.hazards.size}`
);

console.log(
  `Distance Rules: ${usage.distanceRules.size}`
);

console.log(
  `Protection Levels: ${usage.protectionLevels.size}`
);

console.log(
  `Constraints: ${usage.constraints.size}`
);

console.log(
  `Structures: ${usage.structures.size}`
);

console.log(
  `Orientation Types: ${usage.orientationTypes.size}`
);

if (warningCount === 0) {

  console.log(
    "\n✓ Repository usage validation passed"
  );

  console.log(
    "No unused repository objects detected"
  );
}
else {

  console.log(
    `\n✓ Repository usage validation passed with ${warningCount} warning(s)`
  );
}