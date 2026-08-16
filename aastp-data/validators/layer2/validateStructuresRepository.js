/**
 * =============================================================================
 * validateStructuresRepository.js
 * =============================================================================
 *
 * Layer 2 Repository Validator
 *
 * Validates the integrity of the Structures repository.
 *
 * Responsibilities
 * ----------------
 * - Validate repository structure
 * - Validate engineering object definitions
 * - Validate controlled vocabulary references
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
 * Phase 3 - Validate Engineering Object Definitions
 * Phase 4 - Validate Controlled Vocabulary References
 * Phase 5 - Validate Engineering Traceability
 * Phase 6 - Validate Repository Consistency
 *
 * =============================================================================
 */

import repository
    from "../../repository/repository.js";

import {
    STRUCTURE_CATEGORIES
}
    from "../../constants/engineeringConstants.js";

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

    id: VALIDATORS.STRUCTURES_REPOSITORY,

    name: "Structures Repository Integrity",

    layer: 2,

    dataset: "structures"

};


export function validateStructuresRepository() {

    const errors = [];

    const warnings = [];

    const statistics = {};

    /*
    ==========================================================
    Phase 1
    Build Lookup Collections
    ==========================================================
    */

    const structures =
        repository.getCollection("structures");

    const metadata =
        repository.getMetadata("structures");

    const orientationTypes =
        repository.getCollection("orientationTypes");

    /*
    ==========================================================
    Phase 2
    Validate Repository Structure
    ==========================================================
    */

    validateStructureRepository(

        structures,

        statistics,

        errors

    );

    /*
    ==========================================================
    Phase 3
    Validate Engineering Object Definitions
    ==========================================================
    */

    validateEngineeringObjectDefinitions(

        structures,

        statistics,

        errors

    );

    /*
    ==========================================================
    Phase 4
    Validate Controlled Vocabulary References
    ==========================================================
    */

    validateControlledVocabularyReferences(

        structures,

        orientationTypes,

        statistics,

        errors

    );

    /*
    ==========================================================
    Phase 5
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
    Phase 6
    Validate Repository Consistency
    ==========================================================
    */

    validateStructureConsistency(

        structures,

        statistics,

        errors,

        warnings

    );

    return buildValidationResult(

        VALIDATOR,

        errors,

        warnings,

        statistics

    );

}

/**
 * =============================================================================
 * validateStructureRepository
 * =============================================================================
 *
 * Phase 2 Helper Function
 *
 * Validates the structural integrity of the Structures repository.
 *
 * Responsibilities
 * ----------------
 * - Validate unique Structure IDs
 * - Validate unique Structure Codes
 * - Validate unique Structure Names
 * - Validate mandatory properties
 * - Update validation statistics
 *
 * Error Codes
 * -----------
 * ST001  Duplicate Structure ID
 * ST002  Duplicate Structure Code
 * ST003  Duplicate Structure Name
 * ST004  Missing mandatory property
 *
 * =============================================================================
 */

