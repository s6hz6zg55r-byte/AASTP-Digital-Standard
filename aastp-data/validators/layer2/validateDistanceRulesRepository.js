/**
 * -----------------------------------------------------------------------------
 * Validator: validateDistanceRulesRepository.js
 * -----------------------------------------------------------------------------
 *
 * Validator ID
 * ------------
 * VAL-L2-DR-001
 *
 * Purpose
 * --------
 * Validates repository integrity of the Distance Rules dataset.
 *
 * This validator confirms that each Distance Rule is internally consistent,
 * references valid repository objects, and satisfies repository integrity
 * requirements.
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
 * • Future branch types
 * • National distance rules
 * • Future AASTP chapters
 *
 * Error Codes
 * -----------
 * DR001 - DR099 Are reserved for Distance Rule Repository Integrity validation errors.
 * Specific error codes are defined in the validateDistanceRulesRepository() helper functions.
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

    id: "VAL-L2-DR-001",

    layer: 2,

    dataset: "distanceRules",

    name: "Distance Rule Repository Integrity"

};

import {
    INPUT_BASIS_VALUES,
    ENGINEERING_STATUS_VALUES
} from "../../constants/engineeringConstants.js";

import { ERROR_CODES } from "../../constants/validationConstants.js";

export function validateDistanceRulesRepository() {

    const errors = [];

    const warnings = [];

    const statistics = {};

    /*
    ==========================================================
    Phase 1
    Build Lookup Collections
    ==========================================================
    */

    const distanceRules =
        repository.getCollection("distanceRules");

    const formulas =
        repository.getCollection("formulas");

    const transformations =
        repository.getCollection("transformations");

    const formulaIds =
        buildIdSet(formulas, "formulas");

    const transformationIds =
        buildIdSet(transformations, "transformations");

    const formulaMap =
        buildIdMap(formulas, "id", "formulas");
    /*
    ==========================================================
    Phase 2
    Rule Envelop Validation
    ==========================================================
    */

    validateDistanceRuleStructure(
        distanceRules,
        statistics,
        errors
    );

    /*
    ==========================================================
    Phase 3
    Validate Branch Structure
    ==========================================================
    */

    validateDistanceRuleBranches(
        distanceRules,
        statistics,
        errors
    );

    /*
    ==========================================================
    Phase 4
    Validate Engineering References
    ==========================================================
    */

    validateEngineeringReferences(
        distanceRules,
        formulaIds,
        transformationIds,
        statistics,
        errors
    );

    /*
    ==========================================================
    Phase 5
    Validate Branch Applicability
    ==========================================================
    */

    validateBranchCoverage(
        distanceRules,
        statistics,
        errors
    );

    validateBranchContinuity(
        distanceRules,
        statistics,
        errors
    );

    validateBranchOverlap(
        distanceRules,
        statistics,
        errors
    );

    validateBranchOrdering(
        distanceRules,
        statistics,
        errors
    );

    /*
    ==========================================================
    Phase 6
    Reserved
    Formula engineering definitions are validated by
    validateFormulasRepository().
    ==========================================================
    */


     /*
    ==========================================================
    Phase 7
    Validate Transformations
    ==========================================================
    */
    validateTransformationReferences(
        distanceRules,
        transformationIds,
        statistics,
        errors
    );

    validateTransformationDuplicates(
        distanceRules,
        statistics,
        errors
    );

    validateTransformationConsistency(
        distanceRules,
        statistics,
        errors
    );

    /*
    ==========================================================
    Phase 8
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
    validateDistanceRulesRepository();

Example 2 - Validation Pipeline

const results = [

    validateDistanceRulesRepository(),

    validateReferences()

];

===============================================================================
*/

