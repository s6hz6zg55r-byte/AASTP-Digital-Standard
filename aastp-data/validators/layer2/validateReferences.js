/**
 * -----------------------------------------------------------------------------
 * Validator: validateReferences.js
 * -----------------------------------------------------------------------------
 *
 * Validator ID
 * ------------
 * VAL-L2-REF-001
 *
 * Purpose
 * --------
 * Validates repository-wide reference integrity.
 *
 * This validator confirms that cross-references between repository datasets
 * resolve to valid repository objects.
 *
 * Validation Layer
 * ----------------
 * Layer 2 - Repository Integrity Validation
 *
 * Inputs
 * ------
 * Repository
 *
 * Output
 * ------
 * ValidationResult
 *
 * Dependencies
 * ------------
 * Repository
 * buildValidationResult()
 * addValidationError()
 * addValidationWarning()
 * buildIdSet()
 * buildIdMap()
 *
 * Future Extension Points
 * -----------------------
 * • Additional repository datasets
 * • National tailoring datasets
 * • Future AASTP chapters
 * 
 * Error Codes
 * ------------
 * REF001 - Unknown Orientation Type Reference
 * REF002 - Unknown Structure Reference
 * REF003 - Unknown PES Type Reference
 * REF004 - Unknown ES Type Reference
 * REF005 - (DEPRECATED) Unknown Interaction Reference
 * REF006 - Unknown Effect
 * REF007 - Unknown Hazard Category
 * REF008 - Unknown Constraint
 * REF009 - Unknown Distance Rule
 * REF010 - Unknown Protection Level
 * REF011 - Unknown ECM Protection Rating
 * ENG001 - Missing/conflicting definition
 * ENG002 - Missing Input Basis
 * ENG003 - Missing Protection Level
 * ENG004 - Invalid Input Basis
 * ENG005 - Invalid Status
 * ENG006 - Duplicate Hazard, Protection Level, Constraint Definitions within Effect
 * 
 * -----------------------------------------------------------------------------
 */


import repository from "../../repository/repository.js";

import { buildValidationResult }
    from "../utils/buildValidationResult.js";

import { addValidationError }
    from "../utils/addValidationError.js";

import { addValidationWarning }
    from "../utils/addValidationWarning.js";

import { buildIdSet }
    from "../../repository/utils/buildIdSet.js";

import { buildIdMap }
    from "../../repository/utils/buildIdMap.js";

const validator = {

    id: "VAL-L2-REF-001",

    layer: 2,

    dataset: "repository",

    name: "Repository Reference Integrity"

};

import {
    INPUT_BASIS_VALUES,
    ENGINEERING_STATUS_VALUES
} from "../../constants/engineeringConstants.js";
import { ERROR_CODES } from "../../constants/validationConstants.js";