function validateStructureRepository(
    structures,
    statistics,
    errors
) {
    const ids = new Set();
    const codes = new Set();
    const names = new Set();
    statistics.structuresChecked = 0;
    statistics.uniqueIdsChecked = 0;
    statistics.uniqueCodesChecked = 0;
    statistics.uniqueNamesChecked = 0;
    for (const structure of structures) {
        statistics.structuresChecked++;
        /*
        ----------------------------------------------------------
        Mandatory Properties
        ----------------------------------------------------------
        */
        if (!structure.id) {
            addValidationError(
                errors,
                ERROR_CODES.ST004,
                "<unknown>",
                "Structure is missing required property 'id'."
            );
            continue;
        }
        if (!structure.code) {
            addValidationError(
                errors,
                ERROR_CODES.ST004,
                structure.id,
                "Structure is missing required property 'code'."
            );
        }
        if (!structure.name) {
            addValidationError(
                errors,
                ERROR_CODES.ST004,
                structure.id,
                "Structure is missing required property 'name'."
            );
        }
        if (structure.category === undefined) {
            addValidationError(
                errors,
                ERROR_CODES.ST004,
                structure.id,
                "Structure is missing required property 'category'."
            );
        }
        if (structure.supportedProperties === undefined) {
            addValidationError(
                errors,
                ERROR_CODES.ST004,
                structure.id,
                "Structure is missing required property 'supportedProperties'."
            );
        }
        if (structure.supportedExposure === undefined) {
            addValidationError(
                errors,
                ERROR_CODES.ST004,
                structure.id,
                "Structure is missing required property 'supportedExposure'."
            );
        }
        if (!structure.orientationType) {
            addValidationError(
                errors,
                ERROR_CODES.ST004,
                structure.id,
                "Structure is missing required property 'orientationType'."
            );
        }
        /*
        ----------------------------------------------------------
        Unique Structure ID
        ----------------------------------------------------------
        */
        if (ids.has(structure.id)) {
            addValidationError(
                errors,
                ERROR_CODES.ST001,
                structure.id,
                `Duplicate Structure ID '${structure.id}'.`
            );
        }
        else {
            ids.add(structure.id);
            statistics.uniqueIdsChecked++;
        }
        /*
        ----------------------------------------------------------
        Unique Structure Code
        ----------------------------------------------------------
        */
        if (codes.has(structure.code)) {
            addValidationError(
                errors,
                ERROR_CODES.ST002,
                structure.id,
                `Duplicate Structure code '${structure.code}'.`
            );
        }
        else {
            codes.add(structure.code);
            statistics.uniqueCodesChecked++;
        }
        /*
        ----------------------------------------------------------
        Unique Structure Name
        ----------------------------------------------------------
        */
        if (names.has(structure.name)) {
            addValidationError(
                errors,
                ERROR_CODES.ST003,
                structure.id,
                `Duplicate Structure name '${structure.name}'.`
            );
        }
        else {
            names.add(structure.name);
            statistics.uniqueNamesChecked++;
        }
    }
}

/**
 * =============================================================================
 * validateEngineeringObjectDefinitions
 * =============================================================================
 *
 * Phase 3 Helper Function
 *
 * Validates the engineering object definitions contained within the Structures
 * repository.
 *
 * Responsibilities
 * ----------------
 * - Validate supportedProperties
 * - Validate supportedExposure
 * - Update validation statistics
 *
 * Error Codes
 * -----------
 * ST010  Invalid supportedProperties definition
 * ST011  Invalid supportedExposure definition
 *
 * =============================================================================
 */

function validateEngineeringObjectDefinitions(
    structures,
    statistics,
    errors
) {
    statistics.definitionsChecked = 0;
    statistics.supportedPropertiesChecked = 0;
    statistics.supportedExposureChecked = 0;
    for (const structure of structures) {
        statistics.definitionsChecked++;
        /*
        ----------------------------------------------------------
        Supported Properties
        ----------------------------------------------------------
        */
        if (structure.supportedProperties !== false) {
            if (
                structure.supportedProperties === null ||
                typeof structure.supportedProperties !== "object" ||
                Array.isArray(structure.supportedProperties)
            ) {
                addValidationError(
                    errors,
                    ERROR_CODES.ST010,
                    structure.id,
                    "supportedProperties must be either false or an object."
                );
            }
            else {
                for (const [property, value] of Object.entries(structure.supportedProperties)) {
                    statistics.supportedPropertiesChecked++;
                    if (typeof value !== "boolean") {
                        addValidationError(
                            errors,
                            ERROR_CODES.ST010,
                            structure.id,
                            `supportedProperties.${property} must be a boolean.`
                        );
                    }
                }
            }
        }
    
        /*
        ----------------------------------------------------------
        Supported Exposure
        ----------------------------------------------------------
        */
        if (structure.supportedExposure !== false) {
            if (
                structure.supportedExposure === null ||
                typeof structure.supportedExposure !== "object" ||
                Array.isArray(structure.supportedExposure)
            ) {
                addValidationError(
                    errors,
                    ERROR_CODES.ST011,
                    structure.id,
                    "supportedExposure must be either false or an object."
                );
            }
            else {
                for (const [property, value] of Object.entries(structure.supportedExposure)) {
                    statistics.supportedExposureChecked++;
                    if (typeof value !== "boolean") {
                        addValidationError(
                            errors,
                            ERROR_CODES.ST011,
                            structure.id,
                            `supportedExposure.${property} must be a boolean.`
                        );
                    }
                }
            }
        }
    }
}


