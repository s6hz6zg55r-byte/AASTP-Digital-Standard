/******************************************************************************
 * validateInteractionsRepository
 *
 * Layer 2 Repository Validator
 *
 * Purpose
 * -------
 * Validates the integrity of the Interactions repository.
 *
 * The Interactions repository defines the engineering decision matrix used
 * to resolve relationships between Explosive Sites (ES), Potential Explosion
 * Sites (PES) and the resulting engineering outcomes.
 *
 * Responsibilities
 * ----------------
 * This validator is responsible for:
 *
 * - Repository structure validation
 * - Interaction definition validation
 * - Governed dependency validation
 * - Engineering provenance and traceability validation
 * - Repository consistency validation
 *
 * Out of Scope
 * ------------
 * This validator does not:
 *
 * - Validate JSON schema compliance (Layer 1)
 * - Validate engineering completeness (Layer 3)
 * - Execute engineering calculations (Layer 4)
 * - Validate application behaviour
 *
 * Validation Phases
 * -----------------
 * Phase 1 - Repository Collections
 * Phase 2 - Repository Structure
 * Phase 3 - Engineering Definitions
 * Phase 4 - Governed Dependencies
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
    INPUT_BASIS_VALUES,
    ORIENTATION_TYPES,
    INTERACTION_REFERENCE_TYPES
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

    id: VALIDATORS.INTERACTIONS_REPOSITORY,

    name: "Interactions Repository Integrity",

    layer: 2,

    dataset: "interactions"

};

/******************************************************************************
 * Validator
 ******************************************************************************/

export function validateInteractionsRepository() {

    /*
    --------------------------------------------------------------------------
    Repository Collections
    --------------------------------------------------------------------------
    */

    const interactions =
        repository.getCollection("interactions");

    const esTypes =
        repository.getCollection("esTypes");

    const pesTypes =
        repository.getCollection("pesTypes");

    const effects =
        repository.getCollection("effects");

    const hazardCategories =
        repository.getCollection("hazardCategories");

    const constraints =
        repository.getCollection("constraints");

    const distanceRules =
        repository.getCollection("distanceRules");

    const protectionLevels =
        repository.getCollection("protectionLevels");

    const ecmProtectionRatings =
        repository.getCollection("ecmProtectionRatings");

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
        interactions,
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
        interactions,
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
        interactions,
        esTypes,
        pesTypes,
        effects,
        hazardCategories,
        constraints,
        distanceRules,
        protectionLevels,
        ecmProtectionRatings,
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
        interactions,
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
        interactions,
        statistics,
        warnings
    );

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
 * Validates the structural integrity of the Interactions repository.
 *
 * Responsibilities
 * ----------------
 * - Validate repository is not empty
 * - Validate unique interaction identifiers
 * - Validate unique ES/PES orientation configurations
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Validate engineering definitions
 * - Validate repository dependencies
 * - Validate engineering provenance
 *
 * Error Codes
 * -----------
 * INT001  Invalid Repository Structure
 * INT002  Duplicate Interaction Identifier
 * INT003  Duplicate Interaction Configuration
 *
 * =============================================================================
 */