/**
 * =============================================================================
 * validateDistanceRuleStructure
 * =============================================================================
 *
 * Validates the structural integrity of distance rule records.
 *
 * This phase validates only the distance rule envelope:
 * - Unique rule identifiers
 * - Unique rule names
 * - Required rule collections
 * - Required metadata objects
 *
 * This phase does not validate:
 * - Branch structure
 * - Formula references
 * - Transformations
 * - Engineering applicability
 *
 * Error Codes:
 * DR001 - Duplicate distance rule ID
 * DR002 - Duplicate distance rule name
 * DR003 - Distance rule contains no branches
 * DR004 - Calculation object missing
 * DR005 - Applicability definition missing
 * DR006 - Traceability definition missing
 *
 * =============================================================================
 */

function validateDistanceRuleStructure(
    distanceRules,
    statistics,
    errors
) {
    statistics.distanceRulesChecked = distanceRules.length;
    const ruleIds = new Set();
    const ruleNames = new Set();
    for (const rule of distanceRules) {
        /*
        ==========================================================
        DR001
        Validate unique distance rule IDs
        ==========================================================
        */
        if (ruleIds.has(rule.id)) {
            addValidationError(
                errors,
                "DR001",
                rule.id,
                `Duplicate distance rule ID '${rule.id}'.`
            );
        }
        ruleIds.add(rule.id);
        /*
        ==========================================================
        DR002
        Validate unique distance rule names
        ==========================================================
        */
        if (ruleNames.has(rule.name)) {
            addValidationError(
                errors,
                "DR002",
                rule.id,
                `Duplicate distance rule name '${rule.name}'.`
            );
        }
        ruleNames.add(rule.name);
        /*
        ==========================================================
        DR003
        Validate branch existence (moved to phase 3)
        ==========================================================
        
        if (
            !rule.calculation ||
            !Array.isArray(rule.calculation.branches) ||
            rule.calculation.branches.length === 0
        ) {
            addValidationError(
                errors,
                "DR003",
                rule.id,
                ERROR_CODES.DR003
            );
        }
        */
        /*
        ==========================================================
        DR004
        Validate calculation object
        ==========================================================
        */
        if (!rule.calculation) {
            addValidationError(
                errors,
                "DR004",
                rule.id,
                "Calculation object missing."
            );
        }
        /*
        ==========================================================
        DR005
        Validate applicability object
        ==========================================================
        */
        if (!rule.applicability) {
            addValidationError(
                errors,
                "DR005",
                rule.id,
                "Applicability definition missing."
            );
        }
        /*
        ==========================================================
        DR006
        Validate traceability object
        ==========================================================
        */
        if (!rule.traceability) {
            addValidationError(
                errors,
                "DR006",
                rule.id,
                "Traceability definition missing."
            );
        }
    }
}

/**
 * =============================================================================
 * validateDistanceRuleBranches
 * =============================================================================
 *
 * Validates the structural integrity of distance rule branches.
 *
 * Checks:
 * - Each rule contains at least one branch
 * - Branch identifiers exist
 * - Branch identifiers follow rule naming convention
 * - Branch sequence numbers are unique
 * - Branch sequence numbers are sequential
 *
 * Does not validate:
 * - NEQ applicability ranges
 * - Formula references
 * - Formula parameters
 * - Transformations
 *
 * =============================================================================
 */

