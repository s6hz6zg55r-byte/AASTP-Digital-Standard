import { formatError } from "../utils/formatError.js";

import { renderText } from "./renderText.js";

export function renderErrorList(
    pdf,
    validator
) {
    for (const error of validator.errors) {
        const lines = formatError(error);
        for (const line of lines) {
            renderText(
                pdf,
                line
            );
        }
        pdf.moveDown(0.25);
    }
}