import { renderText } from "./renderText.js";

import { renderValidator } from "./renderValidator.js";

export function renderValidationLayer(
    pdf,
    layer
) {
    renderText(
        pdf,
        `Level ${layer.layer} — ${layer.name}`,
        "heading1"
    );
    pdf.moveDown(0.5);
    renderText(
        pdf,
        "Summary",
        "heading2"
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
    renderText(
        pdf,
        "Validators",
        "heading2"
    );
    pdf.moveDown(0.5);

    for (const validator of layer.validators) {
        renderValidator(
            pdf,
            validator
        );
    }
}