function validateDistanceRuleBranches(
    distanceRules,
    statistics,
    errors
) {
    statistics.branchesChecked = 0;
    for (const rule of distanceRules) {
        const branches =
            rule.calculation?.branches;
        /*
        ==========================================================
        DR003
        Validate branch existence
        ==========================================================
        */
        if (
            !Array.isArray(branches) ||
            branches.length === 0
        ) {
            addValidationError(
                errors,
                "DR003",
                rule.id,
                ERROR_CODES.DR003
            );
            continue;
        }
        statistics.branchesChecked += branches.length;
        const sequences = new Set();
        branches.forEach((branch, index) => {
            /*
            ======================================================
            DR004
            Validate branch ID
            ======================================================
            */
            const expectedPrefix =
                `${rule.id}_`;
            if (
                !branch.id ||
                !branch.id.startsWith(expectedPrefix)
            ) {
                addValidationError(
                    errors,
                    "DR004",
                    rule.id,
                    `Invalid branch ID '${branch.id}'.`
                );
            }
            /*
            ======================================================
            DR005 / DR006
            Validate sequence numbers
            ======================================================
            */
            if (
                typeof branch.sequence !== "number"
            ) {
                addValidationError(
                    errors,
                    "DR005",
                    rule.id,
                    `Branch '${branch.id}' has invalid sequence number.`
                );
                return;
            }
            if (
                sequences.has(branch.sequence)
            ) {
                addValidationError(
                    errors,
                    "DR006",
                    rule.id,
                    `Duplicate branch sequence '${branch.sequence}'.`
                );
            }
            sequences.add(branch.sequence);
        });
        /*
        ==========================================================
        DR007
        Validate sequential ordering
        ==========================================================
        */
        const sortedSequences =
            [...sequences].sort(
                (a,b)=>a-b
            );
        sortedSequences.forEach(
            (sequence,index)=>{
                const expected =
                    index + 1;
                if (
                    sequence !== expected
                ) {
                    addValidationError(
                        errors,
                        "DR007",
                        rule.id,
                        "Branch sequence numbers are not sequential."
                    );
                }
            }
        );
    }
}

/**
 * =============================================================================
 * validateEngineeringReferences
 * =============================================================================
 *
 * Validates that engineering references contained within Distance Rule branches
 * resolve to valid repository objects.
 *
 * This phase validates:
 *   - Formula references
 *   - Forward transformation references
 *   - Reverse transformation references
 *
 * This phase does not validate:
 *   - Formula parameter compatibility
 *   - Engineering expressions
 *   - Branch applicability
 *
 * Error Codes
 * -----------
 * DR020 - Unknown Formula Reference
 * DR021 - Unknown Forward Transformation
 * DR022 - Unknown Reverse Transformation
 * =============================================================================
 */

function validateEngineeringReferences(
    distanceRules,
    formulaIds,
    transformationIds,
    statistics,
    errors
) {
    statistics.formulaReferencesChecked = 0;
    statistics.transformationReferencesChecked = 0;
    for (const rule of distanceRules) {
        const branches =
            rule.calculation?.branches ?? [];
        for (const branch of branches) {
            /*
            ==========================================================
            DR020
            Validate Formula Reference
            ==========================================================
            */
            statistics.formulaReferencesChecked++;
            if (
                !formulaIds.has(branch.formula)
            ) {
                addValidationError(
                    errors,
                    "DR020",
                    branch.id,
                    `Unknown formula '${branch.formula}'.`
                );
            }
            /*
            ==========================================================
            DR021
            Validate Forward Transformations
            ==========================================================
            */
            const forward =
                branch.forwardTransformations ?? [];
            for (const transformation of forward) {
                statistics.transformationReferencesChecked++;
                if (
                    !transformationIds.has(transformation)
                ) {
                    addValidationError(
                        errors,
                        "DR021",
                        branch.id,
                        `Unknown forward transformation '${transformation}'.`
                    );
                }
            }
            /*
            ==========================================================
            DR022
            Validate Reverse Transformations
            ==========================================================
            */
            const reverse =
                branch.reverseTransformations ?? [];


            for (const transformation of reverse) {
                statistics.transformationReferencesChecked++;
                if (
                    !transformationIds.has(transformation)
                ) {
                    addValidationError(
                        errors,
                        "DR022",
                        branch.id,
                        `Unknown reverse transformation '${transformation}'.`
                    );
                }
            }
        }
    }
}

/**
 * =============================================================================
 * validateBranchCoverage
 * =============================================================================
 *
 * Validates that a Distance Rule provides complete applicability coverage.
 *
 * Error Codes
 * -----------
 * DR030 - First branch has no lower bound
 * DR031 - Final branch has no upper bound
 *
 * =============================================================================
 */

