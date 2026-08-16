/******************************************************************************
 * validateHazardCategoriesRepository
 *
 * Layer 2 Repository Validator
 *
 * Purpose
 * -------
 * Validates the integrity of the Hazard Categories repository.
 *
 * Responsibilities
 * ----------------
 * This validator is responsible for:
 *
 * - Repository structure validation
 * - Hazard Category definition validation
 * - Governed value validation
 * - Engineering provenance and traceability validation
 * - Repository consistency validation
 *
 * Out of Scope
 * ------------
 * This validator does not:
 *
 * - Validate JSON schema compliance (Layer 1)
 * - Validate cross-repository engineering relationships (Layer 3)
 * - Validate engineering behaviour (Layer 4)
 *
 * Validation Phases
 * -----------------
 * Phase 1 - Lookup Collections
 * Phase 2 - Repository Structure
 * Phase 3 - Engineering Definitions
 * Phase 4 - Governed Values
 * Phase 5 - Engineering Provenance and Traceability
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
    HAZARD_CATEGORY,
    HAZARD_CATEGORY_TYPES,
    INPUT_BASIS_VALUES
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

    id: VALIDATORS.HAZARD_CATEGORIES_REPOSITORY,

    name: "Hazard Categories Repository Integrity",

    layer: 2,

    dataset: "hazardCategories"

};

/******************************************************************************
 * Validator
 ******************************************************************************/

