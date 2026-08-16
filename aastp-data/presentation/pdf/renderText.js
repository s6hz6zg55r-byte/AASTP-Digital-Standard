import {
    DOCUMENT_PRESENTATION_STANDARD
} from "../documentPresentationStandard.js";


export function renderText(
    pdf,
    text,
    style = "body",
    options = {}
) {
    const typography =
        DOCUMENT_PRESENTATION_STANDARD.typography.styles[style];
    const fontName =
        DOCUMENT_PRESENTATION_STANDARD.typography.fonts[typography.font];
    pdf
        .font(fontName)
        .fontSize(typography.size)
        .text(
            text,
            options
        );
}