function validateRepositoryStructure(
    interactions,
    statistics,
    errors
) {
    const identifiers = new Set();
    const interactionKeys = new Set();
    statistics.repositoryObjectsChecked = 0;
    statistics.identifiersChecked = 0;
    statistics.interactionsChecked = 0;
    /*
    --------------------------------------------------------------------------
    Repository Empty
    --------------------------------------------------------------------------
    */
    if (interactions.length === 0) {
        addValidationError(
            errors,
            ERROR_CODES.INT001,
            "Repository",
            "Interactions repository is empty."
        );
        return;
    }
    /*
    --------------------------------------------------------------------------
    Repository Objects
    --------------------------------------------------------------------------
    */
    for (const interaction of interactions) {
        statistics.repositoryObjectsChecked++;
        /*
        ----------------------------------------------------------------------
        Identifier
        ----------------------------------------------------------------------
        */
        statistics.identifiersChecked++;
        if (identifiers.has(interaction.id)) {
            addValidationError(
                errors,
                ERROR_CODES.INT002,
                interaction.id,
                `Duplicate Interaction identifier '${interaction.id}'.`
            );
        }
        identifiers.add(interaction.id);
        /*
        ----------------------------------------------------------------------
        Interaction Key
        ----------------------------------------------------------------------
        */
        statistics.interactionsChecked++;
        const interactionKey = [
            interaction.conditions.esType,
            interaction.conditions.orientation.es,
            interaction.conditions.pesType,
            interaction.conditions.orientation.pes
        ].join("|");
        if (interactionKeys.has(interactionKey)) {
            addValidationError(
                errors,
                ERROR_CODES.INT003,
                interaction.id,
                `Duplicate Interaction defined for ES '${interaction.conditions.esType}' (${interaction.conditions.orientation.es}) and PES '${interaction.conditions.pesType}' (${interaction.conditions.orientation.pes}).`
            );
        }
        interactionKeys.add(interactionKey);
    }
}

/**
 * =============================================================================
 * validateEngineeringDefinitions
 * =============================================================================
 *
 * Phase 3 Helper Function
 *
 * Validates the internal engineering definitions contained within interactions.
 *
 * Responsibilities
 * ----------------
 * - Validate effect collections
 * - Validate hazard outcomes
 * - Validate calculated outcomes
 * - Validate non-calculated outcomes
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Validate effect references
 * - Validate hazard references
 * - Validate distance rule references
 * - Validate protection level references
 * 
 * Error Codes
 * -----------
 * INT011  Interaction must contain at least one effect definition
 * INT012  Effect must contain at least one hazard definition
 * INT013  Hazard definition missing hazard identifier
 * INT014  Calculated hazard missing required engineering properties
 * INT015  Non-calculated hazard contains calculation properties
 *
 * =============================================================================
 */

function validateEngineeringDefinitions(
    interactions,
    statistics,
    errors
) {

    statistics.interactionsChecked = 0;

    statistics.effectDefinitionsChecked = 0;

    statistics.hazardDefinitionsChecked = 0;


    for (const interaction of interactions) {

        statistics.interactionsChecked++;


        /*
        ----------------------------------------------------------------------
        Validate Effects Object
        ----------------------------------------------------------------------
        */

        if (
            !interaction.effects ||
            typeof interaction.effects !== "object" ||
            Object.keys(interaction.effects).length === 0
        ) {

            addValidationError(

                errors,

                ERROR_CODES.INT011,

                interaction.id,

                "Interaction must contain at least one effect definition."

            );

            continue;

        }


        /*
        ----------------------------------------------------------------------
        Validate Effects
        ----------------------------------------------------------------------
        */

        for (const [effectId, hazards] of Object.entries(interaction.effects)) {

            statistics.effectDefinitionsChecked++;


            if (
                !Array.isArray(hazards) ||
                hazards.length === 0
            ) {

                addValidationError(

                    errors,

                    ERROR_CODES.INT012,

                    interaction.id,

                    `Effect '${effectId}' must contain at least one hazard definition.`

                );

                continue;

            }


            /*
            ------------------------------------------------------------------
            Validate Hazard Outcomes
            ------------------------------------------------------------------
            */

            for (const hazard of hazards) {

                statistics.hazardDefinitionsChecked++;


                if (!hazard.hazard) {

                    addValidationError(

                        errors,

                        ERROR_CODES.INT013,

                        interaction.id,

                        `Effect '${effectId}' contains hazard definition without hazard identifier.`

                    );

                    continue;

                }


                /*
                --------------------------------------------------------------
                Calculated Outcome
                --------------------------------------------------------------
                */

                if (!hazard.status) {

                    if (
                        !hazard.distanceRule ||
                        !hazard.inputBasis ||
                        !hazard.protectionLevel
                    ) {

                        addValidationError(

                            errors,

                            ERROR_CODES.INT014,

                            interaction.id,

                            `Calculated hazard '${hazard.hazard}' is missing required engineering properties.`

                        );

                    }

                }


                /*
                --------------------------------------------------------------
                Non Calculated Outcome
                --------------------------------------------------------------
                */

                else {

                    if (
                        hazard.distanceRule ||
                        hazard.inputBasis ||
                        hazard.protectionLevel
                    ) {

                        addValidationError(

                            errors,

                            ERROR_CODES.INT015,

                            interaction.id,

                            `Non-calculated hazard '${hazard.hazard}' contains calculation properties.`

                        );

                    }

                }

            }

        }

    }

}

