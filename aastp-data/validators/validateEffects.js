const { loadRepository } = require("./utils/loadRepository");

const {
    validateSource,
    validateUniqueIds,
    isNonEmptyString
} = require("./utils");

// This is the list of valid effect categories. Consider pulling out into its own json file at a later stage.
const VALID_CATEGORIES = [
    "blast_effect",
    "fragment_effect",
    "thermal_effect",
    "fire_effect",
    "local_effect"
];

// This is the top level function which cycles through effects.json data. It calls on the other functions in doing so.
function validateEffects(repository = loadRepository()) {
    const errors = [];
    const warnings = [];
    const {effects} = repository;

    validateEffectsDataset(
        effects,
        errors
    );

    if (
        Array.isArray(
            effects.effects
        )
    ) {

        validateUniqueIds(
            effects.effects,
            errors,
            "effect"
        );

        for (const effect of effects.effects) {
            validateEffect(
                effect,
                errors
            );
        }
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}

// This function confirms that the json contains the minimum necessary data overall.
// It does not examine the data contained within individual effects.
function validateEffectsDataset(
    data,
    errors
) {

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

    if (!Array.isArray(data.effects)) {
        errors.push(
            "effects must be an array"
        );
        return;
    }

    if (data.effects.length === 0) {
        errors.push(
            "effects array cannot be empty"
        );
    }
}

// This function checks individual effects to make sure each one contains the necessary data.
function validateEffect(
    effect,
    errors
) {

    if (!effect.id) {
        errors.push(
            "Effect: missing id"
        );
    }

    if (
        !isNonEmptyString(
            effect.code
        )
    ) {

        errors.push(
            `${effect.id}: missing code`
        );
    }

    if (
        !isNonEmptyString(
            effect.name
        )
    ) {

        errors.push(
            `${effect.id}: missing name`
        );
    }

    if (
        !isNonEmptyString(
            effect.description
        )
    ) {

        errors.push(
            `${effect.id}: missing description`
        );
    }

    if (
        !VALID_CATEGORIES.includes(
            effect.category
        )
    ) {

        errors.push(
            `${effect.id}: invalid category '${effect.category}'`
        );
    }

    if (
        typeof effect.requiresQD !==
        "boolean"
    ) {

        errors.push(
            `${effect.id}: requiresQD must be boolean`
        );
    }

    if (
        typeof effect.active !==
        "boolean"
    ) {

        errors.push(
            `${effect.id}: active must be boolean`
        );
    }

    validateSource(
        effect.source,
        effect.id,
        errors
    );
}

const result =
    validateEffects();

if (result.valid) {

    console.log(
        "✓ Effects validation passed"
    );

} else {

    console.error(
        "Effects Validation Errors:"
    );

    result.errors.forEach(
        error =>
            console.error(
                `  - ${error}`
            )
    );

    process.exit(1);
}