export function validateReferences() {

    const errors = [];

    const warnings = [];

    const statistics = {

        structuresChecked: 0,

        pesTypesChecked: 0,

        esTypesChecked: 0,

        interactionsChecked: 0,

        effectsChecked: 0

    };

    /*
    ==========================================================
    Phase 1
    Build lookup collections
    ==========================================================
    */

    const constraints = repository.getCollection("constraints");

    const constraintIds = buildIdSet( constraints, "constraints" );

    const constraintMap = buildIdMap( constraints, "id", "constraints" );

    const distanceRules = repository.getCollection("distanceRules");

    const distanceRuleIds = buildIdSet( distanceRules, "distanceRules" );

    const distanceRuleMap = buildIdMap( distanceRules, "id", "distanceRules" );

    const ecmProtectionRatings = repository.getCollection("ecmProtectionRatings");

    const ecmProtectionRatingIds = buildIdSet( ecmProtectionRatings, "ecmProtectionRatings" );

    const ecmProtectionRatingMap = buildIdMap( ecmProtectionRatings, "id", "ecmProtectionRatings" );

    const effects = repository.getCollection("effects");

    const effectIds = buildIdSet( effects, "effects" );

    const effectMap = buildIdMap( effects, "id", "effects" );

    const esTypes = repository.getCollection("esTypes");

    const esTypeIds = buildIdSet( esTypes, "esTypes" );

    const esTypeMap = buildIdMap( esTypes, "id", "esTypes" );

    const formulas = repository.getCollection("formulas");

    const formulaIds = buildIdSet( formulas, "formulas" );

    const formulaMap = buildIdMap( formulas, "id", "formulas" );

    const hazardCategories = repository.getCollection("hazardCategories");

    const hazardCategoryIds = buildIdSet( hazardCategories, "hazardCategories" );

    const hazardCategoryMap = buildIdMap( hazardCategories, "id", "hazardCategories" );

    const interactions = repository.getCollection("interactions");

    const interactionIds = buildIdSet( interactions, "interactions" );

    const interactionMap = buildIdMap( interactions, "id", "interactions" );

    const orientationTypes = repository.getCollection("orientationTypes");

    const orientationTypeIds = buildIdSet( orientationTypes, "orientationTypes" );

    const orientationTypeMap = buildIdMap( orientationTypes, "id", "orientationTypes" );

    const pesTypes = repository.getCollection("pesTypes");

    const pesTypeIds = buildIdSet( pesTypes, "pesTypes" );

    const pesTypeMap = buildIdMap( pesTypes, "id", "pesTypes" );

    const protectionLevels = repository.getCollection("protectionLevels");

    const protectionLevelIds = buildIdSet( protectionLevels, "protectionLevels" );

    const protectionLevelMap = buildIdMap( protectionLevels, "id", "protectionLevels" );

    const structures = repository.getCollection("structures");

    const structureIds = buildIdSet( structures, "Structures" );

    const structureMap = buildIdMap( structures, "id", "Structures" );

    const transformations = repository.getCollection("transformations");

    const transformationIds = buildIdSet( transformations, "transformations" );

    const transformationMap = buildIdMap( transformations, "id", "transformations" );

    /*
    ===============================================================================
    Repository lookup collections complete.
    All subsequent validation phases consume these collections and shall not
    access the Repository directly.
    ===============================================================================
    */

    /*
    ==========================================================
    Phase 2
    Validate Structure References
    ==========================================================
    */

    statistics.structuresChecked = structures.length;

    validateStructureReferences(
        structures,
        orientationTypeIds,
        errors
    );

    /*
    ==========================================================
    Phase 3
    Validate Store Type References
    ==========================================================
    */

    statistics.pesTypesChecked = pesTypes.length;

    statistics.esTypesChecked = esTypes.length;

    validatePesTypeReferences(
        pesTypes,
        structureIds,
        errors
    );

    validateEsTypeReferences(
        esTypes,
        structureIds,
        errors
    );

    /*
    ==========================================================
    Phase 4
    Validate Interaction Structure
    ==========================================================
    */

    validateInteractionEffects(
        interactions,
        effectIds,
        statistics,
        errors
    );

    validateHazardDefinitions(
        interactions,
        hazardCategoryIds,
        statistics,
        errors
    );

    validateConstraintReferences(
        interactions,
        constraintIds,
        statistics,
        errors
    );

    /*
    ==========================================================
    Phase 5
    Validate Engineering References
    ==========================================================
    */

    validateDistanceRuleReferences(
        interactions,
        distanceRuleIds,
        statistics,
        errors
    );

    validateProtectionLevelReferences(
        interactions,
        protectionLevelIds,
        statistics,
        errors
    );

    validateEcmProtectionRatings(
        interactions,
        ecmProtectionRatingIds,
        statistics,
        errors
    );

    /*
    ==========================================================
    Phase 6
    Validate Engineering Definition Integrity
    ==========================================================
    */

    validateEngineeringDefinitions(
        interactions,
        statistics,
        errors
    );

    validateEngineeringDefinitionUniqueness(
        interactions,
        statistics,
        errors
    );

    /*
    ==========================================================
    Phase 7
    Build Validation Result
    ==========================================================
    */

    return buildValidationResult(

        validator,

        errors,

        warnings,

        statistics

    );

}

/*
===============================================================================
Usage Examples
===============================================================================

Example 1 - Repository Validation

const result =
    validateReferences();


Example 2 - Validation Pipeline

const results = [

    validateDistanceRulesRepository(),

    validateReferences()

];


Example 3 - Repository Release Validation

const result =
    validateReferences();

if (!result.passed) {

    ...

}

===============================================================================
*/

function validateStructureReferences(
    structures,
    orientationTypeIds,
    errors
) {
    for (const structure of structures) {
        if (!orientationTypeIds.has(structure.orientationType)) {
            addValidationError(
                errors,
                "REF001",
                structure.id,
                ERROR_CODES.REF001 + `'${structure.orientationType}'.`
            );
        }
    }
}

function validatePesTypeReferences(
    pesTypes,
    structureIds,
    errors
) {
    for (const pesType of pesTypes) {
        if (!structureIds.has(pesType.structure)) {
            addValidationError(
                errors,
                "REF002",
                pesType.id,
                ERROR_CODES.REF002 + `'${pesType.structure}'.`
            );
        }
    }
}

