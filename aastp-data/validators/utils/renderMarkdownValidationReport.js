/**
 * =============================================================================
 * renderMarkdownValidationReport
 * =============================================================================
 *
 * Purpose
 * -------
 * Generates a Markdown Validation Assurance Report from a ValidationReport
 * object.
 *
 * The report includes:
 * - Overall report summary
 * - Validation Level Summary
 * - Detailed validator results
 * - Internal navigation using stable anchors
 *
 * =============================================================================
 */

import fs from "node:fs";

import { renderReportMetadataMarkdown } from "../../presentation/markdown/renderReportMetadataMarkdown.js";

export function renderMarkdownValidationReport(
    report,
    outputPath
) {

    let markdown = "";

    const reportSummary = report.components.reportSummary;
    const validationLevelSummary = report.components.validationLevelSummary;


    /*
    ============================================================================
    Report Heading
    ============================================================================
    */

    markdown += "<a id=\"top\"></a>\n\n";

    markdown += "# AASTP Validation Report\n\n";

    markdown += renderReportMetadataMarkdown(report.metadata);

    markdown += "## Report Summary\n\n";

    markdown += `**Status:** ${reportSummary.status}\n\n`;
    markdown += `**Validators:** ${reportSummary.validators}\n\n`;
    markdown += `**Passed:** ${reportSummary.passed}\n\n`;
    markdown += `**Failed:** ${reportSummary.failed}\n\n`;
    markdown += `**Errors:** ${reportSummary.errors}\n\n`;
    markdown += `**Warnings:** ${reportSummary.warnings}\n\n`;

    markdown += "---\n\n";


    /*
    ============================================================================
    Validation Level Summary
    ============================================================================
    */

    markdown += "## Validation Level Summary\n\n";

    markdown += "| Level | Description | Status | Validators | Passed | Failed | Errors | Warnings |\n";
    markdown += "|------:|-------------|:------:|-----------:|-------:|-------:|-------:|---------:|\n";

    for (const layer of validationLevelSummary.layers) {

        markdown +=
            `| ${layer.layer}` +
            ` | [${layer.name}](#${layer.anchor})` +
            ` | ${layer.summary.status}` +
            ` | ${layer.summary.validators}` +
            ` | ${layer.summary.passed}` +
            ` | ${layer.summary.failed}` +
            ` | ${layer.summary.errors}` +
            ` | ${layer.summary.warnings} |\n`;

    }

    markdown += "\n---\n\n";


    /*
    ============================================================================
    Detailed Validation Results
    ============================================================================
    */

    for (const layer of validationLevelSummary.layers) {

        markdown += `<a id="${layer.anchor}"></a>\n\n`;

        markdown += "[Return to Report Summary](#top)\n\n";

        markdown += `# Level ${layer.layer}: ${layer.name}\n\n`;


        /*
        ------------------------------------------------------------------------
        Level Summary
        ------------------------------------------------------------------------
        */

        markdown += "| Metric | Value |\n";
        markdown += "|--------|------:|\n";
        markdown += `| Status | ${layer.summary.status} |\n`;
        markdown += `| Validators | ${layer.summary.validators} |\n`;
        markdown += `| Passed | ${layer.summary.passed} |\n`;
        markdown += `| Failed | ${layer.summary.failed} |\n`;
        markdown += `| Errors | ${layer.summary.errors} |\n`;
        markdown += `| Warnings | ${layer.summary.warnings} |\n\n`;


        /*
        ------------------------------------------------------------------------
        Validator Results
        ------------------------------------------------------------------------
        */

        for (const validator of layer.validators) {

            markdown += `## ${validator.name}\n\n`;

            markdown += `**Status:** ${validator.status}\n\n`;


            /*
            --------------------------------------------------------------------
            Statistics
            --------------------------------------------------------------------
            */

            if (Object.keys(validator.statistics).length > 0) {

                markdown += "### Statistics\n\n";

                markdown += "| Statistic | Value |\n";
                markdown += "|-----------|------:|\n";

                for (const [key, value] of Object.entries(validator.statistics)) {

                    markdown += `| ${key} | ${value} |\n`;

                }

                markdown += "\n";

            }


            /*
            --------------------------------------------------------------------
            Errors
            --------------------------------------------------------------------
            */

            if (validator.errors.length > 0) {

                markdown += "### Errors\n\n";

                for (const error of validator.errors) {

                    markdown += `- **${error.code}**\n`;
                    markdown += `  - Location: ${error.location}\n`;
                    markdown += `  - ${error.message}\n`;

                }

                markdown += "\n";

            }


            /*
            --------------------------------------------------------------------
            Warnings
            --------------------------------------------------------------------
            */

            if (validator.warnings.length > 0) {

                markdown += "### Warnings\n\n";

                for (const warning of validator.warnings) {

                    markdown += `- **${warning.code}**\n`;
                    markdown += `  - Location: ${warning.location}\n`;
                    markdown += `  - ${warning.message}\n`;

                }

                markdown += "\n";

            }

        }

        markdown += "---\n\n";

    }


    fs.writeFileSync(
        outputPath,
        markdown,
        "utf8"
    );

}