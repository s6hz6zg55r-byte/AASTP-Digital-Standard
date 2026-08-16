/**
 * =============================================================================
 * validateTransformationsRepository.js
 * =============================================================================
 *
 * Layer 2 Repository Validator
 *
 * Validates the integrity of the Transformation repository.
 *
 * Responsibilities
 * ----------------
 * - Validate Transformation repository structure
 * - Validate engineering expressions
 * - Validate repository consistency
 *
 * This validator does NOT validate:
 * - Schema compliance (Layer 1)
 * - Expression execution (Service Layer)
 * - References from other datasets
 *
 * Validation Phases
 * -----------------
 * Phase 1 - Build Lookup Collections
 * Phase 2 - Validate Repository Structure
 * Phase 3 - Validate Transformation Expressions
 * Phase 4 - Validate Expression Syntax
 * Phase 5 - Validate Function Contracts
 * Phase 6 - Validate Repository Consistency
 *
 * Error Codes
 * -----------
 * TR001-TR009  Repository Structure
 * TR010-TR019  Transformation Expressions
 * TR020-TR029  Expression Syntax
 * TR030-TR039  Function Contracts
 * TR040-TR049  Repository Consistency
 *
 * =============================================================================
 */

import repository
    from "../../repository/repository.js";

import { buildValidationResult }
    from "../utils/buildValidationResult.js";

import { addValidationError }
    from "../utils/addValidationError.js";

import { addValidationWarning }
    from "../utils/addValidationWarning.js";
    
import { TRANSFORMATION_FUNCTIONS }
    from "../../constants/engineeringConstants.js";

const VALIDATOR = {

    id: "VAL-L2-TR-001",

    name: "Transformation Repository Integrity",

    layer: 2,

    dataset: "transformations"

};


/**
 * =============================================================================
 * validateTransformationsRepository
 * =============================================================================
 */