function validateEsTypeReferences(
    esTypes,
    structureIds,
    errors
) {
    for (const esType of esTypes) {
        if (!structureIds.has(esType.structure)) {
            addValidationError(
                errors,
                "REF002",
                esType.id,
                ERROR_CODES.REF002 + `'${esType.structure}'.`
            );
        }
    }
}

function validateInteractionEffects(
    interactions,
    effectIds,
    statistics,
    errors
) {
    statistics.effectsChecked = 0;
    for (const interaction of interactions) {
        for (const effectId of Object.keys(interaction.effects ?? {})) {
            statistics.effectsChecked++;
            if (!effectIds.has(effectId)) {
                addValidationError(
                    errors,
                    "REF006",
                    interaction.id,
                    ERROR_CODES.REF006 + `'${effectId}'.`
                );
            }
        }
    }
}

function validateHazardDefinitions(
    interactions,
    hazardCategoryIds,
    statistics,
    errors
) {
    statistics.hazardsChecked = 0;
    for (const interaction of interactions) {
        for (const hazardDefinitions of Object.values(interaction.effects ?? {})) {
            for (const definition of hazardDefinitions) {
                statistics.hazardsChecked++;
                if (!hazardCategoryIds.has(definition.hazard)) {
                    addValidationError(
                        errors,
                        "REF007",
                        interaction.id,
                        ERROR_CODES.REF007 + `'${definition.hazard}'.`
                    );
                }
            }
        }
    }
}

function validateConstraintReferences(
    interactions,
    constraintIds,
    statistics,
    errors
) {
    statistics.constraintsChecked = 0;
    for (const interaction of interactions) {
        for (const hazardDefinitions of Object.values(interaction.effects ?? {})) {
            for (const definition of hazardDefinitions) {
                for (const constraint of definition.constraints ?? []) {
                    statistics.constraintsChecked++;
                    if (!constraintIds.has(constraint)) {
                        addValidationError(
                            errors,
                            "REF008",
                            interaction.id,
                            ERROR_CODES.REF008 + `'${constraint}'.`
                        );
                    }
                }
            }
        }
    }
}

function validateDistanceRuleReferences(
    interactions,
    distanceRuleIds,
    statistics,
    errors
) {
    statistics.distanceRulesChecked = 0;
    for (const interaction of interactions) {
        for (const hazardDefinitions of Object.values(interaction.effects ?? {})) {
            for (const definition of hazardDefinitions) {
                if (!definition.distanceRule) {
                    continue;
                }
                statistics.distanceRulesChecked++;
                if (!distanceRuleIds.has(definition.distanceRule)) {
                    addValidationError(
                        errors,
                        "REF009",
                        interaction.id,
                        ERROR_CODES.REF009 + `'${definition.distanceRule}'.`
                    );
                }
            }
        }
    }
}

function validateProtectionLevelReferences(
    interactions,
    protectionLevelIds,
    statistics,
    errors
) {
    statistics.protectionLevelsChecked = 0;
    for (const interaction of interactions) {
        for (const hazardDefinitions of Object.values(interaction.effects ?? {})) {
            for (const definition of hazardDefinitions) {
                if (!definition.protectionLevel) {
                    continue;
                }
                statistics.protectionLevelsChecked++;
                if (!protectionLevelIds.has(definition.protectionLevel)) {
                    addValidationError(
                        errors,
                        "REF010",
                        interaction.id,
                        ERROR_CODES.REF010 + `'${definition.protectionLevel}'.`
                    );
                }
            }
        }
    }
}

function validateEcmProtectionRatings(
    interactions,
    ecmProtectionRatingIds,
    statistics,
    errors
) {
    statistics.ecmProtectionRatingsChecked = 0;
    for (const interaction of interactions) {
        for (const hazardDefinitions of Object.values(interaction.effects ?? {})) {
            for (const definition of hazardDefinitions) {
                if (!definition.ecmProtectionRating) {
                    continue;
                }
                statistics.ecmProtectionRatingsChecked++;
                if (!ecmProtectionRatingIds.has(definition.ecmProtectionRating)) {
                    addValidationError(
                        errors,
                        "REF011",
                        interaction.id,
                        ERROR_CODES.REF011 + `'${definition.ecmProtectionRating}'.`
                    );
                }
            }
        }
    }
}

