/******************************************************************************
 * resourceResolver
 *
 * Purpose
 * -------
 * Resolves client-defined PES and ES configurations to authoritative
 * engineering resources during request validation.
 *
 * Resolution Order
 * ----------------
 * 1. Read the requested PES and ES definitions
 * 2. Resolve the applicable authoritative resource dataset
 * 3. Scope candidate resources to the requested Structure
 * 4. Attempt exact resource matching
 * 5. If no exact match exists, evaluate applicable Resource Resolution Rules
 * 6. Apply any governed canonicalisation
 * 7. Store resolved resources and resolution evidence in the validation context
 *
 * Design Principles
 * -----------------
 * - All authoritative data access occurs through repositoryService.
 * - Resource resolution occurs within request validation.
 * - Exact authoritative resources take precedence over Resolution Rules.
 * - Resolution Rules are interpreted generically.
 * - Engineering values are not hard-coded into service logic.
 * - PES-specific and ES-specific engineering behaviour is not embedded here.
 * - Only authoritative resolved resources proceed to interaction resolution.
 *
 ******************************************************************************/

import { repositoryService } from "@aastp/core-data";


export function resolve(
    context,
    validationResult
) {
    validateContext(
        context,
        validationResult
    );
    resolveSiteResource(
        context,
        validationResult,
        {
            site: "PES",
            datasetId: "pes_types",
            idField: "pesType",
            configurationField: "pes",
            resolvedField: "pesType",
            directLookup: repositoryService.findPesTypeById,
            errorCode: "UNKNOWN_PES"
        }
    );
    resolveSiteResource(
        context,
        validationResult,
        {
            site: "ES",
            datasetId: "es_types",
            idField: "esType",
            configurationField: "es",
            resolvedField: "esType",
            directLookup: repositoryService.findEsTypeById,
            errorCode: "UNKNOWN_ES"
        }
    );
    return context;
}

function validateContext(
    context,
    validationResult
) {
    if (!context) {
        throw new Error(
            "resourceResolver requires a context."
        );
    }
    if (!context.request) {
        throw new Error(
            "resourceResolver requires context.request."
        );
    }
    if (!context.resolvedEntities) {
        throw new Error(
            "resourceResolver requires context.resolvedEntities."
        );
    }
    if (
        !validationResult ||
        !Array.isArray(validationResult.errors)
    ) {
        throw new Error(
            "resourceResolver requires a validation result."
        );
    }
}


function resolveDirectResource(
    context,
    validationResult,
    {
        site,
        requestField,
        resolvedField,
        lookup,
        errorCode
    }
) {
    const id =
        context.request[
            requestField
        ];
    /*
    --------------------------------------------------------------------------
    No direct ID supplied
    --------------------------------------------------------------------------
    Configuration-based resource resolution will be implemented later.
    */
    if (
        id === undefined ||
        id === null
    ) {
        return;
    }
    /*
    --------------------------------------------------------------------------
    Resolve authoritative resource
    --------------------------------------------------------------------------
    */
    const resource =
        lookup(id);
    if (!resource) {
        validationResult.errors.push({
            field: requestField,
            code: errorCode,
            message:
                `Unknown ${site} Type '${id}'`
        });
        return;
    }
    /*
    --------------------------------------------------------------------------
    Store authoritative resource
    --------------------------------------------------------------------------
    */
    context.resolvedEntities[
        resolvedField
    ] = resource;
    /*
    --------------------------------------------------------------------------
    Store resolution evidence
    --------------------------------------------------------------------------
    */
    if (!context.resourceResolutions) {
        context.resourceResolutions = {
            pes: null,
            es: null
        };
    }
    context.resourceResolutions[
        site.toLowerCase()
    ] = {
        status: "exact_match",
        resourceId: resource.id
    };
}

function resolveSiteResource(
    context,
    validationResult,
    {
        site,
        datasetId,
        idField,
        configurationField,
        resolvedField,
        directLookup,
        errorCode
    }
) {

    const directId =
        context.request[idField];

    const configuration =
        context.request[configurationField];


    /*
    --------------------------------------------------------------------------
    Direct-ID path
    --------------------------------------------------------------------------
    */

    if (
        directId !== undefined &&
        directId !== null
    ) {

        resolveDirectResource(
            context,
            validationResult,
            {
                site,
                requestField: idField,
                resolvedField,
                lookup: directLookup,
                errorCode
            }
        );

        return;

    }


    /*
    --------------------------------------------------------------------------
    Configuration path
    --------------------------------------------------------------------------
    */

    resolveConfiguredResource(
        context,
        validationResult,
        {
            site,
            datasetId,
            configuration,
            resolvedField
        }
    );

}

