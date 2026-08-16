/******************************************************************************
 * validateResourcePropertySemanticsRepository
 *
 * Layer 2 Repository Validator
 *
 * Purpose
 * -------
 * Validates the engineering integrity of the Resource Property Semantics
 * repository.
 *
 * Responsibilities
 * ----------------
 * - Repository integrity
 * - Unique resource property definitions
 * - Governed semantic role validation
 * - Governed derivation-source validation
 * - Semantic definition consistency
 * - Cross-repository property-path validation
 *
 * Out of Scope
 * ------------
 * This validator does not:
 *
 * - Validate JSON Schema compliance (Layer 1)
 * - Determine Structure-specific property applicability
 * - Execute resource selection
 * - Execute resource resolution
 *
 ******************************************************************************/

import repository
    from "../../repository/repository.js";

import {
    VALIDATORS,
    ERROR_CODES
}
    from "../../constants/validationConstants.js";

import {
    RESOURCE_PROPERTY_ROLES,
    PROPERTY_DERIVATION_SOURCES
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


const VALIDATOR = {

    id: VALIDATORS.RESOURCE_PROPERTY_SEMANTICS_REPOSITORY,

    name: "Resource Property Semantics Repository Integrity",

    layer: 2,

    dataset: "propertySemantics"

};


export function validateResourcePropertySemanticsRepository() {
    /*
    --------------------------------------------------------------------------
    Phase 1
    Repository Collections
    --------------------------------------------------------------------------
    */
    const propertySemantics =
        repository.getCollection("resourcePropertySemantics");
    const esTypes =
        repository.getCollection("esTypes");
    const pesTypes =
        repository.getCollection("pesTypes");
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
    Repository Integrity
    --------------------------------------------------------------------------
    */

    validateRepositoryIntegrity(
        propertySemantics,
        statistics,
        errors
    );


    /*
    --------------------------------------------------------------------------
    Phase 3
    Semantic Definitions
    --------------------------------------------------------------------------
    */

    validateSemanticDefinitions(
        propertySemantics,
        statistics,
        errors
    );


    /*
    --------------------------------------------------------------------------
    Phase 4
    Property References
    --------------------------------------------------------------------------
    */

    validatePropertyReferences(
        propertySemantics,
        {
            esTypes,
            pesTypes
        },
        statistics,
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

function validateRepositoryIntegrity(
    propertySemantics,
    statistics,
    errors
) {
    statistics.semanticDefinitionsChecked = 0;
    statistics.propertyIdentifiersChecked = 0;
    if (
        !Array.isArray(propertySemantics) ||
        propertySemantics.length === 0
    ) {
        addValidationError(
            errors,
            ERROR_CODES.RPS001,
            "Repository",
            "Resource Property Semantics repository is empty."
        );
        return;
    }
    const properties = new Set();
    for (const semantic of propertySemantics) {
        statistics.semanticDefinitionsChecked++;
        statistics.propertyIdentifiersChecked++;
        if (
            properties.has(
                semantic.property
            )
        ) {
            addValidationError(
                errors,
                ERROR_CODES.RPS002,
                semantic.property,
                `Duplicate Resource Property semantic definition '${semantic.property}'.`
            );
        }
        properties.add(
            semantic.property
        );
    }
}

function validateSemanticDefinitions(
    propertySemantics,
    statistics,
    errors
) {
    statistics.rolesChecked = 0;
    statistics.derivationSourcesChecked = 0;
    for (const semantic of propertySemantics) {
        /*
        ----------------------------------------------------------------------
        Role
        ----------------------------------------------------------------------
        */
        statistics.rolesChecked++;
        if (
            !RESOURCE_PROPERTY_ROLES.includes(
                semantic.role
            )
        ) {
            addValidationError(
                errors,
                ERROR_CODES.RPS010,
                semantic.property,
                `Unknown Resource Property role '${semantic.role}'.`
            );
        }
        /*
        ----------------------------------------------------------------------
        Derivation Source
        ----------------------------------------------------------------------
        */
        if (
            semantic.derivedFrom !== undefined
        ) {
            statistics.derivationSourcesChecked++;
            if (
                !PROPERTY_DERIVATION_SOURCES.includes(
                    semantic.derivedFrom
                )
            ) {
                addValidationError(
                    errors,
                    ERROR_CODES.RPS011,
                    semantic.property,
                    `Unknown Resource Property derivation source '${semantic.derivedFrom}'.`
                );
            }
        }
        /*
        ----------------------------------------------------------------------
        Semantic Consistency
        ----------------------------------------------------------------------
        */
        if (
            semantic.role === "selectable" &&
            semantic.derivedFrom !== undefined
        ) {
            addValidationError(
                errors,
                ERROR_CODES.RPS012,
                semantic.property,
                `Selectable Resource Property '${semantic.property}' must not define a derivation source.`
            );
        }
    }
}

function validatePropertyReferences(
    propertySemantics,
    repositories,
    statistics,
    errors
) {
    statistics.propertyReferencesChecked = 0;
    const resources = [
        ...repositories.esTypes,
        ...repositories.pesTypes
    ];
    for (const semantic of propertySemantics) {
        statistics.propertyReferencesChecked++;
        const propertyExists =
            resources.some(
                resource =>
                    hasPropertyPath(
                        resource,
                        semantic.property
                    )
            );
        if (!propertyExists) {
            addValidationError(
                errors,
                ERROR_CODES.RPS020,
                semantic.property,
                `Resource Property '${semantic.property}' does not exist in the governed ES or PES resource model.`
            );
        }
    }
}

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