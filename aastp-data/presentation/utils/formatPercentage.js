/**
 * =============================================================================
 * Format Percentage
 * =============================================================================
 *
 * Purpose
 * -------
 * Converts decimal values into human-readable percentages.
 *
 * Examples
 * --------
 * 0.95
 *     -> 95%
 *
 * 0.875
 *     -> 87.5%
 *
 * =============================================================================
 */

export function formatPercentage(
    value,
    decimalPlaces = 0
) {
    if (
        value === null ||
        value === undefined ||
        Number.isNaN(value)
    ) {
        return "";
    }
    return `${(value * 100).toFixed(decimalPlaces)}%`;
}