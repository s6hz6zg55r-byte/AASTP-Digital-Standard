/**
 * =============================================================================
 * validateFormulasRepository.js
 * =============================================================================
 *
 * Layer 2 Repository Validator
 *
 * Validates the integrity of the Formula repository.
 *
 * Responsibilities
 * ----------------
 * - Validate Formula repository structure
 * - Validate engineering definitions
 * - Validate internal consistency
 *
 * This validator does NOT validate:
 * - Schema compliance (Layer 1)
 * - Formula execution (Service Layer)
 * - References from other datasets
 *
 * Validation Phases
 * -----------------
 * Phase 1 - Build Lookup Collections
 * Phase 2 - Validate Formula Structure
 * Phase 3 - Validate Solvability Definition
 * Phase 4 - Validate Engineering Units
 * Phase 5 - Validate Parameter Contract
 * Phase 6 - Validate Engineering Expressions
 * Phase 7 - Validate Formula Consistency
 *
 * Error Codes
 * -----------
 * FM001-FM009  Formula Structure
 * FM010-FM019  Solvability
 * FM020-FM029  Engineering Units
 * FM030-FM039  Parameter Contract
 * FM040-FM049  Engineering Expressions
 * FM050-FM059  Formula Consistency
 *
 * =============================================================================
 */

import repository
    from "../../repository/repository.js";

import { buildValidationResult }
    from "../utils/buildValidationResult.js";

import { addValidationError }
    from "../utils/addValidationError.js";

const VALIDATOR = {

    id: "VAL-L2-FM-001",

    name: "Formula Repository Integrity",

    layer: 2,

    dataset: "formulas"

};


/**
 * =============================================================================
 * validateFormulasRepository
 * =============================================================================
 */

export function validateFormulasRepository() {

    const errors = [];

    const warnings = [];

    const statistics = {};

    /*
    ==========================================================
    Phase 1
    Build Lookup Collections
    ==========================================================
    */

    const formulas =
        repository.getCollection("formulas");

    /*
    ==========================================================
    Phase 2
    Validate Formula Structure
    ==========================================================
    */

    validateFormulaStructure(
        formulas,
        statistics,
        errors
    );

    /*
    ==========================================================
    Phase 3
    Validate Solvability Definition
    ==========================================================
    */

    validateFormulaSolvability(
        formulas,
        statistics,
        errors
    );

    /*
    ==========================================================
    Phase 4
    Validate Engineering Units
    ==========================================================
    */

    validateEngineeringUnits(
        formulas,
        statistics,
        errors
    );

    /*
    ==========================================================
    Phase 5
    Validate Parameter Contract
    ==========================================================
    */

    validateParameterContract(
        formulas,
        statistics,
        errors
    );

    /*
    ==========================================================
    Phase 6
    Validate Engineering Expressions
    ==========================================================
    */

    validateEngineeringExpressions(
        formulas,
        statistics,
        errors
    );

    /*
    ==========================================================
    Phase 7
    Validate Formula Consistency
    ==========================================================
    */

    validateFormulaConsistency(
        formulas,
        statistics,
        errors
    );

    /*
    ==========================================================
    Build Validation Result
    ==========================================================
    */

    return buildValidationResult(

        VALIDATOR,

        errors,

        warnings,

        statistics

    );

}

/**
 * =============================================================================
 * validateFormulaStructure
 * =============================================================================
 *
 * Validates the repository structure of Formula definitions.
 *
 * Checks:
 * - Unique Formula IDs
 * - Unique Formula Codes
 * - Unique Formula Names
 * - Mandatory repository properties
 *
 * Error Codes
 * -----------
 * FM001 - Duplicate Formula ID
 * FM002 - Duplicate Formula Code
 * FM003 - Duplicate Formula Name
 * FM004 - Missing mandatory property
 *
 * =============================================================================
 */

