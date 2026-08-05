/**
 * =============================================================================
 * validateEcmProtectionRatingsSchema.js
 * =============================================================================
 *
 * Layer 1 Schema Validator
 *
 * Validates the ECM protection ratings repository against ecmProtectionRatings.schema.json.
 *
 * Responsibilities
 * ----------------
 * - Load schema definitions
 * - Compile JSON Schema
 * - Validate ecmProtectionRatings.json
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

    id: "VAL-L1-PR-001",

    name: "ECM Protection Ratings Schema",

    layer: 1,

    dataset: "ecm_protection_ratings"

};

export function validateEcmProtectionRatingsSchema() {
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
    const ecmProtectionRatingsSchema = JSON.parse(
        fs.readFileSync(
            path.join(
                __dirname,
                "../../schemas/ecmProtectionRatings.schema.json"
            ),
            "utf8"
        )
    );
    ajv.addSchema(commonSchema);
    ajv.addSchema(ecmProtectionRatingsSchema);
    /*
    ==========================================================
    Load Repository
    ==========================================================
    */
    const ecmProtectionRatings = JSON.parse(
        fs.readFileSync(
            path.join(
                __dirname,
                "../../data/ecmProtectionRatings.json"
            ),
            "utf8"
        )
    );
    /*
    ==========================================================
    Validate
    ==========================================================
    */
    const validate = ajv.compile(ecmProtectionRatingsSchema);
    validate(ecmProtectionRatings);

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
        ecmProtectionRatingsChecked: ecmProtectionRatings.ecm_protection_ratings.length
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