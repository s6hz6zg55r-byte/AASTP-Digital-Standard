/**
 * =============================================================================
 * validateOrientationTypesRepository.js
 * =============================================================================
 *
 * Layer 2 Repository Validator
 *
 * Validates the integrity of the Orientation Types repository.
 *
 * Responsibilities
 * ----------------
 * - Validate repository structure
 * - Validate engineering definitions
 * - Validate engineering traceability
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
 * Phase 3 - Validate Orientation Type Definitions
 * Phase 4 - Validate Engineering Traceability
 * Phase 5 - Validate Repository Consistency
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

    id: VALIDATORS.ORIENTATION_TYPES_REPOSITORY,

    name: "Orientation Types Repository Integrity",

    layer: 2,

    dataset: "orientationTypes"

};


/**
 * =============================================================================
 * validateOrientationTypesRepository
 * =============================================================================
 */

export function validateOrientationTypesRepository() {

    const errors = [];

    const warnings = [];

    const statistics = {};

    /*
    ==========================================================
    Phase 1
    Build Lookup Collections
    ==========================================================
    */

    const orientationTypes =
        repository.getCollection("orientationTypes");

    const metadata =
        repository.getMetadata("orientationTypes");

    /*
    ==========================================================
    Phase 2
    Validate Repository Structure
    ==========================================================
    */

    validateOrientationTypeStructure(

        orientationTypes,

        statistics,

        errors

    );

    /*
    ==========================================================
    Phase 3
    Validate Orientation Type Definitions
    ==========================================================
    */

    validateOrientationTypeDefinitions(

        orientationTypes,

        statistics,

        errors

    );

    /*
    ==========================================================
    Phase 4
    Validate Engineering Traceability
    ==========================================================
    */

    validateEngineeringTraceability(

        metadata,

        statistics,

        errors

    );

    /*
    ==========================================================
    Phase 5
    Validate Repository Consistency
    ==========================================================
    */

    validateOrientationTypeConsistency(

        orientationTypes,

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
 * validateOrientationTypeStructure
 * =============================================================================
 *
 * Phase 2 Helper Function
 *
 * Validates the structural integrity of the Orientation Types repository.
 *
 * Responsibilities
 * ----------------
 * - Validate unique Orientation Type IDs
 * - Validate unique Orientation Type Names
 * - Validate mandatory properties
 * - Update validation statistics
 *
 * Error Codes
 * -----------
 * OR001  Duplicate Orientation Type ID
 * OR002  Duplicate Orientation Type Name
 * OR003  Missing mandatory property
 *
 * =============================================================================
 */

function validateOrientationTypeStructure(
    orientationTypes,
    statistics,
    errors
) {
    const ids = new Set();
    const names = new Set();
    statistics.orientationTypesChecked = 0;
    statistics.uniqueIdsChecked = 0;
    statistics.uniqueNamesChecked = 0;
    for (const orientationType of orientationTypes) {
        statistics.orientationTypesChecked++;
        /*
        ----------------------------------------------------------
        Mandatory Properties
        ----------------------------------------------------------
        */
        if (!orientationType.id) {
            addValidationError(
                errors,
                ERROR_CODES.OR003,
                "<unknown>",
                "Orientation Type is missing required property 'id'."
            );
            continue;
        }
        if (!orientationType.name) {
            addValidationError(
                errors,
                ERROR_CODES.OR003,
                orientationType.id,
                "Orientation Type is missing required property 'name'."
            );
        }
        if (!orientationType.values) {
            addValidationError(
                errors,
                ERROR_CODES.OR003,
                orientationType.id,
                "Orientation Type is missing required property 'values'."
            );
        }

        /*
        ----------------------------------------------------------
        Unique Orientation Type ID
        ----------------------------------------------------------
        */

        if (ids.has(orientationType.id)) {

            addValidationError(

                errors,

                ERROR_CODES.OR001,

                orientationType.id,

                `Duplicate Orientation Type ID '${orientationType.id}'.`

            );

        }
        else {

            ids.add(orientationType.id);

            statistics.uniqueIdsChecked++;

        }

        /*
        ----------------------------------------------------------
        Unique Orientation Type Name
        ----------------------------------------------------------
        */

        if (names.has(orientationType.name)) {

            addValidationError(

                errors,

                ERROR_CODES.OR002,

                orientationType.id,

                `Duplicate Orientation Type name '${orientationType.name}'.`

            );

        }
        else {

            names.add(orientationType.name);

            statistics.uniqueNamesChecked++;

        }

    }

}


/**
 * =============================================================================
 * validateOrientationTypeDefinitions
 * =============================================================================
 *
 * Phase 3 Helper Function
 *
 * Validates the engineering definitions contained within the Orientation Types
 * repository.
 *
 * Responsibilities
 * ----------------
 * - Validate values arrays
 * - Validate engineering definitions
 * - Update validation statistics
 *
 * Error Codes
 * -----------
 * OR010  Missing or invalid values array
 * OR011  Invalid orientation value
 *
 * =============================================================================
 */

function validateOrientationTypeDefinitions(
    orientationTypes,
    statistics,
    errors
) {
    statistics.definitionsChecked = 0;
    statistics.valuesChecked = 0;
    for (const orientationType of orientationTypes) {
        statistics.definitionsChecked++;
        /*
        ----------------------------------------------------------
        Values Array
        ----------------------------------------------------------
        */
        if (!Array.isArray(orientationType.values)) {
            addValidationError(
                errors,
                ERROR_CODES.OR010,
                orientationType.id,
                "Orientation Type values must be an array."
            );
            continue;
        }
        if (orientationType.values.length === 0) {
            addValidationError(
                errors,
                ERROR_CODES.OR010,
                orientationType.id,
                "Orientation Type must contain at least one value."
            );
            continue;
        }
        const values = new Set();
        for (const value of orientationType.values) {
            statistics.valuesChecked++;
            if (typeof value !== "string") {
                addValidationError(
                    errors,
                    ERROR_CODES.OR011,
                    orientationType.id,
                    "Orientation value must be a string."
                );
                continue;
            }
            if (value.trim() === "") {
                addValidationError(
                    errors,
                    ERROR_CODES.OR011,
                    orientationType.id,
                    "Orientation value cannot be empty."
                );
                continue;
            }
            if (values.has(value)) {
                addValidationError(
                    errors,
                    ERROR_CODES.OR011,
                    orientationType.id,
                    `Duplicate orientation value '${value}'.`
                );
            }
            else {
                values.add(value);
            }
        }
    }
}


/**
 * =============================================================================
 * validateEngineeringTraceability
 * =============================================================================
 *
 * Phase 4 Helper Function
 *
 * Validates repository-level engineering traceability.
 *
 * Responsibilities
 * ----------------
 * - Validate source standard
 * - Validate source edition
 * - Validate source chapter
 * - Update validation statistics
 *
 * Error Codes
 * -----------
 * OR020  Missing source standard
 * OR021  Missing source edition
 * OR022  Missing source chapter
 *
 * =============================================================================
 */

function validateEngineeringTraceability(
    metadata,
    statistics,
    errors
) {
    statistics.traceabilityChecked = 0;
    /*
    ----------------------------------------------------------
    Metadata
    ----------------------------------------------------------
    */
    if (!metadata || !metadata.source) {
        addValidationError(
            errors,
            ERROR_CODES.OR020,
            "<repository>",
            "Repository metadata is missing source information."
        );
        return;
    }
    statistics.traceabilityChecked++;
    /*
    ----------------------------------------------------------
    Source Standard
    ----------------------------------------------------------
    */
    if (
        metadata.source.standard === undefined ||
        typeof metadata.source.standard !== "string" ||
        metadata.source.standard.trim() === ""
    ) {
        addValidationError(
            errors,
            ERROR_CODES.OR020,
            "<repository>",
            "Repository source standard is missing."
        );
    }
    /*
    ----------------------------------------------------------
    Source Edition
    ----------------------------------------------------------
    */
    if (
        metadata.source.edition === undefined ||
        typeof metadata.source.edition !== "string" ||
        metadata.source.edition.trim() === ""
    ) {
        addValidationError(
            errors,
            ERROR_CODES.OR021,
            "<repository>",
            "Repository source edition is missing."
        );
    }
    /*
    ----------------------------------------------------------
    Source Chapter
    ----------------------------------------------------------
    */
    if (
        metadata.source.chapter === undefined ||
        typeof metadata.source.chapter !== "string" ||
        metadata.source.chapter.trim() === ""
    ) {
        addValidationError(
            errors,
            ERROR_CODES.OR022,
            "<repository>",
            "Repository source chapter is missing."
        );
    }
}


/**
 * =============================================================================
 * validateOrientationTypeConsistency
 * =============================================================================
 *
 * Phase 5 Helper Function
 *
 * Validates the overall consistency of the Orientation Types repository.
 *
 * Responsibilities
 * ----------------
 * - Validate repository contains Orientation Types
 * - Identify duplicate Orientation Type value sets
 * - Update validation statistics
 *
 * Error Codes
 * -----------
 * OR030  Repository contains no Orientation Types
 *
 * Warning Codes
 * -------------
 * ORW001 Duplicate Orientation Type value set
 *
 * =============================================================================
 */

function validateOrientationTypeConsistency(
    orientationTypes,
    statistics,
    errors,
    warnings
) {
    statistics.repositoryConsistencyChecked = 0;
    statistics.uniqueValueSetsChecked = 0;
    /*
    ----------------------------------------------------------
    Repository Empty
    ----------------------------------------------------------
    */
    if (orientationTypes.length === 0) {
        addValidationError(
            errors,
            ERROR_CODES.OR030,
            "<repository>",
            "Orientation Types repository contains no Orientation Types."
        );
        return;
    }
    statistics.repositoryConsistencyChecked++;
    /*
    ----------------------------------------------------------
    Duplicate Value Sets
    ----------------------------------------------------------
    */
    const valueSets = new Map();
    for (const orientationType of orientationTypes) {
        /*
         * Sort the values so that:
         *
         * [front, side, rear]
         *
         * and
         *
         * [rear, front, side]
         *
         * are treated as identical engineering definitions.
         */

        const signature =
            [...orientationType.values]
                .sort()
                .join("|");
        if (valueSets.has(signature)) {
            addValidationWarning(
                warnings,
                WARNING_CODES.ORW001,
                orientationType.id,
                `Orientation Type '${orientationType.name}' has an identical value set to '${valueSets.get(signature)}'.`
            );
        }
        else {
            valueSets.set(
                signature,
                orientationType.name
            );
            statistics.uniqueValueSetsChecked++;
        }
    }
}