function resolveConfiguredResource(
    context,
    validationResult,
    {
        site,
        datasetId,
        configuration,
        resolvedField
    }
) {
    const resources =
        resolveResourceDataset(
            datasetId
        );
    const candidateResources =
        scopeResourcesToStructure(
            resources,
            configuration.structureId
        );
    const exactResource =
        findExactResource(
            candidateResources,
            configuration
        );
    /*
    --------------------------------------------------------------------------
    No exact match
    --------------------------------------------------------------------------

    Resource Resolution Rules will be introduced during R4-R6.
    --------------------------------------------------------------------------
    */
    if (!exactResource) {
        const resolution = resolveUsingRules({
            site,
            datasetId,
            configuration,
            resourceDataset: resources
        });
        if (resolution.status === "unresolved") {
            validationResult.errors.push({
                field: site.toLowerCase(),
                code: "RESOURCE_UNRESOLVED",
                message:
                    `${site} configuration does not resolve to an authoritative resource.`
            });
            return;
        }
        if (resolution.status === "undefined_configuration") {
            validationResult.errors.push({
                field: site.toLowerCase(),
                code: "RESOURCE_UNDEFINED",
                message:
                    `${site} configuration is explicitly undefined by governed Resource Resolution Rule '${resolution.ruleId}'.`
            });
            ensureResolutionEvidence(context);
            context.resourceResolutions[
                site.toLowerCase()
            ] = resolution;
            return;
        }
        context.resolvedEntities[ resolvedField ] = resolution.resource;
        ensureResolutionEvidence( context );
        context.resourceResolutions[
            site.toLowerCase()
        ] = resolution;
        return;
    }
    /*
    --------------------------------------------------------------------------
    Store authoritative resource
    --------------------------------------------------------------------------
    */
    context.resolvedEntities[
        resolvedField
    ] = exactResource;
    /*
    --------------------------------------------------------------------------
    Store resolution evidence
    --------------------------------------------------------------------------
    */
    ensureResolutionEvidence(
        context
    );
    context.resourceResolutions[
        site.toLowerCase()
    ] = {
        status: "exact_match",
        resourceId: exactResource.id
    };
}

function resolveResourceDataset(
    datasetId
) {
    switch (datasetId) {
        case "pes_types":
            return repositoryService.getPesTypes();
        case "es_types":
            return repositoryService.getEsTypes();
        default:
            throw new Error(
                `Unsupported resource dataset '${datasetId}'.`
            );
    }
}

function scopeResourcesToStructure(
    resources,
    structureId
) {
    return resources.filter(
        resource =>
            resource.structure === structureId
    );
}

function findExactResource(
    candidateResources,
    configuration
) {
    const matches =
        candidateResources.filter(
            resource =>
                configurationMatchesResource(
                    configuration,
                    resource
                )
        );
    if (matches.length > 1) {
        const ids =
            matches
                .map(
                    resource =>
                        resource.id
                )
                .join(", ");
        throw new Error(
            `Resource configuration resolved to multiple authoritative resources: ${ids}.`
        );
    }
    return matches[0] ?? null;
}

function configurationMatchesResource(
    configuration,
    resource
) {
    const comparableConfiguration = {
        ...configuration
    };
    delete comparableConfiguration.structureId;
    return objectPropertiesMatch(
        comparableConfiguration,
        resource
    );
}

function objectPropertiesMatch(
    expected,
    actual
) {
    for (
        const [key, expectedValue]
        of Object.entries(expected)
    ) {
        /*
        ----------------------------------------------------------------------
        Nested object
        ----------------------------------------------------------------------
        */
        if (
            expectedValue !== null &&
            typeof expectedValue === "object" &&
            !Array.isArray(expectedValue)
        ) {
            if (
                actual?.[key] === null ||
                typeof actual?.[key] !== "object"
            ) {
                return false;
            }
            if (
                !objectPropertiesMatch(
                    expectedValue,
                    actual[key]
                )
            ) {
                return false;
            }
            continue;
        }
        /*
        ----------------------------------------------------------------------
        Scalar / null
        ----------------------------------------------------------------------
        */
        if (
            !Object.is(
                actual?.[key],
                expectedValue
            )
        ) {
            return false;
        }
    }
    return true;
}

function ensureResolutionEvidence(
    context
) {
    if (!context.resourceResolutions) {
        context.resourceResolutions = {
            pes: null,
            es: null
        };
    }
}

function resolveUsingRules({
    site,
    datasetId,
    configuration,
    resourceDataset
}) {
    const rules =
        findApplicableResolutionRules(
            datasetId,
            configuration.structureId
        );
    const matchingRules =
        rules.filter(
            rule =>
                evaluateConditionGroup(
                    rule.when,
                    configuration
                )
        );
    /*
    --------------------------------------------------------------------------
    No governed rule
    --------------------------------------------------------------------------
    */
    if (
        matchingRules.length === 0
    ) {
        return {
            status: "unresolved"
        };
    }
    /*
    --------------------------------------------------------------------------
    Determinism failure
    --------------------------------------------------------------------------
    Layer 2 validation is intended to prevent this. If it occurs here,
    the service/data contract has been violated.
    --------------------------------------------------------------------------
    */
    if (
        matchingRules.length > 1
    ) {
        const ruleIds =
            matchingRules
                .map(rule => rule.id)
                .join(", ");
        throw new Error(
            `${site} configuration matched multiple Resource Resolution Rules: ${ruleIds}.`
        );
    }
    return applyResolutionRule({
        rule: matchingRules[0],
        configuration,
        resourceDataset
    });

}

