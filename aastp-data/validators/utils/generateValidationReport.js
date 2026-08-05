/**
 * -----------------------------------------------------------------------------
 * Utility: generateValidationReport.js
 * -----------------------------------------------------------------------------
 *
 * Purpose
 * --------
 * Generates a console-based validation report from one or more
 * ValidationResult objects.
 *
 * This utility provides a standard presentation of validation outcomes
 * for repository maintainers, developers and automated workflows.
 *
 * Inputs
 * ------
 * results
 *      Array of ValidationResult objects.
 *
 * Output
 * ------
 * Console report.
 *
 * Notes
 * -----
 * This utility performs no validation.
 * It assumes all ValidationResult objects conform to the
 * Validation Framework governance document.
 *
 * Dependencies
 * ------------
 * ValidationResult
 *
 * Failure Modes
 * -------------
 * None.
 *
 * Future Extension Points
 * -----------------------
 * Future versions may support:
 *
 * • Markdown reports
 * • HTML reports
 * • PDF reports
 * • JSON reports
 * • GitHub Actions summaries
 * • Repository release reports
 * • Validation history
 *
 * -----------------------------------------------------------------------------
 */

export function generateValidationReport(results) {
    const grouped = new Map();
    for (const result of results) {
        const layer = result.validator.layer;
        if (!grouped.has(layer)) {
            grouped.set(layer, []);
        }
        grouped.get(layer).push(result);
    }

    const layers =
        [...grouped.keys()].sort(
            (a, b) => a - b
        );

    let validatorCount = 0;
    let passedCount = 0;
    let failedCount = 0;
    let warningCount = 0;
    let errorCount = 0;

    console.log("");
    console.log("========================================");
    console.log("AASTP Validation Report");
    console.log("========================================");

    for (const layer of layers) {
        const validators =
            grouped
                .get(layer)
                .sort(
                    (a, b) =>
                        a.validator.id.localeCompare(
                            b.validator.id
                        )
                );

        console.log("");
        console.log(`Layer ${layer}`);
        console.log("----------------------------------------");
        console.log("");

        for (const result of validators) {

            validatorCount++;

            if (result.passed) {
                passedCount++;
                console.log(`✓ ${result.validator.id}`);
            }
            else {
                failedCount++;
                console.log(`✗ ${result.validator.id}`);
            }

            console.log(`  ${result.validator.name}`);

            if (result.errors.length > 0) {

                console.log("");
                console.log("  Errors");

                for (const error of result.errors) {

                    errorCount++;

                    console.log(
                        `    ${error.code}`
                    );

                    console.log(
                        `      ${error.location}`
                    );

                    console.log(
                        `      ${error.message}`
                    );
                }
            }

            if (result.warnings.length > 0) {
                console.log("");
                console.log("  Warnings");
                for (const warning of result.warnings) {
                    warningCount++;
                    console.log(`    ${warning.code}`);
                    console.log(`      ${warning.location}`);
                    console.log(`      ${warning.message}`);
                }
            }
        }
    }

    console.log("");
    console.log("========================================");
    console.log(`Validators : ${validatorCount}`);
    console.log(`Passed     : ${passedCount}`);
    console.log(`Failed     : ${failedCount}`);
    console.log(`Errors     : ${errorCount}`);
    console.log(`Warnings   : ${warningCount}`);
    console.log("========================================");

}

function renderConsoleValiationReport(results) {}

function renderMarkdownValiationReport(results) {}

function renderHtmlValiationReport(results) {}

function renderPdfValiationReport(results) {}

function renderJsonValiationReport(results) {}

/*
===============================================================================
Usage Examples
===============================================================================

Example 1 - Generate Validation Report

generateValidationReport(results);


Example 2 - Typical Repository Validation

const results = [

    validateDistanceRulesSchema(),

    validateDistanceRulesRepository(),

    validateDistanceRulesEngineering()

];

generateValidationReport(results);


Example 3 - Repository Release Validation

const validationResults = [

    ...

];

generateValidationReport(validationResults);

===============================================================================
*/