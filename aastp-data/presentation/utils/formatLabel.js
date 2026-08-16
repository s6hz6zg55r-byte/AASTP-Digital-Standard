/**
 * =============================================================================
 * Format Label
 * =============================================================================
 *
 * Purpose
 * -------
 * Converts camelCase property names into human-readable labels while preserving
 * recognised engineering acronyms.
 *
 * Example
 * -------
 * constraintsChecked
 *     → Constraints Checked
 *
 * uniqueIdsChecked
 *     → Unique IDs Checked
 *
 * ecmProtectionRatingsChecked
 *     → ECM Protection Ratings Checked
 *
 * =============================================================================
 */

import { PRESENTATION_ACRONYMS } from "../constants/presentationConstants.js";

const ACRONYMS = PRESENTATION_ACRONYMS;

export function formatLabel(label) {

    return label

        // Split camelCase into individual words.
        .replace(/([A-Z])/g, " $1")

        // Capitalise the first character.
        .replace(/^./, character => character.toUpperCase())

        // Replace recognised engineering acronyms.
        .split(" ")
        .map(word => PRESENTATION_ACRONYMS[word] ?? word)
        .join(" ");

}