export function validateTransformationsRepository() {

    const errors = [];

    const warnings = [];

    const statistics = {};

    /*
    ==========================================================
    Phase 1
    Build Lookup Collections
    ==========================================================
    */

    const transformations =
        repository.getCollection("transformations");

    /*
    ==========================================================
    Phase 2
    Validate Repository Structure
    ==========================================================
    */

    validateTransformationStructure(
        transformations,
        statistics,
        errors
    );

    /*
    ==========================================================
    Phase 3
    Validate Transformation Expressions
    ==========================================================
    */

    validateTransformationExpressions(
        transformations,
        statistics,
        errors
    );

    /*
    ==========================================================
    Phase 4
    Validate Expression Syntax
    ==========================================================
    */

    validateExpressionSyntax(
        transformations,
        statistics,
        errors
    );

    /*
    ==========================================================
    Phase 5
    Validate Function Contracts
    ==========================================================
    */

    validateFunctionContracts(
        transformations,
        statistics,
        errors
    );

    /*
    ==========================================================
    Phase 6
    Validate Repository Consistency
    ==========================================================
    */

    validateTransformationConsistency(
        transformations,
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
 * validateTransformationStructure
 * =============================================================================
 *
 * Phase 2 Helper Function
 *
 * Validates the structural integrity of the Transformation repository.
 *
 * Responsibilities
 * ----------------
 * - Validate unique Transformation IDs
 * - Validate unique Transformation names
 * - Validate mandatory repository properties
 * - Update validation statistics
 *
 * Error Codes
 * -----------
 * TR001  Duplicate Transformation ID
 * TR002  Duplicate Transformation Name
 * TR003  Missing mandatory property
 *
 * =============================================================================
 */

function validateTransformationStructure(
    transformations,
    statistics,
    errors
) {
    const ids = new Set();
    const names = new Set();
    statistics.transformationsChecked = 0;
    statistics.uniqueIdsChecked = 0;
    statistics.uniqueNamesChecked = 0;
    for (const transformation of transformations) {
        statistics.transformationsChecked++;
        /*
        ----------------------------------------------------------
        Mandatory Properties
        ----------------------------------------------------------
        */
        if (!transformation.id) {
            addValidationError(
                errors,
                "TR003",
                "<unknown>",
                "Transformation is missing required property 'id'."
            );
            continue;
        }
        if (!transformation.name) {
            addValidationError(
                errors,
                "TR003",
                transformation.id,
                "Transformation is missing required property 'name'."
            );
        }
        if (!transformation.expression) {
            addValidationError(
                errors,
                "TR003",
                transformation.id,
                "Transformation is missing required property 'expression'."
            );
        }
        /*
        ----------------------------------------------------------
        Unique ID
        ----------------------------------------------------------
        */
        if (ids.has(transformation.id)) {
            addValidationError(
                errors,
                "TR001",
                transformation.id,
                `Duplicate Transformation ID '${transformation.id}'.`
            );
        }
        else {
            ids.add(transformation.id);
            statistics.uniqueIdsChecked++;
        }
        /*
        ----------------------------------------------------------
        Unique Name
        ----------------------------------------------------------
        */
        if (names.has(transformation.name)) {
            addValidationError(
                errors,
                "TR002",
                transformation.id,
                `Duplicate Transformation name '${transformation.name}'.`
            );
        }
        else {
            names.add(transformation.name);
            statistics.uniqueNamesChecked++;
        }
    }
}


/**
 * =============================================================================
 * validateTransformationExpressions
 * =============================================================================
 *
 * Phase 3 Helper Function
 *
 * Validates the engineering expressions defined for each Transformation.
 *
 * Responsibilities
 * ----------------
 * - Validate expression exists
 * - Validate expression is a string
 * - Validate expression is not empty
 * - Update validation statistics
 *
 * Error Codes
 * -----------
 * TR010  Missing transformation expression
 * TR011  Invalid transformation expression
 *
 * =============================================================================
 */

function validateTransformationExpressions(
    transformations,
    statistics,
    errors
) {
    statistics.expressionsChecked = 0;
    for (const transformation of transformations) {
        statistics.expressionsChecked++;
        /*
        ----------------------------------------------------------
        Expression Exists
        ----------------------------------------------------------
        */
        if (transformation.expression === undefined) {
            addValidationError(
                errors,
                "TR010",
                transformation.id,
                "Transformation is missing an expression."
            );
            continue;
        }
        /*
        ----------------------------------------------------------
        Expression Type
        ----------------------------------------------------------
        */
        if (typeof transformation.expression !== "string") {
            addValidationError(
                errors,
                "TR011",
                transformation.id,
                "Transformation expression must be a string."
            );
            continue;
        }
        /*
        ----------------------------------------------------------
        Empty Expression
        ----------------------------------------------------------
        */
        if (transformation.expression.trim() === "") {
            addValidationError(
                errors,
                "TR011",
                transformation.id,
                "Transformation expression cannot be empty."
            );
        }
    }
}


/**
 * =============================================================================
 * validateExpressionSyntax
 * =============================================================================
 *
 * Phase 4 Helper Function
 *
 * Validates the syntax of Transformation expressions.
 *
 * Responsibilities
 * ----------------
 * - Validate expression syntax
 * - Validate balanced parentheses
 * - Validate parameter list
 * - Update validation statistics
 *
 * Error Codes
 * -----------
 * TR020  Invalid transformation expression syntax
 * TR021  Invalid parameter list
 *
 * =============================================================================
 */

function validateExpressionSyntax(
    transformations,
    statistics,
    errors
) {
    statistics.expressionSyntaxChecked = 0;
    for (const transformation of transformations) {
        statistics.expressionSyntaxChecked++;
        const expression = transformation.expression.trim();
        /*
        ----------------------------------------------------------
        Function Call
        ----------------------------------------------------------
        */
        const open = expression.indexOf("(");
        const close = expression.lastIndexOf(")");
        if (open < 1 || close < open) {
            addValidationError(
                errors,
                "TR020",
                transformation.id,
                "Invalid transformation expression syntax."
            );
            continue;
        }
        /*
        ----------------------------------------------------------
        Balanced Parentheses
        ----------------------------------------------------------
        */
        const opens =
            [...expression].filter(c => c === "(").length;
        const closes =
            [...expression].filter(c => c === ")").length;
        if (opens !== closes) {
            addValidationError(
                errors,
                "TR020",
                transformation.id,
                "Unbalanced parentheses in transformation expression."
            );
            continue;
        }
        /*
        ----------------------------------------------------------
        Parameter List
        ----------------------------------------------------------
        */
        const parameters = expression
            .substring(open + 1, close)
            .trim();
        if (parameters.length === 0) {
            addValidationError(
                errors,
                "TR021",
                transformation.id,
                "Transformation expression contains an empty parameter list."
            );
        }
    }
}


/**
 * =============================================================================
 * validateFunctionContracts
 * =============================================================================
 *
 * Phase 5 Helper Function
 *
 * Validates the engineering contract of each Transformation function.
 *
 * Responsibilities
 * ----------------
 * - Validate supported Transformation functions
 * - Validate expected parameter count
 * - Validate expected parameter names
 * - Update validation statistics
 *
 * Error Codes
 * -----------
 * TR030  Unsupported Transformation function
 * TR031  Invalid parameter count
 * TR032  Invalid parameter names
 *
 * =============================================================================
 */

function validateFunctionContracts(
    transformations,
    statistics,
    errors
) {
    statistics.functionContractsChecked = 0;
    for (const transformation of transformations) {
        statistics.functionContractsChecked++;
        const expression = transformation.expression.trim();
        const open = expression.indexOf("(");
        const close = expression.lastIndexOf(")");
        const functionName =
            expression.substring(0, open).trim();
        const parameters =
            expression
                .substring(open + 1, close)
                .split(",")
                .map(parameter => parameter.trim());
        /*
        ----------------------------------------------------------
        Supported Function
        ----------------------------------------------------------
        */
        if (!(functionName in TRANSFORMATION_FUNCTIONS)) {
            addValidationError(
                errors,
                "TR030",
                transformation.id,
                `Unsupported Transformation function '${functionName}'.`
            );
            continue;
        }
        const expectedParameters =
            TRANSFORMATION_FUNCTIONS[functionName];
        /*
        ----------------------------------------------------------
        Parameter Count
        ----------------------------------------------------------
        */
        if (parameters.length !== expectedParameters.length) {
            addValidationError(
                errors,
                "TR031",
                transformation.id,
                `Function '${functionName}' expects ${expectedParameters.length} parameter(s).`
            );
            continue;
        }
        /*
        ----------------------------------------------------------
        Parameter Names
        ----------------------------------------------------------
        */
        for (let index = 0; index < expectedParameters.length; index++) {
            if (parameters[index] !== expectedParameters[index]) {
                addValidationError(
                    errors,
                    "TR032",
                    transformation.id,
                    `Parameter ${index + 1} should be '${expectedParameters[index]}'.`
                );
            }
        }
    }
}


/**
 * =============================================================================
 * validateTransformationConsistency
 * =============================================================================
 *
 * Phase 6 Helper Function
 *
 * Validates overall repository consistency.
 *
 * Responsibilities
 * ----------------
 * - Validate repository is not empty
 * - Identify duplicate Transformation expressions
 * - Update validation statistics
 *
 * Error Codes
 * -----------
 * TR040  Repository contains no Transformations
 *
 * Warning Codes
 * -------------
 * TRW001 Duplicate Transformation expression
 *
 * =============================================================================
 */

function validateTransformationConsistency(
    transformations,
    statistics,
    errors,
    warnings
) {
    statistics.repositoryConsistencyChecked = 0;
    statistics.uniqueExpressionsChecked = 0;
    /*
    ----------------------------------------------------------
    Repository Empty
    ----------------------------------------------------------
    */
    if (transformations.length === 0) {
        addValidationError(
            errors,
            "TR040",
            "<repository>",
            "Transformation repository contains no Transformations."
        );
        return;
    }
    statistics.repositoryConsistencyChecked++;
    /*
    ----------------------------------------------------------
    Duplicate Expressions
    ----------------------------------------------------------
    */
    const expressions = new Set();
    for (const transformation of transformations) {
        if (expressions.has(transformation.expression)) {
            addValidationWarning(
                warnings,
                "TRW001",
                transformation.id,
                `Duplicate Transformation expression '${transformation.expression}'.`
            );
        }
        else {
            expressions.add(transformation.expression);
            statistics.uniqueExpressionsChecked++;
        }
    }
}