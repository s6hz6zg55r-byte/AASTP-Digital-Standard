/******************************************************************************
 * validateResourceResolutionRulesRepository
 *
 * Layer 2 Repository Validator
 *
 * Purpose
 * -------
 * Validates the integrity of the Resource Resolution Rules repository.
 *
 * The Resource Resolution Rules repository defines explicitly governed
 * canonicalisation behaviour for exceptional engineering resource
 * configurations that do not resolve through normal exact matching.
 *
 * Responsibilities
 * ----------------
 * This validator is responsible for:
 *
 * - Repository structure validation
 * - Resolution rule definition validation
 * - Governed dependency validation
 * - Engineering provenance and traceability validation
 * - Repository consistency validation
 * - Resolution determinism validation
 *
 * Out of Scope
 * ------------
 * This validator does not:
 *
 * - Validate JSON schema compliance (Layer 1)
 * - Validate engineering completeness (Layer 3)
 * - Execute interaction resolution
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
    RESOLUTION_OPERATORS,
    RESOLUTION_OUTCOME_TYPES,
    RESOLUTION_VALUE_TYPES,
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

    id: VALIDATORS.RESOURCE_RESOLUTION_RULES_REPOSITORY,

    name: "Resource Resolution Rules Repository Integrity",

    layer: 2,

    dataset: "resourceResolutionRules"

};

const SUPPORTED_RESOLUTION_DATASETS = Object.freeze({

    es_types: Object.freeze({
        resourceType: "es_type",
        repositoryCollection: "esTypes",
        contextMappings: Object.freeze({
            structureId: "structure"
        }),
        applicabilityMappings: Object.freeze({
            construction: "supportedProperties",
            exposure: "supportedExposure"
        })
    }),

    pes_types: Object.freeze({
        resourceType: "pes_type",
        repositoryCollection: "pesTypes",
        contextMappings: Object.freeze({
            structureId: "structure"
        }),
        applicabilityMappings: Object.freeze({
            construction: "supportedProperties"
        })
    })
});


/******************************************************************************
 * Validator
 ******************************************************************************/

