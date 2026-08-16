/**
 * =============================================================================
 * validateProtectionLevelsRepository.js
 * =============================================================================
 *
 * Layer 2 Repository Validator
 *
 * Validates the integrity of the Protection Levels repository.
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
 * Phase 3 - Validate Protection Level Definitions
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

    id: VALIDATORS.PROTECTION_LEVELS_REPOSITORY,

    name: "Protection Levels Repository Integrity",

    layer: 2,

    dataset: "protectionLevels"

};


/**
 * =============================================================================
 * validateProtectionLevelsRepository
 * =============================================================================
 */

export function validateProtectionLevelsRepository() {

    const errors = [];

    const warnings = [];

    const statistics = {};

    /*
    ==========================================================
    Phase 1
    Build Lookup Collections
    ==========================================================
    */

    const protectionLevels =
        repository.getCollection("protectionLevels");

    /*
    ==========================================================
    Phase 2
    Validate Repository Structure
    ==========================================================
    */

    validateProtectionLevelStructure(

        protectionLevels,

        statistics,

        errors

    );

    /*
    ==========================================================
    Phase 3
    Validate Protection Level Definitions
    ==========================================================
    */

    validateProtectionLevelDefinitions(

        protectionLevels,

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

        protectionLevels,

        statistics,

        errors

    );

    /*
    ==========================================================
    Phase 5
    Validate Repository Consistency
    ==========================================================
    */

    validateProtectionLevelConsistency(

        protectionLevels,

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
 * validateProtectionLevelStructure
 * =============================================================================
 *
 * Phase 2 Helper Function
 *
 * Validates the structural integrity of the Protection Levels repository.
 *
 * Responsibilities
 * ----------------
 * - Validate unique Protection Level IDs
 * - Validate unique Protection Level Codes
 * - Validate unique Protection Level Names
 * - Validate mandatory properties
 * - Update validation statistics
 *
 * Error Codes
 * -----------
 * PL001  Duplicate Protection Level ID
 * PL002  Duplicate Protection Level Code
 * PL003  Duplicate Protection Level Name
 * PL004  Missing mandatory property
 *
 * =============================================================================
 */

function validateProtectionLevelStructure(
    protectionLevels,
    statistics,
    errors
) {
    const ids = new Set();
    const codes = new Set();
    const names = new Set();
    statistics.protectionLevelsChecked = 0;
    statistics.uniqueIdsChecked = 0;
    statistics.uniqueCodesChecked = 0;
    statistics.uniqueNamesChecked = 0;
    for (const protectionLevel of protectionLevels) {
        statistics.protectionLevelsChecked++;
        /*
        ----------------------------------------------------------
        Mandatory Properties
        ----------------------------------------------------------
        */
        if (!protectionLevel.id) {
            addValidationError(
                errors,
                ERROR_CODES.PL004,
                "<unknown>",
                "Protection Level is missing required property 'id'."
            );
            continue;
        }
        if (!protectionLevel.code) {
            addValidationError(
                errors,
                ERROR_CODES.PL004,
                protectionLevel.id,
                "Protection Level is missing required property 'code'."
            );
        }
        if (!protectionLevel.name) {
            addValidationError(
                errors,
                ERROR_CODES.PL004,
                protectionLevel.id,
                "Protection Level is missing required property 'name'."
            );
        }
        if (!protectionLevel.notes) {
            addValidationError(
                errors,
                ERROR_CODES.PL004,
                protectionLevel.id,
                "Protection Level is missing required property 'notes'."
            );
        }
        if (!protectionLevel.source) {
            addValidationError(
                errors,
                ERROR_CODES.PL004,
                protectionLevel.id,
                "Protection Level is missing required property 'source'."
            );
        }

        /*
        ----------------------------------------------------------
        Unique Protection Level ID
        ----------------------------------------------------------
        */

        if (ids.has(protectionLevel.id)) {

            addValidationError(

                errors,

                ERROR_CODES.PL001,

                protectionLevel.id,

                `Duplicate Protection Level ID '${protectionLevel.id}'.`

            );

        }
        else {

            ids.add(protectionLevel.id);

            statistics.uniqueIdsChecked++;

        }

        /*
        ----------------------------------------------------------
        Unique Protection Level Code
        ----------------------------------------------------------
        */

        if (codes.has(protectionLevel.code)) {

            addValidationError(

                errors,

                ERROR_CODES.PL002,

                protectionLevel.id,

                `Duplicate Protection Level code '${protectionLevel.code}'.`

            );

        }
        else {

            codes.add(protectionLevel.code);

            statistics.uniqueCodesChecked++;

        }

        /*
        ----------------------------------------------------------
        Unique Protection Level Name
        ----------------------------------------------------------
        */

        if (names.has(protectionLevel.name)) {

            addValidationError(

                errors,

                ERROR_CODES.PL003,

                protectionLevel.id,

                `Duplicate Protection Level name '${protectionLevel.name}'.`

            );

        }
        else {

            names.add(protectionLevel.name);

            statistics.uniqueNamesChecked++;

        }

    }

}


/**
 * =============================================================================
 * validateProtectionLevelDefinitions
 * =============================================================================
 *
 * Phase 3 Helper Function
 *
 * Validates the engineering definitions contained within the Protection Levels
 * repository.
 *
 * Responsibilities
 * ----------------
 * - Validate Protection Level notes
 * - Validate source object
 * - Update validation statistics
 *
 * Error Codes
 * -----------
 * PL010  Missing Protection Level notes
 * PL011  Missing source
 *
 * =============================================================================
 */

function validateProtectionLevelDefinitions(
    protectionLevels,
    statistics,
    errors
) {
    statistics.definitionsChecked = 0;
    for (const protectionLevel of protectionLevels) {
        statistics.definitionsChecked++;
        /*
        ----------------------------------------------------------
        Notes
        ----------------------------------------------------------
        */
        if (protectionLevel.notes === undefined) {
            addValidationError(
                errors,
                ERROR_CODES.PL010,
                protectionLevel.id,
                "Protection Level is missing notes."
            );
            continue;
        }
        if (typeof protectionLevel.notes !== "string") {
            addValidationError(
                errors,
                ERROR_CODES.PL010,
                protectionLevel.id,
                "Protection Level notes must be a string."
            );
            continue;
        }
        if (protectionLevel.notes.trim() === "") {
            addValidationError(
                errors,
                ERROR_CODES.PL010,
                protectionLevel.id,
                "Protection Level notes cannot be empty."
            );
        }
        /*
        ----------------------------------------------------------
        Source
        ----------------------------------------------------------
        */
        if (
            protectionLevel.source === undefined ||
            protectionLevel.source === null
        ) {
            addValidationError(
                errors,
                ERROR_CODES.PL011,
                protectionLevel.id,
                "Protection Level is missing a source definition."
            );
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
 * Validates engineering traceability for each Protection Level.
 *
 * Responsibilities
 * ----------------
 * - Validate source document
 * - Validate source paragraph
 * - Update validation statistics
 *
 * Error Codes
 * -----------
 * PL020  Missing source document
 * PL021  Missing source paragraph
 *
 * =============================================================================
 */

function validateEngineeringTraceability(
    protectionLevels,
    statistics,
    errors
) {
    statistics.sourceReferencesChecked = 0;
    for (const protectionLevel of protectionLevels) {
        statistics.sourceReferencesChecked++;
        /*
        ----------------------------------------------------------
        Source Document
        ----------------------------------------------------------
        */
        if (
            protectionLevel.source.document === undefined ||
            typeof protectionLevel.source.document !== "string" ||
            protectionLevel.source.document.trim() === ""
        ) {
            addValidationError(
                errors,
                ERROR_CODES.PL020,
                protectionLevel.id,
                "Protection Level is missing a source document."
            );
        }
        /*
        ----------------------------------------------------------
        Source Paragraph
        ----------------------------------------------------------
        */
        if (
            protectionLevel.source.para === undefined ||
            typeof protectionLevel.source.para !== "string" ||
            protectionLevel.source.para.trim() === ""
        ) {
            addValidationError(
                errors,
                ERROR_CODES.PL021,
                protectionLevel.id,
                "Protection Level is missing a source paragraph."
            );
        }
    }
}


/**
 * =============================================================================
 * validateProtectionLevelConsistency
 * =============================================================================
 *
 * Phase 5 Helper Function
 *
 * Validates the overall consistency of the Protection Levels repository.
 *
 * Responsibilities
 * ----------------
 * - Validate repository contains Protection Levels
 * - Identify duplicate Protection Level notes
 * - Update validation statistics
 *
 * Error Codes
 * -----------
 * PL030  Repository contains no Protection Levels
 *
 * Warning Codes
 * -------------
 * PLW001 Duplicate Protection Level notes
 *
 * =============================================================================
 */

function validateProtectionLevelConsistency(
    protectionLevels,
    statistics,
    errors,
    warnings
) {
    statistics.repositoryConsistencyChecked = 0;
    statistics.uniqueNotesChecked = 0;
    /*
    ----------------------------------------------------------
    Repository Empty
    ----------------------------------------------------------
    */
    if (protectionLevels.length === 0) {
        addValidationError(
            errors,
            ERROR_CODES.PL030,
            "<repository>",
            "Protection Levels repository contains no Protection Levels."
        );
        return;
    }
    statistics.repositoryConsistencyChecked++;
    /*
    ----------------------------------------------------------
    Duplicate Notes
    ----------------------------------------------------------
    */
    const notes = new Set();
    for (const protectionLevel of protectionLevels) {
        if (notes.has(protectionLevel.notes)) {
            addValidationWarning(
                warnings,
                WARNING_CODES.PLW001,
                protectionLevel.id,
                `Duplicate Protection Level notes detected.`
            );
        }
        else {
            notes.add(protectionLevel.notes);
            statistics.uniqueNotesChecked++;
        }
    }
}