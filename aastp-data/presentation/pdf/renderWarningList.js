import { formatWarning } from "../utils/formatWarning.js";

import { renderText } from "./renderText.js";

export function renderWarningList(
    pdf,
    validator
) {
    for (const warning of validator.warnings) {
        const lines = formatWarning(warning);
        for (const line of lines) {
            renderText(
                pdf,
                line
            );
        }
        pdf.moveDown(0.25);
    }
}