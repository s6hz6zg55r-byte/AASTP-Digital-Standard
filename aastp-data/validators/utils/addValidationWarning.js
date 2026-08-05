/**
 * Utility:
 * addValidationWarning.js
 *
 * Purpose:
 * Adds a standardised validation warning to a
 * ValidationResult warning collection.
 *
 * Inputs:
 *   warnings    Array of validation warnings.
 *   code        Validator-specific warning code.
 *   location    Repository location of the warning.
 *   message     Human-readable description.
 *
 * Output:
 *   None (mutates the supplied warnings array).
 *
 * Notes:
 * Validation warnings indicate observations that
 * do not invalidate the repository but may require
 * engineering review.
 */

export function addValidationWarning(
    warnings,
    code,
    location,
    message
) {
    warnings.push({
        code,
        location,
        message
    });
}

/*
------------------------------------------------------------
Usage Examples
------------------------------------------------------------

// Example 1 - Repository observation

addValidationWarning(
    warnings,
    "DRW001",
    "BD03_A",
    "Branch contains an optional notes field that is empty."
);


// Example 2 - Engineering observation

addValidationWarning(
    warnings,
    "DRW002",
    "BD05",
    "Branch upper engineering limit is unusually large."
);


// Example 3 - Transformation observation

addValidationWarning(
    warnings,
    "TRW001",
    "FORM001",
    "Transformation is defined but not currently referenced."
);

*/