export function validateResourceResolutionRulesRepository() {

    /*
    --------------------------------------------------------------------------
    Phase 1
    Repository Collections
    --------------------------------------------------------------------------
    */

    const resourceResolutionRules =
        repository.getCollection("resourceResolutionRules");

    const structures =
        repository.getCollection("structures");

    const esTypes =
        repository.getCollection("esTypes");

    const pesTypes =
        repository.getCollection("pesTypes");

    const propertySemantics =
        repository.getCollection("resourcePropertySemantics");


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
        resourceResolutionRules,
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
        resourceResolutionRules,
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
        resourceResolutionRules,
        structures,
        esTypes,
        pesTypes,
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
        resourceResolutionRules,
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
        resourceResolutionRules,
        {
            esTypes,
            pesTypes,
            propertySemantics
        },
        statistics,
        warnings,
        errors
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
 * Validates the structural integrity of the Resource Resolution Rules
 * repository.
 *
 * Responsibilities
 * ----------------
 * - Validate repository is not empty
 * - Validate unique Resolution Rule identifiers
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Validate Resolution Rule engineering definitions
 * - Validate governed dependencies
 * - Validate canonical resolution behaviour
 * - Validate engineering provenance
 * - Validate rule overlap or ambiguity
 *
 * Error Codes
 * -----------
 * RRR001  Invalid Repository Structure
 * RRR002  Duplicate Resolution Rule ID
 *
 * =============================================================================
 */

function validateRepositoryStructure(
    resourceResolutionRules,
    statistics,
    errors
) {
    const identifiers = new Set();
    /*
    --------------------------------------------------------------------------
    Initialise Statistics
    --------------------------------------------------------------------------
    */
    statistics.repositoryObjectsChecked = 0;
    statistics.identifiersChecked = 0;
    statistics.rulesChecked = 0;
    /*
    --------------------------------------------------------------------------
    Repository Empty
    --------------------------------------------------------------------------
    */
    if (resourceResolutionRules.length === 0) {
        addValidationError(
            errors,
            ERROR_CODES.RRR001,
            "Repository",
            "Resource Resolution Rules repository is empty."
        );
        return;
    }
    /*
    --------------------------------------------------------------------------
    Repository Objects
    --------------------------------------------------------------------------
    */
    for (const rule of resourceResolutionRules) {
        statistics.repositoryObjectsChecked++;
        statistics.rulesChecked++;
        /*
        ----------------------------------------------------------------------
        Identifier
        ----------------------------------------------------------------------
        */
        statistics.identifiersChecked++;
        if (identifiers.has(rule.id)) {
            addValidationError(
                errors,
                ERROR_CODES.RRR002,
                rule.id,
                `Duplicate Resource Resolution Rule identifier '${rule.id}'.`
            );
        }
        identifiers.add(rule.id);
    }
}

/**
 * =============================================================================
 * validateEngineeringDefinitions
 * =============================================================================
 *
 * Phase 3 Helper Function
 *
 * Validates the internal engineering definitions contained within Resource
 * Resolution Rules.
 *
 * Responsibilities
 * ----------------
 * - Validate Resolution Rule definitions
 * - Validate condition groups
 * - Validate Resolution Rule predicates
 * - Validate Resolution Rule outcomes
 * - Validate canonical assignment definitions
 * - Validate canonical target definitions
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Validate referenced datasets
 * - Validate referenced Structures
 * - Validate property existence or applicability
 * - Validate controlled engineering values
 * - Validate canonical target existence
 * - Validate rule overlap or ambiguity
 *
 * Error Codes
 * -----------
 * RRR010  Invalid Resolution Rule Definition
 * RRR011  Invalid Resolution Rule Predicate
 * RRR012  Invalid Resolution Rule Outcome
 * RRR013  Invalid Resolution Rule Canonical Assignment
 * RRR014  Invalid Canonical Target Definition
 *
 * =============================================================================
 */

function validateEngineeringDefinitions(
    resourceResolutionRules,
    statistics,
    errors
) {
    statistics.conditionGroupsChecked = 0;
    statistics.predicatesChecked = 0;
    statistics.outcomesChecked = 0;
    statistics.canonicalAssignmentsChecked = 0;
    for (const rule of resourceResolutionRules) {
        /*
        ----------------------------------------------------------------------
        Rule Definition
        ----------------------------------------------------------------------
        */
        if (
            !rule.appliesTo ||
            !rule.when ||
            !rule.outcome ||
            !rule.governance
        ) {
            addValidationError(
                errors,
                ERROR_CODES.RRR010,
                rule.id,
                "Resolution Rule contains an incomplete engineering definition."
            );
            continue;
        }
        /*
        ----------------------------------------------------------------------
        Condition Definition
        ----------------------------------------------------------------------
        */
        validateConditionGroup(
            rule.when,
            rule.id,
            statistics,
            errors
        );
        /*
        ----------------------------------------------------------------------
        Outcome Definition
        ----------------------------------------------------------------------
        */
        validateResolutionOutcome(
            rule.outcome,
            rule.id,
            statistics,
            errors
        );
    }
}

/**
 * =============================================================================
 * validateConditionGroup
 * =============================================================================
 *
 * Phase 3.1 Helper Function
 *
 * Validates the internal structure of a Resolution Rule condition group.
 *
 * Responsibilities
 * ----------------
 * - Validate exactly one condition-group operator is present
 * - Validate condition groups are not empty
 * - Recursively validate nested condition groups
 * - Validate Resolution Rule predicates
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Validate property existence
 * - Validate property applicability
 * - Validate controlled engineering values
 *
 * Error Codes
 * -----------
 * RRR010  Invalid Resolution Rule Definition
 * RRR011  Invalid Resolution Rule Predicate
 *
 * =============================================================================
 */

function validateConditionGroup(
    conditionGroup,
    ruleId,
    statistics,
    errors
) {
    statistics.conditionGroupsChecked++;
    const hasAll =
        Array.isArray(conditionGroup?.all);
    const hasAny =
        Array.isArray(conditionGroup?.any);
    /*
    --------------------------------------------------------------------------
    Condition Group Definition
    --------------------------------------------------------------------------
    */
    if (hasAll === hasAny) {
        addValidationError(
            errors,
            ERROR_CODES.RRR010,
            ruleId,
            "Resolution condition group must define exactly one of 'all' or 'any'."
        );
        return;
    }
    const conditions =
        hasAll
            ? conditionGroup.all
            : conditionGroup.any;
    /*
    --------------------------------------------------------------------------
    Empty Condition Group
    --------------------------------------------------------------------------
    */
    if (conditions.length === 0) {
        addValidationError(
            errors,
            ERROR_CODES.RRR010,
            ruleId,
            "Resolution condition group must contain at least one condition."
        );
        return;
    }
    /*
    --------------------------------------------------------------------------
    Condition Nodes
    --------------------------------------------------------------------------
    */
    for (const condition of conditions) {
        const isConditionGroup =
            Array.isArray(condition?.all) ||
            Array.isArray(condition?.any);
        if (isConditionGroup) {
            validateConditionGroup(
                condition,
                ruleId,
                statistics,
                errors
            );
            continue;
        }
        validatePredicate(
            condition,
            ruleId,
            statistics,
            errors
        );
    }
}

/**
 * =============================================================================
 * validatePredicate
 * =============================================================================
 *
 * Phase 3.2 Helper Function
 *
 * Validates the internal definition of a Resolution Rule predicate.
 *
 * Responsibilities
 * ----------------
 * - Validate predicate property definition
 * - Validate supported predicate operator
 * - Validate operator/value relationship
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Validate whether the property exists
 * - Validate whether the property is applicable
 * - Validate whether the supplied value is governed
 *
 * Error Codes
 * -----------
 * RRR011  Invalid Resolution Rule Predicate
 *
 * =============================================================================
 */

function validatePredicate(
    predicate,
    ruleId,
    statistics,
    errors
) {
    statistics.predicatesChecked++;
    /*
    --------------------------------------------------------------------------
    Property
    --------------------------------------------------------------------------
    */
    if (
        typeof predicate?.property !== "string" ||
        predicate.property.trim() === ""
    ) {
        addValidationError(
            errors,
            ERROR_CODES.RRR011,
            ruleId,
            "Resolution predicate contains an invalid property definition."
        );
        return;
    }
    /*
    --------------------------------------------------------------------------
    Operator
    --------------------------------------------------------------------------
    */
    if (
        !RESOLUTION_OPERATORS.includes(
            predicate.operator
        )
    ) {
        addValidationError(
            errors,
            ERROR_CODES.RRR011,
            ruleId,
            `Unknown Resolution Rule operator '${predicate.operator}'.`
        );
        return;
    }
    /*
    --------------------------------------------------------------------------
    type_is
    --------------------------------------------------------------------------
    */
    if (
        predicate.operator === "type_is"
    ) {
        if (
            !RESOLUTION_VALUE_TYPES.includes(
                predicate.value
            )
        ) {
            addValidationError(
                errors,
                ERROR_CODES.RRR011,
                ruleId,
                `Invalid type_is value '${predicate.value}'.`
            );
        }
    }
}

/**
 * =============================================================================
 * validateResolutionOutcome
 * =============================================================================
 *
 * Phase 3.3 Helper Function
 *
 * Validates the internal definition of a Resolution Rule outcome.
 *
 * Responsibilities
 * ----------------
 * - Validate supported outcome type
 * - Validate canonical outcomes
 * - Validate undefined outcomes
 * - Validate canonical assignments
 * - Validate canonical target definition
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Validate canonical target existence
 * - Validate assignment property existence
 * - Validate assignment engineering values
 * - Execute canonical resolution
 *
 * Error Codes
 * -----------
 * RRR012  Invalid Resolution Rule Outcome
 * RRR013  Invalid Resolution Rule Canonical Assignment
 * RRR014  Invalid Canonical Target Definition
 *
 * =============================================================================
 */

function validateResolutionOutcome(
    outcome,
    ruleId,
    statistics,
    errors
) {
    statistics.outcomesChecked++;
    /*
    --------------------------------------------------------------------------
    Outcome Type
    --------------------------------------------------------------------------
    */
    if (
        !RESOLUTION_OUTCOME_TYPES.includes(
            outcome?.type
        )
    ) {
        addValidationError(
            errors,
            ERROR_CODES.RRR012,
            ruleId,
            `Unknown Resolution Rule outcome type '${outcome?.type}'.`
        );
        return;
    }
    /*
    --------------------------------------------------------------------------
    Undefined Configuration
    --------------------------------------------------------------------------
    */
    if (
        outcome.type === "undefined_configuration"
    ) {
        return;
    }
    /*
    --------------------------------------------------------------------------
    Canonical Assignments
    --------------------------------------------------------------------------
    */
    if (
        !Array.isArray(outcome.canonicalAssignments) ||
        outcome.canonicalAssignments.length === 0
    ) {
        addValidationError(
            errors,
            ERROR_CODES.RRR013,
            ruleId,
            "Canonical Resolution outcome must contain at least one canonical assignment."
        );
    }
    else {
        for (
            const assignment
            of outcome.canonicalAssignments
        ) {
            validateCanonicalAssignment(
                assignment,
                ruleId,
                statistics,
                errors
            );
        }
    }
    /*
    --------------------------------------------------------------------------
    Canonical Target
    --------------------------------------------------------------------------
    */
    if (
        typeof outcome.canonicalTargetId !== "string" ||
        outcome.canonicalTargetId.trim() === ""
    ) {
        addValidationError(
            errors,
            ERROR_CODES.RRR014,
            ruleId,
            "Canonical Resolution outcome must define a canonical target identifier."
        );
    }
}

/**
 * =============================================================================
 * validateCanonicalAssignment
 * =============================================================================
 *
 * Phase 3.4 Helper Function
 *
 * Validates the internal definition of a canonical property assignment.
 *
 * Responsibilities
 * ----------------
 * - Validate canonical assignment property definition
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Validate property existence
 * - Validate property applicability
 * - Validate controlled engineering values
 *
 * Error Codes
 * -----------
 * RRR013  Invalid Resolution Rule Canonical Assignment
 *
 * =============================================================================
 */

function validateCanonicalAssignment(
    assignment,
    ruleId,
    statistics,
    errors
) {
    statistics.canonicalAssignmentsChecked++;
    if (
        typeof assignment?.property !== "string" ||
        assignment.property.trim() === ""
    ) {
        addValidationError(
            errors,
            ERROR_CODES.RRR013,
            ruleId,
            "Canonical assignment contains an invalid property definition."
        );
    }
}

/**
 * =============================================================================
 * validateGovernedDependencies
 * =============================================================================
 *
 * Phase 4 Helper Function
 *
 * Validates governed dependencies referenced by Resource Resolution Rules.
 *
 * Responsibilities
 * ----------------
 * - Validate dataset references
 * - Validate resource type references
 * - Validate Structure references
 * - Validate property references
 * - Validate governed values
 * - Validate canonical assignments
 * - Validate canonical target references
 * - Validate property applicability
 *
 * This helper does NOT:
 * - Validate engineering provenance
 * - Validate rule overlap or ambiguity
 * - Execute resource resolution
 * - Execute engineering calculations
 *
 * =============================================================================
 */

function validateGovernedDependencies(
    resourceResolutionRules,
    structures,
    esTypes,
    pesTypes,
    statistics,
    errors
) {

    validateDatasetReferences(
        resourceResolutionRules,
        statistics,
        errors
    );

    validateStructureReferences(
        resourceResolutionRules,
        structures,
        statistics,
        errors
    );

    validatePropertyReferences(
        resourceResolutionRules,
        esTypes,
        pesTypes,
        statistics,
        errors
    );

    validateControlledValues(
        resourceResolutionRules,
        {
            esTypes,
            pesTypes
        },
        statistics,
        errors
    );

    validateCanonicalAssignments(
        resourceResolutionRules,
        {
            esTypes,
            pesTypes
        },
        statistics,
        errors
    );

    validateCanonicalTargets(
        resourceResolutionRules,
        {
            esTypes,
            pesTypes
        },
        statistics,
        errors
    );

    validateCanonicalTargetConsistency(
        resourceResolutionRules,
        {
            esTypes,
            pesTypes
        },
        statistics,
        errors
    );

    validatePropertyApplicability(
        resourceResolutionRules,
        structures,
        statistics,
        errors
    );

}

/**
 * =============================================================================
 * validateDatasetReferences
 * =============================================================================
 *
 * Phase 4.1 Helper Function
 *
 * Validates dataset and resource type references used by Resolution Rules.
 *
 * Responsibilities
 * ----------------
 * - Validate referenced dataset is supported
 * - Validate resource type matches the referenced dataset
 * - Update validation statistics
 *
 * Error Codes
 * -----------
 * RRR020  Invalid Dataset Reference
 * RRR021  Invalid Resource Type Reference
 *
 * =============================================================================
 */

function validateDatasetReferences(
    resourceResolutionRules,
    statistics,
    errors
) {
    statistics.datasetReferencesChecked = 0;
    statistics.resourceTypeReferencesChecked = 0;
    for (const rule of resourceResolutionRules) {
        const datasetId =
            rule.appliesTo?.datasetId;
        const resourceType =
            rule.appliesTo?.resourceType;
        /*
        ----------------------------------------------------------------------
        Dataset Reference
        ----------------------------------------------------------------------
        */
        statistics.datasetReferencesChecked++;
        const datasetDefinition =
            SUPPORTED_RESOLUTION_DATASETS[datasetId];
        if (!datasetDefinition) {
            addValidationError(
                errors,
                ERROR_CODES.RRR020,
                rule.id,
                `Unknown Resource Resolution dataset '${datasetId}'.`
            );
            continue;
        }
        /*
        ----------------------------------------------------------------------
        Resource Type Reference
        ----------------------------------------------------------------------
        */
        statistics.resourceTypeReferencesChecked++;
        if (
            resourceType !==
            datasetDefinition.resourceType
        ) {
            addValidationError(
                errors,
                ERROR_CODES.RRR021,
                rule.id,
                `Resource type '${resourceType}' is invalid for dataset '${datasetId}'.`
            );
        }
    }
}

/**
 * =============================================================================
 * validateStructureReferences
 * =============================================================================
 *
 * Phase 4.2 Helper Function
 *
 * Validates Structure references used to scope Resource Resolution Rules.
 *
 * Responsibilities
 * ----------------
 * - Validate referenced Structures exist
 * - Update validation statistics
 *
 * Error Codes
 * -----------
 * RRR022  Invalid Structure Reference
 *
 * =============================================================================
 */

function validateStructureReferences(
    resourceResolutionRules,
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
    for (const rule of resourceResolutionRules) {
        const structureId =
            rule.appliesTo?.context?.structureId;
        if (!structureId) {
            continue;
        }
        statistics.structureReferencesChecked++;
        if (
            !validStructures.has(
                structureId
            )
        ) {
            addValidationError(
                errors,
                ERROR_CODES.RRR022,
                rule.id,
                `Unknown Structure reference '${structureId}'.`
            );
        }
    }
}

/**
 * =============================================================================
 * validatePropertyReferences
 * =============================================================================
 *
 * Phase 4.3 Helper Function
 *
 * Validates property paths referenced by Resource Resolution Rules against
 * the authoritative resource dataset to which each rule applies.
 *
 * Responsibilities
 * ----------------
 * - Validate condition property paths
 * - Validate canonical assignment property paths
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Validate property applicability to the selected Structure
 * - Validate controlled values
 * - Validate canonical target values
 *
 * Error Codes
 * -----------
 * RRR023  Invalid Property Reference
 *
 * =============================================================================
 */

function validatePropertyReferences(
    resourceResolutionRules,
    esTypes,
    pesTypes,
    statistics,
    errors
) {
    statistics.propertyReferencesChecked = 0;
    for (const rule of resourceResolutionRules) {
        /*
        ----------------------------------------------------------------------
        Resolve Authoritative Resource Collection
        ----------------------------------------------------------------------
        */
        let resources;
        switch (
            rule.appliesTo?.datasetId
        ) {
            case "es_types":
                resources = esTypes;
                break;
            case "pes_types":
                resources = pesTypes;
                break;
            default:
                /*
                Dataset validation is owned by Phase 4.1.
                */
                continue;
        }
        /*
        ----------------------------------------------------------------------
        Condition Properties
        ----------------------------------------------------------------------
        */
        const conditionProperties =
            collectConditionPropertyPaths(
                rule.when
            );
        /*
        ----------------------------------------------------------------------
        Canonical Assignment Properties
        ----------------------------------------------------------------------
        */
        const assignmentProperties =
            Array.isArray(
                rule.outcome?.canonicalAssignments
            )
                ? rule.outcome.canonicalAssignments.map(
                    assignment =>
                        assignment.property
                )
                : [];
        const propertyPaths = [
            ...conditionProperties,
            ...assignmentProperties
        ];
        /*
        ----------------------------------------------------------------------
        Validate Property Paths
        ----------------------------------------------------------------------
        */
        for (const propertyPath of propertyPaths) {
            statistics.propertyReferencesChecked++;
            const propertyExists =
                resources.some(
                    resource =>
                        hasPropertyPath(
                            resource,
                            propertyPath
                        )
                );
            if (!propertyExists) {
                addValidationError(
                    errors,
                    ERROR_CODES.RRR023,
                    rule.id,
                    `Unknown property reference '${propertyPath}' for dataset '${rule.appliesTo.datasetId}'.`
                );
            }
        }
    }
}

/**
 * =============================================================================
 * validateControlledValues
 * =============================================================================
 *
 * Phase 4.4 Helper Function
 *
 * Validates explicit values referenced by Resource Resolution Rules against
 * values present in the applicable authoritative resource dataset.
 *
 * Responsibilities
 * ----------------
 * - Validate governed predicate values
 * - Validate governed canonical assignment values
 * - Derive governed value domains from authoritative data
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Define engineering property names
 * - Define controlled engineering vocabularies
 * - Validate property applicability
 * - Validate canonical target existence
 *
 * Error Codes
 * -----------
 * RRR024  Invalid Controlled Value
 *
 * =============================================================================
 */

function validateControlledValues(
    resourceResolutionRules,
    repositories,
    statistics,
    errors
) {
    statistics.controlledValuesChecked = 0;
    for (const rule of resourceResolutionRules) {
        const datasetDefinition =
            SUPPORTED_RESOLUTION_DATASETS[
                rule.appliesTo?.datasetId
            ];
        if (!datasetDefinition) {
            /*
            Dataset validity is owned by Phase 4.1.
            */
            continue;
        }
        const resources =
            repositories[
                datasetDefinition.repositoryCollection
            ];
        if (!Array.isArray(resources)) {
            continue;
        }
        /*
        ----------------------------------------------------------------------
        Scope Resources to Rule Context
        ----------------------------------------------------------------------
        */
        const structureId =
            rule.appliesTo?.context?.structureId;
        const scopedResources =
            structureId
                ? resources.filter(
                    resource =>
                        resource.structure === structureId
                )
                : resources;
        /*
        ----------------------------------------------------------------------
        Predicate Values
        ----------------------------------------------------------------------
        */
        validateConditionValues(
            rule.when,
            rule.id,
            scopedResources,
            statistics,
            errors
        );
        /*
        ----------------------------------------------------------------------
        Canonical Assignment Values
        ----------------------------------------------------------------------
        */
        if (
            Array.isArray(
                rule.outcome?.canonicalAssignments
            )
        ) {
            for (
                const assignment
                of rule.outcome.canonicalAssignments
            ) {
                validateGovernedPropertyValue(
                    assignment.property,
                    assignment.value,
                    rule.id,
                    scopedResources,
                    statistics,
                    errors
                );
            }
        }
    }
}

/**
 * =============================================================================
 * validateCanonicalAssignments
 * =============================================================================
 *
 * Phase 4.5 Helper Function
 *
 * Validates canonical assignments against the authoritative resource context
 * declared by each Resource Resolution Rule.
 *
 * Responsibilities
 * ----------------
 * - Resolve the authoritative resource dataset
 * - Scope resources to the declared rule context
 * - Validate canonical assignment values occur within that context
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Define engineering property names
 * - Define controlled engineering values
 * - Validate canonical target existence
 * - Confirm the complete canonical configuration matches the target
 *
 * Error Codes
 * -----------
 * RRR025  Invalid Canonical Assignment
 *
 * =============================================================================
 */

function validateCanonicalAssignments(
    resourceResolutionRules,
    repositories,
    statistics,
    errors
) {

    statistics.canonicalAssignmentContextChecks = 0;
    for (const rule of resourceResolutionRules) {
        /*
        ----------------------------------------------------------------------
        Undefined configurations do not contain canonical assignments
        ----------------------------------------------------------------------
        */
        if (
            rule.outcome?.type ===
            "undefined_configuration"
        ) {
            continue;
        }
        const assignments =
            rule.outcome?.canonicalAssignments;
        if (!Array.isArray(assignments)) {
            /*
            Assignment structure is owned by Phase 3.
            */
            continue;
        }
        /*
        ----------------------------------------------------------------------
        Resolve Dataset
        ----------------------------------------------------------------------
        */
        const datasetDefinition =
            SUPPORTED_RESOLUTION_DATASETS[
                rule.appliesTo?.datasetId
            ];
        if (!datasetDefinition) {
            /*
            Dataset validity is owned by Phase 4.1.
            */
            continue;
        }
        const resources =
            repositories[
                datasetDefinition.repositoryCollection
            ];
        if (!Array.isArray(resources)) {
            continue;
        }
        /*
        ----------------------------------------------------------------------
        Apply Rule Context
        ----------------------------------------------------------------------
        */
        const scopedResources =
            scopeResourcesToContext(
                resources,
                rule.appliesTo?.context,
                datasetDefinition.contextMappings
            );
        /*
        ----------------------------------------------------------------------
        Validate Assignments
        ----------------------------------------------------------------------
        */
        for (const assignment of assignments) {
            statistics.canonicalAssignmentContextChecks++;
            const assignmentExists =
                scopedResources.some(
                    resource =>
                        hasPropertyPath(
                            resource,
                            assignment.property
                        ) &&
                        Object.is(
                            getPropertyValue(
                                resource,
                                assignment.property
                            ),
                            assignment.value
                        )
                );
            if (!assignmentExists) {
                addValidationError(
                    errors,
                    ERROR_CODES.RRR025,
                    rule.id,
                    `Canonical assignment '${assignment.property}' = '${String(assignment.value)}' is not represented within the declared resource context.`
                );
            }
        }
    }
}

/**
 * =============================================================================
 * validateCanonicalTargets
 * =============================================================================
 *
 * Phase 4.6 Helper Function
 *
 * Validates canonical target references against the authoritative dataset
 * declared by each Resource Resolution Rule.
 *
 * Responsibilities
 * ----------------
 * - Resolve the authoritative target dataset
 * - Validate canonical target identifiers exist within that dataset
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Validate canonical assignments
 * - Validate target configuration against canonical assignments
 * - Validate rule overlap or ambiguity
 * - Execute resource resolution
 *
 * Error Codes
 * -----------
 * RRR026  Invalid Canonical Target Reference
 *
 * =============================================================================
 */

function validateCanonicalTargets(
    resourceResolutionRules,
    repositories,
    statistics,
    errors
) {
    statistics.canonicalTargetsChecked = 0;
    for (const rule of resourceResolutionRules) {
        /*
        ----------------------------------------------------------------------
        Undefined configurations do not resolve to canonical resources
        ----------------------------------------------------------------------
        */
        if (
            rule.outcome?.type ===
            "undefined_configuration"
        ) {
            continue;
        }
        /*
        ----------------------------------------------------------------------
        Resolve Dataset
        ----------------------------------------------------------------------
        */
        const datasetDefinition =
            SUPPORTED_RESOLUTION_DATASETS[
                rule.appliesTo?.datasetId
            ];
        if (!datasetDefinition) {
            /*
            Dataset validity is owned by Phase 4.1.
            */
            continue;
        }
        const resources =
            repositories[
                datasetDefinition.repositoryCollection
            ];
        if (!Array.isArray(resources)) {
            continue;
        }
        /*
        ----------------------------------------------------------------------
        Canonical Target
        ----------------------------------------------------------------------
        */
        const canonicalTargetId =
            rule.outcome?.canonicalTargetId;
        /*
        Target definition is owned by Phase 3.
        */
        if (
            typeof canonicalTargetId !== "string" ||
            canonicalTargetId.trim() === ""
        ) {
            continue;
        }
        statistics.canonicalTargetsChecked++;
        const targetExists =
            resources.some(
                resource =>
                    resource.id === canonicalTargetId
            );
        if (!targetExists) {
            addValidationError(
                errors,
                ERROR_CODES.RRR026,
                rule.id,
                `Canonical target '${canonicalTargetId}' does not exist within dataset '${rule.appliesTo.datasetId}'.`
            );
        }
    }
}

/**
 * =============================================================================
 * validateCanonicalTargetConsistency
 * =============================================================================
 *
 * Phase 4.7 Helper Function
 *
 * Validates that each declared canonical target is consistent with the
 * configuration produced by the Resolution Rule.
 *
 * Responsibilities
 * ----------------
 * - Resolve the authoritative target dataset
 * - Resolve the declared canonical target
 * - Collect equality predicates from the rule
 * - Apply canonical assignments over those predicate values
 * - Compare the resulting canonical values with the declared target
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Validate canonical target existence
 * - Validate property applicability
 * - Validate rule overlap or ambiguity
 * - Execute resource resolution
 *
 * Error Codes
 * -----------
 * RRR027  Canonical Target Does Not Match Canonical Configuration
 *
 * =============================================================================
 */

function validateCanonicalTargetConsistency(
    resourceResolutionRules,
    repositories,
    statistics,
    errors
) {
    statistics.canonicalConfigurationsChecked = 0;
    for (const rule of resourceResolutionRules) {
        if (
            rule.outcome?.type ===
            "undefined_configuration"
        ) {
            continue;
        }
        const datasetDefinition =
            SUPPORTED_RESOLUTION_DATASETS[
                rule.appliesTo?.datasetId
            ];
        if (!datasetDefinition) {
            continue;
        }
        const resources =
            repositories[
                datasetDefinition.repositoryCollection
            ];
        if (!Array.isArray(resources)) {
            continue;
        }
        const canonicalTarget =
            resources.find(
                resource =>
                    resource.id ===
                    rule.outcome?.canonicalTargetId
            );
        if (!canonicalTarget) {
            /*
            Target existence is owned by Phase 4.6.
            */
            continue;
        }
        statistics.canonicalConfigurationsChecked++;
        const canonicalConfiguration =
            buildCanonicalConfiguration(rule);

        for (
            const [propertyPath, canonicalRuleValue]
            of Object.entries(canonicalConfiguration)
        ) {
            if (
                !hasPropertyPath(
                    canonicalTarget,
                    propertyPath
                )
            ) {
                continue;
            }
            const targetResourceValue =
                getPropertyValue(
                    canonicalTarget,
                    propertyPath
                );
            if (
                !Object.is(
                    targetResourceValue,
                    canonicalRuleValue
                )
            ) {
                addValidationError(
                    errors,
                    ERROR_CODES.RRR027,
                    rule.id,
                    `Canonical target '${canonicalTarget.id}' does not match the configuration defined by the Resolution Rule for property '${propertyPath}'. Rule resolves to '${String(canonicalRuleValue)}', but target resource contains '${String(targetResourceValue)}'.`
                );
            }
        }
    }
}

/**
 * =============================================================================
 * validatePropertyApplicability
 * =============================================================================
 *
 * Phase 4.8 Helper Function
 *
 * Validates that properties referenced by Resource Resolution Rules are
 * applicable within the declared Structure context.
 *
 * Responsibilities
 * ----------------
 * - Resolve the declared Structure
 * - Resolve dataset applicability mappings
 * - Validate referenced condition properties
 * - Validate canonical assignment properties
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Validate property existence
 * - Validate controlled values
 * - Validate canonical target consistency
 * - Validate selectable versus informational semantics
 *
 * Error Codes
 * -----------
 * RRR028  Property Not Applicable to Structure
 *
 * =============================================================================
 */

function validatePropertyApplicability(
    resourceResolutionRules,
    structures,
    statistics,
    errors
) {
    statistics.propertyApplicabilityChecks = 0;
    for (const rule of resourceResolutionRules) {
        const datasetDefinition =
            SUPPORTED_RESOLUTION_DATASETS[
                rule.appliesTo?.datasetId
            ];
        if (!datasetDefinition) {
            continue;
        }
        const structureId =
            rule.appliesTo?.context?.structureId;
        if (!structureId) {
            continue;
        }
        const structure =
            structures.find(
                item =>
                    item.id === structureId
            );
        if (!structure) {
            /*
            Structure existence is owned by P4.2.
            */
            continue;
        }
        /*
        ----------------------------------------------------------------------
        Collect Referenced Properties
        ----------------------------------------------------------------------
        */
        const conditionProperties =
            collectConditionPropertyPaths(
                rule.when
            );
        const assignmentProperties =
            Array.isArray(
                rule.outcome?.canonicalAssignments
            )
                ? rule.outcome.canonicalAssignments.map(
                    assignment =>
                        assignment.property
                )
                : [];
        const propertyPaths = [
            ...conditionProperties,
            ...assignmentProperties
        ];
        /*
        ----------------------------------------------------------------------
        Validate Applicability
        ----------------------------------------------------------------------
        */
        for (const propertyPath of propertyPaths) {
            statistics.propertyApplicabilityChecks++;
            const applicable =
                isPropertyApplicable(
                    propertyPath,
                    structure,
                    datasetDefinition.applicabilityMappings
                );
            if (!applicable) {
                addValidationError(
                    errors,
                    ERROR_CODES.RRR028,
                    rule.id,
                    `Property '${propertyPath}' is not applicable to Structure '${structureId}'.`
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
 * Validates engineering provenance and traceability associated with Resource
 * Resolution Rules.
 *
 * Responsibilities
 * ----------------
 * - Validate governance definition exists
 * - Validate engineering rationale
 * - Validate engineering source reference
 * - Validate effective date
 * - Detect placeholder governance data in approved rules
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Validate external source documents
 * - Validate engineering interpretation
 * - Validate whether the cited source supports the resolution
 * - Validate rule behaviour
 *
 * Error Codes
 * -----------
 * RRR030  Missing Engineering Provenance or Traceability
 * RRR031  Missing Resolution Rationale
 * RRR032  Missing Resolution Source
 * RRR033  Missing Resolution Effective Date
 * RRR034  Approved Rule Contains Placeholder Governance Data
 *
 * =============================================================================
 */

function validateEngineeringTraceability(
    resourceResolutionRules,
    statistics,
    errors
) {
    statistics.traceabilityRecordsChecked = 0;
    statistics.rationalesChecked = 0;
    statistics.sourceReferencesChecked = 0;
    statistics.effectiveDatesChecked = 0;
    for (const rule of resourceResolutionRules) {
        statistics.traceabilityRecordsChecked++;
        /*
        ----------------------------------------------------------------------
        Governance Definition
        ----------------------------------------------------------------------
        */
        const governance =
            rule.governance;
        if (
            !governance ||
            typeof governance !== "object"
        ) {
            addValidationError(
                errors,
                ERROR_CODES.RRR030,
                rule.id,
                "Resolution Rule governance definition is missing."
            );
            continue;
        }
        /*
        ----------------------------------------------------------------------
        Engineering Rationale
        ----------------------------------------------------------------------
        */
        statistics.rationalesChecked++;
        if (
            typeof governance.rationale !== "string" ||
            governance.rationale.trim() === ""
        ) {
            addValidationError(
                errors,
                ERROR_CODES.RRR031,
                rule.id,
                "Resolution Rule engineering rationale is missing."
            );
        }
        /*
        ----------------------------------------------------------------------
        Engineering Source
        ----------------------------------------------------------------------
        */
        statistics.sourceReferencesChecked++;
        if (
            typeof governance.source !== "string" ||
            governance.source.trim() === ""
        ) {
            addValidationError(
                errors,
                ERROR_CODES.RRR032,
                rule.id,
                "Resolution Rule engineering source is missing."
            );
        }
        /*
        ----------------------------------------------------------------------
        Effective Date
        ----------------------------------------------------------------------
        */
        statistics.effectiveDatesChecked++;
        if (
            typeof governance.effectiveFrom !== "string" ||
            governance.effectiveFrom.trim() === ""
        ) {
            addValidationError(
                errors,
                ERROR_CODES.RRR033,
                rule.id,
                "Resolution Rule effective date is missing."
            );
        }
        /*
        ----------------------------------------------------------------------
        Approved Rule Placeholder Governance
        ----------------------------------------------------------------------
        */
        if (
            rule.status === "approved" &&
            containsPlaceholderGovernance(
                governance
            )
        ) {
            addValidationError(
                errors,
                ERROR_CODES.RRR034,
                rule.id,
                "Approved Resolution Rule contains placeholder governance data."
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
 * Validates consistency and determinism across the complete Resource
 * Resolution Rules repository.
 *
 * Responsibilities
 * ----------------
 * - Detect duplicate Resolution Rules
 * - Detect overlapping Resolution Rules
 * - Detect ambiguous resolutions
 * - Detect rules that apply to existing exact resources
 * - Validate canonical resolution uniqueness
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Validate JSON Schema conformance
 * - Validate governed dependencies
 * - Validate engineering provenance
 * - Execute downstream interaction or calculation logic
 *
 * Error Codes
 * -----------
 * RRR040  Duplicate Resolution Rule
 * RRR041  Overlapping Resolution Rules
 * RRR042  Ambiguous Resolution
 * RRR043  Rule Applies to Existing Exact Resource
 * RRR044  Canonical Resolution Is Not Unique
 *
 * Warning Codes
 * -------------
 * RRRW001  Redundant Resolution Rule
 * RRRW002  Rule Never Matches Governed Configuration
 * RRRW003  Informational Property Used in Selection Condition
 *
 * =============================================================================
 */

function validateRepositoryConsistency(
    resourceResolutionRules,
    repositories,
    statistics,
    warnings,
    errors
) {

    validateDuplicateRules(
        resourceResolutionRules,
        statistics,
        errors
    );

    
    validateRuleOverlaps(
        resourceResolutionRules,
        statistics,
        errors
    );

    validateAmbiguousResolutions(
        resourceResolutionRules,
        statistics,
        errors
    );

    validateExactMatchConflicts(
        resourceResolutionRules,
        repositories,
        statistics,
        errors
    );

    validateCanonicalResolutionUniqueness(
        resourceResolutionRules,
        repositories,
        statistics,
        errors
    );

    validateRedundantRules(
        resourceResolutionRules,
        statistics,
        warnings
    );

    validateRuleReachability(
        resourceResolutionRules,
        repositories,
        statistics,
        warnings
    );

    validateInformationalSelectionProperties(
        resourceResolutionRules,
        repositories.propertySemantics,
        statistics,
        warnings
    );
}

/**
 * =============================================================================
 * validateDuplicateRules
 * =============================================================================
 *
 * Phase 6.1 Helper Function
 *
 * Detects Resolution Rules that contain identical governed resolution
 * definitions despite having different identifiers.
 *
 * Responsibilities
 * ----------------
 * - Compare rule scope
 * - Compare rule conditions
 * - Compare rule outcomes
 * - Detect duplicate engineering definitions
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Detect partially overlapping rules
 * - Validate rule identifiers
 * - Validate engineering provenance
 *
 * Error Codes
 * -----------
 * RRR040  Duplicate Resolution Rule
 *
 * =============================================================================
 */

function validateDuplicateRules(
    resourceResolutionRules,
    statistics,
    errors
) {
    statistics.rulePairsChecked = 0;
    statistics.duplicateRulesChecked = 0;
    for (
        let firstIndex = 0;
        firstIndex < resourceResolutionRules.length;
        firstIndex++
    ) {
        for (
            let secondIndex = firstIndex + 1;
            secondIndex < resourceResolutionRules.length;
            secondIndex++
        ) {
            statistics.rulePairsChecked++;
            const firstRule =
                resourceResolutionRules[firstIndex];
            const secondRule =
                resourceResolutionRules[secondIndex];
            /*
            ------------------------------------------------------------------
            Compare governed resolution definition
            ------------------------------------------------------------------
            */
            const firstDefinition =
                buildRuleDefinitionSignature(
                    firstRule
                );
            const secondDefinition =
                buildRuleDefinitionSignature(
                    secondRule
                );
            statistics.duplicateRulesChecked++;
            if (
                firstDefinition ===
                secondDefinition
            ) {
                addValidationError(
                    errors,
                    ERROR_CODES.RRR040,
                    firstRule.id,
                    `Resolution Rule '${firstRule.id}' duplicates the governed resolution definition of '${secondRule.id}'.`
                );
            }
        }
    }
}

/**
 * =============================================================================
 * validateRuleOverlaps
 * =============================================================================
 *
 * Phase 6.2 Helper Function
 *
 * Detects Resolution Rules whose conditions can match at least one common
 * governed configuration within the same declared scope.
 *
 * Responsibilities
 * ----------------
 * - Compare Resolution Rules within equivalent scopes
 * - Determine whether rule conditions can simultaneously be satisfied
 * - Report overlapping rule definitions
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Determine whether overlapping rules produce different outcomes
 * - Validate governed references
 * - Execute resource resolution
 *
 * Error Codes
 * -----------
 * RRR041  Overlapping Resolution Rules
 *
 * =============================================================================
 */

function validateRuleOverlaps(
    resourceResolutionRules,
    statistics,
    errors
) {
    statistics.overlapPairsChecked = 0;
    statistics.overlapsDetected = 0;
    for (
        let firstIndex = 0;
        firstIndex < resourceResolutionRules.length;
        firstIndex++
    ) {
        for (
            let secondIndex = firstIndex + 1;
            secondIndex < resourceResolutionRules.length;
            secondIndex++
        ) {
            const firstRule =
                resourceResolutionRules[firstIndex];
            const secondRule =
                resourceResolutionRules[secondIndex];
            /*
            ------------------------------------------------------------------
            Scope
            ------------------------------------------------------------------
            */
            if (
                !rulesShareScope(
                    firstRule,
                    secondRule
                )
            ) {
                continue;
            }
            statistics.overlapPairsChecked++;
            /*
            ------------------------------------------------------------------
            Condition Overlap
            ------------------------------------------------------------------
            */
            if (
                conditionsCanOverlap(
                    firstRule.when,
                    secondRule.when
                )
            ) {
                statistics.overlapsDetected++;
            /*
            ----------------------------------------------------------------------
            Equivalent overlapping outcomes are handled as redundancy warnings
            by P6.6.
            ----------------------------------------------------------------------
            */

                if (
                    outcomesAreEquivalent(
                        firstRule.outcome,
                        secondRule.outcome
                    )
                ) {
                    continue;
                }
                addValidationError(
                    errors,
                    ERROR_CODES.RRR041,
                    firstRule.id,
                    `Resolution Rules '${firstRule.id}' and '${secondRule.id}' overlap within the same governed resource context.`
                );
            }
        }
    }
}

/**
 * =============================================================================
 * validateAmbiguousResolutions
 * =============================================================================
 *
 * Phase 6.3 Helper Function
 *
 * Detects overlapping Resolution Rules that can produce different governed
 * outcomes for the same configuration.
 *
 * Responsibilities
 * ----------------
 * - Compare overlapping Resolution Rules
 * - Determine whether outcomes are equivalent
 * - Detect ambiguous governed resolutions
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Detect rule overlap independently
 * - Resolve rules by priority or order
 * - Execute resource resolution
 *
 * Error Codes
 * -----------
 * RRR042  Ambiguous Resolution
 *
 * =============================================================================
 */

function validateAmbiguousResolutions(
    resourceResolutionRules,
    statistics,
    errors
) {
    statistics.ambiguousPairsChecked = 0;
    statistics.ambiguousResolutionsDetected = 0;
    for (
        let firstIndex = 0;
        firstIndex < resourceResolutionRules.length;
        firstIndex++
    ) {
        for (
            let secondIndex = firstIndex + 1;
            secondIndex < resourceResolutionRules.length;
            secondIndex++
        ) {
            const firstRule =
                resourceResolutionRules[firstIndex];
            const secondRule =
                resourceResolutionRules[secondIndex];
            if (
                !rulesShareScope(
                    firstRule,
                    secondRule
                )
            ) {
                continue;
            }
            if (
                !conditionsCanOverlap(
                    firstRule.when,
                    secondRule.when
                )
            ) {
                continue;
            }
            statistics.ambiguousPairsChecked++;
            if (
                !outcomesAreEquivalent(
                    firstRule.outcome,
                    secondRule.outcome
                )
            ) {
                statistics.ambiguousResolutionsDetected++;
                addValidationError(
                    errors,
                    ERROR_CODES.RRR042,
                    firstRule.id,
                    `Resolution Rules '${firstRule.id}' and '${secondRule.id}' can match the same configuration but produce different governed outcomes.`
                );
            }
        }
    }
}

/**
 * =============================================================================
 * validateExactMatchConflicts
 * =============================================================================
 *
 * Phase 6.4 Helper Function
 *
 * Detects Resolution Rules that can apply to configurations already represented
 * by an exact authoritative resource.
 *
 * Responsibilities
 * ----------------
 * - Resolve the authoritative dataset
 * - Expand condition alternatives
 * - Build concrete configurations from equality predicates
 * - Detect existing exact resource matches
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Apply canonical assignments
 * - Validate canonical target consistency
 * - Resolve type-only predicates to arbitrary values
 * - Execute resource resolution
 *
 * Error Codes
 * -----------
 * RRR043  Rule Applies to Existing Exact Resource
 *
 * =============================================================================
 */

function validateExactMatchConflicts(
    resourceResolutionRules,
    repositories,
    statistics,
    errors
) {
    statistics.exactMatchAlternativesChecked = 0;
    statistics.exactMatchConflictsDetected = 0;
    for (const rule of resourceResolutionRules) {
        const datasetDefinition =
            SUPPORTED_RESOLUTION_DATASETS[
                rule.appliesTo?.datasetId
            ];
        if (!datasetDefinition) {
            continue;
        }
        const resources =
            repositories[
                datasetDefinition.repositoryCollection
            ];
        if (!Array.isArray(resources)) {
            continue;
        }
        /*
        ----------------------------------------------------------------------
        Scope Resources to Rule Context
        ----------------------------------------------------------------------
        */
        const scopedResources =
            scopeResourcesToContext(
                resources,
                rule.appliesTo?.context,
                datasetDefinition.contextMappings
            );
        /*
        ----------------------------------------------------------------------
        Expand Rule Alternatives
        ----------------------------------------------------------------------
        */
        const alternatives =
            expandConditionAlternatives(
                rule.when
            );
        for (const predicates of alternatives) {
            const concreteConfiguration =
                buildConcreteConfiguration(
                    predicates
                );
            /*
            ------------------------------------------------------------------
            A type_is predicate does not define one concrete configuration.
            ------------------------------------------------------------------
            */
            if (!concreteConfiguration.complete) {
                continue;
            }
            statistics.exactMatchAlternativesChecked++;
            const exactMatch =
                scopedResources.find(
                    resource =>
                        configurationMatchesResource(
                            concreteConfiguration.values,
                            resource
                        )
                );
            if (exactMatch) {
                statistics.exactMatchConflictsDetected++;
                addValidationError(
                    errors,
                    ERROR_CODES.RRR043,
                    rule.id,
                    `Resolution Rule '${rule.id}' applies to a configuration already represented by exact resource '${exactMatch.id}'.`
                );
            }
        }
    }
}

/**
 * =============================================================================
 * validateCanonicalResolutionUniqueness
 * =============================================================================
 *
 * Phase 6.5 Helper Function
 *
 * Validates that the canonical configuration produced by each Resource
 * Resolution Rule identifies exactly one authoritative resource within the
 * declared rule context.
 *
 * Responsibilities
 * ----------------
 * - Resolve the authoritative resource dataset
 * - Scope resources to the declared rule context
 * - Build the rule-derived canonical configuration
 * - Identify authoritative resources matching that configuration
 * - Detect non-unique canonical resolutions
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Validate canonical target existence
 * - Validate canonical target consistency
 * - Validate rule overlap
 * - Execute downstream resource resolution
 *
 * Error Codes
 * -----------
 * RRR044  Canonical Resolution Is Not Unique
 *
 * =============================================================================
 */

function validateCanonicalResolutionUniqueness(
    resourceResolutionRules,
    repositories,
    statistics,
    errors
) {
    statistics.canonicalResolutionChecks = 0;
    statistics.nonUniqueCanonicalResolutionsDetected = 0;
    for (const rule of resourceResolutionRules) {
        /*
        ----------------------------------------------------------------------
        Undefined configurations do not resolve to canonical resources
        ----------------------------------------------------------------------
        */
        if (
            rule.outcome?.type ===
            "undefined_configuration"
        ) {
            continue;
        }
        /*
        ----------------------------------------------------------------------
        Resolve Dataset
        ----------------------------------------------------------------------
        */
        const datasetDefinition =
            SUPPORTED_RESOLUTION_DATASETS[
                rule.appliesTo?.datasetId
            ];
        if (!datasetDefinition) {
            /*
            Dataset validity is owned by Phase 4.1.
            */
            continue;
        }
        const resources =
            repositories[
                datasetDefinition.repositoryCollection
            ];
        if (!Array.isArray(resources)) {
            continue;
        }
        /*
        ----------------------------------------------------------------------
        Scope Resources to Rule Context
        ----------------------------------------------------------------------
        */
        const scopedResources =
            scopeResourcesToContext(
                resources,
                rule.appliesTo?.context,
                datasetDefinition.contextMappings
            );
        /*
        ----------------------------------------------------------------------
        Build Canonical Configuration
        ----------------------------------------------------------------------
        */
        const canonicalConfiguration =
            buildCanonicalConfiguration(
                rule
            );
        statistics.canonicalResolutionChecks++;
        /*
        ----------------------------------------------------------------------
        Identify Matching Resources
        ----------------------------------------------------------------------
        */
        const matchingResources =
            scopedResources.filter(
                resource =>
                    configurationMatchesResource(
                        canonicalConfiguration,
                        resource
                    )
            );
        /*
        ----------------------------------------------------------------------
        Non-Unique Resolution
        ----------------------------------------------------------------------
        */
        if (
            matchingResources.length > 1
        ) {
            statistics.nonUniqueCanonicalResolutionsDetected++;
            const matchingIds =
                matchingResources
                    .map(
                        resource =>
                            resource.id
                    )
                    .join(", ");
            addValidationError(
                errors,
                ERROR_CODES.RRR044,
                rule.id,
                `Canonical configuration defined by Resolution Rule '${rule.id}' matches multiple authoritative resources: ${matchingIds}.`
            );
        }
    }
}

/**
 * =============================================================================
 * validateRedundantRules
 * =============================================================================
 *
 * Phase 6.6 Helper Function
 *
 * Detects overlapping Resolution Rules that produce equivalent governed
 * outcomes and therefore appear redundant.
 *
 * Responsibilities
 * ----------------
 * - Compare Resolution Rules within equivalent scope
 * - Detect overlapping condition domains
 * - Detect equivalent outcomes
 * - Exclude exact duplicate definitions
 * - Update validation statistics
 *
 * Warning Codes
 * -------------
 * RRRW001  Redundant Resolution Rule
 *
 * =============================================================================
 */

function validateRedundantRules(
    resourceResolutionRules,
    statistics,
    warnings
) {
    statistics.redundantRulePairsChecked = 0;
    statistics.redundantRulesDetected = 0;
    for (
        let firstIndex = 0;
        firstIndex < resourceResolutionRules.length;
        firstIndex++
    ) {
        for (
            let secondIndex = firstIndex + 1;
            secondIndex < resourceResolutionRules.length;
            secondIndex++
        ) {
            const firstRule =
                resourceResolutionRules[firstIndex];
            const secondRule =
                resourceResolutionRules[secondIndex];
            if (
                !rulesShareScope(
                    firstRule,
                    secondRule
                )
            ) {
                continue;
            }
            /*
            ------------------------------------------------------------------
            Exact duplicates are owned by P6.1 / RRR040
            ------------------------------------------------------------------
            */
            if (
                buildRuleDefinitionSignature(
                    firstRule
                ) ===
                buildRuleDefinitionSignature(
                    secondRule
                )
            ) {
                continue;
            }
            statistics.redundantRulePairsChecked++;
            if (
                conditionsCanOverlap(
                    firstRule.when,
                    secondRule.when
                ) &&
                outcomesAreEquivalent(
                    firstRule.outcome,
                    secondRule.outcome
                )
            ) {
                statistics.redundantRulesDetected++;
                addValidationWarning(
                    warnings,
                    WARNING_CODES.RRRW001,
                    firstRule.id,
                    `Resolution Rules '${firstRule.id}' and '${secondRule.id}' overlap and produce equivalent governed outcomes.`
                );
            }
        }
    }
}

/**
 * =============================================================================
 * validateRuleReachability
 * =============================================================================
 *
 * Phase 6.7 Helper Function
 *
 * Detects Resolution Rules whose predicates cannot be satisfied using
 * governed values available within the declared resource context.
 *
 * Responsibilities
 * ----------------
 * - Resolve authoritative resource context
 * - Expand condition alternatives
 * - Derive governed property value domains
 * - Determine whether at least one rule alternative is satisfiable
 * - Update validation statistics
 *
 * Warning Codes
 * -------------
 * RRRW002  Rule Never Matches Governed Configuration
 *
 * =============================================================================
 */

function validateRuleReachability(
    resourceResolutionRules,
    repositories,
    statistics,
    warnings
) {
    statistics.ruleReachabilityChecks = 0;
    statistics.unreachableRulesDetected = 0;
    for (const rule of resourceResolutionRules) {
        const datasetDefinition =
            SUPPORTED_RESOLUTION_DATASETS[
                rule.appliesTo?.datasetId
            ];
        if (!datasetDefinition) {
            continue;
        }
        const resources =
            repositories[
                datasetDefinition.repositoryCollection
            ];
        if (!Array.isArray(resources)) {
            continue;
        }
        const scopedResources =
            scopeResourcesToContext(
                resources,
                rule.appliesTo?.context,
                datasetDefinition.contextMappings
            );
        const alternatives =
            expandConditionAlternatives(
                rule.when
            );
        statistics.ruleReachabilityChecks++;
        const reachable =
            alternatives.some(
                predicates =>
                    predicateSetCanMatchGovernedDomain(
                        predicates,
                        scopedResources
                    )
            );
        if (!reachable) {
            statistics.unreachableRulesDetected++;
            addValidationWarning(
                warnings,
                WARNING_CODES.RRRW002,
                rule.id,
                `Resolution Rule '${rule.id}' cannot be satisfied using governed values within its declared resource context.`
            );
        }
    }
}

/**
 * =============================================================================
 * validateInformationalSelectionProperties
 * =============================================================================
 *
 * Phase 6.8 Helper Function
 *
 * Detects informational resource properties used as Resolution Rule matching
 * predicates.
 *
 * Responsibilities
 * ----------------
 * - Collect property paths referenced by Resolution Rule predicates
 * - Resolve authoritative Resource Property Semantics
 * - Detect informational properties used as matching conditions
 * - Update validation statistics
 *
 * This helper does NOT:
 * - Define engineering property names
 * - Define property semantic roles
 * - Validate property existence
 * - Validate property applicability
 * - Prevent informational properties from being used by a rule
 *
 * Warning Codes
 * -------------
 * RRRW003  Informational Property Used in Selection Condition
 *
 * =============================================================================
 */

function validateInformationalSelectionProperties(
    resourceResolutionRules,
    propertySemantics,
    statistics,
    warnings
) {
    statistics.selectionSemanticsChecks = 0;
    statistics.informationalPredicatesDetected = 0;
    if (!Array.isArray(propertySemantics)) {
        return;
    }
    /*
    --------------------------------------------------------------------------
    Build Semantic Lookup
    --------------------------------------------------------------------------
    */
    const semanticLookup =
        new Map(
            propertySemantics.map(
                semantic => [
                    semantic.property,
                    semantic
                ]
            )
        );
    /*
    --------------------------------------------------------------------------
    Validate Resolution Rule Predicates
    --------------------------------------------------------------------------
    */
    for (const rule of resourceResolutionRules) {
        const propertyPaths =
            collectConditionPropertyPaths(
                rule.when
            );
        for (const propertyPath of propertyPaths) {
            const semantic =
                semanticLookup.get(
                    propertyPath
                );
            /*
            ------------------------------------------------------------------
            Properties without a semantic definition are outside this check.
            Their existence is validated elsewhere.
            ------------------------------------------------------------------
            */
            if (!semantic) {
                continue;
            }
            statistics.selectionSemanticsChecks++;
            if (
                semantic.role !==
                "informational"
            ) {
                continue;
            }
            statistics.informationalPredicatesDetected++;
            addValidationWarning(
                warnings,
                WARNING_CODES.RRRW003,
                rule.id,
                `Informational Resource Property '${propertyPath}' is used as a Resolution Rule matching condition.`
            );
        }
    }
}

























/**
 * =============================================================================
 * hasPropertyPath
 * =============================================================================
 *
 * Determines whether an object contains the supplied dotted property path.
 *
 * Examples
 * --------
 * hasPropertyPath(object, "construction.roofType")
 * hasPropertyPath(object, "exposure.level")
 *
 * =============================================================================
 */

function hasPropertyPath(
    object,
    propertyPath
) {
    const properties =
        propertyPath.split(".");

    let current = object;
    for (const property of properties) {
        if (
            current === null ||
            typeof current !== "object" ||
            !Object.prototype.hasOwnProperty.call(
                current,
                property
            )
        ) {
            return false;
        }
        current =
            current[property];
    }
    return true;
}

/**
 * =============================================================================
 * collectConditionPropertyPaths
 * =============================================================================
 *
 * Collects all property paths referenced by Resolution Rule predicates.
 *
 * =============================================================================
 */

function collectConditionPropertyPaths(
    conditionGroup
) {
    const propertyPaths = [];
    const conditions =
        conditionGroup.all ??
        conditionGroup.any ??
        [];
    for (const condition of conditions) {
        if (
            Array.isArray(condition?.all) ||
            Array.isArray(condition?.any)
        ) {
            propertyPaths.push(
                ...collectConditionPropertyPaths(
                    condition
                )
            );
            continue;
        }
        if (
            typeof condition?.property === "string"
        ) {
            propertyPaths.push(
                condition.property
            );
        }
    }
    return propertyPaths;
}

/**
 * =============================================================================
 * validateConditionValues
 * =============================================================================
 *
 * Recursively validates explicit values contained within Resolution Rule
 * predicates.
 *
 * =============================================================================
 */

function validateConditionValues(
    conditionGroup,
    ruleId,
    resources,
    statistics,
    errors
) {
    const conditions =
        conditionGroup.all ??
        conditionGroup.any ??
        [];
    for (const condition of conditions) {
        if (
            Array.isArray(condition?.all) ||
            Array.isArray(condition?.any)
        ) {
            validateConditionValues(
                condition,
                ruleId,
                resources,
                statistics,
                errors
            );
            continue;
        }
        /*
        ----------------------------------------------------------------------
        Resolution language vocabulary is validated by Phase 3.
        ----------------------------------------------------------------------
        */
        if (
            condition.operator === "type_is"
        ) {
            continue;
        }
        if (
            condition.operator === "equals"
        ) {
            validateGovernedPropertyValue(
                condition.property,
                condition.value,
                ruleId,
                resources,
                statistics,
                errors
            );
        }
    }
}

/**
 * =============================================================================
 * validateGovernedPropertyValue
 * =============================================================================
 *
 * Validates a value against the authoritative value domain for the referenced
 * engineering property.
 *
 * =============================================================================
 */

function validateGovernedPropertyValue(
    propertyPath,
    value,
    ruleId,
    resources,
    statistics,
    errors
) {
    statistics.controlledValuesChecked++;
    /*
    --------------------------------------------------------------------------
    Build Authoritative Value Domain
    --------------------------------------------------------------------------
    */
    const governedValues = [];
    for (const resource of resources) {
        if (
            !hasPropertyPath(
                resource,
                propertyPath
            )
        ) {
            continue;
        }
        governedValues.push(
            getPropertyValue(
                resource,
                propertyPath
            )
        );
    }
    /*
    --------------------------------------------------------------------------
    Property existence is validated by Phase 4.3.
    --------------------------------------------------------------------------
    */
    if (governedValues.length === 0) {
        return;
    }
    /*
    --------------------------------------------------------------------------
    Validate Governed Value
    --------------------------------------------------------------------------
    */
    const valid =
        governedValues.some(
            governedValue =>
                Object.is(
                    governedValue,
                    value
                )
        );
    if (!valid) {
        addValidationError(
            errors,
            ERROR_CODES.RRR024,
            ruleId,
            `Value '${String(value)}' is not governed for property '${propertyPath}' within the applicable resource context.`
        );
    }
}

/**
 * =============================================================================
 * getPropertyValue
 * =============================================================================
 *
 * Retrieves a value from an object using a dotted property path.
 *
 * =============================================================================
 */

function getPropertyValue(
    object,
    propertyPath
) {
    const properties =
        propertyPath.split(".");
    let current = object;
    for (const property of properties) {
        if (
            current === null ||
            typeof current !== "object" ||
            !Object.prototype.hasOwnProperty.call(
                current,
                property
            )
        ) {
            return undefined;
        }
        current = current[property];
    }
    return current;
}

/**
 * =============================================================================
 * scopeResourcesToContext
 * =============================================================================
 *
 * Filters an authoritative resource collection using the declared Resolution
 * Rule context and registered dataset context mappings.
 *
 * =============================================================================
 */

function scopeResourcesToContext(
    resources,
    context,
    contextMappings
) {
    if (
        !context ||
        typeof context !== "object"
    ) {
        return resources;
    }
    let scopedResources = resources;
    for (
        const [contextProperty, contextValue]
        of Object.entries(context)
    ) {
        const resourceProperty =
            contextMappings?.[
                contextProperty
            ];
        if (!resourceProperty) {
            /*
            Unknown context semantics are validated elsewhere.
            */
            continue;
        }
        scopedResources =
            scopedResources.filter(
                resource =>
                    Object.is(
                        getPropertyValue(
                            resource,
                            resourceProperty
                        ),
                        contextValue
                    )
            );
    }
    return scopedResources;
}

function buildCanonicalConfiguration(
    rule
) {
    const configuration = {};
    collectEqualityPredicates(
        rule.when,
        configuration
    );
    if (
        Array.isArray(
            rule.outcome?.canonicalAssignments
        )
    ) {
        for (
            const assignment
            of rule.outcome.canonicalAssignments
        ) {
            configuration[
                assignment.property
            ] = assignment.value;
        }
    }
    return configuration;
}

function collectEqualityPredicates(
    conditionGroup,
    configuration
) {
    const conditions =
        conditionGroup.all ??
        conditionGroup.any ??
        [];
    for (const condition of conditions) {
        if (
            Array.isArray(condition?.all) ||
            Array.isArray(condition?.any)
        ) {
            collectEqualityPredicates(
                condition,
                configuration
            );
            continue;
        }
        if (
            condition.operator !== "equals"
        ) {
            continue;
        }
        configuration[
            condition.property
        ] = condition.value;
    }
}

function isPropertyApplicable(
    propertyPath,
    structure,
    applicabilityMappings
) {
    const pathParts =
        propertyPath.split(".");
    /*
    --------------------------------------------------------------------------
    Top-level properties
    --------------------------------------------------------------------------
    */
    if (pathParts.length === 1) {
        return true;
    }
    const [resourceBranch, propertyName] =
        pathParts;
    const structureBranch =
        applicabilityMappings?.[
            resourceBranch
        ];
    if (!structureBranch) {
        return true;
    }
    const applicabilityDefinition =
        structure[
            structureBranch
        ];
    /*
    --------------------------------------------------------------------------
    Entire branch not applicable
    --------------------------------------------------------------------------
    */
    if (
        applicabilityDefinition === false ||
        applicabilityDefinition === null
    ) {
        return false;
    }
    /*
    --------------------------------------------------------------------------
    Property applicability
    --------------------------------------------------------------------------
    */
    if (
        typeof applicabilityDefinition !== "object"
    ) {
        return false;
    }
    return (
        Object.prototype.hasOwnProperty.call(
            applicabilityDefinition,
            propertyName
        ) &&
        applicabilityDefinition[propertyName] === true
    );
}

/**
 * =============================================================================
 * containsPlaceholderGovernance
 * =============================================================================
 *
 * Detects placeholder values within Resolution Rule governance metadata.
 *
 * =============================================================================
 */

function containsPlaceholderGovernance(
    governance
) {
    const values = [
        governance.rationale,
        governance.source,
        governance.effectiveFrom
    ];
    return values.some(
        value =>
            typeof value === "string" &&
            (
                value.includes("<") ||
                value.includes(">")
            )
    );
}

function buildRuleDefinitionSignature(
    rule
) {
    return JSON.stringify({
        appliesTo: rule.appliesTo,
        when: rule.when,
        outcome: rule.outcome
    });
}

function rulesShareScope(
    firstRule,
    secondRule
) {

    return (
        firstRule.appliesTo?.datasetId ===
            secondRule.appliesTo?.datasetId
        &&
        firstRule.appliesTo?.resourceType ===
            secondRule.appliesTo?.resourceType
        &&
        JSON.stringify(
            firstRule.appliesTo?.context ?? {}
        ) ===
        JSON.stringify(
            secondRule.appliesTo?.context ?? {}
        )
    );

}

function expandConditionAlternatives(
    conditionGroup
) {
    if (
        Array.isArray(
            conditionGroup?.all
        )
    ) {
        let alternatives = [
            []
        ];
        for (
            const condition
            of conditionGroup.all
        ) {
            const childAlternatives =
                isConditionGroup(condition)
                    ? expandConditionAlternatives(
                        condition
                    )
                    : [
                        [condition]
                    ];
            alternatives =
                combineAlternatives(
                    alternatives,
                    childAlternatives
                );
        }
        return alternatives;
    }
    if (
        Array.isArray(
            conditionGroup?.any
        )
    ) {
        return conditionGroup.any.flatMap(
            condition =>
                isConditionGroup(condition)
                    ? expandConditionAlternatives(
                        condition
                    )
                    : [
                        [condition]
                    ]
        );
    }
    return [];
}

function isConditionGroup(
    condition
) {
    return (
        Array.isArray(condition?.all) ||
        Array.isArray(condition?.any)
    );
}

function combineAlternatives(
    firstAlternatives,
    secondAlternatives
) {
    const combinations = [];
    for (
        const first
        of firstAlternatives
    ) {
        for (
            const second
            of secondAlternatives
        ) {
            combinations.push([
                ...first,
                ...second
            ]);
        }
    }
    return combinations;
}

function conditionsCanOverlap(
    firstConditionGroup,
    secondConditionGroup
) {
    const firstAlternatives =
        expandConditionAlternatives(
            firstConditionGroup
        );
    const secondAlternatives =
        expandConditionAlternatives(
            secondConditionGroup
        );
    for (
        const firstPredicates
        of firstAlternatives
    ) {
        for (
            const secondPredicates
            of secondAlternatives
        ) {
            if (
                predicateSetsAreCompatible(
                    firstPredicates,
                    secondPredicates
                )
            ) {
                return true;
            }
        }
    }
    return false;
}

function predicateSetsAreCompatible(
    firstPredicates,
    secondPredicates
) {
    const predicates = [
        ...firstPredicates,
        ...secondPredicates
    ];
    const properties = new Map();
    for (const predicate of predicates) {
        if (
            !properties.has(
                predicate.property
            )
        ) {
            properties.set(
                predicate.property,
                []
            );
        }
        properties
            .get(predicate.property)
            .push(predicate);
    }
    for (
        const propertyPredicates
        of properties.values()
    ) {
        if (
            predicatesConflict(
                propertyPredicates
            )
        ) {
            return false;
        }
    }
    return true;
}

function predicatesConflict(
    predicates
) {
    const equalsPredicates =
        predicates.filter(
            predicate =>
                predicate.operator ===
                "equals"
        );
    const typePredicates =
        predicates.filter(
            predicate =>
                predicate.operator ===
                "type_is"
        );
    /*
    --------------------------------------------------------------------------
    Conflicting equals values
    --------------------------------------------------------------------------
    */
    if (
        equalsPredicates.length > 1
    ) {
        const firstValue =
            equalsPredicates[0].value;
        if (
            equalsPredicates.some(
                predicate =>
                    !Object.is(
                        predicate.value,
                        firstValue
                    )
            )
        ) {
            return true;
        }
    }
    /*
    --------------------------------------------------------------------------
    equals versus type_is
    --------------------------------------------------------------------------
    */
    if (
        equalsPredicates.length > 0 &&
        typePredicates.length > 0
    ) {
        const equalsValue =
            equalsPredicates[0].value;
        const actualType =
            getJsonType(
                equalsValue
            );
        if (
            typePredicates.some(
                predicate =>
                    predicate.value !==
                    actualType
            )
        ) {
            return true;
        }
    }
    /*
    --------------------------------------------------------------------------
    Conflicting type predicates
    --------------------------------------------------------------------------
    */
    if (
        typePredicates.length > 1
    ) {
        const firstType =
            typePredicates[0].value;
        if (
            typePredicates.some(
                predicate =>
                    predicate.value !==
                    firstType
            )
        ) {
            return true;
        }
    }
    return false;
}

function getJsonType(
    value
) {
    if (value === null) {
        return "null";
    }
    if (Array.isArray(value)) {
        return "array";
    }
    return typeof value;
}

function outcomesAreEquivalent(
    firstOutcome,
    secondOutcome
) {
    if (
        firstOutcome?.type !==
        secondOutcome?.type
    ) {
        return false;
    }
    /*
    --------------------------------------------------------------------------
    Undefined outcomes
    --------------------------------------------------------------------------
    */
    if (
        firstOutcome.type ===
        "undefined_configuration"
    ) {
        return true;
    }
    return (
        firstOutcome.canonicalTargetId ===
            secondOutcome.canonicalTargetId
        &&
        JSON.stringify(
            firstOutcome.canonicalAssignments
        ) ===
        JSON.stringify(
            secondOutcome.canonicalAssignments
        )
    );

}

function buildConcreteConfiguration(
    predicates
) {
    const values = {};
    let complete = true;
    for (const predicate of predicates) {
        if (
            predicate.operator !== "equals"
        ) {
            complete = false;
            continue;
        }
        values[
            predicate.property
        ] = predicate.value;
    }
    return {
        complete,
        values
    };
}

function configurationMatchesResource(
    configuration,
    resource
) {
    for (
        const [propertyPath, expectedValue]
        of Object.entries(configuration)
    ) {
        if (
            !hasPropertyPath(
                resource,
                propertyPath
            )
        ) {
            return false;
        }
        const resourceValue =
            getPropertyValue(
                resource,
                propertyPath
            );
        if (
            !Object.is(
                resourceValue,
                expectedValue
            )
        ) {
            return false;
        }
    }
    return true;
}

function predicateSetCanMatchGovernedDomain(
    predicates,
    resources
) {
    /*
    --------------------------------------------------------------------------
    Internally contradictory predicates cannot match.
    --------------------------------------------------------------------------
    */
    if (
        predicatesConflictAcrossProperties(
            predicates
        )
    ) {
        return false;
    }
    const predicatesByProperty =
        new Map();
    for (const predicate of predicates) {
        if (
            !predicatesByProperty.has(
                predicate.property
            )
        ) {
            predicatesByProperty.set(
                predicate.property,
                []
            );
        }
        predicatesByProperty
            .get(predicate.property)
            .push(predicate);
    }
    for (
        const [propertyPath, propertyPredicates]
        of predicatesByProperty.entries()
    ) {
        const governedValues =
            resources
                .filter(
                    resource =>
                        hasPropertyPath(
                            resource,
                            propertyPath
                        )
                )
                .map(
                    resource =>
                        getPropertyValue(
                            resource,
                            propertyPath
                        )
                );
        const satisfiable =
            governedValues.some(
                value =>
                    propertyPredicates.every(
                        predicate =>
                            predicateMatchesValue(
                                predicate,
                                value
                            )
                    )
            );
        if (!satisfiable) {
            return false;
        }
    }
    return true;
}

function predicateMatchesValue(
    predicate,
    value
) {
    if (
        predicate.operator === "equals"
    ) {
        return Object.is(
            value,
            predicate.value
        );
    }
    if (
        predicate.operator === "type_is"
    ) {
        return (
            getJsonType(value) ===
            predicate.value
        );
    }
    return false;
}

function predicatesConflictAcrossProperties(
    predicates
) {
    const predicatesByProperty =
        new Map();
    for (const predicate of predicates) {
        if (
            !predicatesByProperty.has(
                predicate.property
            )
        ) {
            predicatesByProperty.set(
                predicate.property,
                []
            );
        }
        predicatesByProperty
            .get(predicate.property)
            .push(predicate);
    }
    return Array.from(
        predicatesByProperty.values()
    ).some(
        propertyPredicates =>
            predicatesConflict(
                propertyPredicates
            )
    );
}