function validateGovernedDependencies(
    interactions,
    esTypes,
    pesTypes,
    effects,
    hazardCategories,
    constraints,
    distanceRules,
    protectionLevels,
    statistics,
    errors
) {

    validateInteractionConditions(
        interactions,
        esTypes,
        pesTypes,
        statistics,
        errors
    );

    validateInteractionOrientations(
        interactions,
        statistics,
        errors
    );

    validateEffectReferences(
        interactions,
        effects,
        statistics,
        errors
    );

    validateHazardReferences(
        interactions,
        hazardCategories,
        statistics,
        errors
    );

    validateDistanceRuleReferences(
        interactions,
        distanceRules,
        statistics,
        errors
    );

    validateProtectionLevelReferences(
        interactions,
        protectionLevels,
        statistics,
        errors
    );

    validateConstraintReferences(
        interactions,
        constraints,
        statistics,
        errors
    );
}

/**
 * =============================================================================
 * validateInteractionConditions
 * =============================================================================
 *
 * Phase 4.1 Helper Function
 *
 * Validates ES and PES references contained within Interaction conditions.
 *
 * Responsibilities
 * ----------------
 * - Validate referenced ES Types exist
 * - Validate referenced PES Types exist
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Validate orientation values
 * - Validate engineering applicability
 * - Validate effects or hazard relationships
 *
 * Error Codes
 * -----------
 * INT020  Invalid ES Type Reference
 * INT021  Invalid PES Type Reference
 *
 * =============================================================================
 */

function validateInteractionConditions(
    interactions,
    esTypes,
    pesTypes,
    statistics,
    errors
) {
    const validEsTypes = new Set(
        esTypes.map(es => es.id)
    );
    const validPesTypes = new Set(
        pesTypes.map(pes => pes.id)
    );
    statistics.esTypeReferencesChecked = 0;
    statistics.pesTypeReferencesChecked = 0;
    for (const interaction of interactions) {
        /*
        ----------------------------------------------------------------------
        Validate ES Type
        ----------------------------------------------------------------------
        */
        statistics.esTypeReferencesChecked++;
        const esType =
            interaction.conditions?.esType;
        if (!validEsTypes.has(esType)) {
            addValidationError(
                errors,
                ERROR_CODES.INT020,
                interaction.id,
                `Unknown ES Type reference '${esType}'.`
            );
        }
        /*
        ----------------------------------------------------------------------
        Validate PES Type
        ----------------------------------------------------------------------
        */
        statistics.pesTypeReferencesChecked++;
        const pesType =
            interaction.conditions?.pesType;
        if (!validPesTypes.has(pesType)) {
            addValidationError(
                errors,
                ERROR_CODES.INT021,
                interaction.id,
                `Unknown PES Type reference '${pesType}'.`
            );
        }
    }
}

