/**
 * =============================================================================
 * validateEsTypesSchema.js
 * =============================================================================
 *
 * Layer 1 Schema Validator
 *
 * Validates the esTypes repository against esTypes.schema.json.
 *
 * Responsibilities
 * ----------------
 * - Load schema definitions
 * - Compile JSON Schema
 * - Validate esTypes.json
 * - Return standard ValidationResult
 *
 * This validator does NOT validate:
 * - Repository integrity
 * - Engineering resolution consistency
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

    id: "VAL-L1-ES-001",

    name: "ES Types Schema",

    layer: 1,

    dataset: "es_types"

};

export function validateEsTypesSchema() {
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
    const esTypesSchema = JSON.parse(
        fs.readFileSync(
            path.join(
                __dirname,
                "../../schemas/esTypes.schema.json"
            ),
            "utf8"
        )
    );
    ajv.addSchema(commonSchema);
    ajv.addSchema(esTypesSchema);
    /*
    ==========================================================
    Load Repository
    ==========================================================
    */
    const esTypes = JSON.parse(
        fs.readFileSync(
            path.join(
                __dirname,
                "../../data/esTypes.json"
            ),
            "utf8"
        )
    );
    /*
    ==========================================================
    Validate
    ==========================================================
    */
    const validate = ajv.compile(esTypesSchema);
    validate(esTypes);

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
        esTypesChecked: esTypes.es_types.length
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