/**
 * =============================================================================
 * Render PDF Validation Report
 * =============================================================================
 *
 * Purpose
 * -------
 * Renders a Validation Report as a PDF document.
 *
 * Responsibilities
 * ----------------
 * • Creates a PDF document.
 * • Applies the Document Presentation Standard.
 * • Renders presentation components.
 * • Writes the document to disk.
 *
 * Inputs
 * ------
 * report
 * outputPath
 *
 * Outputs
 * -------
 * PDF Validation Report.
 *
 * Dependencies
 * ------------
 * pdfkit
 * Document Presentation Standard
 *
 * Future Extension Points
 * -----------------------
 * • PDF bookmarks
 * • Hyperlinks
 * • Headers
 * • Footers
 * • Table of Contents
 *
 * =============================================================================
 */

import fs from "node:fs";

import PDFDocument from "pdfkit";

import { DOCUMENT_PRESENTATION_STANDARD } from "../../presentation/documentPresentationStandard.js";

import { renderText } from "../../presentation/pdf/renderText.js";

import { renderReportSummary } from "../../presentation/pdf/renderReportSummary.js";

import { renderValidationLevelSummary } from "../../presentation/pdf/renderValidationLevelSummary.js";

import { renderValidationLayer } from "../../presentation/pdf/renderValidationLayer.js";

import { renderReportMetadata } from "../../presentation/pdf/renderReportMetadata.js";

export function renderPdfValidationReport(
    report,
    outputPath
) {
   
    const pdf =
        new PDFDocument({

            size:
                DOCUMENT_PRESENTATION_STANDARD.page.size,

            margins:
                DOCUMENT_PRESENTATION_STANDARD.page.margins

        });

    pdf.pipe(
        fs.createWriteStream(outputPath)
    );

    pdf.info.Title =
        DOCUMENT_PRESENTATION_STANDARD.document.title;

    pdf.info.Author =
        DOCUMENT_PRESENTATION_STANDARD.document.author;

    pdf.info.Creator =
        DOCUMENT_PRESENTATION_STANDARD.document.creator;

    pdf.info.Producer =
        DOCUMENT_PRESENTATION_STANDARD.document.producer;

    pdf.info.Subject =
        DOCUMENT_PRESENTATION_STANDARD.document.subject;

    renderText(
        pdf,
        DOCUMENT_PRESENTATION_STANDARD.document.title,
        "title"
    );

    renderReportMetadata(
        pdf,
        report.metadata
    );

    pdf.moveDown(1);

    renderReportSummary(
        pdf,
        report.components.reportSummary
    );
   
    pdf.moveDown();

    renderValidationLevelSummary(
        pdf,
        report.components.validationLevelSummary
    );

    for (const layer of report.layers) {
        pdf.addPage();
        renderValidationLayer(
            pdf,
            layer
        );
    }

    pdf.end();

}