/**
 * =============================================================================
 * validateInteractionOrientations
 * =============================================================================
 *
 * Phase 4.2 Helper Function
 *
 * Validates orientation values contained within Interaction conditions.
 *
 * Responsibilities
 * ----------------
 * - Validate ES orientation values
 * - Validate PES orientation values
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Validate ES/PES repository references
 * - Validate orientation applicability
 * - Validate engineering outcomes
 *
 * Error Codes
 * -----------
 * INT022  Invalid ES Orientation
 * INT023  Invalid PES Orientation
 *
 * =============================================================================
 */

function validateInteractionOrientations(
    interactions,
    statistics,
    errors
) {
    const validOrientations = new Set(
        ORIENTATION_TYPES
    );
    statistics.esOrientationsChecked = 0;
    statistics.pesOrientationsChecked = 0;
    for (const interaction of interactions) {
        const orientation =
            interaction.conditions?.orientation;
        if (!orientation) {
            addValidationError(
                errors,
                ERROR_CODES.INT022,
                interaction.id,
                "Interaction orientation definition is missing."
            );
            continue;
        }
        /*
        ----------------------------------------------------------------------
        Validate ES Orientation
        ----------------------------------------------------------------------
        */
        statistics.esOrientationsChecked++;
        if (
            !validOrientations.has(
                orientation.es
            )
        ) {
            addValidationError(
                errors,
                ERROR_CODES.INT022,
                interaction.id,
                `Invalid ES orientation '${orientation.es}'.`
            );
        }
        /*
        ----------------------------------------------------------------------
        Validate PES Orientation
        ----------------------------------------------------------------------
        */
        statistics.pesOrientationsChecked++;
        if (
            !validOrientations.has(
                orientation.pes
            )
        ) {
            addValidationError(
                errors,
                ERROR_CODES.INT023,
                interaction.id,
                `Invalid PES orientation '${orientation.pes}'.`
            );
        }
    }
}

/**
 * =============================================================================
 * validateEffectReferences
 * =============================================================================
 *
 * Phase 4.3 Helper Function
 *
 * Validates Effect references contained within Interaction definitions.
 *
 * Responsibilities
 * ----------------
 * - Validate referenced Effects exist
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Validate Effect engineering content
 * - Validate Hazard Categories
 * - Validate calculation outcomes
 *
 * Error Codes
 * -----------
 * INT024  Invalid Effect Reference
 *
 * =============================================================================
 */

function validateEffectReferences(
    interactions,
    effects,
    statistics,
    errors
) {
    const validEffects = new Set(
        effects.map(effect => effect.id)
    );
    statistics.effectReferencesChecked = 0;
    for (const interaction of interactions) {
        if (
            !interaction.effects ||
            typeof interaction.effects !== "object"
        ) {
            continue;
        }
        for (const effectId of Object.keys(interaction.effects)) {
            statistics.effectReferencesChecked++;
            if (!validEffects.has(effectId)) {
                addValidationError(
                    errors,
                    ERROR_CODES.INT024,
                    interaction.id,
                    `Unknown Effect reference '${effectId}'.`
                );
            }
        }
    }
}

/**
 * =============================================================================
 * validateHazardReferences
 * =============================================================================
 *
 * Phase 4.4 Helper Function
 *
 * Validates Hazard Category references contained within Interaction effects.
 *
 * Responsibilities
 * ----------------
 * - Validate referenced Hazard Categories exist
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Validate Hazard Category applicability
 * - Validate hazard engineering outcomes
 * - Validate distance calculations
 *
 * Error Codes
 * -----------
 * INT025  Invalid Hazard Category Reference
 *
 * =============================================================================
 */

function validateHazardReferences(
    interactions,
    hazardCategories,
    statistics,
    errors
) {
    const validHazardCategories = new Set(
        hazardCategories.map(
            hazardCategory => hazardCategory.id
        )
    );
    statistics.hazardReferencesChecked = 0;
    for (const interaction of interactions) {
        if (
            !interaction.effects ||
            typeof interaction.effects !== "object"
        ) {
            continue;
        }
        for (const hazards of Object.values(interaction.effects)) {
            if (!Array.isArray(hazards)) {
                continue;
            }
            for (const hazard of hazards) {
                statistics.hazardReferencesChecked++;
                if (
                    !validHazardCategories.has(
                        hazard.hazard
                    )
                ) {
                    addValidationError(
                        errors,
                        ERROR_CODES.INT025,
                        interaction.id,
                        `Unknown Hazard Category reference '${hazard.hazard}'.`
                    );
                }
            }
        }
    }
}

