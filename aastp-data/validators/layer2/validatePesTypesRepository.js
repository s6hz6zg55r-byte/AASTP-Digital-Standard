/******************************************************************************
 * validatePesTypesRepository
 *
 * Layer 2 Validator
 *
 * Validates repository integrity for the Potential Explosion Site (PES)
 * repository.
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
 * Phase 1 - Lookup Collections
 * Phase 2 - Repository Structure
 * Phase 3 - Engineering Object Definitions
 * Phase 4 - Governed Dependencies
 * Phase 5 - Engineering Traceability
 * Phase 6 - Repository Consistency
 *
 ******************************************************************************/
import repository 
    from "../../repository/repository.js";

import {
    VALIDATORS,
    ERROR_CODES,
    WARNING_CODES
}
    from "../../constants/validationConstants.js";

import {
    PES_SUPPORTED_CONSTRUCTION_DISCRIMINATORS,
    //EXPOSURE_CATEGORIES,
    //EXPOSURE_LEVELS,
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

    id: VALIDATORS.PES_TYPES_REPOSITORY,

    name: "PES Types Repository Integrity",

    layer: 2,

    dataset: "pesTypes"

};

/**
 * =============================================================================
 * validatePesTypesRepository
 * =============================================================================
 */

export function validatePesTypesRepository() {

    const errors = [];

    const warnings = [];

    const statistics = {};


    /*
    ==========================================================
    Phase 1
    Build Lookup Collections
    ==========================================================
    */
    
    const pesTypes =
        repository.getCollection("pesTypes");
    
    const metadata =
        repository.getMetadata("pesTypes");
    
    const structures =
        repository.getCollection("structures");
    

    /*
    --------------------------------------------------------------------------
    Phase 2
    Repository Structure
    --------------------------------------------------------------------------
    */

    validateRepositoryStructure(
        pesTypes,
        statistics,
        errors
    );

    /*
    --------------------------------------------------------------------------
    Phase 3
    Engineering Object Definitions
    --------------------------------------------------------------------------
    */

    validateEngineeringObjectDefinitions(
        pesTypes,
        statistics,
        errors
    );

    /*
    --------------------------------------------------------------------------
    Phase 4
    Governed Dependencies
    --------------------------------------------------------------------------
    */

    validateGovernedDependencies(
        pesTypes,
        structures,
        statistics,
        errors
    );

    /*
    --------------------------------------------------------------------------
    Phase 5
    Engineering Traceability
    --------------------------------------------------------------------------
    */

    validateEngineeringTraceability(
        pesTypes,
        statistics,
        errors
    );

    /*
    --------------------------------------------------------------------------
    Phase 6
    Repository Consistency
    --------------------------------------------------------------------------
    */

    validateRepositoryConsistency(
        pesTypes,
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
 * validateRepositoryStructure
 * =============================================================================
 *
 * Phase 2 Helper Function
 *
 * Validates the structural integrity of the PES Types repository.
 *
 * Responsibilities
 * ----------------
 * - Validate repository is not empty
 * - Validate unique identifiers
 * - Validate unique names
 * - Update validation statistics
 *
 * Error Codes
 * -----------
 * PES001  Invalid Repository Structure
 * PES002  Duplicate PES Type Identifier
 * PES003  Duplicate PES Type Name
 *
 * =============================================================================
 */

function validateRepositoryStructure(
    pesTypes,
    statistics,
    errors
) {
    const identifiers = new Set();
    const names = new Set();
    statistics.repositoryObjectsChecked = 0;
    statistics.identifiersChecked = 0;
    statistics.namesChecked = 0;
    /*
    --------------------------------------------------------------------------
    Repository Empty
    --------------------------------------------------------------------------
    */
    if (pesTypes.length === 0) {
        addValidationError(
            errors,
            ERROR_CODES.PES001,
            "Repository",
            "PES Types repository is empty."
        );
        return;
    }
    /*
    --------------------------------------------------------------------------
    Repository Objects
    --------------------------------------------------------------------------
    */
    for (const pesType of pesTypes) {
        statistics.repositoryObjectsChecked++;
        /*
        ----------------------------------------------------------------------
        Identifier
        ----------------------------------------------------------------------
        */
        statistics.identifiersChecked++;
        if (identifiers.has(pesType.id)) {
            addValidationError(
                errors,
                ERROR_CODES.PES002,
                pesType.id,
                `Duplicate PES Type identifier '${pesType.id}'.`
            );
        }
        identifiers.add(pesType.id);
        /*
        ----------------------------------------------------------------------
        Name
        ----------------------------------------------------------------------
        */
        statistics.namesChecked++;
        if (names.has(pesType.name)) {
            addValidationError(
                errors,
                ERROR_CODES.PES003,
                pesType.id,
                `Duplicate PES Type name '${pesType.name}'.`
            );
        }
        names.add(pesType.name);
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
 * PES Types repository.
 *
 * Responsibilities
 * ----------------
 * - Validate construction discriminator group
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Validate Structure references
 * - Validate discriminator applicability
 * - Validate governed engineering values
 *
 * Error Codes
 * -----------
 * PES010  Invalid construction definition
 *
 * =============================================================================
 */

function validateEngineeringObjectDefinitions(
    pesTypes,
    statistics,
    errors
) {
    statistics.definitionsChecked = 0;
    statistics.constructionDefinitionsChecked = 0;
    for (const pesType of pesTypes) {
        statistics.definitionsChecked++;
        /*
        ----------------------------------------------------------
        Construction
        ----------------------------------------------------------
        */
        if (pesType.construction !== null) {
            if (
                typeof pesType.construction !== "object" ||
                Array.isArray(pesType.construction)
            ) {
                addValidationError(
                    errors,
                    ERROR_CODES.PES010,
                    pesType.id,
                    "construction must be either null or an object."
                );
            }
            else {
                statistics.constructionDefinitionsChecked++;
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
    pesTypes,
    structures,
    statistics,
    errors
) {

    validateStructureReference(
        pesTypes,
        structures,
        statistics,
        errors
    );

    validateConstructionApplicability(
        pesTypes,
        structures,
        statistics,
        errors
    );

    validateConstructionDiscriminators(
        pesTypes,
        structures,
        statistics,
        errors
    );

    validateGovernedValues(
        pesTypes,
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
 * Validates that each PES Type references a valid Structure.
 *
 * Responsibilities
 * ----------------
 * - Validate Structure references
 * - Update validation statistics
 *
 * Error Codes
 * -----------
 * PES020  Unknown Structure reference
 *
 * =============================================================================
 */

function validateStructureReference(
    pesTypes,
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
    for (const pesType of pesTypes) {
        statistics.structureReferencesChecked++;
        if (!validStructures.has(pesType.structure)) {
            addValidationError(
                errors,
                ERROR_CODES.PES020,
                pesType.id,
                `Unknown Structure '${pesType.structure}'.`
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
 * Validates that each PES Type contains the appropriate construction
 * discriminators required by its referenced Structure.
 *
 * Responsibilities
 * ----------------
 * - Validate construction applicability
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Validate discriminator values
 * - Validate governed vocabularies
 *
 * Error Codes
 * -----------
 * PES021  Invalid Construction Applicability
 *
 * =============================================================================
 */

function validateConstructionApplicability(
    pesTypes,
    structures,
    statistics,
    errors
) {
    const structureMap = new Map(
        structures.map(
            structure => [structure.id, structure]
        )
    );
    statistics.constructionApplicabilityChecked = 0;
    for (const pesType of pesTypes) {
        const structure = structureMap.get(pesType.structure);
        if (!structure) {
            continue;
        }
        statistics.constructionApplicabilityChecked++;
        const supported =
            structure.supportedProperties ?? {};
        const construction =
            pesType.construction;
        /*
        ----------------------------------------------------------------------
        Construction Required
        ----------------------------------------------------------------------
        */
        const constructionRequired =
            Object.entries(supported)
                .filter(
                    ([property]) =>
                        PES_SUPPORTED_CONSTRUCTION_DISCRIMINATORS.includes(property)
                )
                .some(
                    ([, required]) => required === true
                );
        if (constructionRequired) {
            if (construction === null) {
                addValidationError(
                    errors,
                    ERROR_CODES.PES021,
                    pesType.id,
                    "Construction definition is required because the referenced Structure supports construction properties."
                );
            }
        }
        /*
        ----------------------------------------------------------------------
        Construction Not Applicable
        ----------------------------------------------------------------------
        */
        else {
            if (construction !== null) {
                addValidationError(
                    errors,
                    ERROR_CODES.PES021,
                    pesType.id,
                    "Construction definition must be null because the referenced Structure does not support construction properties."
                );
            }
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
 * Validates construction discriminator applicability against the referenced
 * Structure.
 *
 * Responsibilities
 * ----------------
 * - Validate construction discriminator applicability
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Validate discriminator values
 * - Validate governed vocabularies
 *
 * Error Codes
 * -----------
 * PES022  Invalid Construction Discriminator
 *
 * =============================================================================
 */

function validateConstructionDiscriminators(
    pesTypes,
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
    for (const pesType of pesTypes) {
        const structure = structureLookup.get(pesType.structure);
        if (!structure) {
            continue;
        }
        if (pesType.construction === null) {
            continue;
        }
        for (const property of PES_SUPPORTED_CONSTRUCTION_DISCRIMINATORS) {
            const applicable =
                structure.supportedProperties?.[property];
            /*
            ------------------------------------------------------
            Structure definition incomplete
            ------------------------------------------------------
            */
            if (applicable === undefined) {
                addValidationError(
                    errors,
                    ERROR_CODES.PES022,
                    pesType.id,
                    `Structure '${structure.id}' does not define applicability for construction discriminator '${property}'.`
                );
                continue;
            }
            statistics.constructionDiscriminatorsChecked++;
            /*
            ------------------------------------------------------
            Property not applicable
            ------------------------------------------------------
            */
            if (!applicable) {
                if (pesType.construction[property] !== null) {
                    addValidationError(
                        errors,
                        ERROR_CODES.PES022,
                        pesType.id,
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
            if (!(property in pesType.construction)) {
                addValidationError(
                    errors,
                    ERROR_CODES.PES022,
                    pesType.id,
                    `'${property}' is required because it is supported by Structure '${structure.id}'.`
                );
            }
        }
    }
}

/**
 * =============================================================================
 * validateGovernedValues
 * =============================================================================
 *
 * Phase 4 Subordinate Helper Function
 *
 * Validates governed construction discriminator values.
 *
 * Responsibilities
 * ----------------
 * - Validate Roof Type values
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Validate discriminator applicability
 * - Validate boolean values
 *
 * Error Codes
 * -----------
 * PES023  Invalid Governed Value
 *
 * =============================================================================
 */

function validateGovernedValues(
    pesTypes,
    statistics,
    errors
) {
    const validRoofTypes = new Set(ROOF_TYPES);
    statistics.roofTypesChecked = 0;
    for (const pesType of pesTypes) {
        if (pesType.construction === null) {
            continue;
        }
        /*
        ----------------------------------------------------------------------
        Roof Type
        ----------------------------------------------------------------------
        */
        if (pesType.construction.roofType !== null) {
            statistics.roofTypesChecked++;
            if (
                !validRoofTypes.has(
                    pesType.construction.roofType
                )
            ) {
                addValidationError(
                    errors,
                    ERROR_CODES.PES023,
                    pesType.id,
                    `Unknown Roof Type '${pesType.construction.roofType}'.`
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
 * Validates engineering traceability for PES Types.
 *
 * Responsibilities
 * ----------------
 * - Validate source object
 * - Validate source document
 * - Validate source paragraph
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Validate referenced AASTP content
 * - Validate engineering relationships
 *
 * Error Codes
 * -----------
 * PES030  Missing Engineering Traceability
 *
 * =============================================================================
 */

function validateEngineeringTraceability(
    pesTypes,
    statistics,
    errors
) {
    statistics.traceabilityRecordsChecked = 0;
    statistics.sourceDocumentsChecked = 0;
    statistics.sourceParagraphsChecked = 0;
    for (const pesType of pesTypes) {
        statistics.traceabilityRecordsChecked++;
        /*
        ----------------------------------------------------------------------
        Source Object
        ----------------------------------------------------------------------
        */
        if (
            !pesType.source ||
            typeof pesType.source !== "object" ||
            Array.isArray(pesType.source)
        ) {
            addValidationError(
                errors,
                ERROR_CODES.PES030,
                pesType.id,
                "Engineering traceability (source) is missing."
            );
            continue;
        }
        /*
        ----------------------------------------------------------------------
        Source Document
        ----------------------------------------------------------------------
        */
        statistics.sourceDocumentsChecked++;
        if (
            typeof pesType.source.document !== "string" ||
            pesType.source.document.trim() === ""
        ) {
            addValidationError(
                errors,
                ERROR_CODES.PES030,
                pesType.id,
                "Engineering source document is missing."
            );
        }
        /*
        ----------------------------------------------------------------------
        Source Paragraph
        ----------------------------------------------------------------------
        */
        statistics.sourceParagraphsChecked++;
        if (
            typeof pesType.source.para !== "string" ||
            pesType.source.para.trim() === ""
        ) {
            addValidationError(
                errors,
                ERROR_CODES.PES030,
                pesType.id,
                "Engineering source paragraph is missing."
            );
        }
    }
}

/**
 * =============================================================================
 * validateRepositoryConsistency
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
 * This helper does NOT:
 * - Determine engineering intent
 * - Validate engineering relationships
 *
 * Warning Codes
 * -------------
 * PESW001  Duplicate Engineering Definition
 *
 * =============================================================================
 */

function validateRepositoryConsistency(
    pesTypes,
    statistics,
    warnings
) {
    const definitions = new Map();
    statistics.engineeringDefinitionsChecked = 0;
    statistics.duplicateDefinitionsDetected = 0;
    for (const pesType of pesTypes) {
        statistics.engineeringDefinitionsChecked++;
        /*
        ----------------------------------------------------------------------
        Engineering Definition
        ----------------------------------------------------------------------
        */
        const definition = JSON.stringify({
            structure: pesType.structure,
            construction: pesType.construction
        });
        const existing = definitions.get(definition);
        if (existing) {
            statistics.duplicateDefinitionsDetected++;
            addValidationWarning(
                warnings,
                WARNING_CODES.PESW001,
                pesType.id,
                `PES Type '${pesType.name}' has an identical engineering definition to '${existing.name}'.`
            );
        }
        else {
            definitions.set(definition, {
                id: pesType.id,
                name: pesType.name
            });
        }
    }
}