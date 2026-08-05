const { loadRepository } = require("../utils/loadRepository");
const { validateUniqueIds} = require("../utils/validateUniqueIds")
const {
    validateId,
    validateSource,
    validateHazardSource,
    isNonEmptyString
} = require("../utils");
const VALID_TYPES = [
    "hazard_division",
    "storage_subdivision"
];
const VALID_QUANTITY_BASIS = [
    "NEQ",
    "MCE"
];

function validateHazardClasses(repository = loadRepository()) {
 
    const errors = [];
    const warnings = [];
    const {hazardCategories} = repository;

    validateDataset(hazardCategories, errors);

    validateUniqueIds(
        hazardCategories.hazard_divisions,
        errors,
        "Hazard Classes"
    );

    for (const hazard of hazardCategories.hazard_divisions) {

        validateHazardDivision(
            hazard,
            errors,
            warnings
        );
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}

function validateDataset(
    data,
    errors) 
    {
    if (!data.schemaVersion) {
        errors.push(
            "Missing schemaVersion"
        );
    }
    if (!data.metadata) {
        errors.push(
            "Missing metadata"
        );
    }
    if (!Array.isArray(data.hazard_divisions)) {
        errors.push(
            "hazard_divisions must be an array"
        );
    }
    if (data.hazard_divisions.length === 0) {
        errors.push(
            "hazard_divisions array cannot be empty"
        )
    }
}

function validateHazardDivision(
    hazard,
    errors,
    warnings
) {

    validateId(
        hazard.id,
        hazard.id,
        `Hazard ${hazard.id}`,
        errors
    );

    if (!isNonEmptyString(hazard.code)) {
        errors.push(
            `${hazard.id}: missing code`
        );
    }

    if (!isNonEmptyString(hazard.name)) {
        errors.push(
            `${hazard.id}: missing name`
        );
    }

    if (!isNonEmptyString(hazard.description)) {
        errors.push(
            `${hazard.id}: missing description`
        );
    }

    if (
        !VALID_TYPES.includes(hazard.type)
    ) {
        errors.push(
            `${hazard.id}: invalid type '${hazard.type}'`
        );
    }

    validateHazardSource(
        hazard.source,
        `Hazard ${hazard.id}`,
        errors
    );



    validateQuantityBasis(
        hazard,
        errors
    );

    validateEffectsArray(
        hazard,
        errors
    );

    validateParentDivision(
        hazard,
        warnings
    );
}

function validateQuantityBasis(
    hazard,
    errors
) {

    if (
        !Array.isArray(
            hazard.supportedQuantityBasis
        )
    ) {
        errors.push(
            `${hazard.id}: supportedQuantityBasis must be an array`
        );
        return;
    }

    for (const basis of hazard.supportedQuantityBasis) {

        if (
            !VALID_QUANTITY_BASIS.includes(
                basis
            )
        ) {
            errors.push(
                `${hazard.id}: invalid quantity basis '${basis}'`
            );
        }
    }
}

function validateEffectsArray(
    hazard,
    errors
) {

    if (!Array.isArray(hazard.effects)) {
        errors.push(
            `${hazard.id}: effects must be an array`
        );
        return;
    }

    if (hazard.effects.length === 0) {
        errors.push(
            `${hazard.id}: effects array cannot be empty`
        );
    }
}

function validateParentDivision(
    hazard,
    warnings
) {

    const expected =
        expectedParent(hazard.code);

    if (
        hazard.type === "hazard_division" &&
        expected !== null
    ) {

        warnings.push(
            `${hazard.id}: hazard_division should not have subdivision code '${hazard.code}'`
        );
    }

    if (
        hazard.type === "storage_subdivision" &&
        expected === null
    ) {

        warnings.push(
            `${hazard.id}: storage_subdivision must have a parent division`
        );
    }

    if (
        hazard.parentDivision !== expected
    ) {

        warnings.push(
            `${hazard.id}: expected parentDivision '${expected}' but found '${hazard.parentDivision}'`
        );
    }
}

function expectedParent(code) {

    const parts = code.split(".");

    // Top-level divisions
    if (parts.length === 2) {
        return null;
    }

    // Storage subdivisions
    return `${parts[0]}.${parts[1]}`;
}

const result =
    validateHazardClasses();

if (result.valid) {
    console.log(
        "✓ Hazard category validation passed"
    );
}

if (result.warnings.length) {

    console.log("\nWarnings:");

    result.warnings.forEach(w =>
        console.log(`  - ${w}`)
    );
}

if (result.errors.length) {

    console.log("\nErrors:");

    result.errors.forEach(e =>
        console.log(`  - ${e}`)
    );

    process.exit(1);
}
