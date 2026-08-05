/**
 * =============================================================================
 * validateFormulasSchema.js
 * =============================================================================
 *
 * Layer 1 Schema Validator
 *
 * Validates the formulas repository against formulas.schema.json.
 *
 * Responsibilities
 * ----------------
 * - Load schema definitions
 * - Compile JSON Schema
 * - Validate formulas.json
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

    id: "VAL-L1-FM-001",

    name: "Formula Schema",

    layer: 1,

    dataset: "formulas"

};

export function validateFormulasSchema() {
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
    const formulasSchema = JSON.parse(
        fs.readFileSync(
            path.join(
                __dirname,
                "../../schemas/formulas.schema.json"
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
    const formulas = JSON.parse(
        fs.readFileSync(
            path.join(
                __dirname,
                "../../data/formulas.json"
            ),
            "utf8"
        )
    );
    /*
    ==========================================================
    Validate
    ==========================================================
    */
    const validate = ajv.compile(formulasSchema);
    validate(formulas);

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
        formulasChecked: formulas.formulas.length
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