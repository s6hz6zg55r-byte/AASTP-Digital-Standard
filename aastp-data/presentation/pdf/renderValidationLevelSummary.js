import { renderText } from "./renderText.js";
import { renderTable } from "./renderTable.js";


export function renderValidationLevelSummary(
    pdf,
    validationLevelSummary
) {
    renderText(
        pdf,
        "Validation Level Summary",
        "heading2"
    );

    const table = {
        headers: [
            "Level",
            "Status",
            "Validators",
            "Passed",
            "Failed",
            "Errors",
            "Warnings"
        ],
        rows: validationLevelSummary.layers.map(layer => [
            `Level ${layer.layer} — ${layer.name}`,
            layer.summary.status,
            layer.summary.validators,
            layer.summary.passed,
            layer.summary.failed,
            layer.summary.errors,
            layer.summary.warnings
        ])
    };

    renderTable(
        pdf,
        table
    );
    
    /*
    pdf.moveDown(0.5);
    for (const layer of validationLevelSummary.layers) {
        renderText(
            pdf,
            `Level ${layer.layer} — ${layer.name}`
        );
        renderText(
            pdf,
            `Status: ${layer.summary.status}`
        );
        renderText(
            pdf,
            `Validators: ${layer.summary.validators}`
        );
        renderText(
            pdf,
            `Passed: ${layer.summary.passed}`
        );
        renderText(
            pdf,
            `Failed: ${layer.summary.failed}`
        );
        renderText(
            pdf,
            `Errors: ${layer.summary.errors}`
        );
        renderText(
            pdf,
            `Warnings: ${layer.summary.warnings}`
        );
        pdf.moveDown();
    }
    */
}