function validateEngineeringDefinitions(
    interactions,
    statistics,
    errors
) {
    statistics.engineeringDefinitionsChecked = 0;
    for (const interaction of interactions) {
        for (const hazardDefinitions of Object.values(interaction.effects ?? {})) {
            for (const definition of hazardDefinitions) {
                statistics.engineeringDefinitionsChecked++;
                const hasDistanceRule =
                    definition.distanceRule !== undefined;
                const hasStatus =
                    definition.status !== undefined;
                /*
                --------------------------------------------------
                ENG001
                Must contain either
                distanceRule
                OR
                status
                --------------------------------------------------
                */
                if (hasDistanceRule === hasStatus) {
                    addValidationError(
                        errors,
                        "ENG001",
                        interaction.id,
                        ERROR_CODES.ENG001
                    );
                }
                /*
                --------------------------------------------------
                ENG002
                Distance Rule requires Input Basis
                --------------------------------------------------
                */
                if (
                    hasDistanceRule &&
                    !definition.inputBasis
                ) {
                    addValidationError(
                        errors,
                        "ENG002",
                        interaction.id,
                        ERROR_CODES.ENG002
                    );
                }
                /*
                --------------------------------------------------
                ENG003

                Distance Rule requires Protection Level

                --------------------------------------------------
                */
                if (
                    hasDistanceRule &&
                    !definition.protectionLevel
                ) {
                    addValidationError(
                        errors,
                        "ENG003",
                        interaction.id,
                        ERROR_CODES.ENG003
                    );
                }
                /*
                --------------------------------------------------
                ENG004

                Valid Input Basis

                --------------------------------------------------
                */
                if (
                    definition.inputBasis &&
                    !INPUT_BASIS_VALUES.includes(
                        definition.inputBasis
                    )
                ) {
                    addValidationError(
                        errors,
                        "ENG004",
                        interaction.id,
                        ERROR_CODES.ENG004 + `'${definition.inputBasis}'.`
                    );
                }
                /*
                --------------------------------------------------
                ENG005

                Valid Status

                --------------------------------------------------
                */
                if (
                    definition.status &&
                    !ENGINEERING_STATUS_VALUES.includes(
                        definition.status
                    )
                ) {
                    addValidationError(
                        errors,
                        "ENG005",
                        interaction.id,
                        ERROR_CODES.ENG005 + `'${definition.status}'.`
                    );
                }
            }
        }
    }
}
/*
function validateDuplicateEngineeringDefinitions(
    interactions,
    statistics,
    errors
) {
    statistics.hazardDefinitionsChecked = 0;
    for (const interaction of interactions) {
        for (const [effectId, hazardDefinitions] of Object.entries(interaction.effects ?? {})) {
            const hazards = new Set();
            for (const definition of hazardDefinitions) {
                statistics.hazardDefinitionsChecked++;
                if (hazards.has(definition.hazard)) {
                    addValidationError(
                        errors,
                        "ENG006",
                        interaction.id,
                        `Duplicate engineering definition for hazard '${definition.hazard}' in effect '${effectId}'.`
                    );
                }
                hazards.add(definition.hazard);
            }
        }
    }
}
*/
/**
 * =============================================================================
 * validateEngineeringDefinitionUniqueness
 * =============================================================================
 * Validates that each engineering definition within an Effect is unique.
 *
 * A unique engineering definition is identified by:
 *   - Hazard
 *   - Protection Level
 *   - Normalised Constraint Set
 *
 * Multiple definitions for the same hazard are permitted provided they represent
 * distinct engineering contexts (e.g. different protection levels or different
 * constraint sets).
 *
 * Error Code:
 *   ENG006 - Duplicate Engineering Definition
 * =============================================================================
 */
function validateEngineeringDefinitionUniqueness(
    interactions,
    statistics,
    errors
) {
    statistics.hazardDefinitionsChecked = 0;
    for (const interaction of interactions) {
        for (const [effectId, hazardDefinitions] of Object.entries(interaction.effects ?? {})) {
            const engineeringDefinitions = new Set();
            for (const definition of hazardDefinitions) {
                statistics.hazardDefinitionsChecked++;
                const {
                    key: engineeringKey,
                    constraintKey
                } = buildEngineeringDefinitionKey(definition);
                if (engineeringDefinitions.has(engineeringKey)) {
                    addValidationError(
                        errors,
                        "ENG006",
                        interaction.id,
                        `Duplicate engineering definition for hazard '${definition.hazard}', protection level '${definition.protectionLevel}', and constraints [${constraintKey}] in effect '${effectId}'.`
                    );
                }
                engineeringDefinitions.add(engineeringKey);
            }
        }
    }
}

function buildEngineeringDefinitionKey(definition) {
    const constraintKey =
        (definition.constraints ?? [])
            .slice()
            .sort()
            .join(",");
    return {
        key: [
            definition.hazard,
            definition.protectionLevel,
            constraintKey
        ].join("|"),
        constraintKey
    };
}