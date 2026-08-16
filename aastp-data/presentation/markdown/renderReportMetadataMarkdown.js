/**
 * =============================================================================
 * Render Report Metadata Markdown
 * =============================================================================
 *
 * Purpose
 * -------
 * Renders report metadata information into Markdown format.
 *
 * Inputs
 * ------
 * metadata
 *
 * Outputs
 * -------
 * Markdown string
 *
 * =============================================================================
 */


import { formatDate } from "../utils/formatDate.js";


export function renderReportMetadataMarkdown(metadata) {

    if (!metadata) {

        return "";

    }


    return `

Generated: ${formatDate(metadata.generatedAt)}

Validation Version: ${metadata.validatorVersion}

Dataset Version: ${metadata.datasetVersion}

---

`;

}