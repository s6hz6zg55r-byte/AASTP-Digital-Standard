/**
 * =============================================================================
 * Render Report Metadata
 * =============================================================================
 *
 * Purpose
 * -------
 * Renders report metadata into a PDF document.
 *
 * Inputs
 * ------
 * pdf
 * metadata
 *
 * Dependencies
 * ------------
 * renderText
 * formatDate
 *
 * =============================================================================
 */

import { renderText } from "./renderText.js";

import { formatDate } from "../utils/formatDate.js";


export function renderReportMetadata(
    pdf,
    metadata
) {

    if (!metadata) {

        return;

    }


    renderText(
        pdf,
        `Generated: ${formatDate(metadata.generatedAt)}`
    );


    renderText(
        pdf,
        `Validation Version: ${metadata.validatorVersion}`
    );


    renderText(
        pdf,
        `Dataset Version: ${metadata.datasetVersion}`
    );

}