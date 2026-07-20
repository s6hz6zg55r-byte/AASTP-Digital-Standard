const fs = require("fs");

const { loadJson } = require("./utils/loadJson");

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
 * Validation State
 * -------------------------------------------------- */

let hasErrors = false;

function error(message) {
  console.error(`❌ ${message}`);
  hasErrors = true;
}

/* --------------------------------------------------
 * Build Lookup Sets
 * -------------------------------------------------- */

const structureIds = new Set(
  structures.structures.map(s => s.id)
);

const pesIds = new Set(
  pesTypes.pes_types.map(p => p.id)
);

const esIds = new Set(
  esTypes.es_types.map(e => e.id)
);

const effectIds = new Set(
  effects.effects.map(e => e.id)
);

const hazardIds = new Set(
  hazardCategories.hazardDivisions.map(h => h.id)
);

const distanceRuleIds = new Set(
  distanceRules.distanceRules.map(r => r.id)
);

const protectionLevelIds = new Set(
  protectionLevels.protection_levels.map(p => p.id)
);

const constraintIds = new Set(
  constraints.constraints.map(c => c.id)
);

const orientationTypeIds = new Set(
  Object.keys(interactionDimensions.orientationTypes)
);

/* --------------------------------------------------
 * Structure → OrientationType
 * -------------------------------------------------- */

for (const structure of structures.structures) {

  if (!orientationTypeIds.has(structure.orientationType)) {

    error(
      `Structure ${structure.id} references unknown orientation type ${structure.orientationType}`
    );
  }
}

/* --------------------------------------------------
 * PES → Structure
 * -------------------------------------------------- */

for (const pes of pesTypes.pes_types) {

  if (!structureIds.has(pes.structure)) {

    error(
      `PES ${pes.id} references unknown structure ${pes.structure}`
    );
  }
}

/* --------------------------------------------------
 * ES → Structure
 * -------------------------------------------------- */

for (const es of esTypes.es_types) {

  if (!structureIds.has(es.structure)) {

    error(
      `ES ${es.id} references unknown structure ${es.structure}`
    );
  }
}

/* --------------------------------------------------
 * Build Structure Maps
 * -------------------------------------------------- */

const structureMap = new Map(
  structures.structures.map(s => [s.id, s])
);

const pesMap = new Map(
  pesTypes.pes_types.map(p => [p.id, p])
);

const esMap = new Map(
  esTypes.es_types.map(e => [e.id, e])
);

/* --------------------------------------------------
 * Interaction References
 * -------------------------------------------------- */

for (const interaction of Object.values(interactionRules.interactionRules)) {

  const pesType = interaction.conditions.pesType;
  const esType = interaction.conditions.esType;

  if (!pesIds.has(pesType)) {

    error(
      `${interaction.id} references unknown PES type ${pesType}`
    );
  }

  if (!esIds.has(esType)) {

    error(
      `${interaction.id} references unknown ES type ${esType}`
    );
  }

  for (const effectId of Object.keys(interaction.effects)) {

    if (!effectIds.has(effectId)) {

      error(
        `${interaction.id} references unknown effect ${effectId}`
      );
    }
  }
}

/* --------------------------------------------------
 * Effect Rule References
 * -------------------------------------------------- */

for (const interaction of Object.values(interactionRules.interactionRules)) {

  for (const [effectId, rules] of Object.entries(interaction.effects)) {

    for (const rule of rules) {

      if (!hazardIds.has(rule.hazard)) {

        error(
          `${interaction.id}/${effectId} references unknown hazard ${rule.hazard}`
        );
      }

      if (rule.status) {
        continue;
      }

      if (!distanceRuleIds.has(rule.distanceRule)) {

        error(
          `${interaction.id}/${effectId} references unknown distance rule ${rule.distanceRule}`
        );
      }

      if (!protectionLevelIds.has(rule.protectionLevel)) {

        error(
          `${interaction.id}/${effectId} references unknown protection level ${rule.protectionLevel}`
        );
      }

      for (const constraint of rule.constraints) {

        if (!constraintIds.has(constraint)) {

          error(
            `${interaction.id}/${effectId} references unknown constraint ${constraint}`
          );
        }
      }
    }
  }
}

/* --------------------------------------------------
 * Orientation Compatibility
 * -------------------------------------------------- */

for (const interaction of Object.values(interactionRules.interactionRules)) {

  const pes = pesMap.get(interaction.conditions.pesType);
  const es = esMap.get(interaction.conditions.esType);

  if (!pes || !es) continue;

  const pesStructure = structureMap.get(pes.structure);
  const esStructure = structureMap.get(es.structure);

  if (!pesStructure || !esStructure) continue;

  const pesOrientationType =
    interactionDimensions.orientationTypes[
      pesStructure.orientationType
    ];

  const esOrientationType =
    interactionDimensions.orientationTypes[
      esStructure.orientationType
    ];

  if (
    pesOrientationType &&
    !pesOrientationType.values.includes(
      interaction.conditions.orientation.pes
    )
  ) {

    error(
      `${interaction.id} uses invalid PES orientation '${interaction.conditions.orientation.pes}'`
    );
  }

  if (
    esOrientationType &&
    !esOrientationType.values.includes(
      interaction.conditions.orientation.es
    )
  ) {

    error(
      `${interaction.id} uses invalid ES orientation '${interaction.conditions.orientation.es}'`
    );
  }
}

/* --------------------------------------------------
 * Result
 * -------------------------------------------------- */

if (hasErrors) {

  console.error(
    "\n❌ Reference validation failed"
  );

  process.exit(1);
}

console.log(
  "✓ Reference validation passed"
);