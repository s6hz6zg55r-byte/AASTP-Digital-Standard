const fs = require("fs");

const { loadJson } = require("../utils/loadJson")

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
 * Helpers
 * -------------------------------------------------- */

let hasErrors = false;

function error(message) {
  console.error(`❌ ${message}`);
  hasErrors = true;
}

function isActive(item) {
  return item.active !== false;
}

/* --------------------------------------------------
 * Build Usage Sets
 * -------------------------------------------------- */

const effectUsage = new Set();
const hazardUsage = new Set();
const distanceRuleUsage = new Set();
const protectionLevelUsage = new Set();
const constraintUsage = new Set();

const structureUsage = new Set();
const orientationTypeUsage = new Set();

/* --------------------------------------------------
 * Structures referenced by PES / ES
 * -------------------------------------------------- */

for (const pes of pesTypes.pes_types) {
  structureUsage.add(pes.structure);
}

for (const es of esTypes.es_types) {
  structureUsage.add(es.structure);
}

/* --------------------------------------------------
 * Orientation types referenced by structures
 * -------------------------------------------------- */

for (const structure of structures.structures) {

  if (structure.orientationType) {

    orientationTypeUsage.add(
      structure.orientationType
    );
  }
}

/* --------------------------------------------------
 * Interaction references
 * -------------------------------------------------- */

for (const interaction of Object.values(
  interactionRules.interactionRules
)) {

  for (const [effectId, rules] of Object.entries(
    interaction.effects
  )) {

    effectUsage.add(effectId);

    for (const rule of rules) {

      hazardUsage.add(rule.hazard);

      if (rule.status) {
        continue;
      }

      if (rule.distanceRule) {
        distanceRuleUsage.add(
          rule.distanceRule
        );
      }

      if (rule.protectionLevel) {
        protectionLevelUsage.add(
          rule.protectionLevel
        );
      }

      if (rule.constraints) {

        for (const constraint of rule.constraints) {

          constraintUsage.add(
            constraint
          );
        }
      }
    }
  }
}

/* --------------------------------------------------
 * Hazard → Effect Completeness
 * -------------------------------------------------- */

for (const hazard of hazardCategories.hazardDivisions) {

  if (!isActive(hazard)) {
    continue;
  }

  if (
    !hazard.effects ||
    hazard.effects.length === 0
  ) {

    error(
      `Hazard ${hazard.id} supports no effects`
    );
  }
}

/* --------------------------------------------------
 * Effect ← Hazard Completeness
 * -------------------------------------------------- */

for (const effect of effects.effects) {

  if (!isActive(effect)) {
    continue;
  }

  let supported = false;

  for (const hazard of hazardCategories.hazardDivisions) {

    if (!isActive(hazard)) {
      continue;
    }

    if (
      hazard.effects &&
      hazard.effects.includes(effect.id)
    ) {

      supported = true;
      break;
    }
  }

  if (!supported) {

    error(
      `Active effect ${effect.id} is not supported by any active hazard`
    );
  }
}

/* --------------------------------------------------
 * Structure Completeness
 * -------------------------------------------------- */

for (const structure of structures.structures) {

  if (!isActive(structure)) {
    continue;
  }

  if (!structureUsage.has(structure.id)) {

    error(
      `Active structure ${structure.id} is not referenced by any PES or ES type`
    );
  }
}

/* --------------------------------------------------
 * Orientation Type Completeness
 * -------------------------------------------------- */

for (const orientationTypeId of Object.keys(
  interactionDimensions.orientationTypes
)) {

  const orientationType =
    interactionDimensions.orientationTypes[
      orientationTypeId
    ];

  if (!isActive(orientationType)) {
    continue;
  }

  if (
    !orientationTypeUsage.has(
      orientationTypeId
    )
  ) {

    error(
      `Active orientation type ${orientationTypeId} is not referenced by any structure`
    );
  }
}

/* --------------------------------------------------
 * Result
 * -------------------------------------------------- */

if (hasErrors) {

  console.error(
    "\n❌ Repository completeness validation failed"
  );

  process.exit(1);
}

console.log(
  "✓ Repository completeness validation passed"
);