/**
 * =============================================================================
 * Format Error
 * =============================================================================
 */

export function formatError(error) {

    return [

        "Error",

        `Code: ${error.code}`,

        `Location: ${error.location}`,

        `Message: ${error.message}`

    ];

}