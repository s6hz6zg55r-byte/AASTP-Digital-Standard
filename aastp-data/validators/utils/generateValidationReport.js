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

import fs from "node:fs";

import { renderMarkdownValidationReport } 
    from "./renderMarkdownValidationReport.js";

import { renderPdfValidationReport } 
    from "./renderPdfValidationReport.js";

import { buildValidationReport } 
    from "./buildValidationReport.js";

import { buildValidationReportComponents } 
    from "./buildValidationReportComponents.js";

import { VALIDATION_RESULT_STATUS }
    from "../../constants/validationConstants.js";

const DEFAULT_REPORT_PATH = "./reports/validation-report.json";
const DEFAULT_MARKDOWN_REPORT_PATH = "./reports/validation-report.md";
const DEFAULT_PDF_REPORT_PATH = "./reports/validation-report.pdf";

export function generateValidationReport(
    results,
    options = {}
) {
    const report = buildValidationReport(results)
    
    const presentation = buildValidationReportComponents(report);

    renderConsoleValidationReport(report);

    renderJsonValidationReport(
        report,
        options.jsonPath ?? DEFAULT_REPORT_PATH
    );

    renderMarkdownValidationReport(
        report,
        options.markdownPath ?? DEFAULT_MARKDOWN_REPORT_PATH
    );

    renderPdfValidationReport(
        report,
        DEFAULT_PDF_REPORT_PATH
    );

    return report;
}


function renderConsoleValidationReport(report) {

    console.log("");

    console.log("========================================");
    console.log("AASTP Validation Report");
    console.log("========================================");


    for (const layer of report.layers) {


        console.log("");

        console.log("----------------------------------------");

        console.log(
            `Layer ${layer.layer}: ${layer.name}`
        );

        console.log("----------------------------------------");


        console.log(
            `Status    : ${layer.summary.status}`
        );

        console.log(
            `Validators: ${layer.summary.validators}`
        );

        console.log(
            `Passed    : ${layer.summary.passed}`
        );

        console.log(
            `Failed    : ${layer.summary.failed}`
        );

        console.log(
            `Errors    : ${layer.summary.errors}`
        );

        console.log(
            `Warnings  : ${layer.summary.warnings}`
        );


        for (
            const validator of layer.validators
        ) {


            console.log("");


            if (
                validator.status === VALIDATION_RESULT_STATUS.PASS
            ) {

                console.log(
                    `✓ ${validator.id}`
                );

            }
            else {

                console.log(
                    `✗ ${validator.id}`
                );

            }


            console.log(
                `  ${validator.name}`
            );


            if (
                validator.errors.length > 0
            ) {

                console.log("");

                console.log(
                    "  Errors"
                );


                for (
                    const error of validator.errors
                ) {

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


            if (
                validator.warnings.length > 0
            ) {

                console.log("");

                console.log(
                    "  Warnings"
                );


                for (
                    const warning of validator.warnings
                ) {

                    console.log(
                        `    ${warning.code}`
                    );

                    console.log(
                        `      ${warning.location}`
                    );

                    console.log(
                        `      ${warning.message}`
                    );

                }

            }

        }

    }


    console.log("");

    console.log("========================================");

    console.log("Overall Summary");

    console.log("========================================");


    console.log(
        `Status     : ${report.summary.status}`
    );

    console.log(
        `Validators  : ${report.summary.totals.validators}`
    );

    console.log(
        `Passed      : ${report.summary.totals.passed}`
    );

    console.log(
        `Failed      : ${report.summary.totals.failed}`
    );

    console.log(
        `Errors      : ${report.summary.totals.errors}`
    );

    console.log(
        `Warnings    : ${report.summary.totals.warnings}`
    );

    console.log(
        "========================================");

}

function renderHtmlValidationReport(results) {}


/**
 * =============================================================================
 * renderJsonValidationReport
 * =============================================================================
 *
 * Purpose
 * -------
 * Writes a ValidationReport object to a JSON assurance report file.
 *
 * Inputs
 * ------
 * report
 *      ValidationReport object.
 *
 * outputPath
 *      Destination file path.
 *
 * Outputs
 * -------
 * JSON validation report file.
 *
 * Dependencies
 * ------------
 * Node.js filesystem module.
 *
 * Failure Modes
 * -------------
 * - Invalid output path.
 * - Unable to write file.
 *
 * Future Extension Points
 * -----------------------
 * - Report signing.
 * - Report metadata.
 * - Digital assurance records.
 *
 * =============================================================================
 */



export function renderJsonValidationReport(
    report,
    outputPath
) {

    const json =
        JSON.stringify(
            report,
            null,
            2
        );


    fs.writeFileSync(
        outputPath,
        json,
        "utf8"
    );

}

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