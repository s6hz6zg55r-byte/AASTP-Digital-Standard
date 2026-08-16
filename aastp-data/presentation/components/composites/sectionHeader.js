/**
 * =============================================================================
 * Section Header Component
 * =============================================================================
 *
 * Purpose
 * -------
 * Creates a reusable section heading for engineering documents.
 *
 * Responsibilities
 * ----------------
 * • Defines the semantic structure of a document section.
 * • Supports renderer navigation.
 * • Supports future PDF bookmarks.
 * • Supports Markdown anchors.
 *
 * Inputs
 * ------
 * title
 * level
 * anchor
 *
 * Outputs
 * -------
 * Section Header component.
 *
 * Dependencies
 * ------------
 * Document Presentation Standard.
 *
 * Future Extension Points
 * -----------------------
 * • Icons
 * • Numbered headings
 * • Cross references
 * • Collapsible sections
 *
 * =============================================================================
 */

export const SECTION_HEADER_COMPONENT = Object.freeze({

    id:
        "COMP001",

    name:
        "Section Header",

    description:
        "Reusable engineering document section heading."

});

export function buildSectionHeader(
    {
        title,
        level = 1,
        anchor = null,
        bookmark = true,
        pageBreakBefore = false
    }
) {

    return {
        component:
            SECTION_HEADER_COMPONENT.id,
        title,
        level,
        anchor,
        bookmark,
        pageBreakBefore
    };
}