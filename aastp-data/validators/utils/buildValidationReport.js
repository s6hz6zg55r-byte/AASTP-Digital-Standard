/**
 * -----------------------------------------------------------------------------
 * Function: buildValidationReport
 * -----------------------------------------------------------------------------
 *
 * Purpose
 * -------
 * Builds a governed ValidationReport object from ValidationResult objects.
 *
 * Inputs
 * ------
 * results
 *      Array of ValidationResult objects.
 *
 * Output
 * ------
 * ValidationReport object.
 *
 * Dependencies
 * ------------
 * ValidationResult structure.
 *
 * Failure Modes
 * -------------
 * None.
 *
 * Future Extension Points
 * -----------------------
 * - Dataset version metadata
 * - Validator framework version
 * - Execution environment
 * - Validation history
 *
 * -----------------------------------------------------------------------------
 */

import { 
    VALIDATION_RESULT_STATUS,
    VALIDATION_LAYER_NAMES
} from "../../constants/validationConstants.js";

export function buildValidationReport(
    results
) {
    const layerMap = new Map();
    for (const result of results) {
        const validator =
            buildValidatorEntry(result);
        const layer =
            validator.layer;
        if (
            !layerMap.has(layer)
        ) {
            layerMap.set(
                layer,
                []
            );
        }
        layerMap
            .get(layer)
            .push(validator);
    }
    const layers = [];
    for (
        const [layer, validators]
        of layerMap
    ) {
        layers.push(
            buildLayerReport(
                layer,
                validators
            )
        );
    }
    layers.sort(
        (a, b) =>
            a.layer - b.layer
    );
    const totals =
        buildLayerSummary(
            layers.flatMap(
                layer =>
                    layer.validators
            )
        );
    return {
        reportVersion: "1.0",
        metadata: {
            generatedAt:
                new Date().toISOString(),
            validatorVersion:
                "1.0",
            datasetVersion:
                "unknown"
        },
        summary: {
            status:
                totals.status,
            totals,
            layers:
                Object.fromEntries(
                    layers.map(
                        layer => [
                            layer.layer,
                            layer.summary
                        ]
                    )
                )
        },
        layers
    };
}

function buildValidatorEntry(result) {
    return {
        id: result.validator.id,
        name: result.validator.name,
        layer: result.validator.layer,
        status:
            result.passed
                ? VALIDATION_RESULT_STATUS.PASS
                : VALIDATION_RESULT_STATUS.FAIL,
        statistics:
            result.statistics ?? {},
        errors:
            result.errors,
        warnings:
            result.warnings
    };
}

function buildLayerSummary(validators) {
    let passed = 0;
    let failed = 0;
    let errors = 0;
    let warnings = 0;
    for (const validator of validators) {
        if (
            validator.status === VALIDATION_RESULT_STATUS.PASS
        ) {
            passed++;
        }
        else {
            failed++;
        }
        errors += validator.errors.length;
        warnings += validator.warnings.length;
    }
    return {
        status:
            failed === 0
                ? VALIDATION_RESULT_STATUS.PASS
                : VALIDATION_RESULT_STATUS.FAIL,
        validators:
            validators.length,
        passed,
        failed,
        errors,
        warnings
    };
}


function buildLayerReport(
    layer,
    validators
) {
    return {
        layer,
        anchor: `level${layer}`,
        name:
            VALIDATION_LAYER_NAMES[layer],
        summary:
            buildLayerSummary(validators),
        validators
    };
}