function validateFormulaStructure(
    formulas,
    statistics,
    errors
) {
    statistics.formulasChecked = formulas.length;
    const ids = new Set();
    const codes = new Set();
    const names = new Set();
    for (const formula of formulas) {
        /*
        ==========================================================
        FM001
        Validate unique Formula ID
        ==========================================================
        */
        if (ids.has(formula.id)) {
            addValidationError(
                errors,
                "FM001",
                formula.id ?? "<unknown>",
                `Duplicate Formula ID '${formula.id}'.`
            );
        } else {
            ids.add(formula.id);
        }
        /*
        ==========================================================
        FM002
        Validate unique Formula Code
        ==========================================================
        */
        if (codes.has(formula.code)) {
            addValidationError(
                errors,
                "FM002",
                formula.id,
                `Duplicate Formula Code '${formula.code}'.`
            );
        } else {
            codes.add(formula.code);
        }
        /*
        ==========================================================
        FM003
        Validate unique Formula Name
        ==========================================================
        */
        if (names.has(formula.name)) {
            addValidationError(
                errors,
                "FM003",
                formula.id,
                `Duplicate Formula Name '${formula.name}'.`
            );
        } else {
            names.add(formula.name);
        }
        /*
        ==========================================================
        FM004
        Validate mandatory repository properties
        ==========================================================
        */
        const requiredProperties = [
            "id",
            "code",
            "name",
            "description",
            "solvable",
            "engineeringUnits",
            "parameters"
        ];
        for (const property of requiredProperties) {
            if (
                formula[property] === undefined ||
                formula[property] === null
            ) {
                addValidationError(
                    errors,
                    "FM004",
                    formula.id ?? "<unknown>",
                    `Missing mandatory property '${property}'.`
                );
            }
        }
    }
}

/**
 * =============================================================================
 * validateFormulaSolvability
 * =============================================================================
 *
 * Validates the Formula solvability definition.
 *
 * Checks:
 * - solvable.forward exists
 * - solvable.reverse exists
 * - forward is Boolean
 * - reverse is Boolean
 *
 * Error Codes
 * -----------
 * FM010 - Missing forward solvability
 * FM011 - Missing reverse solvability
 * FM012 - Invalid forward solvability
 * FM013 - Invalid reverse solvability
 *
 * =============================================================================
 */

function validateFormulaSolvability(
    formulas,
    statistics,
    errors
) {
    statistics.formulaSolvabilityChecked = formulas.length;
    statistics.forwardSolvabilityChecked = 0;
    statistics.reverseSolvabilityChecked = 0;
    for (const formula of formulas) {
        /*
        ==========================================================
        FM010
        Forward solvability present
        ==========================================================
        */
        if (formula.solvable?.forward === undefined) {
            addValidationError(
                errors,
                "FM010",
                formula.id,
                "Missing forward solvability."
            );
        } else {
            statistics.forwardSolvabilityChecked++;
        }
        /*
        ==========================================================
        FM011
        Reverse solvability present
        ==========================================================
        */
        if (formula.solvable?.reverse === undefined) {
            addValidationError(
                errors,
                "FM011",
                formula.id,
                "Missing reverse solvability."
            );
        } else {
            statistics.reverseSolvabilityChecked++;
        }
        /*
        ==========================================================
        FM012
        Forward solvability Boolean
        ==========================================================
        */
        if (
            formula.solvable?.forward !== undefined &&
            typeof formula.solvable.forward !== "boolean"
        ) {
            addValidationError(
                errors,
                "FM012",
                formula.id,
                "Forward solvability must be Boolean."
            );
        }
        /*
        ==========================================================
        FM013
        Reverse solvability Boolean
        ==========================================================
        */
        if (
            formula.solvable?.reverse !== undefined &&
            typeof formula.solvable.reverse !== "boolean"
        ) {
            addValidationError(
                errors,
                "FM013",
                formula.id,
                "Reverse solvability must be Boolean."
            );
        }
    }
}

/**
 * =============================================================================
 * validateEngineeringUnits
 * =============================================================================
 *
 * Validates the engineering units defined by each Formula.
 *
 * Checks:
 * - Forward engineering units exist when forward solvable
 * - Reverse engineering units exist when reverse solvable
 * - Input unit exists
 * - Output unit exists
 *
 * Error Codes
 * -----------
 * FM020 - Missing forward engineering units
 * FM021 - Missing reverse engineering units
 * FM022 - Missing forward input unit
 * FM023 - Missing forward output unit
 * FM024 - Missing reverse input unit
 * FM025 - Missing reverse output unit
 *
 * =============================================================================
 */