/**
 * =============================================================================
 * validateDistanceRuleReferences
 * =============================================================================
 *
 * Phase 4.5 Helper Function
 *
 * Validates Distance Rule references contained within Interaction hazard
 * outcomes.
 *
 * Responsibilities
 * ----------------
 * - Validate referenced Distance Rules exist
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Validate Distance Rule suitability
 * - Validate input basis compatibility
 * - Validate Formula relationships
 * - Validate engineering calculations
 *
 * Error Codes
 * -----------
 * INT026  Invalid Distance Rule Reference
 *
 * =============================================================================
 */

function validateDistanceRuleReferences(
    interactions,
    distanceRules,
    statistics,
    errors
) {
    const validDistanceRules = new Set(
        distanceRules.map(
            distanceRule => distanceRule.id
        )
    );
    statistics.distanceRuleReferencesChecked = 0;
    for (const interaction of interactions) {
        if (
            !interaction.effects ||
            typeof interaction.effects !== "object"
        ) {
            continue;
        }
        for (const hazards of Object.values(interaction.effects)) {
            if (!Array.isArray(hazards)) {
                continue;
            }
            for (const hazard of hazards) {
                /*
                ------------------------------------------------------------------
                Only calculated outcomes should contain distance rules
                ------------------------------------------------------------------
                */
                if (!hazard.distanceRule) {
                    continue;
                }
                statistics.distanceRuleReferencesChecked++;
                if (
                    !validDistanceRules.has(
                        hazard.distanceRule
                    )
                ) {
                    addValidationError(
                        errors,
                        ERROR_CODES.INT026,
                        interaction.id,
                        `Unknown Distance Rule reference '${hazard.distanceRule}'.`
                    );
                }
            }
        }
    }
}

/**
 * =============================================================================
 * validateProtectionLevelReferences
 * =============================================================================
 *
 * Phase 4.6 Helper Function
 *
 * Validates Protection Level references contained within Interaction hazard
 * outcomes.
 *
 * Responsibilities
 * ----------------
 * - Validate referenced Protection Levels exist
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Validate Protection Level applicability
 * - Validate hazard/protection relationships
 * - Validate calculation suitability
 *
 * Error Codes
 * -----------
 * INT027  Invalid Protection Level Reference
 *
 * =============================================================================
 */

function validateProtectionLevelReferences(
    interactions,
    protectionLevels,
    statistics,
    errors
) {
    const validProtectionLevels = new Set(
        protectionLevels.map(
            protectionLevel => protectionLevel.id
        )
    );
    statistics.protectionLevelReferencesChecked = 0;
    for (const interaction of interactions) {
        if (
            !interaction.effects ||
            typeof interaction.effects !== "object"
        ) {
            continue;
        }
        for (const hazards of Object.values(interaction.effects)) {
            if (!Array.isArray(hazards)) {
                continue;
            }
            for (const hazard of hazards) {
                if (!hazard.protectionLevel) {
                    continue;
                }
                statistics.protectionLevelReferencesChecked++;
                if (
                    !validProtectionLevels.has(
                        hazard.protectionLevel
                    )
                ) {
                    addValidationError(
                        errors,
                        ERROR_CODES.INT027,
                        interaction.id,
                        `Unknown Protection Level reference '${hazard.protectionLevel}'.`
                    );
                }
            }
        }
    }
}

