/**
 * =============================================================================
 * Report Summary Component
 * =============================================================================
 *
 * Purpose
 * -------
 * Creates a reusable report summary for engineering documents.
 *
 * Responsibilities
 * ----------------
 * • Defines the semantic structure of a document section.
 * • Supports renderer navigation.
 * • Supports future PDF bookmarks.
 * • Supports Markdown anchors.
 *
 * Inputs
 * ------
 * status
 * validators
 * passed
 * failed
 * errors
 * warnings
 *
 * Outputs
 * -------
 * Report Summary component.
 *
 * Dependencies
 * ------------
 * Document Presentation Standard.
 *
 * Future Extension Points
 * -----------------------
 * • 
 *
 * =============================================================================
 */

export const REPORT_SUMMARY_COMPONENT = Object.freeze({

    id: 
        "COMP002",

    name: 
        "Report Summary",

    description:
        "Reusable engineering report summary."

});

export function buildReportSummary({

    status,
    validators,
    passed,
    failed,
    errors,
    warnings

}) {

    return {
        component: REPORT_SUMMARY_COMPONENT.id,
        status,
        validators,
        passed,
        failed,
        errors,
        warnings
    };
}