function validateEngineeringUnits(
    formulas,
    statistics,
    errors
) {
    statistics.engineeringUnitsChecked = formulas.length;
    statistics.forwardEngineeringUnitsChecked = 0;
    statistics.reverseEngineeringUnitsChecked = 0;
    for (const formula of formulas) {
        /*
        ==========================================================
        Forward Engineering Units
        ==========================================================
        */
        if (formula.solvable.forward) {
            const forward =
                formula.engineeringUnits?.forward;
            if (!forward) {
                addValidationError(
                    errors,
                    "FM020",
                    formula.id,
                    "Missing forward engineering units."
                );
            } else {
                statistics.forwardEngineeringUnitsChecked++;
                if (!forward.input) {
                    addValidationError(
                        errors,
                        "FM022",
                        formula.id,
                        "Missing forward input engineering unit."
                    );
                }
                if (!forward.output) {
                    addValidationError(
                        errors,
                        "FM023",
                        formula.id,
                        "Missing forward output engineering unit."
                    );
                }
            }
        }
        /*
        ==========================================================
        Reverse Engineering Units
        ==========================================================
        */
        if (formula.solvable.reverse) {
            const reverse =
                formula.engineeringUnits?.reverse;
            if (!reverse) {
                addValidationError(
                    errors,
                    "FM021",
                    formula.id,
                    "Missing reverse engineering units."
                );
            } else {
                statistics.reverseEngineeringUnitsChecked++;
                if (!reverse.input) {
                    addValidationError(
                        errors,
                        "FM024",
                        formula.id,
                        "Missing reverse input engineering unit."
                    );
                }
                if (!reverse.output) {
                    addValidationError(
                        errors,
                        "FM025",
                        formula.id,
                        "Missing reverse output engineering unit."
                    );
                }
            }
        }
    }
}

/**
 * =============================================================================
 * validateParameterContract
 * =============================================================================
 *
 * Validates the engineering parameter contract defined by each Formula.
 *
 * Checks:
 * - Forward parameter contract exists when forward solvable
 * - Reverse parameter contract exists when reverse solvable
 * - Input parameter exists
 * - Output parameter exists
 *
 * Error Codes
 * -----------
 * FM030 - Missing forward parameter contract
 * FM031 - Missing reverse parameter contract
 * FM032 - Missing forward input parameter
 * FM033 - Missing forward output parameter
 * FM034 - Missing reverse input parameter
 * FM035 - Missing reverse output parameter
 *
 * =============================================================================
 */

function validateParameterContract(
    formulas,
    statistics,
    errors
) {
    statistics.parameterContractsChecked = formulas.length;
    statistics.forwardParameterContractsChecked = 0;
    statistics.reverseParameterContractsChecked = 0;
    for (const formula of formulas) {
        /*
        ==========================================================
        Forward Parameter Contract
        ==========================================================
        */
        if (formula.solvable.forward) {
            const forward =
                formula.parameters?.forward;
            if (!forward) {
                addValidationError(
                    errors,
                    "FM030",
                    formula.id,
                    "Missing forward parameter contract."
                );
            } else {
                statistics.forwardParameterContractsChecked++;
                if (!forward.input) {
                    addValidationError(
                        errors,
                        "FM032",
                        formula.id,
                        "Missing forward input parameter."
                    );
                }
                if (!forward.output) {
                    addValidationError(
                        errors,
                        "FM033",
                        formula.id,
                        "Missing forward output parameter."
                    );
                }
            }
        }
        /*
        ==========================================================
        Reverse Parameter Contract
        ==========================================================
        */
        if (formula.solvable.reverse) {
            const reverse =
                formula.parameters?.reverse;
            if (!reverse) {
                addValidationError(
                    errors,
                    "FM031",
                    formula.id,
                    "Missing reverse parameter contract."
                );
            } else {
                statistics.reverseParameterContractsChecked++;
                if (!reverse.input) {
                    addValidationError(
                        errors,
                        "FM034",
                        formula.id,
                        "Missing reverse input parameter."
                    );
                }
                if (!reverse.output) {
                    addValidationError(
                        errors,
                        "FM035",
                        formula.id,
                        "Missing reverse output parameter."
                    );
                }
            }
        }
    }
}

/**
 * =============================================================================
 * validateEngineeringExpressions
 * =============================================================================
 *
 * Validates the engineering expressions defined by each Formula.
 *
 * Checks:
 * - Forward expression exists when forward solvable
 * - Reverse expression exists when reverse solvable
 * - Expressions are non-empty strings
 *
 * Error Codes
 * -----------
 * FM040 - Missing forward engineering expression
 * FM041 - Missing reverse engineering expression
 * FM042 - Invalid forward engineering expression
 * FM043 - Invalid reverse engineering expression
 * FM044 - Invalid expression owner
 *
 * =============================================================================
 */