/**
 * =============================================================================
 * validateConstraintReferences
 * =============================================================================
 *
 * Phase 4.7 Helper Function
 *
 * Validates Constraint references contained within Interaction hazard outcomes.
 *
 * Responsibilities
 * ----------------
 * - Validate referenced Constraints exist
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Validate constraint applicability
 * - Validate engineering qualifier behaviour
 * - Validate Distance Rule constraint logic
 *
 * Error Codes
 * -----------
 * INT028  Invalid Constraint Reference
 *
 * =============================================================================
 */

function validateConstraintReferences(
    interactions,
    constraints,
    statistics,
    errors
) {
    const validConstraints = new Set(
        constraints.map(
            constraint => constraint.id
        )
    );
    statistics.constraintReferencesChecked = 0;
    for (const interaction of interactions) {
        if (
            !interaction.effects ||
            typeof interaction.effects !== "object"
        ) {
            continue;
        }
        for (const hazards of Object.values(interaction.effects)) {
            if (!Array.isArray(hazards)) {
                continue;
            }
            for (const hazard of hazards) {
                if (
                    !Array.isArray(hazard.constraints)
                ) {
                    continue;
                }
                for (const constraintId of hazard.constraints) {
                    statistics.constraintReferencesChecked++;
                    if (
                        !validConstraints.has(
                            constraintId
                        )
                    ) {
                        addValidationError(
                            errors,
                            ERROR_CODES.INT028,
                            interaction.id,
                            `Unknown Constraint reference '${constraintId}'.`
                        );
                    }
                }
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
 * Validates engineering provenance and traceability for the Interaction
 * repository.
 *
 * Responsibilities
 * ----------------
 * - Validate source object exists
 * - Validate source document
 * - Validate source paragraph
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Validate external documents
 * - Validate engineering interpretation
 * - Validate source correctness
 *

 *
 * =============================================================================
 */

/**
 * =============================================================================
 * validateEngineeringTraceability
 * =============================================================================
 *
 * Phase 5 Helper Function
 *
 * Validates engineering provenance and traceability for Interaction objects.
 *
 * Responsibilities
 * ----------------
 * - Validate source object exists
 * - Validate source document exists
 * - Validate reference object exists
 * - Validate reference type against controlled vocabulary
 *
 * This helper does NOT:
 * - Validate reference-type-specific properties
 * - Validate external source content
 * - Validate engineering interpretation
 * 
 * Error Codes
 * -----------
 * INT030  Missing Engineering Provenance or Traceability
 * INT031  Invalid Source Document Reference
 * INT032  Interaction Table Reference Missing
 * INT033  Interaction Tabel Reference Invalid
 *
 * Future Extension
 * ----------------
 * Reference-type-specific validation will be implemented once provenance
 * schemas are expanded to support multiple reference structures.
 *
 * =============================================================================
 */

function validateEngineeringTraceability(
    interactions,
    statistics,
    errors
) {
    const validReferenceTypes = new Set(
        INTERACTION_REFERENCE_TYPES
    );
    statistics.traceabilityRecordsChecked = 0;
    for (const interaction of interactions) {
        statistics.traceabilityRecordsChecked++;
        /*
        ----------------------------------------------------------------------
        Validate Source
        ----------------------------------------------------------------------
        */
        if (
            !interaction.source ||
            typeof interaction.source !== "object"
        ) {
            addValidationError(
                errors,
                ERROR_CODES.INT030,
                interaction.id,
                "Interaction source reference is missing."
            );
            continue;
        }
        /*
        ----------------------------------------------------------------------
        Validate Document
        ----------------------------------------------------------------------
        */
        if (
            typeof interaction.source.document !== "string" ||
            interaction.source.document.trim() === ""
        ) {
            addValidationError(
                errors,
                ERROR_CODES.INT031,
                interaction.id,
                "Interaction source document is missing."
            );
        }
        /*
        ----------------------------------------------------------------------
        Validate Reference
        ----------------------------------------------------------------------
        */
        const reference =
            interaction.source.reference;
        if (
            !reference ||
            typeof reference !== "object"
        ) {
            addValidationError(
                errors,
                ERROR_CODES.INT032,
                interaction.id,
                "Interaction source reference is missing."
            );
            continue;
        }
        /*
        ----------------------------------------------------------------------
        Validate Reference Type
        ----------------------------------------------------------------------
        */
        if (
            !validReferenceTypes.has(
                reference.type
            )
        ) {
            addValidationError(
                errors,
                ERROR_CODES.INT033,
                interaction.id,
                `Invalid interaction reference type '${reference.type}'.`
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
 * Validates repository consistency within Interaction definitions.
 *
 * Responsibilities
 * ----------------
 * - Detect duplicate hazard outcomes within individual effects
 * - Detect empty effect definitions
 * - Detect duplicate constraint references within hazard outcomes
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Validate engineering correctness
 * - Validate interaction completeness
 * - Validate hazard/effect applicability
 * - Validate calculation suitability
 *
 * Error Codes
 * -----------
 * INT040  Duplicate Hazard Outcome Within Effect
 * INT041  Empty Effect Definition
 * INT042  Duplicate Constraint Reference
 *
 * =============================================================================
 */

function validateRepositoryConsistency(
    interactions,
    statistics,
    warnings,
    errors
) {
    statistics.hazardOutcomesChecked = 0;
    statistics.effectDefinitionsChecked = 0;
    statistics.constraintReferencesChecked = 0;
    for (const interaction of interactions) {
        if (
            !interaction.effects ||
            typeof interaction.effects !== "object"
        ) {
            continue;
        }
        /*
        ----------------------------------------------------------------------
        Validate each effect independently
        ----------------------------------------------------------------------
        */
        for (
            const [effectId, hazards] of Object.entries(interaction.effects)
        ) {
            statistics.effectDefinitionsChecked++;
            /*
            ------------------------------------------------------------------
            Empty effect definition
            ------------------------------------------------------------------
            */
            if (
                !Array.isArray(hazards) ||
                hazards.length === 0
            ) {
                addValidationWarning(
                    warnings,
                    WARNING_CODES.INT041,
                    interaction.id,
                    `Effect '${effectId}' contains no hazard outcomes.`
                );
                continue;
            }
            const hazardDefinitions = new Set();
            /*
            ------------------------------------------------------------------
            Validate hazard outcomes within effect
            ------------------------------------------------------------------
            */
            for (const hazard of hazards) {
                statistics.hazardOutcomesChecked++;
                const hazardKey = JSON.stringify({
                    hazard: hazard.hazard ?? null,
                    status: hazard.status ?? null,
                    distanceRule: hazard.distanceRule ?? null,
                    inputBasis: hazard.inputBasis ?? null,
                    protectionLevel: hazard.protectionLevel ?? null
                });
                if (
                    hazardDefinitions.has(hazardKey)
                ) {
                    addValidationError(
                        errors,
                        ERROR_CODES.INT040,
                        interaction.id,
                        `Duplicate hazard outcome '${hazard.hazard}' within effect '${effectId}'.`
                    );
                }
                hazardDefinitions.add(hazardKey);
                /*
                ------------------------------------------------------------------
                Validate duplicate constraints
                ------------------------------------------------------------------
                */
                if (
                    Array.isArray(hazard.constraints)
                ) {
                    const constraintReferences = new Set();
                    for (
                        const constraint of hazard.constraints
                    ) {
                        statistics.constraintReferencesChecked++;
                        if (
                            constraintReferences.has(constraint)
                        ) {
                            addValidationError(
                                errors,
                                ERROR_CODES.INT042,
                                interaction.id,
                                `Duplicate constraint reference '${constraint}' within hazard '${hazard.hazard}'.`
                            );
                        }
                        constraintReferences.add(constraint);
                    }
                }
            }
        }
    }
}