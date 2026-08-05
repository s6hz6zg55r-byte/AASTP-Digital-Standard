/**
 * =============================================================================
 * validateDistanceRulesSchema.js
 * =============================================================================
 *
 * Layer 1 Schema Validator
 *
 * Validates the distance rules repository against distanceRules.schema.json.
 *
 * Responsibilities
 * ----------------
 * - Load schema definitions
 * - Compile JSON Schema
 * - Validate distanceRules.json
 * - Return standard ValidationResult
 *
 * This validator does NOT validate:
 * - Repository integrity
 * - Formula engineering consistency
 * - Cross-repository references
 *
 * =============================================================================
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

import { buildValidationResult } 
  from "../utils/buildValidationResult.js";
import { addValidationError } 
  from "../utils/addValidationError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VALIDATOR = {

    id: "VAL-L1-DR-001",

    layer: 1,

    dataset: "distance_rules",

    name: "Distance Rule Schema"
};

export function validateDistanceRulesSchema() {
  const errors = [];
  const warnings = [];
  /*
  ==========================================================
  Configure AJV
  ==========================================================
  */
  const ajv = new Ajv2020({
    allErrors: true,
    strict: false
  });

  addFormats(ajv);

  /*
  ==========================================================
  Load Schemas
  ==========================================================
  */
  const commonSchema = JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname, 
        "../../schemas/defs/common.schema.json"
      ),
      "utf8"
    )
  );
  const distanceRulesSchema = JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        "../../schemas/distanceRules.schema.json"
      ),
      "utf8"
    )
  );
  ajv.addSchema(commonSchema);
  ajv.addSchema(distanceRulesSchema);

  /*
  ==========================================================
  Load Repository
  ==========================================================
  */
  const distanceRules = JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
         "../../data/distanceRules.json"
      ),
      "utf8"
    )
  );

  /*
  ==========================================================
  Validate
  ==========================================================
  */
  const validate = ajv.compile(distanceRulesSchema);

  validate(distanceRules);

  const schemaErrors = (validate.errors ?? []);
    for (const error of schemaErrors) { 
      addValidationError(
      
        errors,
        
        "SCH001",
      
        error.instancePath || "<root>",
      
        error.message
    );
  }

  /*
  =========================================================
  Statistics
  ==========================================================
  */

  const statistics = {
    distanceRulesChecked: distanceRules.distance_rules.length,
  };

  /*
  ==========================================================
  Build Result
  ==========================================================
  */
  return buildValidationResult(
    
    VALIDATOR, 
    
    errors, 
    
    warnings, 
    
    statistics
  
  );

}