/**
 * =============================================================================
 * validateControlledVocabularyReferences
 * =============================================================================
 *
 * Phase 4 Helper Function
 *
 * Validates governed vocabulary and repository relationships used by the
 * Structures repository.
 *
 * Responsibilities
 * ----------------
 * - Validate Structure Category values
 * - Validate Orientation Type references
 * - Update validation statistics
 *
 * Error Codes
 * -----------
 * ST020  Unknown Structure Category
 * ST021  Unknown Orientation Type
 *
 * =============================================================================
 */

function validateControlledVocabularyReferences(
    structures,
    orientationTypes,
    statistics,
    errors
) {
    statistics.relationshipsChecked = 0;
    statistics.categoryReferencesChecked = 0;
    statistics.orientationTypeReferencesChecked = 0;
    const validOrientationTypes = new Set(
        orientationTypes.map(
            orientationType => orientationType.id
        )
    );
    const validCategories = new Set(
        STRUCTURE_CATEGORIES
    );
    for (const structure of structures) {
        statistics.relationshipsChecked++;
        /*
        ----------------------------------------------------------
        Structure Category
        ----------------------------------------------------------
        */
        statistics.categoryReferencesChecked++;
        if (!validCategories.has(structure.category)) {
            addValidationError(
                errors,
                ERROR_CODES.ST020,
                structure.id,
                `Unknown Structure Category '${structure.category}'.`
            );
        }
        /*
        ----------------------------------------------------------
        Orientation Type
        ----------------------------------------------------------
        */
        statistics.orientationTypeReferencesChecked++;
        if (!validOrientationTypes.has(structure.orientationType)) {
            addValidationError(
                errors,
                ERROR_CODES.ST021,
                structure.id,
                `Unknown Orientation Type '${structure.orientationType}'.`
            );
        }
    }
}

/**
 * =============================================================================
 * validateEngineeringTraceability
 * =============================================================================
 *
 * Phase 5 Helper Function
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
 * ST030  Missing source standard
 * ST031  Missing source edition
 * ST032  Missing source chapter
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
    Repository Metadata
    ----------------------------------------------------------
    */
    if (!metadata || !metadata.source) {
        addValidationError(
            errors,
            ERROR_CODES.ST030,
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
            ERROR_CODES.ST030,
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
            ERROR_CODES.ST031,
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
            ERROR_CODES.ST032,
            "<repository>",
            "Repository source chapter is missing."
        );
    }
}

/**
 * =============================================================================
 * validateStructureConsistency
 * =============================================================================
 *
 * Phase 6 Helper Function
 *
 * Validates the overall consistency of the Structures repository.
 *
 * Responsibilities
 * ----------------
 * - Validate repository contains Structures
 * - Identify duplicate engineering definitions
 * - Update validation statistics
 *
 * Error Codes
 * -----------
 * ST040  Repository contains no Structures
 *
 * Warning Codes
 * -------------
 * STW001 Duplicate engineering definition
 *
 * =============================================================================
 */

function validateStructureConsistency(
    structures,
    statistics,
    errors,
    warnings
) {
    statistics.repositoryConsistencyChecked = 0;
    statistics.uniqueEngineeringDefinitionsChecked = 0;
    /*
    ----------------------------------------------------------
    Repository Empty
    ----------------------------------------------------------
    */
    if (structures.length === 0) {
        addValidationError(
            errors,
            ERROR_CODES.ST040,
            "<repository>",
            "Structures repository contains no Structures."
        );
        return;
    }
    statistics.repositoryConsistencyChecked++;
    /*
    ----------------------------------------------------------
    Duplicate Engineering Definitions
    ----------------------------------------------------------
    */
    const engineeringDefinitions = new Map();
    for (const structure of structures) {
        const signature = JSON.stringify({
            category: structure.category,
            supportedProperties: structure.supportedProperties,
            supportedExposure: structure.supportedExposure,
            orientationType: structure.orientationType
        });
        if (engineeringDefinitions.has(signature)) {
            addValidationWarning(
                warnings,
                WARNING_CODES.STW001,
                structure.id,
                `Structure '${structure.name}' has an identical engineering definition to '${engineeringDefinitions.get(signature)}'.`
            );
        }
        else {
            engineeringDefinitions.set(
                signature,
                structure.name
            );
            statistics.uniqueEngineeringDefinitionsChecked++;
        }
    }
}