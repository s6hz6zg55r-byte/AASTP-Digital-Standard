/**
 * =============================================================================
 * validateConstraintsRepository.js
 * =============================================================================
 *
 * Layer 2 Repository Validator
 *
 * Validates the integrity of the Constraints repository.
 *
 * Responsibilities
 * ----------------
 * - Validate repository structure
 * - Validate engineering definitions
 * - Validate controlled vocabulary
 * - Validate source references
 * - Validate repository consistency
 *
 * This validator does NOT validate:
 * - Schema compliance (Layer 1)
 * - References from other datasets
 *
 * Validation Phases
 * -----------------
 * Phase 1 - Build Lookup Collections
 * Phase 2 - Validate Repository Structure
 * Phase 3 - Validate Constraint Definitions
 * Phase 4 - Validate Controlled Vocabulary
 * Phase 5 - Validate Source References
 * Phase 6 - Validate Repository Consistency
 *
 * =============================================================================
 */

import repository
    from "../../repository/repository.js";

import {
    VALIDATORS,
    ERROR_CODES,
    WARNING_CODES
}
    from "../../constants/validationConstants.js";

import {
    CONSTRAINT_CATEGORIES
}
    from "../../constants/engineeringConstants.js";

import {
    buildValidationResult
}
    from "../utils/buildValidationResult.js";

import {
    addValidationError
}
    from "../utils/addValidationError.js";

import {
    addValidationWarning
}
    from "../utils/addValidationWarning.js";


const VALIDATOR = {

    id: VALIDATORS.CONSTRAINTS_REPOSITORY,

    name: "Constraint Repository Integrity",

    layer: 2,

    dataset: "constraints"

};


/**
 * =============================================================================
 * validateConstraintsRepository
 * =============================================================================
 */

