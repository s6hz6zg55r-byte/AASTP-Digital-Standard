/**
 * =============================================================================
 * validateEsTypesRepository.js
 * =============================================================================
 *
 * Layer 2 Repository Validator
 *
 * Validates the integrity of the Exposure Site (ES) repository.
 *
 * Responsibilities
 * ----------------
 * - Validate repository structure
 * - Validate engineering object definitions
 * - Validate governed dependencies
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
 * Phase 4 - Validate Governed Dependencies
 * Phase 5 - Validate Engineering Traceability
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
    ES_SUPPORTED_CONSTRUCTION_DISCRIMINATORS,
    ES_SUPPORTED_EXPOSURE_DISCRIMINATORS,
    EXPOSURE_CATEGORIES,
    EXPOSURE_LEVELS,
    ROOF_TYPES
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

    id: VALIDATORS.ES_TYPES_REPOSITORY,

    name: "ES Types Repository Integrity",

    layer: 2,

    dataset: "esTypes"

};


/**
 * =============================================================================
 * validateEsTypesRepository
 * =============================================================================
 */

export function validateEsTypesRepository() {

    const errors = [];

    const warnings = [];

    const statistics = {};

    /*
    ==========================================================
    Phase 1
    Build Lookup Collections
    ==========================================================
    */

    const esTypes =
        repository.getCollection("esTypes");

    const metadata =
        repository.getMetadata("esTypes");

    const structures =
        repository.getCollection("structures");

    const protectionLevels =
        repository.getCollection("ecmProtectionRatings");

    /*
    ==========================================================
    Phase 2
    Validate Repository Structure
    ==========================================================
    */

    validateEsTypeRepository(

        esTypes,

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

        esTypes,

        statistics,

        errors

    );

    /*
    ==========================================================
    Phase 4
    Validate Governed Dependencies
    ==========================================================
    */

    validateGovernedDependencies(

        esTypes,

        structures,

        protectionLevels,

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

        esTypes,

        statistics,

        errors

    );

    /*
    ==========================================================
    Phase 6
    Validate Repository Consistency
    ==========================================================
    */

    validateEsTypeConsistency(

        esTypes,

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
 * validateEsTypeRepository
 * =============================================================================
 *
 * Phase 2 Helper Function
 *
 * Validates the structural integrity of the ES Types repository.
 *
 * Responsibilities
 * ----------------
 * - Validate unique ES Type IDs
 * - Validate unique ES Type Names
 * - Validate mandatory properties
 * - Update validation statistics
 *
 * Error Codes
 * -----------
 * ES001  Duplicate ES Type ID
 * ES002  Duplicate ES Type Name
 * ES003  Missing mandatory property
 *
 * =============================================================================
 */

function validateEsTypeRepository(
    esTypes,
    statistics,
    errors
) {
    const ids = new Set();
    const names = new Set();
    statistics.esTypesChecked = 0;
    statistics.uniqueIdsChecked = 0;
    statistics.uniqueNamesChecked = 0;
    for (const esType of esTypes) {
        statistics.esTypesChecked++;
        /*
        ----------------------------------------------------------
        Mandatory Properties
        ----------------------------------------------------------
        */
        if (!esType.id) {
            addValidationError(
                errors,
                ERROR_CODES.ES003,
                "<unknown>",
                "ES Type is missing required property 'id'."
            );
            continue;
        }
        if (!esType.name) {
            addValidationError(
                errors,
                ERROR_CODES.ES003,
                esType.id,
                "ES Type is missing required property 'name'."
            );
        }
        if (esType.structure === undefined) {
            addValidationError(
                errors,
                ERROR_CODES.ES003,
                esType.id,
                "ES Type is missing required property 'structure'."
            );
        }
        if (esType.construction === undefined) {
            addValidationError(
                errors,
                ERROR_CODES.ES003,
                esType.id,
                "ES Type is missing required property 'construction'."
            );
        }
        if (esType.exposure === undefined) {
            addValidationError(
                errors,
                ERROR_CODES.ES003,
                esType.id,
                "ES Type is missing required property 'exposure'."
            );
        }
        if (esType.source === undefined) {
            addValidationError(
                errors,
                ERROR_CODES.ES003,
                esType.id,
                "ES Type is missing required property 'source'."
            );
        }
        /*
        ----------------------------------------------------------
        Unique ES Type ID
        ----------------------------------------------------------
        */
        if (ids.has(esType.id)) {
            addValidationError(
                errors,
                ERROR_CODES.ES001,
                esType.id,
                `Duplicate ES Type ID '${esType.id}'.`
            );
        }
        else {
            ids.add(esType.id);
            statistics.uniqueIdsChecked++;
        }
        /*
        ----------------------------------------------------------
        Unique ES Type Name
        ----------------------------------------------------------
        */
        if (names.has(esType.name)) {
            addValidationError(
                errors,
                ERROR_CODES.ES002,
                esType.id,
                `Duplicate ES Type name '${esType.name}'.`
            );
        }
        else {
            names.add(esType.name);
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
 * Validates the engineering object definitions contained within the
 * ES Types repository.
 *
 * Responsibilities
 * ----------------
 * - Validate construction discriminator group
 * - Validate exposure discriminator group
 * - Update validation statistics
 *
 * Error Codes
 * -----------
 * ES010  Invalid construction definition
 * ES011  Invalid exposure definition
 *
 * =============================================================================
 */

function validateEngineeringObjectDefinitions(
    esTypes,
    statistics,
    errors
) {
    statistics.definitionsChecked = 0;
    statistics.constructionDefinitionsChecked = 0;
    statistics.exposureDefinitionsChecked = 0;
    for (const esType of esTypes) {
        statistics.definitionsChecked++;
        /*
        ----------------------------------------------------------
        Construction
        ----------------------------------------------------------
        */
        if (esType.construction !== null) {
            if (
                typeof esType.construction !== "object" ||
                Array.isArray(esType.construction)
            ) {
                addValidationError(
                    errors,
                    ERROR_CODES.ES010,
                    esType.id,
                    "construction must be either null or an object."
                );
            }
            else {
                statistics.constructionDefinitionsChecked++;
            }
        }
        /*
        ----------------------------------------------------------
        Exposure
        ----------------------------------------------------------
        */
        if (esType.exposure !== null) {
            if (
                typeof esType.exposure !== "object" ||
                Array.isArray(esType.exposure)
            ) {
                addValidationError(
                    errors,
                    ERROR_CODES.ES011,
                    esType.id,
                    "exposure must be either null or an object."
                );
            }
            else {
                statistics.exposureDefinitionsChecked++;
            }
        }
    }
}


/**
 * =============================================================================
 * Phase 4
 * =============================================================================
 */

function validateGovernedDependencies(
    esTypes,
    structures,
    protectionRatings,
    statistics,
    errors
) {

    validateStructureReference(
        esTypes,
        structures,
        statistics,
        errors
    );

    validateConstructionApplicability(
        esTypes,
        structures,
        statistics,
        errors
    );

    validateExposureApplicability(
        esTypes,
        structures,
        statistics,
        errors
    );

    validateConstructionDiscriminators(
        esTypes,
        structures,
        statistics,
        errors
    );

    validateExposureDiscriminators(
        esTypes,
        structures,
        statistics,
        errors
    );

    validateGovernedValues(
        esTypes,
        protectionRatings,
        statistics,
        errors
    );
}

/**
 * =============================================================================
 * validateStructureReference
 * =============================================================================
 *
 * Phase 4 Subordinate Helper Function
 *
 * Validates that each ES Type references a valid Structure.
 *
 * Responsibilities
 * ----------------
 * - Validate Structure references
 * - Update validation statistics
 *
 * Error Codes
 * -----------
 * ES020  Unknown Structure reference
 *
 * =============================================================================
 */

function validateStructureReference(
    esTypes,
    structures,
    statistics,
    errors
) {
    const validStructures = new Set(
        structures.map(
            structure => structure.id
        )
    );
    statistics.structureReferencesChecked = 0;
    for (const esType of esTypes) {
        statistics.structureReferencesChecked++;
        if (!validStructures.has(esType.structure)) {
            addValidationError(
                errors,
                ERROR_CODES.ES020,
                esType.id,
                `Unknown Structure '${esType.structure}'.`
            );
        }
    }
}

/**
 * =============================================================================
 * validateConstructionApplicability
 * =============================================================================
 *
 * Phase 4 Subordinate Helper Function
 *
 * Validates that the Construction discriminator group is present only when
 * required by the referenced Structure.
 *
 * Responsibilities
 * ----------------
 * - Validate Construction applicability
 * - Update validation statistics
 *
 * Error Codes
 * -----------
 * ES021  Invalid Construction applicability
 *
 * =============================================================================
 */

function validateConstructionApplicability(
    esTypes,
    structures,
    statistics,
    errors
) {
    const structureLookup = new Map(
        structures.map(
            structure => [structure.id, structure]
        )
    );
    statistics.constructionApplicabilityChecked = 0;
    for (const esType of esTypes) {
        const structure = structureLookup.get(esType.structure);
        // Structure reference errors are handled by validateStructureReference()
        if (!structure) {
            continue;
        }
        statistics.constructionApplicabilityChecked++;
        /*
        ----------------------------------------------------------
        Construction not applicable
        ----------------------------------------------------------
        */
        if (structure.supportedProperties === false) {
            if (esType.construction !== null) {
                addValidationError(
                    errors,
                    ERROR_CODES.ES021,
                    esType.id,
                    "Construction must be null because the referenced Structure does not support construction properties."
                );
            }
            continue;
        }
        /*
        ----------------------------------------------------------
        Construction applicable
        ----------------------------------------------------------
        */
        if (
            esType.construction === null ||
            typeof esType.construction !== "object" ||
            Array.isArray(esType.construction)
        ) {
            addValidationError(
                errors,
                ERROR_CODES.ES021,
                esType.id,
                "Construction definition is required because the referenced Structure supports construction properties."
            );
        }
    }
}

/**
 * =============================================================================
 * validateExposureApplicability
 * =============================================================================
 *
 * Phase 4 Subordinate Helper Function
 *
 * Validates that the Exposure discriminator group is present only when
 * required by the referenced Structure.
 *
 * Responsibilities
 * ----------------
 * - Validate Exposure applicability
 * - Update validation statistics
 *
 * Error Codes
 * -----------
 * ES022  Invalid Exposure applicability
 *
 * =============================================================================
 */

function validateExposureApplicability(
    esTypes,
    structures,
    statistics,
    errors
) {
    const structureLookup = new Map(
        structures.map(
            structure => [structure.id, structure]
        )
    );
    statistics.exposureApplicabilityChecked = 0;
    for (const esType of esTypes) {
        const structure = structureLookup.get(esType.structure);
        // Structure reference errors are handled separately.
        if (!structure) {
            continue;
        }
        statistics.exposureApplicabilityChecked++;
        /*
        ----------------------------------------------------------
        Exposure not applicable
        ----------------------------------------------------------
        */
        if (structure.supportedExposure === false) {
            if (esType.exposure !== null) {
                addValidationError(
                    errors,
                    ERROR_CODES.ES022,
                    esType.id,
                    "Exposure must be null because the referenced Structure does not support exposure properties."
                );
            }
            continue;
        }
        /*
        ----------------------------------------------------------
        Exposure applicable
        ----------------------------------------------------------
        */
        if (
            esType.exposure === null ||
            typeof esType.exposure !== "object" ||
            Array.isArray(esType.exposure)
        ) {
            addValidationError(
                errors,
                ERROR_CODES.ES022,
                esType.id,
                "Exposure definition is required because the referenced Structure supports exposure properties."
            );
        }
    }
}

/**
 * =============================================================================
 * validateConstructionDiscriminators
 * =============================================================================
 *
 * Phase 4 Subordinate Helper Function
 *
 * Validates construction discriminator properties against the applicability
 * defined by the referenced Structure.
 *
 * Responsibilities
 * ----------------
 * - Validate construction discriminator applicability
 * - Validate required discriminator properties are present
 * - Update validation statistics
 *
 * Error Codes
 * -----------
 * ES023  Invalid Construction Discriminator
 *
 * =============================================================================
 */

function validateConstructionDiscriminators(
    esTypes,
    structures,
    statistics,
    errors
) {
    const structureLookup = new Map(
        structures.map(
            structure => [structure.id, structure]
        )
    );
    statistics.constructionDiscriminatorsChecked = 0;
    for (const esType of esTypes) {
        const structure = structureLookup.get(esType.structure);
        if (!structure) {
            continue;
        }
        if (
            structure.supportedProperties === false ||
            esType.construction === null
        ) {
            continue;
        }
        for (const property of ES_SUPPORTED_CONSTRUCTION_DISCRIMINATORS) {

            const applicable = structure.supportedProperties?.[property];
            statistics.constructionDiscriminatorsChecked++;

            /*
            ------------------------------------------------------
            Property not defined in Structure
            ------------------------------------------------------
            */            
            if (applicable === undefined) {
                addValidationError(
                    errors,
                    ERROR_CODES.ES023,
                    esType.id,
                    `Structure '${structure.id}' does not define applicability for '${property}'.`
                );
                continue;
            }
            /*
            ------------------------------------------------------
            Property not applicable
            ------------------------------------------------------
            */
            if (!applicable) {
                if (esType.construction[property] !== null) {
                    addValidationError(
                        errors,
                        ERROR_CODES.ES023,
                        esType.id,
                        `'${property}' must be null because it is not supported by Structure '${structure.id}'.`
                    );
                }
                continue;
            }
            /*
            ------------------------------------------------------
            Property applicable
            ------------------------------------------------------
            */
            if (!(property in esType.construction)) {
                addValidationError(
                    errors,
                    ERROR_CODES.ES023,
                    esType.id,
                    `'${property}' is required because it is supported by Structure '${structure.id}'.`
                );
            }
        }
    }
}

/**
 * =============================================================================
 * validateExposureDiscriminators
 * =============================================================================
 *
 * Phase 4 Subordinate Helper Function
 *
 * Validates exposure discriminator properties against the applicability
 * defined by the referenced Structure.
 *
 * Responsibilities
 * ----------------
 * - Validate exposure discriminator applicability
 * - Validate required discriminator properties are present
 * - Update validation statistics
 *
 * Error Codes
 * -----------
 * ES024  Invalid Exposure Discriminator
 *
 * =============================================================================
 */

function validateExposureDiscriminators(
    esTypes,
    structures,
    statistics,
    errors
) {
    const structureLookup = new Map(
        structures.map(
            structure => [structure.id, structure]
        )
    );
    statistics.exposureDiscriminatorsChecked = 0;
    for (const esType of esTypes) {
        const structure = structureLookup.get(esType.structure);
        if (!structure) {
            continue;
        }
        if (
            structure.supportedExposure === false ||
            esType.exposure === null
        ) {
            continue;
        }
        for (const property of ES_SUPPORTED_EXPOSURE_DISCRIMINATORS) {
            const applicable =
                structure.supportedExposure?.[property];
            /*
            ------------------------------------------------------
            Structure definition incomplete
            ------------------------------------------------------
            */
            if (applicable === undefined) {
                addValidationError(
                    errors,
                    ERROR_CODES.ES024,
                    esType.id,
                    `Structure '${structure.id}' does not define applicability for exposure discriminator '${property}'.`
                );
                continue;
            }
            statistics.exposureDiscriminatorsChecked++;
            /*
            ------------------------------------------------------
            Property not applicable
            ------------------------------------------------------
            */
            if (!applicable) {
                if (esType.exposure[property] !== null) {
                    addValidationError(
                        errors,
                        ERROR_CODES.ES024,
                        esType.id,
                        `'${property}' must be null because it is not supported by Structure '${structure.id}'.`
                    );
                }
                continue;
            }
            /*
            ------------------------------------------------------
            Property applicable
            ------------------------------------------------------
            */
            if (!(property in esType.exposure)) {
                addValidationError(
                    errors,
                    ERROR_CODES.ES024,
                    esType.id,
                    `'${property}' is required because it is supported by Structure '${structure.id}'.`
                );
            }
        }
    }
}

function validateGovernedValues(
    esTypes,
    protectionRatings,
    statistics,
    errors
) {

    validateConstructionValues(
        esTypes,
        protectionRatings,
        statistics,
        errors
    );

    validateExposureValues(
        esTypes,
        statistics,
        errors
    );

}

/**
 * =============================================================================
 * validateConstructionValues
 * =============================================================================
 *
 * Phase 4 Subordinate Helper Function
 *
 * Validates governed construction discriminator values.
 *
 * Responsibilities
 * ----------------
 * - Validate ECM Protection Rating references
 * - Validate Roof Type values
 * - Update validation statistics
 *
 * Error Codes
 * -----------
 * ES025  Invalid Construction Value
 *
 * =============================================================================
 */

function validateConstructionValues(
    esTypes,
    protectionRatings,
    statistics,
    errors
) {
    const validProtectionRatings = new Set(
        protectionRatings.map(
            rating => rating.id
        )
    );
    const validRoofTypes = new Set(ROOF_TYPES);
    statistics.constructionValuesChecked = 0;
    for (const esType of esTypes) {
        if (esType.construction === null) {
            continue;
        }
        /*
        ------------------------------------------------------
        ECM Protection Rating
        ------------------------------------------------------
        */
        if (
            esType.construction.ecmProtectionRating !== null
        ) {
            statistics.constructionValuesChecked++;
            if (
                !validProtectionRatings.has(
                    esType.construction.ecmProtectionRating
                )
            ) {
                addValidationError(
                    errors,
                    ERROR_CODES.ES025,
                    esType.id,
                    `Unknown ECM Protection Rating '${esType.construction.ecmProtectionRating}'.`
                );
            }
        }
        /*
        ------------------------------------------------------
        Roof Type
        ------------------------------------------------------
        */
        if (
            esType.construction.roofType !== null
        ) {
            statistics.constructionValuesChecked++;
            if (
                !validRoofTypes.has(
                    esType.construction.roofType
                )
            ) {
                addValidationError(
                    errors,
                    ERROR_CODES.ES025,
                    esType.id,
                    `Unknown Roof Type '${esType.construction.roofType}'.`
                );
            }
        }
    }
}

/**
 * =============================================================================
 * validateExposureValues
 * =============================================================================
 *
 * Phase 4 Subordinate Helper Function
 *
 * Validates governed exposure discriminator values.
 *
 * Responsibilities
 * ----------------
 * - Validate Exposure Category values
 * - Validate Exposure Level values
 * - Update validation statistics
 *
 * Error Codes
 * -----------
 * ES026  Invalid Exposure Value
 *
 * =============================================================================
 */

function validateExposureValues(
    esTypes,
    statistics,
    errors
) {
    const validCategories = new Set(EXPOSURE_CATEGORIES);
    const validLevels = new Set(EXPOSURE_LEVELS);
    statistics.exposureCategoriesChecked = 0;
    statistics.exposureLevelsChecked = 0;
    for (const esType of esTypes) {
        if (esType.exposure === null) {
            continue;
        }
        /*
        ------------------------------------------------------
        Exposure Category
        ------------------------------------------------------
        */
        if (esType.exposure.category !== false) {
            statistics.exposureCategoriesChecked++;
            if (
                !validCategories.has(
                    esType.exposure.category
                )
            ) {
                addValidationError(
                    errors,
                    ERROR_CODES.ES026,
                    esType.id,
                    `Unknown Exposure Category '${esType.exposure.category}'.`
                );
            }
        }
        /*
        ------------------------------------------------------
        Exposure Level
        ------------------------------------------------------
        */
        if (esType.exposure.level !== false) {
            statistics.exposureLevelsChecked++;
            if (
                !validLevels.has(
                    esType.exposure.level
                )
            ) {
                addValidationError(
                    errors,
                    ERROR_CODES.ES026,
                    esType.id,
                    `Unknown Exposure Level '${esType.exposure.level}'.`
                );
            }
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
 * Validates engineering traceability for ES Types.
 *
 * Responsibilities
 * ----------------
 * - Validate source object
 * - Validate source document
 * - Validate source note
 * - Update validation statistics
 *
 * Error Codes
 * -----------
 * ES030  Missing Engineering Traceability
 *
 * =============================================================================
 */

function validateEngineeringTraceability(
    esTypes,
    statistics,
    errors
) {
    statistics.traceabilityRecordsChecked = 0;
    statistics.sourceDocumentsChecked = 0;
    statistics.sourceParasChecked = 0;
    for (const esType of esTypes) {
        statistics.traceabilityRecordsChecked++;
        /*
        ----------------------------------------------------------
        Source Object
        ----------------------------------------------------------
        */
        if (
            !esType.source ||
            typeof esType.source !== "object" ||
            Array.isArray(esType.source)
        ) {
            addValidationError(
                errors,
                ERROR_CODES.ES030,
                esType.id,
                "Engineering traceability (source) is missing."
            );
            continue;
        }
        /*
        ----------------------------------------------------------
        Source Document
        ----------------------------------------------------------
        */
        statistics.sourceDocumentsChecked++;
        if (
            typeof esType.source.document !== "string" ||
            esType.source.document.trim() === ""
        ) {
            addValidationError(
                errors,
                ERROR_CODES.ES030,
                esType.id,
                "Engineering source document is missing."
            );
        }
        /*
        ----------------------------------------------------------
        Source Note
        ----------------------------------------------------------
        */
        statistics.sourceParasChecked++;
        if (
            typeof esType.source.para !== "string" ||
            esType.source.para.trim() === ""
        ) {
            addValidationError(
                errors,
                ERROR_CODES.ES030,
                esType.id,
                "Engineering source para is missing."
            );
        }
    }
}

/**
 * =============================================================================
 * validateEsTypeConsistency
 * =============================================================================
 *
 * Phase 6 Helper Function
 *
 * Validates repository consistency and identifies duplicate engineering
 * definitions.
 *
 * Responsibilities
 * ----------------
 * - Detect duplicate engineering definitions
 * - Generate engineering quality warnings
 * - Update validation statistics
 *
 * Warning Codes
 * -------------
 * ESW001  Duplicate Engineering Definition
 *
 * =============================================================================
 */

function validateEsTypeConsistency(
    esTypes,
    statistics,
    errors,
    warnings
) {
    const definitions = new Map();
    statistics.engineeringDefinitionsChecked = 0;
    statistics.duplicateDefinitionsDetected = 0;
    for (const esType of esTypes) {
        statistics.engineeringDefinitionsChecked++;
        const definition = JSON.stringify({
            structure: esType.structure,
            construction: esType.construction,
            exposure: esType.exposure
        });
        const existing = definitions.get(definition);
        if (existing) {
            statistics.duplicateDefinitionsDetected++;
            addValidationWarning(
                warnings,
                WARNING_CODES.ESW001,
                esType.id,
                `ES Type '${esType.name}' has an identical engineering definition to '${existing.name}'.`
            );
        }
        else {
            definitions.set(definition, {
                id: esType.id,
                name: esType.name
            });
        }
    }
}