/**
 * Utility:
 * addValidationError.js
 *
 * Purpose:
 * Adds a standardised validation error to a
 * ValidationResult error collection.
 *
 * Inputs:
 *   errors      Array of validation errors.
 *   code        Validator-specific error code.
 *   location    Repository location of the error.
 *   message     Human-readable description.
 *
 * Output:
 *   None (mutates the supplied errors array).
 */

export function addValidationError(
    errors,
    code,
    location,
    message
) {
    errors.push({
        code,
        location,
        message
    });
}

/**
 * Usage:
 * Instead of:
 * errors.push(`${rule.id}: missing calculation`);
 *
 * Use:
 * addValidationError(
 *     errors,
 *     "DR001",
 *     rule.id,
 *     "Missing calculation object"
 * );
 * 
 * 
 */