function validateBranchCoverage(
    distanceRules,
    statistics,
    errors
) {
    statistics.branchCoverageChecked = 0;
    for (const rule of distanceRules) {
        const branches = [...(rule.calculation?.branches ?? [])]
            .sort((a, b) => a.sequence - b.sequence);
        if (branches.length === 0) {
            continue;
        }
        statistics.branchCoverageChecked++;
        const first = branches[0];
        const last = branches.at(-1);
        if (!first.when?.neq?.gte) {
            addValidationError(
                errors,
                "DR030",
                rule.id,
                "First branch does not define a lower applicability bound."
            );
        }
        if (
            last.when?.neq?.lt === undefined &&
            last.when?.neq?.lte === undefined
        ) {
            addValidationError(
                errors,
                "DR031",
                rule.id,
                "Final branch does not define an upper applicability bound."
            );
        }
    }
}

/**
 * =============================================================================
 * validateBranchContinuity
 * =============================================================================
 *
 * Error Codes
 * -----------
 * DR032 - Gap between consecutive branches
 *
 * =============================================================================
 */

function validateBranchContinuity(
    distanceRules,
    statistics,
    errors
) {
    statistics.branchContinuityChecked = 0;
    for (const rule of distanceRules) {
        const branches = [...(rule.calculation?.branches ?? [])]
            .sort((a, b) => a.sequence - b.sequence);
        for (let i = 0; i < branches.length - 1; i++) {
            statistics.branchContinuityChecked++;
            const current = branches[i];
            const next = branches[i + 1];
            const currentMaximum =
                current.when?.neq?.lt ??
                current.when?.neq?.lte;
            const nextMinimum =
                next.when?.neq?.gte ??
                next.when?.neq?.gt;
            if (
                currentMaximum !== undefined &&
                nextMinimum !== undefined &&
                currentMaximum !== nextMinimum
            ) {
                addValidationError(
                    errors,
                    "DR032",
                    rule.id,
                    `Gap between '${current.id}' and '${next.id}'.`
                );
            }
        }
    }
}

/**
 * =============================================================================
 * validateBranchOverlap
 * =============================================================================
 *
 * Error Codes
 * -----------
 * DR033 - Branch applicability overlap
 *
 * =============================================================================
 */

function validateBranchOverlap(
    distanceRules,
    statistics,
    errors
) {

    statistics.branchOverlapChecked = 0;
    for (const rule of distanceRules) {
        const branches = [...(rule.calculation?.branches ?? [])]
            .sort((a, b) => a.sequence - b.sequence);
        for (let i = 0; i < branches.length - 1; i++) {
            statistics.branchOverlapChecked++;
            const current = branches[i];
            const next = branches[i + 1];
            const currentMaximum =
                current.when?.neq?.lt ??
                current.when?.neq?.lte;
            const nextMinimum =
                next.when?.neq?.gte ??
                next.when?.neq?.gt;
            if (
                currentMaximum !== undefined &&
                nextMinimum !== undefined &&
                nextMinimum < currentMaximum
            ) {
                addValidationError(
                    errors,
                    "DR033",
                    rule.id,
                    `Overlap between '${current.id}' and '${next.id}'.`
                );
            }
        }
    }
}

/**
 * =============================================================================
 * validateBranchOrdering
 * =============================================================================
 *
 * Error Codes
 * -----------
 * DR034 - Branch ordering inconsistent with applicability
 *
 * =============================================================================
 */

