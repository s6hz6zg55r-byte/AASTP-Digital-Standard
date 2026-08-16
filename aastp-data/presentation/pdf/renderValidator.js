/**
 * =============================================================================
 * Render Validator
 * =============================================================================
 *
 * Purpose
 * -------
 * Renders a single validator result within a validation layer.
 *
 * Responsibilities
 * ----------------
 * • Renders validator identity.
 * • Renders validator summary statistics.
 * • Renders validator warnings.
 * • Renders validator errors.
 *
 * Inputs
 * ------
 * pdf
 * validator
 *
 * Outputs
 * -------
 * Validator section rendered to the PDF document.
 *
 * Dependencies
 * ------------
 * renderText
 *
 * Future Extension Points
 * -----------------------
 * • Status icons
 * • Coloured status labels
 * • Statistics tables
 * • Collapsible sections
 *
 * =============================================================================
 */
/**
 * =============================================================================
 * Render Validator
 * =============================================================================
 */

import { renderText } from "./renderText.js";
import { renderWarningList } from "./renderWarningList.js";
import { renderErrorList } from "./renderErrorList.js";
import { renderKeyValueCollection } from "./renderKeyValueCollection.js";

export function renderValidator(
    pdf,
    validator
) {

    // -------------------------------------------------------------------------
    // Validator Heading
    // -------------------------------------------------------------------------

    renderText(
        pdf,
        validator.name,
        "heading3"
    );

    renderText(
        pdf,
        `Status: ${validator.status}`
    );

    pdf.moveDown(0.25);

    // -------------------------------------------------------------------------
    // Statistics
    // -------------------------------------------------------------------------

    if (
        validator.statistics &&
        Object.keys(validator.statistics).length > 0
    ) {

        renderText(
            pdf,
            "Statistics",
            "body"
        );

        renderKeyValueCollection(
            pdf,
            validator.statistics
        );

        pdf.moveDown(0.25);

    }

    // -------------------------------------------------------------------------
    // Warnings
    // -------------------------------------------------------------------------

    if (validator.warnings.length > 0) {

        //console.log(validator.warnings[0]);

        renderText(
            pdf,
            "Warnings",
            "heading3"
        );

        renderWarningList(
            pdf,
            validator
        );

        pdf.moveDown(0.25);

    }

    // -------------------------------------------------------------------------
    // Errors
    // -------------------------------------------------------------------------

    if (validator.errors.length > 0) {

        renderText(
            pdf,
            "Errors",
            "heading3"
        );

        renderErrorList(
            pdf,
            validator
        );

        pdf.moveDown(0.25);

    }

    pdf.moveDown();

}