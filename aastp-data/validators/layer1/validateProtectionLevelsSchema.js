/**
 * =============================================================================
 * validateProtectionLevelsSchema.js
 * =============================================================================
 *
 * Layer 1 Schema Validator
 *
 * Validates the protection levels repository against protectionLevels.schema.json.
 *
 * Responsibilities
 * ----------------
 * - Load schema definitions
 * - Compile JSON Schema
 * - Validate protectionLevels.json
 * - Return standard ValidationResult
 *
 * This validator does NOT validate:
 * - Repository integrity
 * - Formula engineering consistency
 * - Cross-repository references
 *
 * =============================================================================
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

import { buildValidationResult }
    from "../utils/buildValidationResult.js";
import { addValidationError }
    from "../utils/addValidationError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VALIDATOR = {

    id: "VAL-L1-PL-001",

    name: "Protection Levels Schema",

    layer: 1,

    dataset: "protection_levels"

};

export function validateProtectionLevelsSchema() {
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
    const protectionLevelsSchema = JSON.parse(
        fs.readFileSync(
            path.join(
                __dirname,
                "../../schemas/protectionLevels.schema.json"
            ),
            "utf8"
        )
    );
    ajv.addSchema(commonSchema);
    ajv.addSchema(protectionLevelsSchema);
    /*
    ==========================================================
    Load Repository
    ==========================================================
    */
    const protectionLevels = JSON.parse(
        fs.readFileSync(
            path.join(
                __dirname,
                "../../data/protectionLevels.json"
            ),
            "utf8"
        )
    );
    /*
    ==========================================================
    Validate
    ==========================================================
    */
    const validate = ajv.compile(protectionLevelsSchema);
    validate(protectionLevels);

    const schemaErrors = validate.errors ?? [];
    for (const error of schemaErrors) {
        addValidationError(

            errors,

            "SCH001",

            error.instancePath || "<root>",

            error.message
        );

    }
    /*
    ==========================================================
    Statistics
    ==========================================================
    */
    const statistics = {
        protectionLevelsChecked: protectionLevels.protection_levels.length
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