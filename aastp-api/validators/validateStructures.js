
const { loadRepository } = require("./utils/loadRepository");
const { validateUniqueIds } = require("./utils/validateUniqueIds");
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

  

  return {
    valid: errors.length = 0,
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
 * Helper
 * -------------------------------------------------- */

//function error(message) {
//  console.error(`❌ ${message}`);
//  hasErrors = true;
//}

/* --------------------------------------------------
 * Build lookup tables
 * -------------------------------------------------- */



/* --------------------------------------------------
 * Duplicate Detection
 * -------------------------------------------------- */

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
}

/* --------------------------------------------------
 * Orientation References
 * -------------------------------------------------- */

for (const structure of structures.structures) {

  if (!orientationTypes.has(structure.orientationType)) {
    error(
      `Structure ${structure.id} references unknown orientation type ${structure.orientationType}`
    );
  }
}

/* --------------------------------------------------
 * supportedProperties Validation
 * -------------------------------------------------- */


for (const structure of structures.structures) {

  const props = structure.supportedProperties;

  if (props === false) {
    continue;
  }

  for (const key of expectedProperties) {

    if (!(key in props)) {
      error(
        `${structure.id} missing supportedProperties.${key}`
      );
    }
  }
}

/* --------------------------------------------------
 * supportedExposure Validation
 * -------------------------------------------------- */

for (const structure of structures.structures) {

  const exposure = structure.supportedExposure;

  if (exposure === false) {
    continue;
  }

  if (!("category" in exposure)) {
    error(
      `${structure.id} missing supportedExposure.category`
    );
  }

  if (!("level" in exposure)) {
    error(
      `${structure.id} missing supportedExposure.level`
    );
  }
}

/* --------------------------------------------------
 * Category Validation
 * -------------------------------------------------- */

// Currently hardcoded but consider moving into it's own JSON file.


for (const structure of structures.structures) {

  if (!validCategories.includes(structure.category)) {

    error(
      `${structure.id} contains unknown category '${structure.category}'`
    );
  }
}

/* --------------------------------------------------
 * Result
 * -------------------------------------------------- */

if (hasErrors) {

  console.error(
    "\n❌ Structure validation failed"
  );

  process.exit(1);
}

console.log(
  "✓ Structure validation passed"
);