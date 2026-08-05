/**
 * =============================================================================
 * validateTransformationsSchema.js
 * =============================================================================
 *
 * Layer 1 Schema Validator
 *
 * Validates the transformations repository against transformations.schema.json.
 *
 * Responsibilities
 * ----------------
 * - Load schema definitions
 * - Compile JSON Schema
 * - Validate transformations.json
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

    id: "VAL-L1-TR-001",

    name: "Transformation Schema",

    layer: 1,

    dataset: "transformations"

};

export function validateTransformationsSchema() {
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
    const transformationsSchema = JSON.parse(
        fs.readFileSync(
            path.join(
                __dirname,
                "../../schemas/transformations.schema.json"
            ),
            "utf8"
        )
    );
    ajv.addSchema(commonSchema);
    /*
    ==========================================================
    Load Repository
    ==========================================================
    */
    const transformations = JSON.parse(
        fs.readFileSync(
            path.join(
                __dirname,
                "../../data/transformations.json"
            ),
            "utf8"
        )
    );
    /*
    ==========================================================
    Validate
    ==========================================================
    */
    const validate = ajv.compile(transformationsSchema);
    validate(transformations);

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
        transformationsChecked: transformations.transformations.length
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