export function validateConstraintsRepository() {

    const errors = [];

    const warnings = [];

    const statistics = {};

    /*
    ==========================================================
    Phase 1
    Build Lookup Collections
    ==========================================================
    */

    const constraints =
        repository.getCollection("constraints");

    /*
    ==========================================================
    Phase 2
    Validate Repository Structure
    ==========================================================
    */

    validateConstraintStructure(

        constraints,

        statistics,

        errors

    );

    /*
    ==========================================================
    Phase 3
    Validate Constraint Definitions
    ==========================================================
    */

    validateConstraintDefinitions(

        constraints,

        statistics,

        errors

    );

    /*
    ==========================================================
    Phase 4
    Validate Controlled Vocabulary
    ==========================================================
    */

    validateControlledVocabulary(

        constraints,

        statistics,

        errors

    );

    /*
    ==========================================================
    Phase 5
    Validate Source References
    ==========================================================
    */

    validateSourceReferences(

        constraints,

        statistics,

        errors

    );

    /*
    ==========================================================
    Phase 6
    Validate Repository Consistency
    ==========================================================
    */

    validateConstraintConsistency(

        constraints,

        statistics,

        errors,

        warnings

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
 * validateConstraintStructure
 * =============================================================================
 *
 * Phase 2 Helper Function
 *
 * Validates the structural integrity of the Constraints repository.
 *
 * Responsibilities
 * ----------------
 * - Validate unique Constraint IDs
 * - Validate unique Constraint Codes
 * - Validate unique Constraint Names
 * - Validate mandatory properties
 * - Update validation statistics
 *
 * Error Codes
 * -----------
 * CV001  Duplicate Constraint ID
 * CV002  Duplicate Constraint Code
 * CV003  Duplicate Constraint Name
 * CV004  Missing mandatory property
 *
 * =============================================================================
 */

function validateConstraintStructure(
    constraints,
    statistics,
    errors
) {
    const ids = new Set();
    const codes = new Set();
    const names = new Set();
    statistics.constraintsChecked = 0;
    statistics.uniqueIdsChecked = 0;
    statistics.uniqueCodesChecked = 0;
    statistics.uniqueNamesChecked = 0;
    for (const constraint of constraints) {
        statistics.constraintsChecked++;
        /*
        ----------------------------------------------------------
        Mandatory Properties
        ----------------------------------------------------------
        */
        if (!constraint.id) {
            addValidationError(
                errors,
                ERROR_CODES.CV004,
                "<unknown>",
                "Constraint is missing required property 'id'."
            );
            continue;
        }
        if (!constraint.code) {
            addValidationError(
                errors,
                ERROR_CODES.CV004,
                constraint.id,
                "Constraint is missing required property 'code'."
            );
        }
        if (!constraint.category) {
            addValidationError(
                errors,
                ERROR_CODES.CV004,
                constraint.id,
                "Constraint is missing required property 'category'."
            );
        }
        if (!constraint.name) {
            addValidationError(
                errors,
                ERROR_CODES.CV004,
                constraint.id,
                "Constraint is missing required property 'name'."
            );
        }
        if (!constraint.description) {
            addValidationError(
                errors,
                ERROR_CODES.CV004,
                constraint.id,
                "Constraint is missing required property 'description'."
            );
        }
        if (!constraint.source) {
            addValidationError(
                errors,
                ERROR_CODES.CV004,
                constraint.id,
                "Constraint is missing required property 'source'."
            );
        }

        /*
        ----------------------------------------------------------
        Unique Constraint ID
        ----------------------------------------------------------
        */

        if (ids.has(constraint.id)) {

            addValidationError(

                errors,

                ERROR_CODES.CV001,

                constraint.id,

                `Duplicate Constraint ID '${constraint.id}'.`

            );

        }
        else {

            ids.add(constraint.id);

            statistics.uniqueIdsChecked++;

        }

        /*
        ----------------------------------------------------------
        Unique Constraint Code
        ----------------------------------------------------------
        */

        if (codes.has(constraint.code)) {

            addValidationError(

                errors,

                ERROR_CODES.CV002,

                constraint.id,

                `Duplicate Constraint code '${constraint.code}'.`

            );

        }
        else {

            codes.add(constraint.code);

            statistics.uniqueCodesChecked++;

        }

        /*
        ----------------------------------------------------------
        Unique Constraint Name
        ----------------------------------------------------------
        */

        if (names.has(constraint.name)) {

            addValidationError(

                errors,

                ERROR_CODES.CV003,

                constraint.id,

                `Duplicate Constraint name '${constraint.name}'.`

            );

        }
        else {

            names.add(constraint.name);

            statistics.uniqueNamesChecked++;

        }

    }

}


/**
 * =============================================================================
 * validateConstraintDefinitions
 * =============================================================================
 *
 * Phase 3 Helper Function
 *
 * Validates the engineering definitions contained within the Constraints
 * repository.
 *
 * Responsibilities
 * ----------------
 * - Validate descriptions
 * - Validate source objects
 * - Update validation statistics
 *
 * Error Codes
 * -----------
 * CV010  Missing description
 * CV011  Missing source
 *
 * =============================================================================
 */

function validateConstraintDefinitions(
    constraints,
    statistics,
    errors
) {
    statistics.definitionsChecked = 0;
    for (const constraint of constraints) {
        statistics.definitionsChecked++;
        /*
        ----------------------------------------------------------
        Description
        ----------------------------------------------------------
        */
        if (constraint.description === undefined) {
            addValidationError(
                errors,
                ERROR_CODES.CV010,
                constraint.id,
                "Constraint is missing a description."
            );
            continue;
        }
        if (typeof constraint.description !== "string") {
            addValidationError(
                errors,
                ERROR_CODES.CV010,
                constraint.id,
                "Constraint description must be a string."
            );
            continue;
        }
        if (constraint.description.trim() === "") {
            addValidationError(
                errors,
                ERROR_CODES.CV010,
                constraint.id,
                "Constraint description cannot be empty."
            );
        }
        /*
        ----------------------------------------------------------
        Source
        ----------------------------------------------------------
        */
        if (constraint.source === undefined || constraint.source === null) {
            addValidationError(
                errors,
                ERROR_CODES.CV011,
                constraint.id,
                "Constraint is missing a source definition."
            );
        }
    }
}


/**
 * =============================================================================
 * validateControlledVocabulary
 * =============================================================================
 *
 * Phase 4 Helper Function
 *
 * Validates the controlled vocabulary used by the Constraints repository.
 *
 * Responsibilities
 * ----------------
 * - Validate recognised Constraint categories
 * - Update validation statistics
 *
 * Error Codes
 * -----------
 * CV020  Unknown Constraint category
 *
 * =============================================================================
 */

function validateControlledVocabulary(
    constraints,
    statistics,
    errors
) {
    statistics.controlledVocabularyChecked = 0;
    for (const constraint of constraints) {
        statistics.controlledVocabularyChecked++;
        /*
        ----------------------------------------------------------
        Constraint Category
        ----------------------------------------------------------
        */
        if (!CONSTRAINT_CATEGORIES.includes(constraint.category)) {
            addValidationError(
                errors,
                ERROR_CODES.CV020,
                constraint.id,
                `Unknown Constraint category '${constraint.category}'.`
            );
        }
    }
}


/**
 * =============================================================================
 * validateSourceReferences
 * =============================================================================
 *
 * Phase 5 Helper Function
 *
 * Validates engineering source references for each Constraint.
 *
 * Responsibilities
 * ----------------
 * - Validate source document
 * - Validate source paragraph
 * - Update validation statistics
 *
 * Error Codes
 * -----------
 * CV030  Missing source document
 * CV031  Missing source paragraph
 *
 * =============================================================================
 */

function validateSourceReferences(
    constraints,
    statistics,
    errors
) {
    statistics.sourceReferencesChecked = 0;
    for (const constraint of constraints) {
        statistics.sourceReferencesChecked++;
        /*
        ----------------------------------------------------------
        Source Document
        ----------------------------------------------------------
        */
        if (
            constraint.source.document === undefined ||
            typeof constraint.source.document !== "string" ||
            constraint.source.document.trim() === ""
        ) {
            addValidationError(
                errors,
                ERROR_CODES.CV030,
                constraint.id,
                "Constraint is missing a source document."
            );
        }
        /*
        ----------------------------------------------------------
        Source Paragraph
        ----------------------------------------------------------
        */
        if (
            constraint.source.para === undefined ||
            typeof constraint.source.para !== "string" ||
            constraint.source.para.trim() === ""
        ) {
            addValidationError(
                errors,
                ERROR_CODES.CV031,
                constraint.id,
                "Constraint is missing a source paragraph."
            );
        }
    }
}


/**
 * =============================================================================
 * validateConstraintConsistency
 * =============================================================================
 *
 * Phase 6 Helper Function
 *
 * Validates the overall consistency of the Constraints repository.
 *
 * Responsibilities
 * ----------------
 * - Validate repository contains Constraints
 * - Identify duplicate Constraint descriptions
 * - Update validation statistics
 *
 * Error Codes
 * -----------
 * CV040  Repository contains no Constraints
 *
 * Warning Codes
 * -------------
 * CVW001 Duplicate Constraint description
 *
 * =============================================================================
 */

function validateConstraintConsistency(
    constraints,
    statistics,
    errors,
    warnings
) {
    statistics.repositoryConsistencyChecks = 0;
    statistics.uniqueDescriptionsChecked = 0;
    /*
    ----------------------------------------------------------
    Repository Empty
    ----------------------------------------------------------
    */
    if (constraints.length === 0) {
        addValidationError(
            errors,
            ERROR_CODES.CV040,
            "<repository>",
            "Constraints repository contains no Constraints."
        );
        return;
    }
    statistics.repositoryConsistencyChecks++;
    /*
    ----------------------------------------------------------
    Duplicate Descriptions
    ----------------------------------------------------------
    */
    const descriptions = new Set();
    for (const constraint of constraints) {
        if (descriptions.has(constraint.description)) {
            addValidationWarning(
                warnings,
                WARNING_CODES.CVW001,
                constraint.id,
                `Duplicate Constraint description '${constraint.description}'.`
            );
        }
        else {
            descriptions.add(constraint.description);
            statistics.uniqueDescriptionsChecked++;
        }
    }
}