function validateBranchOrdering(
    distanceRules,
    statistics,
    errors
) {
    statistics.branchOrderingChecked = 0;
    for (const rule of distanceRules) {
        const branches = [...(rule.calculation?.branches ?? [])]
            .sort((a, b) => a.sequence - b.sequence);
        for (let i = 0; i < branches.length - 1; i++) {
            statistics.branchOrderingChecked++;
            const current = branches[i];
            const next = branches[i + 1];
            const currentMinimum =
                current.when?.neq?.gte ??
                current.when?.neq?.gt;
            const nextMinimum =
                next.when?.neq?.gte ??
                next.when?.neq?.gt;
            if (
                currentMinimum !== undefined &&
                nextMinimum !== undefined &&
                nextMinimum < currentMinimum
            ) {
                addValidationError(
                    errors,
                    "DR034",
                    rule.id,
                    `Branch '${next.id}' is out of engineering order.`
                );
            }
        }
    }
}

/**
 * =============================================================================
 * validateTransformationReferences
 * =============================================================================
 *
 * Validates that all transformation references resolve to valid repository
 * transformations.
 *
 * Error Codes
 * -----------
 * DR050 - Unknown forward transformation
 * DR051 - Unknown reverse transformation
 * =============================================================================
 */

function validateTransformationReferences(
    distanceRules,
    transformationIds,
    statistics,
    errors
) {
    statistics.transformationReferencesChecked = 0;
    for (const rule of distanceRules) {
        const forward =
            rule.transformations?.forward ?? [];
        for (const transformation of forward) {
            statistics.transformationReferencesChecked++;
            if (!transformationIds.has(transformation)) {
                addValidationError(
                    errors,
                    "DR050",
                    rule.id,
                    `Unknown forward transformation '${transformation}'.`
                );
            }
        }
        const reverse =
            rule.transformations?.reverse ?? [];
        for (const transformation of reverse) {
            statistics.transformationReferencesChecked++;
            if (!transformationIds.has(transformation)) {
                addValidationError(
                    errors,
                    "DR051",
                    rule.id,
                    `Unknown reverse transformation '${transformation}'.`
                );
            }
        }
    }
}

/**
 * =============================================================================
 * validateTransformationDuplicates
 * =============================================================================
 *
 * Validates that transformation arrays do not contain duplicate references.
 *
 * Error Codes
 * -----------
 * DR052 - Duplicate transformation reference
 * =============================================================================
 */

function validateTransformationDuplicates(
    distanceRules,
    statistics,
    errors
) {
    statistics.transformationArraysChecked = 0;
    for (const rule of distanceRules) {
        const groups = [
            {
                direction: "forward",
                values: rule.transformations?.forward ?? []
            },
            {
                direction: "reverse",
                values: rule.transformations?.reverse ?? []
            }
        ];
        for (const group of groups) {
            statistics.transformationArraysChecked++;
            const seen = new Set();
            for (const transformation of group.values) {
                if (seen.has(transformation)) {
                    addValidationError(
                        errors,
                        "DR052",
                        rule.id,
                        `Duplicate ${group.direction} transformation '${transformation}'.`
                    );
                }
                seen.add(transformation);
            }
        }
    }
}

/**
 * =============================================================================
 * validateTransformationConsistency
 * =============================================================================
 *
 * Validates the consistency of transformation definitions.
 *
 * Error Codes
 * -----------
 * DR053 - Forward transformations is not an array
 * DR054 - Reverse transformations is not an array
 * DR055 - Transformation container missing
 * =============================================================================
 */

function validateTransformationConsistency(
    distanceRules,
    statistics,
    errors
) {
    statistics.transformationDefinitionsChecked = distanceRules.length;
    for (const rule of distanceRules) {
        if (!rule.transformations) {
            addValidationError(
                errors,
                "DR055",
                rule.id,
                "Transformation definition missing."
            );
            continue;
        }
        if (!Array.isArray(rule.transformations.forward)) {
            addValidationError(
                errors,
                "DR053",
                rule.id,
                "Forward transformations must be an array."
            );
        }
        if (!Array.isArray(rule.transformations.reverse)) {
            addValidationError(
                errors,
                "DR054",
                rule.id,
                "Reverse transformations must be an array."
            );
        }
    }
}