/**
 * =============================================================================
 * Build Validation Report Components
 * =============================================================================
 *
 * Purpose
 * -------
 * Builds the reusable document components required to render a Validation
 * Report.
 *
 * Responsibilities
 * ----------------
 * • Builds presentation components from the Validation Report.
 * • Keeps presentation logic separate from report generation.
 * • Produces a renderer-independent component model.
 *
 * Inputs
 * ------
 * report
 *      ValidationReport object.
 *
 * Outputs
 * -------
 * ValidationReport with presentation components.
 *
 * Dependencies
 * ------------
 * Report Summary Component.
 * Validation Level Summary Component.
 *
 * Future Extension Points
 * -----------------------
 * • Cover Page
 * • Table of Contents
 * • Appendix
 * • Revision History
 *
 * =============================================================================
 */

import {
    buildReportSummary
} from "../../presentation/components/composites/reportSummary.js";

import {
    buildValidationLevelSummary
} from "../../presentation/components/composites/validationLevelSummary.js";


export function buildValidationReportComponents(report) {

    report.components = {

        reportSummary:

            buildReportSummary({

                status:
                    report.summary.status,

                validators:
                    report.summary.totals.validators,

                passed:
                    report.summary.totals.passed,

                failed:
                    report.summary.totals.failed,

                errors:
                    report.summary.totals.errors,

                warnings:
                    report.summary.totals.warnings

            }),

        validationLevelSummary:

            buildValidationLevelSummary({

                layers:
                    report.layers

            })

    };


    return report;

}