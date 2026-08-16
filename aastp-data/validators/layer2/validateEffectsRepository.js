/******************************************************************************
 * validateEffectsRepository
 *
 * Layer 2 Repository Validator
 *
 * Purpose
 * -------
 * Validates the integrity of the Effects repository.
 *
 * Responsibilities
 * ----------------
 * This validator is responsible for:
 *
 * - Repository structure validation
 * - Effect definition validation
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
    EFFECT_CATEGORIES
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

    id: VALIDATORS.EFFECTS_REPOSITORY,

    name: "Effects Repository Integrity",

    layer: 2,

    dataset: "effects"

};


export function validateEffectsRepository() {

    /*
    --------------------------------------------------------------------------
    Phase 1
    Lookup Collections
    --------------------------------------------------------------------------
    */

    const effects =
        repository.getCollection("effects");

    /*
    --------------------------------------------------------------------------
    Statistics
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
        effects,
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
        effects,
        statistics,
        errors
    );

    /*
    --------------------------------------------------------------------------
    Phase 4
    Governed Values
    --------------------------------------------------------------------------
    */

    validateGovernedValues(
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
        effects,
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
        effects,
        statistics,
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
 * Validates the structural integrity of the Effects repository.
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
 * EFF001  Invalid Repository Structure
 * EFF002  Duplicate Effect Identifier
 * EFF003  Duplicate Effect Code
 * EFF004  Duplicate Effect Name
 *
 * =============================================================================
 */

function validateRepositoryStructure(
    effects,
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
    if (effects.length === 0) {
        addValidationError(
            errors,
            ERROR_CODES.EFF001,
            "Repository",
            "Effects repository is empty."
        );
        return;
    }
    /*
    --------------------------------------------------------------------------
    Repository Objects
    --------------------------------------------------------------------------
    */
    for (const effect of effects) {
        statistics.repositoryObjectsChecked++;
        /*
        ----------------------------------------------------------------------
        Identifier
        ----------------------------------------------------------------------
        */
        statistics.identifiersChecked++;
        if (identifiers.has(effect.id)) {
            addValidationError(
                errors,
                ERROR_CODES.EFF002,
                effect.id,
                `Duplicate Effect identifier '${effect.id}'.`
            );
        }
        identifiers.add(effect.id);
        /*
        ----------------------------------------------------------------------
        Code
        ----------------------------------------------------------------------
        */
        statistics.codesChecked++;
        if (codes.has(effect.code)) {
            addValidationError(
                errors,
                ERROR_CODES.EFF003,
                effect.id,
                `Duplicate Effect code '${effect.code}'.`
            );
        }
        codes.add(effect.code);
        /*
        ----------------------------------------------------------------------
        Name
        ----------------------------------------------------------------------
        */
        statistics.namesChecked++;
        if (names.has(effect.name)) {
            addValidationError(
                errors,
                ERROR_CODES.EFF004,
                effect.id,
                `Duplicate Effect name '${effect.name}'.`
            );
        }
        names.add(effect.name);
    }
}

/**
 * =============================================================================
 * validateEngineeringDefinitions
 * =============================================================================
 *
 * Phase 3 Helper Function
 *
 * Validates the engineering definitions contained within the Effects
 * repository.
 *
 * Responsibilities
 * ----------------
 * - Validate descriptions
 * - Validate requiresQD definitions
 * - Validate active definitions
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Validate governed vocabularies
 * - Validate engineering provenance
 *
 * Error Codes
 * -----------
 * EFF010  Invalid Effect Definition
 *
 * =============================================================================
 */

function validateEngineeringDefinitions(
    effects,
    statistics,
    errors
) {
    statistics.effectDefinitionsChecked = 0;
    statistics.descriptionsChecked = 0;
    statistics.requiresQDChecked = 0;
    statistics.activeFlagsChecked = 0;
    for (const effect of effects) {
        statistics.effectDefinitionsChecked++;
        /*
        ----------------------------------------------------------------------
        Description
        ----------------------------------------------------------------------
        */
        statistics.descriptionsChecked++;
        if (
            typeof effect.description !== "string" ||
            effect.description.trim() === ""
        ) {
            addValidationError(
                errors,
                ERROR_CODES.EFF010,
                effect.id,
                "Effect description is missing."
            );
        }
        /*
        ----------------------------------------------------------------------
        Requires Quantity Distance
        ----------------------------------------------------------------------
        */
        statistics.requiresQDChecked++;
        if (typeof effect.requiresQD !== "boolean") {
            addValidationError(
                errors,
                ERROR_CODES.EFF010,
                effect.id,
                "'requiresQD' must be a boolean."
            );
        }
        /*
        ----------------------------------------------------------------------
        Active
        ----------------------------------------------------------------------
        */
        statistics.activeFlagsChecked++;
        if (typeof effect.active !== "boolean") {
            addValidationError(
                errors,
                ERROR_CODES.EFF010,
                effect.id,
                "'active' must be a boolean."
            );
        }
    }
}

/**
 * =============================================================================
 * validateGovernedValues
 * =============================================================================
 *
 * Phase 4 Helper Function
 *
 * Validates governed engineering values contained within the Effects
 * repository.
 *
 * Responsibilities
 * ----------------
 * - Validate Effect Categories
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Validate descriptions
 * - Validate primitive values
 * - Validate engineering provenance
 *
 * Error Codes
 * -----------
 * EFF020  Invalid Governed Value
 *
 * =============================================================================
 */

function validateGovernedValues(
    effects,
    statistics,
    errors
) {
    const validCategories = new Set(EFFECT_CATEGORIES);
    statistics.effectCategoriesChecked = 0;
    for (const effect of effects) {
        statistics.effectCategoriesChecked++;
        if (!validCategories.has(effect.category)) {
            addValidationError(
                errors,
                ERROR_CODES.EFF020,
                effect.id,
                `Unknown Effect Category '${effect.category}'.`
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
 * Validates engineering provenance and traceability for the Effects
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
 * - Validate referenced AASTP content
 * - Validate engineering relationships
 *
 * Error Codes
 * -----------
 * EFF030  Missing Engineering Provenance or Traceability
 *
 * =============================================================================
 */

function validateEngineeringTraceability(
    effects,
    statistics,
    errors
) {
    statistics.traceabilityRecordsChecked = 0;
    statistics.sourceDocumentsChecked = 0;
    statistics.sourceParagraphsChecked = 0;
    for (const effect of effects) {
        statistics.traceabilityRecordsChecked++;
        /*
        ----------------------------------------------------------------------
        Source Object
        ----------------------------------------------------------------------
        */
        if (
            !effect.source ||
            typeof effect.source !== "object" ||
            Array.isArray(effect.source)
        ) {
            addValidationError(
                errors,
                ERROR_CODES.EFF030,
                effect.id,
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
            typeof effect.source.document !== "string" ||
            effect.source.document.trim() === ""
        ) {
            addValidationError(
                errors,
                ERROR_CODES.EFF030,
                effect.id,
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
            typeof effect.source.para !== "string" ||
            effect.source.para.trim() === ""
        ) {
            addValidationError(
                errors,
                ERROR_CODES.EFF030,
                effect.id,
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
 * - Generate engineering quality warnings
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Validate engineering provenance
 * - Validate repository structure
 * - Validate governed vocabularies
 *
 * Warning Codes
 * -------------
 * EFFW001  Duplicate Engineering Definition
 *
 * =============================================================================
 */

function validateRepositoryConsistency(
    effects,
    statistics,
    warnings
) {
    const definitions = new Map();
    statistics.engineeringDefinitionsChecked = 0;
    statistics.duplicateDefinitionsDetected = 0;
    for (const effect of effects) {
        statistics.engineeringDefinitionsChecked++;
        /*
        ----------------------------------------------------------------------
        Engineering Definition
        ----------------------------------------------------------------------
        */
        const definition = JSON.stringify({
            category: effect.category,
            requiresQD: effect.requiresQD,
            active: effect.active
        });
        const existing = definitions.get(definition);
        if (existing) {
            statistics.duplicateDefinitionsDetected++;
            addValidationWarning(
                warnings,
                WARNING_CODES.EFFW001,
                effect.id,
                `Effect '${effect.name}' has an identical engineering definition to '${existing.name}'.`
            );
        }
        else {
            definitions.set(definition, {
                id: effect.id,
                name: effect.name
            });
        }
    }
}