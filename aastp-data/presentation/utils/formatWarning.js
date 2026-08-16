/**
 * =============================================================================
 * Format Warning
 * =============================================================================
 */

export function formatWarning(warning) {

    return [

        "Warning",

        `Code: ${warning.code}`,

        `Location: ${warning.location}`,

        `Message: ${warning.message}`

    ];

}