function validateEngineeringExpressions(
    formulas,
    statistics,
    errors
) {
    statistics.engineeringExpressionsChecked = formulas.length;
    statistics.forwardExpressionsChecked = 0;
    statistics.reverseExpressionsChecked = 0;
    const validExpressionOwners = new Set(["formulas", "distanceRules"]);

    for (const formula of formulas) {
        const expressionOwner = formula.expressionOwner ?? "formulas";
        if (!validExpressionOwners.has(expressionOwner)) {
            addValidationError(
                errors,
                "FM044",
                formula.id,
                `Invalid expression owner '${expressionOwner}'.`
            );
            continue;
        }
    }

    for (const formula of formulas) {
        const expressionOwner = formula.expressionOwner ?? "formulas";
        /*
        ==========================================================
        Forward Engineering Expression
        ==========================================================
        */
        if (formula.solvable.forward && expressionOwner === "formulas") {
            if (formula.forwardExpression === undefined) {
                addValidationError(
                    errors,
                    "FM040",
                    formula.id,
                    "Missing forward engineering expression."
                );
            } else {
                statistics.forwardExpressionsChecked++;
                if (
                    typeof formula.forwardExpression !== "string" ||
                    formula.forwardExpression.trim() === ""
                ) {
                    addValidationError(
                        errors,
                        "FM042",
                        formula.id,
                        "Forward engineering expression must be a non-empty string."
                    );
                }
            }
        }
        /*
        ==========================================================
        Reverse Engineering Expression
        ==========================================================
        */
        if (formula.solvable.reverse && expressionOwner === "formulas") {
            if (formula.reverseExpression === undefined) {
                addValidationError(
                    errors,
                    "FM041",
                    formula.id,
                    "Missing reverse engineering expression."
                );
            } else {
                statistics.reverseExpressionsChecked++;
                if (
                    typeof formula.reverseExpression !== "string" ||
                    formula.reverseExpression.trim() === ""
                ) {
                    addValidationError(
                        errors,
                        "FM043",
                        formula.id,
                        "Reverse engineering expression must be a non-empty string."
                    );
                }
            }
        }
    }
}

/**
 * =============================================================================
 * validateFormulaConsistency
 * =============================================================================
 *
 * Validates the internal engineering consistency of Formula definitions.
 *
 * Error Codes
 * -----------
 * FM050 - Forward definition inconsistent with solvability
 * FM051 - Reverse definition inconsistent with solvability
 * FM052 - Expressions defined by incorrect owner
 *
 * =============================================================================
 */

function validateFormulaConsistency(
    formulas,
    statistics,
    errors
) {
    statistics.formulaConsistencyChecked = formulas.length;
    for (const formula of formulas) {
        const owner =
            formula.expressionOwner ?? "formulas";
        /*
        ==========================================================
        FM050
        Forward consistency
        ==========================================================
        */
        if (!formula.solvable.forward) {
            if (
                formula.engineeringUnits?.forward ||
                formula.parameters?.forward ||
                (owner === "formulas" &&
                    formula.forwardExpression !== undefined)
            ) {
                addValidationError(
                    errors,
                    "FM050",
                    formula.id,
                    "Forward engineering definition exists but forward solving is disabled."
                );
            }
        }
        /*
        ==========================================================
        FM051
        Reverse consistency
        ==========================================================
        */
        if (!formula.solvable.reverse) {
            if (
                formula.engineeringUnits?.reverse ||
                formula.parameters?.reverse ||
                (owner === "formulas" &&
                    formula.reverseExpression !== undefined)
            ) {
                addValidationError(
                    errors,
                    "FM051",
                    formula.id,
                    "Reverse engineering definition exists but reverse solving is disabled."
                );
            }
        }
        /*
        ==========================================================
        FM052
        Expression ownership
        ==========================================================
        */
        if (owner === "distanceRules") {
            if (
                formula.forwardExpression !== undefined ||
                formula.reverseExpression !== undefined
            ) {
                addValidationError(
                    errors,
                    "FM052",
                    formula.id,
                    "Expressions must not be defined when expressionOwner is 'distanceRules'."
                );
            }
        }
        /*
        ==========================================================
        FM053
        Formula-owned expressions
        ==========================================================
        */
        if (owner === "formulas") {
            if (
                formula.solvable.forward &&
                formula.forwardExpression === undefined
            ) {
                addValidationError(
                    errors,
                    "FM053",
                    formula.id,
                    "Formula-owned forward expression missing."
                );
            }
        }
    }
}