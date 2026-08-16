/**
 * =============================================================================
 * Render Table
 * =============================================================================
 *
 * Purpose
 * -------
 * Renders a structured table into a PDF document.
 *
 * Inputs
 * ------
 * pdf
 * table
 *
 * Table format
 * ------------
 *
 * {
 *     headers: [],
 *     rows: []
 * }
 *
 * =============================================================================
 */

import { DOCUMENT_PRESENTATION_STANDARD } from "../documentPresentationStandard.js";

import { renderText } from "./renderText.js";


export function renderTable(
    pdf,
    table
) {

    const settings =
        DOCUMENT_PRESENTATION_STANDARD.tables;


    const startX =
        pdf.x;


    let currentY =
        pdf.y;


    const columnWidths =
        calculateColumnWidths(table, pdf);


    renderTableHeader(
        pdf,
        table.headers,
        columnWidths,
        startX,
        currentY,
        settings
    );


    currentY += settings.rowHeight;


    for (const row of table.rows) {

        renderTableRow(
            pdf,
            row,
            columnWidths,
            startX,
            currentY,
            settings
        );

        currentY += settings.rowHeight;

    }


    pdf.y =
        currentY;

}

function calculateColumnWidths(table, pdf) {

    const minimumWidth = 50;

    const availableWidth = 
        pdf.page.width - 
        DOCUMENT_PRESENTATION_STANDARD.page.margins.left - 
        DOCUMENT_PRESENTATION_STANDARD.page.margins.right;

    const columnCount =
        table.headers.length;


    const widths =
        Array(columnCount).fill(minimumWidth);


    for (let index = 0; index < columnCount; index++) {

        const values = [

            table.headers[index],

            ...table.rows.map(
                row => row[index]
            )

        ];


        const longest =
            Math.max(
                ...values.map(
                    value =>
                        String(value).length
                )
            );


        widths[index] =
            Math.max(
                minimumWidth,
                longest * 6
            );

    }


    const total =
        widths.reduce(
            (sum, width) =>
                sum + width,
            0
        );


    return widths.map(
        width =>
            width / total * availableWidth
    );

}

function renderTableHeader(
    pdf,
    headers,
    widths,
    x,
    y,
    settings
) {
    let currentX =
        x;
    headers.forEach(
        (header, index) => {
            drawCell(
                pdf,
                header,
                currentX,
                y,
                widths[index],
                settings,
                true
            );
            currentX += widths[index];
        }
    );
}

function renderTableRow(
    pdf,
    row,
    widths,
    x,
    y,
    settings
) {
    let currentX =
        x;
    row.forEach(
        (cell, index) => {
            drawCell(
                pdf,
                cell,
                currentX,
                y,
                widths[index],
                settings,
                false
            );
            currentX += widths[index];
        }
    );
}

function drawCell(
    pdf,
    text,
    x,
    y,
    width,
    settings,
    header
) {
    const height = settings.rowHeight ?? 24;

    const typography = header
        ? settings.typography.header
        : settings.typography.body;
    
    const alignment = header ? "left" : determineAlignment(text);
    
    pdf
        .rect(
            x,
            y,
            width,
            height
        )
        .stroke();
    pdf.fontSize(
        typography.fontSize ?? 8
    );

    if (typography.bold) {
        pdf.font(DOCUMENT_PRESENTATION_STANDARD.typography.fonts.primary,
            "bold"
        );
    } else {
        pdf.font(DOCUMENT_PRESENTATION_STANDARD.typography.fonts.primary);
    }

    pdf.text(
        String(text),
        x + settings.padding.horizontal,
        y + settings.padding.vertical,
        {
            width:
                width - (settings.padding.horizontal * 2),
            align:
                alignment
        }
    );
}

function determineAlignment(value) {
    if (
        typeof value === "number"
    ) {
        return "right";
    }
    if (
        value === "PASS" ||
        value === "FAIL" ||
        value === "WARNING"
    ) {
        return "center";
    }
    return "left";
}