export function validateHazardCategoriesRepository() {

    /*
    --------------------------------------------------------------------------
    Repository Collections
    --------------------------------------------------------------------------
    */

    const hazardCategories =
        repository.getCollection("hazardCategories");

    const effects =
        repository.getCollection("effects");

    /*
    --------------------------------------------------------------------------
    Validation State
    --------------------------------------------------------------------------
    */

    const statistics = {};

    const errors = [];

    const warnings = [];

    /*
    --------------------------------------------------------------------------
    Phase 2
    Repository Structure
    --------------------------------------------------------------------------
    */

    validateRepositoryStructure(
        hazardCategories,
        statistics,
        errors
    );

    /*
    --------------------------------------------------------------------------
    Phase 3
    Engineering Definitions
    --------------------------------------------------------------------------
    */

    validateEngineeringDefinitions(
        hazardCategories,
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
        hazardCategories,
        effects,
        statistics,
        errors
    );

    /*
    --------------------------------------------------------------------------
    Phase 5
    Engineering Provenance and Traceability
    --------------------------------------------------------------------------
    */

    validateEngineeringTraceability(
        hazardCategories,
        statistics,
        errors
    );

    /*
    --------------------------------------------------------------------------
    Phase 6
    Repository Consistency
    --------------------------------------------------------------------------
    */
/*
    validateRepositoryConsistency(
        hazardCategories,
        statistics,
        warnings
    );
*/
    /*
    --------------------------------------------------------------------------
    Validation Result
    --------------------------------------------------------------------------
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
 * Validates the structural integrity of the Hazard Categories repository.
 *
 * Responsibilities
 * ----------------
 * - Validate repository is not empty
 * - Validate unique identifiers
 * - Validate unique codes
 * - Validate unique names
 * - Update validation statistics
 *
 * Error Codes
 * -----------
 * HAZ001  Invalid Repository Structure
 * HAZ002  Duplicate Hazard Category Identifier
 * HAZ003  Duplicate Hazard Category Code
 * HAZ004  Duplicate Hazard Category Name
 *
 * =============================================================================
 */

function validateRepositoryStructure(
    hazardCategories,
    statistics,
    errors
) {
    const identifiers = new Set();
    const codes = new Set();
    const names = new Set();
    statistics.repositoryObjectsChecked = 0;
    statistics.identifiersChecked = 0;
    statistics.codesChecked = 0;
    statistics.namesChecked = 0;
    /*
    --------------------------------------------------------------------------
    Repository Empty
    --------------------------------------------------------------------------
    */
    if (hazardCategories.length === 0) {
        addValidationError(
            errors,
            ERROR_CODES.HAZ001,
            "Repository",
            "Hazard Categories repository is empty."
        );
        return;
    }
    /*
    --------------------------------------------------------------------------
    Repository Objects
    --------------------------------------------------------------------------
    */
    for (const hazardCategory of hazardCategories) {
        statistics.repositoryObjectsChecked++;
        /*
        ----------------------------------------------------------------------
        Identifier
        ----------------------------------------------------------------------
        */
        statistics.identifiersChecked++;
        if (identifiers.has(hazardCategory.id)) {
            addValidationError(
                errors,
                ERROR_CODES.HAZ002,
                hazardCategory.id,
                `Duplicate Hazard Category identifier '${hazardCategory.id}'.`
            );
        }
        identifiers.add(hazardCategory.id);
        /*
        ----------------------------------------------------------------------
        Code
        ----------------------------------------------------------------------
        */
        statistics.codesChecked++;
        if (codes.has(hazardCategory.code)) {
            addValidationError(
                errors,
                ERROR_CODES.HAZ003,
                hazardCategory.id,
                `Duplicate Hazard Category code '${hazardCategory.code}'.`
            );
        }
        codes.add(hazardCategory.code);
        /*
        ----------------------------------------------------------------------
        Name
        ----------------------------------------------------------------------
        */
        statistics.namesChecked++;
        if (names.has(hazardCategory.name)) {
            addValidationError(
                errors,
                ERROR_CODES.HAZ004,
                hazardCategory.id,
                `Duplicate Hazard Category name '${hazardCategory.name}'.`
            );
        }
        names.add(hazardCategory.name);
    }
}

/**
 * =============================================================================
 * validateEngineeringDefinitions
 * =============================================================================
 *
 * Phase 3 Helper Function
 *
 * Validates the engineering definitions contained within the Hazard
 * Categories repository.
 *
 * Responsibilities
 * ----------------
 * - Validate descriptions
 * - Validate parentDivision definitions
 * - Validate active definitions
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Validate governed vocabularies
 * - Validate repository relationships
 * - Validate engineering provenance
 *
 * Error Codes
 * -----------
 * HAZ010  Invalid Hazard Category Definition
 *
 * =============================================================================
 */

function validateEngineeringDefinitions(
    hazardCategories,
    statistics,
    errors
) {
    statistics.hazardDefinitionsChecked = 0;
    statistics.descriptionsChecked = 0;
    statistics.parentDefinitionsChecked = 0;
    statistics.activeFlagsChecked = 0;
    for (const hazardCategory of hazardCategories) {
        statistics.hazardDefinitionsChecked++;
        /*
        ----------------------------------------------------------------------
        Description
        ----------------------------------------------------------------------
        */
        statistics.descriptionsChecked++;
        if (
            typeof hazardCategory.description !== "string" ||
            hazardCategory.description.trim() === ""
        ) {
            addValidationError(
                errors,
                ERROR_CODES.HAZ010,
                hazardCategory.id,
                "Hazard Category description is missing."
            );
        }
        /*
        ----------------------------------------------------------------------
        Parent Division Definition
        ----------------------------------------------------------------------
        */
        statistics.parentDefinitionsChecked++;
        if (
            hazardCategory.parentDivision !== null &&
            (
                typeof hazardCategory.parentDivision !== "string" ||
                hazardCategory.parentDivision.trim() === ""
            )
        ) {
            addValidationError(
                errors,
                ERROR_CODES.HAZ010,
                hazardCategory.id,
                "'parentDivision' must be either null or a non-empty string."
            );
        }
        /*
        ----------------------------------------------------------------------
        Active
        ----------------------------------------------------------------------
        */
        statistics.activeFlagsChecked++;
        if (typeof hazardCategory.active !== "boolean") {
            addValidationError(
                errors,
                ERROR_CODES.HAZ010,
                hazardCategory.id,
                "'active' must be a boolean."
            );
        }
    }
}

/**
 * =============================================================================
 * validateGovernedDependencies
 * =============================================================================
 *
 * Phase 4 Helper Function
 *
 * Validates governed engineering dependencies for the Hazard Categories
 * repository.
 *
 * Responsibilities
 * ----------------
 * - Validate Hazard Category types
 * - Validate parentDivision values
 * - Validate Effect references
 * - Validate supported Quantity Basis values
 *
 * =============================================================================
 */

function validateGovernedDependencies(
    hazardCategories,
    effects,
    statistics,
    errors
) {

    validateHazardCategoryType(
        hazardCategories,
        statistics,
        errors
    );

    validateParentDivision(
        hazardCategories,
        statistics,
        errors
    );

    validateEffects(
        hazardCategories,
        effects,
        statistics,
        errors
    );

    validateSupportedQuantityBasis(
        hazardCategories,
        statistics,
        errors
    );
}

/**
 * =============================================================================
 * validateHazardCategoryType
 * =============================================================================
 *
 * Phase 4.1 Helper Function
 *
 * Validates Hazard Category types against the controlled engineering
 * vocabulary.
 *
 * Responsibilities
 * ----------------
 * - Validate Hazard Category type
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Validate parent divisions
 * - Validate Effect references
 * - Validate Quantity Basis
 *
 * Error Codes
 * -----------
 * HAZ020  Invalid Hazard Category Type
 *
 * =============================================================================
 */

function validateHazardCategoryType(
    hazardCategories,
    statistics,
    errors
) {
    const validTypes = new Set(HAZARD_CATEGORY_TYPES);
    statistics.hazardCategoryTypesChecked = 0;
    for (const hazardCategory of hazardCategories) {
        statistics.hazardCategoryTypesChecked++;
        if (!validTypes.has(hazardCategory.type)) {
            addValidationError(
                errors,
                ERROR_CODES.HAZ020,
                hazardCategory.id,
                `Unknown Hazard Category Type '${hazardCategory.type}'.`
            );
        }
    }
}

/**
 * =============================================================================
 * validateParentDivision
 * =============================================================================
 *
 * Phase 4.2 Helper Function
 *
 * Validates the parent Hazard Division classification for Storage
 * Subdivisions.
 *
 * Responsibilities
 * ----------------
 * - Validate parentDivision values
 * - Validate engineering classification hierarchy
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Validate repository references
 * - Validate Effect references
 * - Validate Quantity Basis
 *
 * Error Codes
 * -----------
 * HAZ021  Invalid Parent Division
 *
 * =============================================================================
 */

function validateParentDivision(
    hazardCategories,
    statistics,
    errors
) {
    statistics.parentDivisionsChecked = 0;
    for (const hazardCategory of hazardCategories) {
        statistics.parentDivisionsChecked++;
        /*
        ----------------------------------------------------------------------
        Hazard Division
        ----------------------------------------------------------------------
        */
        if (hazardCategory.type === HAZARD_CATEGORY.HAZARD_DIVISION) {
            if (hazardCategory.parentDivision !== null) {
                addValidationError(
                    errors,
                    ERROR_CODES.HAZ021,
                    hazardCategory.id,
                    "Hazard Divisions must not define a parentDivision."
                );
            }
            continue;
        }
        /*
        ----------------------------------------------------------------------
        Storage Subdivision
        ----------------------------------------------------------------------
        */
        if (hazardCategory.type === HAZARD_CATEGORY.STORAGE_SUBDIVISION) {
            const expectedParent =
                hazardCategory.code.substring(
                    0,
                    hazardCategory.code.lastIndexOf(".")
                );
            if (hazardCategory.parentDivision !== expectedParent) {
                addValidationError(
                    errors,
                    ERROR_CODES.HAZ021,
                    hazardCategory.id,
                    `Expected parentDivision '${expectedParent}' but found '${hazardCategory.parentDivision}'.`
                );
            }
        }
    }
}

/**
 * =============================================================================
 * validateEffects
 * =============================================================================
 *
 * Phase 4.3 Helper Function
 *
 * Validates Effect references within the Hazard Categories repository.
 *
 * Responsibilities
 * ----------------
 * - Validate referenced Effects exist
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Validate engineering correctness of assigned Effects
 * - Validate duplicate Effect assignments
 * - Validate engineering behaviour
 *
 * Error Codes
 * -----------
 * HAZ022  Invalid Effect Reference
 *
 * =============================================================================
 */

function validateEffects(
    hazardCategories,
    effects,
    statistics,
    errors
) {
    const validEffects = new Set(
        effects.map(effect => effect.id)
    );
    statistics.effectReferencesChecked = 0;
    for (const hazardCategory of hazardCategories) {
        if (!Array.isArray(hazardCategory.effects)) {
            continue;
        }
        for (const effectId of hazardCategory.effects) {
            statistics.effectReferencesChecked++;
            if (!validEffects.has(effectId)) {
                addValidationError(
                    errors,
                    ERROR_CODES.HAZ022,
                    hazardCategory.id,
                    `Unknown Effect '${effectId}'.`
                );
            }
        }
    }
}

/**
 * =============================================================================
 * validateSupportedQuantityBasis
 * =============================================================================
 *
 * Phase 4.4 Helper Function
 *
 * Validates supported Quantity Basis values against the controlled engineering
 * vocabulary.
 *
 * Responsibilities
 * ----------------
 * - Validate supported Quantity Basis values
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Validate engineering suitability of the assigned Quantity Basis
 * - Validate Effect references
 * - Validate parent divisions
 *
 * Error Codes
 * -----------
 * HAZ023  Invalid Supported Quantity Basis
 *
 * =============================================================================
 */

function validateSupportedQuantityBasis(
    hazardCategories,
    statistics,
    errors
) {
    const validInputBasis = new Set(INPUT_BASIS_VALUES);
    statistics.supportedQuantityBasisChecked = 0;
    for (const hazardCategory of hazardCategories) {
        if (!Array.isArray(hazardCategory.supportedQuantityBasis)) {
            continue;
        }
        for (const quantityBasis of hazardCategory.supportedQuantityBasis) {
            statistics.supportedQuantityBasisChecked++;
            if (!validInputBasis.has(quantityBasis)) {
                addValidationError(
                    errors,
                    ERROR_CODES.HAZ023,
                    hazardCategory.id,
                    `Unknown supported Quantity Basis '${quantityBasis}'.`
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
 * Validates engineering provenance and traceability for the Hazard Categories
 * repository.
 *
 * Responsibilities
 * ----------------
 * - Validate source object
 * - Validate source document
 * - Validate source paragraph
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Validate referenced engineering documents
 * - Validate engineering relationships
 *
 * Error Codes
 * -----------
 * HAZ030  Missing Engineering Provenance or Traceability
 *
 * =============================================================================
 */

function validateEngineeringTraceability(
    hazardCategories,
    statistics,
    errors
) {
    statistics.traceabilityRecordsChecked = 0;
    statistics.sourceDocumentsChecked = 0;
    statistics.sourceParagraphsChecked = 0;
    for (const hazardCategory of hazardCategories) {
        statistics.traceabilityRecordsChecked++;
        /*
        ----------------------------------------------------------------------
        Source Object
        ----------------------------------------------------------------------
        */
        if (
            !hazardCategory.source ||
            typeof hazardCategory.source !== "object" ||
            Array.isArray(hazardCategory.source)
        ) {
            addValidationError(
                errors,
                ERROR_CODES.HAZ030,
                hazardCategory.id,
                "Engineering provenance and traceability (source) is missing."
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
            typeof hazardCategory.source.document !== "string" ||
            hazardCategory.source.document.trim() === ""
        ) {
            addValidationError(
                errors,
                ERROR_CODES.HAZ030,
                hazardCategory.id,
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
            typeof hazardCategory.source.para !== "string" ||
            hazardCategory.source.para.trim() === ""
        ) {
            addValidationError(
                errors,
                ERROR_CODES.HAZ030,
                hazardCategory.id,
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
 * Validates repository consistency by identifying duplicate engineering
 * definitions.
 *
 * Responsibilities
 * ----------------
 * - Detect duplicate engineering definitions
 * - Generate repository quality warnings
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Validate engineering provenance
 * - Validate repository structure
 * - Validate governed vocabularies
 *
 * Warning Codes
 * -------------
 * HAZW001  Duplicate Engineering Definition
 *
 * =============================================================================
 */

function validateRepositoryConsistency(
    hazardCategories,
    statistics,
    warnings
) {
    const definitions = new Map();
    statistics.engineeringDefinitionsChecked = 0;
    statistics.duplicateDefinitionsDetected = 0;
    for (const hazardCategory of hazardCategories) {
        statistics.engineeringDefinitionsChecked++;
        /*
        ----------------------------------------------------------------------
        Engineering Definition
        ----------------------------------------------------------------------
        */
        const definition = JSON.stringify({
            code: hazardCategory.code,
            name: hazardCategory.name,
            type: hazardCategory.type
        });
        const existing = definitions.get(definition);
        if (existing) {
            statistics.duplicateDefinitionsDetected++;
            addValidationWarning(
                warnings,
                WARNING_CODES.HAZW001,
                hazardCategory.id,
                `Hazard Category '${hazardCategory.name}' duplicates the engineering definition of '${existing.name}'.`
            );
        }
        else {
            definitions.set(definition, {
                id: hazardCategory.id,
                name: hazardCategory.name
            });
        }
    }
}