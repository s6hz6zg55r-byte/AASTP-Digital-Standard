
const { loadRepository } = require("../utils/loadRepository");
const { validateUniqueIds } = require("../utils/validateUniqueIds");
const expectedProperties = [
  "protectionLevel",
  "headwall",
  "barricaded",
  "roofType",
  "aperture"
];
const validCategories = [
  "explosives_facility",
  "personnel_facility",
  "transport_route",
  "vulnerable_structure",
  "utility",
  "infrastructure"
];


function validateStructures(repository = loadRepository()) {
  const errors = [];
  const warnings = [];
  const {
    structures,
    interactionDimensions
  } = repository;

  validateDataset(structures, errors);

  const orientationTypes = new Set(
    Object.keys(interactionDimensions.orientationTypes));
  validateUniqueIds(structures.structures, errors, "structure");
  supportedExposure(errors, warnings, structures);
  structureCategories(errors, warnings, structures);

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

function validateDataset(structures, errors) {
  if (!structures.schemaVersion) {
    errors.push(
      "Missing schemaVersion"
    );
  }
  if (!structures.metadata) {
    errors.push(
      "Missing metadata"
    );
  }
  if (!Array.isArray(structures.structures)) {
    errors.push(
      "structures must be an array"
    );
    return;
  }
  if (structures.structures.length === 0) {
    errors.push(
      "structures array cannot be empty"
    );
  }
}


/* --------------------------------------------------
 * Duplicate Detection
 * -------------------------------------------------- 

const ids = new Set();
const codes = new Set();

for (const structure of structures.structures) {

  if (ids.has(structure.id)) {
    error(`Duplicate structure id: ${structure.id}`);
  }

  ids.add(structure.id);

  if (codes.has(structure.code)) {
    error(`Duplicate structure code: ${structure.code}`);
  }

  codes.add(structure.code);
}*/

// Checks that the orientation types for the structrure are valid
function structureOrientation(errors, warnings, structures, orientationTypes) {
  for (const structure of structures.structures) {

    if (!orientationTypes.has(structure.orientationType)) {
      errors.push(
        `Structure ${structure.id} references unknown orientation type ${structure.orientationType}`
      );
    }
  }
}

// Checks that the expected structure properties have been set 
function supportedProperties(errors, warnings, structures) {
  for (const structure of structures.structures) {

    const props = structure.supportedProperties;

    if (props === false) {
      continue;
    }

    for (const key of expectedProperties) {

      if (!(key in props)) {
        errors.push(
          `${structure.id} missing supportedProperties.${key}`
        );
      }
    }
  }
}

// Checks that the structures exposure is valid
function supportedExposure (errors, warnings, structures) {
  for (const structure of structures.structures) {

    const exposure = structure.supportedExposure;

    if (exposure === false) {
      continue;
    }

    if (!("category" in exposure)) {
      errors.push(
        `${structure.id} missing supportedExposure.category`
      );
    }

    if (!("level" in exposure)) {
      errors.push(
        `${structure.id} missing supportedExposure.level`
      );
    }
  }
}


// Checks to determine if the category assigned to the structure is valid.
function structureCategories(errors, warnings, structures) {
  for (const structure of structures.structures) {
    if (!validCategories.includes(structure.category)) {
      errors.push(
        `${structure.id} contains unknown category '${structure.category}'`
      );
    }
  }
}

/* --------------------------------------------------
 * Result
 * -------------------------------------------------- */

const result = validateStructures();

if (result.valid) {

    console.log(
        "✓ Structures validation passed"
    );

} else {

    console.error(
        "Structures Validation Errors:"
    );

    result.errors.forEach(
        error =>
            console.error(
                `  - ${error}`
            )
    );

    process.exit(1);
}