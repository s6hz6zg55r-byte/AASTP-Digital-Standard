/**
 * =============================================================================
 * Render Key Value Collection
 * =============================================================================
 *
 * Purpose
 * -------
 * Renders an object as a collection of formatted key/value pairs.
 *
 * =============================================================================
 */

import { renderText } from "./renderText.js";

import { formatLabel } from "../utils/formatLabel.js";


export function renderKeyValueCollection(
    pdf,
    collection
) {

    if (!collection) {

        return;

    }

    for (const [label, value] of Object.entries(collection)) {

        renderText(

            pdf,

            `${formatLabel(label)}: ${value}`

        );

    }

}