function findApplicableResolutionRules(
    datasetId,
    structureId
) {
    const rules =
        repositoryService.getResourceResolutionRules();
    return rules.filter(
        rule =>
            rule.appliesTo?.datasetId ===
                datasetId
            &&
            rule.appliesTo?.context?.structureId ===
                structureId
    );
}

function evaluateConditionGroup(
    conditionGroup,
    configuration
) {
    if ( Array.isArray( conditionGroup?.all )) {
        return conditionGroup.all.every(
            condition =>
                evaluateCondition(
                    condition,
                    configuration
                )
        );
    }
    if ( Array.isArray( conditionGroup?.any )) {
        return conditionGroup.any.some(
            condition =>
                evaluateCondition(
                    condition,
                    configuration
                )
        );
    }
    throw new Error(
        "Resource Resolution Rule contains an invalid condition group."
    );
}

function evaluateCondition(
    condition,
    configuration
) {
    if (
        Array.isArray(condition?.all) ||
        Array.isArray(condition?.any)
    ) {
        return evaluateConditionGroup(
            condition,
            configuration
        );
    }
    const actualValue =
        getPropertyValue(
            buildResolutionConfiguration(
                configuration
            ),
            condition.property
        );
    switch (
        condition.operator
    ) {
        case "equals":
            return Object.is( actualValue, condition.value );
        case "type_is":
            return ( getJsonType( actualValue ) === condition.value );
        default:
            throw new Error(
                `Unsupported Resource Resolution Rule operator '${condition.operator}'.`
            );
    }
}

function buildResolutionConfiguration(
    configuration
) {
    const resolutionConfiguration = {
        ...configuration,
        structure:
            configuration.structureId
    };
    delete resolutionConfiguration.structureId;
    return resolutionConfiguration;
}

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
        current =
            current[property];
    }
    return current;
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

function applyResolutionRule({
    rule,
    configuration,
    resourceDataset
}) {
    /*
    --------------------------------------------------------------------------
    Explicitly undefined configuration
    --------------------------------------------------------------------------
    */
    if (
        rule.outcome?.type ===
        "undefined_configuration"
    ) {
        return {
            status: "undefined_configuration",
            ruleId: rule.id,
            outcomeType: rule.outcome.type,
            resource: null
        };
    }
    /*
    --------------------------------------------------------------------------
    Canonicalise configuration
    --------------------------------------------------------------------------
    */
    const canonicalConfiguration =
        applyCanonicalAssignments(
            configuration,
            rule.outcome.canonicalAssignments
        );
    /*
    --------------------------------------------------------------------------
    Resolve canonical target
    --------------------------------------------------------------------------
    */
    const canonicalResource =
        resourceDataset.find(
            resource =>
                resource.id ===
                rule.outcome.canonicalTargetId
        );
    if (!canonicalResource) {
        /*
        Layer 2 P4.6 should make this impossible.
        */
        throw new Error(
            `Canonical target '${rule.outcome.canonicalTargetId}' referenced by Resource Resolution Rule '${rule.id}' was not found.`
        );
    }
    return {
        status: "canonicalised",
        ruleId: rule.id,
        outcomeType: rule.outcome.type,
        canonicalTargetId:
            canonicalResource.id,
        canonicalConfiguration,
        assignments:
            buildAssignmentEvidence(
                configuration,
                rule.outcome.canonicalAssignments
            ),
        resource:
            canonicalResource
    };
}

function applyCanonicalAssignments(
    configuration,
    assignments = []
) {
    const canonicalConfiguration =
        structuredClone(
            configuration
        );
    for (const assignment of assignments) {
        setPropertyValue(
            canonicalConfiguration,
            assignment.property,
            assignment.value
        );
    }
    return canonicalConfiguration;
}

function setPropertyValue(
    object,
    propertyPath,
    value
) {
    const properties =
        propertyPath.split(".");
    let current = object;
    for (
        let index = 0;
        index < properties.length - 1;
        index++
    ) {
        const property =
            properties[index];
        if (
            current[property] === undefined ||
            current[property] === null ||
            typeof current[property] !== "object"
        ) {
            current[property] = {};
        }
        current =
            current[property];
    }
    current[
        properties[
            properties.length - 1
        ]
    ] = value;
}

function buildAssignmentEvidence(
    configuration,
    assignments = []
) {
    const resolutionConfiguration =
        buildResolutionConfiguration(
            configuration
        );
    return assignments.map(
        assignment => ({
            property:
                assignment.property,
            from:
                getPropertyValue(
                    resolutionConfiguration,
                    assignment.property
                ),
            to:
                assignment.value
        })
    );
}