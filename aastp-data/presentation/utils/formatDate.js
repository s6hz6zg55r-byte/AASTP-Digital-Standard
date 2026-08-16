/**
 * =============================================================================
 * Format Date
 * =============================================================================
 */

export function formatDate(dateString) {

    const date = new Date(dateString);

    return date.toLocaleString(
        "en-GB",
        {
            dateStyle: "long",
            timeStyle: "medium",
            timeZone: "UTC"
        }
    );

}