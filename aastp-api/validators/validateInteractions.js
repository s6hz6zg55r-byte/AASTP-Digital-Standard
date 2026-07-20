const { loadRepository } = require("./utils/loadRepository");

function validateInteractions(repository = loadRepository()) {
  const {interactions} = repository;
  const errors = [];
  const warnings = [];
  const interactionRules = interactions.interactionRules;

  Object.entries(interactionRules).forEach(
    ([ruleKey, rule]) => validateInteraction(ruleKey, rule, errors, warnings)
  );

  validateDuplicateIds(interactionRules);
  validateDuplicateConditions(interactionRules);

  return {
      valid: errors.length === 0,
      errors,
      warnings
  };
}

function validateInteraction(ruleKey, rule, errors, warnings) {
  
  validateRequiredFields(ruleKey, rule, errors, warnings);

  validateConditions(ruleKey, rule, errors, warnings);

  validateEffects(ruleKey, rule, errors, warnings);

}

function validateRequiredFields(ruleKey, rule, errors, warnings) {
  const requiredFields = [
    "id",
    "source",
    "conditions",
    "effects"
  ];

  requiredFields.forEach(field => {
    if (!(field in rule)) {
      errors.push(
        `${ruleKey}: missing required field '${field}'`
      );
    }
  })
}

function validateConditions(ruleKey, rule, errors, warnings) {
  const conditions = rule.conditions;

  if (!conditions.pesType) {
    errors.push(
      `${ruleKey}: missing conditions.pesType`
    );
  }

  if (!conditions.esType) {
    errors.push(
      `${ruleKey}: missing conditions.esType`
    );
  }

  if (!conditions.orientation) {
    errors.push(
      `${ruleKey}: missing conditions.orientation`
    );
  } else {

    if (!conditions.orientation.pes) {
      errors.push(
        `${ruleKey}: missing conditions.orientation.pes`
      );
    }

    if (!conditions.orientation.es) {
      errors.push(
        `${ruleKey}: missing conditions.orientation.es`
      );
    }
  }
}

function validateEffects(ruleKey, rule, errors, warnings) {
  if (!isObject(rule.effects)) {
    error(`${ruleKey}: effects must be an object`);
    return;
  }
  validateEffectArray(ruleKey, rule, errors, warnings);
}

function validateEffectArray(ruleKey, rule, errors, warnings) {
  Object.entries(rule.effects).forEach(
    ([effectId, effectEntries]) => {

      if (!Array.isArray(effectEntries)) {
        errors.push(
          `${ruleKey}.effects.${effectId}: must be an array`
        );
        return;
      }
      validateEffectEntry(ruleKey, effectId, effectEntries, errors, warnings);      
    }
  );
}


function validateEffectEntry(ruleKey, effectId, effectEntries, errors, warnings) {
  const seenEntries = new Set();

      effectEntries.forEach((entry, index) => {

        const location =
          `${ruleKey}.${effectId}[${index}]`;

        // -------------------------------------------------------------------
        // Hazard Required
        // -------------------------------------------------------------------

        if (!entry.hazard) {
          errors.push(`${location}: missing hazard`);
        }

        // -------------------------------------------------------------------
        // Status XOR Distance Rule
        // -------------------------------------------------------------------

        const hasStatus =
          Object.prototype.hasOwnProperty.call(
            entry,
            "status"
          );

        const hasDistanceRule =
          Object.prototype.hasOwnProperty.call(
            entry,
            "distanceRule"
          );

        if (hasStatus && hasDistanceRule) {
          errors.push(
            `${location}: cannot contain both status and distanceRule`
          );
        }

        if (!hasStatus && !hasDistanceRule) {
          errors.push(
            `${location}: must contain either status or distanceRule`
          );
        }

        // -------------------------------------------------------------------
        // Validate Entry Type
        // -------------------------------------------------------------------

        if (hasStatus) {
          validateStatusEntry(
            entry,
            location
          );
        }

        if (hasDistanceRule) {
          validateDistanceEntry(
            entry,
            location
          );
        }

        // -------------------------------------------------------------------
        // Duplicate Entry Detection
        // -------------------------------------------------------------------

        const signature = JSON.stringify(entry);

        if (seenEntries.has(signature)) {
          warnings.push(
            `${location}: duplicate effect entry`
          );
        }

        seenEntries.add(signature);
      });
}

// Validation Helper. Identifies if any of the rules have duplicate IDs
function validateDuplicateIds(interactionRules) {

  const ids = new Set();

  Object.entries(interactionRules).forEach(
    ([ruleKey, rule]) => {

      if (!rule.id) return;

      if (ids.has(rule.id)) {
        error(
          `${ruleKey}: duplicate interaction id '${rule.id}'`
        );

      } else {
        ids.add(rule.id);
      }
    }
  );
}

// Validation Helper. Identifies if any of the rules have duplicated conditions
function validateDuplicateConditions(interactionRules) {

  const conditionMap = new Map();

  Object.entries(interactionRules).forEach(
    ([ruleKey, rule]) => {

      if (!rule.conditions) return;

      const c = rule.conditions;

      const signature = [
        c.pesType,
        c.esType,
        c.orientation?.pes,
        c.orientation?.es
      ].join("|");

      if (conditionMap.has(signature)) {

        error(
          `${ruleKey}: duplicate interaction conditions with ${conditionMap.get(signature)}`
        );

      } else {

        conditionMap.set(
          signature,
          ruleKey
        );
      }
    }
  );
}

function isObject(value) {
  return value !== null &&
         typeof value === "object" &&
         !Array.isArray(value);
}

function validateStatusEntry(entry, location) {

  const forbiddenFields = [
    "distanceRule",
    "inputBasis",
    "protectionLevel",
    "constraints"
  ];

  forbiddenFields.forEach(field => {
    if (field in entry) {
      error(
        `${location}: status entry cannot contain '${field}'`
      );
    }
  });
}

function validateDistanceEntry(entry, location) {

  const requiredFields = [
    "distanceRule",
    "inputBasis",
    "protectionLevel",
    "constraints"
  ];

  requiredFields.forEach(field => {
    if (!(field in entry)) {
      error(
        `${location}: missing '${field}'`
      );
    }
  });

  if (
    "constraints" in entry &&
    !Array.isArray(entry.constraints)
  ) {
    error(
      `${location}: constraints must be an array`
    );
  }
}


const result = validateInteractions();

// Generate results output
console.log("\n=== Interaction Rules Validation ===\n");

if (result.errors.length === 0) {
  console.log("✓ No validation errors found");
} else {
  console.log(`✗ ${result.errors.length} error(s)\n`);
  result.errors.forEach(error => console.log(error));
}

if (result.warnings.length > 0) {

  console.log(
    `\n⚠ ${result.warnings.length} warning(s)\n`
  );

  result.warnings.forEach(
    warning => console.log(warning)
  );
}

console.log("\nValidation complete.\n");

process.exit(result.errors.length > 0 ? 1 : 0);