import { renderText } from "./renderText.js";


export function renderReportSummary(
    pdf,
    reportSummary
) {

    renderText(
        pdf,
        "Report Summary",
        "heading2"
    );

    renderText(
        pdf,
        `Overall Status: ${reportSummary.status}`
    );

    renderText(
        pdf,
        `Validators: ${reportSummary.validators}`
    );

    renderText(
        pdf,
        `Passed: ${reportSummary.passed}`
    );

    renderText(
        pdf,
        `Failed: ${reportSummary.failed}`
    );

    renderText(
        pdf,
        `Errors: ${reportSummary.errors}`
    );

    renderText(
        pdf,
        `Warnings: ${reportSummary.warnings}`
    );
}