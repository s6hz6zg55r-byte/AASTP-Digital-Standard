/**
 * =============================================================================
 * Validation Level Summary Component
 * =============================================================================
 *
 * Purpose
 * -------
 * Creates a reusable validation level summary for engineering assurance reports.
 *
 * Responsibilities
 * ----------------
 * • Summarises validation outcomes by validation level.
 * • Supports executive review.
 * • Provides navigation into detailed report sections.
 *
 * Inputs
 * ------
 * layers
 *
 * Outputs
 * -------
 * Validation Level Summary component.
 *
 * Dependencies
 * ------------
 * Document Presentation Standard.
 *
 * Future Extension Points
 * -----------------------
 * • Overall percentages
 * • Validation duration
 * • Collapsible sections
 *
 * =============================================================================
 */

export const VALIDATION_LEVEL_SUMMARY_COMPONENT = Object.freeze({
    id:
        "COMP003",

    name:
        "Validation Level Summary",

    description:
        "Reusable validation level summary."
});


export function buildValidationLevelSummary({
    layers
}) {
    return {
        component:
            VALIDATION_LEVEL_SUMMARY_COMPONENT.id,
        layers
    };
}