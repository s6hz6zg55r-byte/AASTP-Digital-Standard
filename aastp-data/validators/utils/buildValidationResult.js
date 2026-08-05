/**
 * -----------------------------------------------------------------------------
 * Utility: buildValidationResult.js
 * -----------------------------------------------------------------------------
 *
 * Purpose
 * --------
 * Creates a standardised ValidationResult object for use throughout the
 * AASTP Validation Framework.
 *
 * Every validator, regardless of validation layer or dataset, shall return
 * a ValidationResult created by this utility.
 *
 * ValidationResults provide the standard interface between:
 *
 *   • Individual validators
 *   • Validation reports
 *   • Automated tooling
 *   • Continuous Integration (CI)
 *   • Future repository governance services
 *
 * Inputs
 * ------
 * validator
 *      Metadata describing the validator.
 *
 * errors
 *      Array of validation errors.
 *
 * warnings
 *      Array of validation warnings.
 *
 * statistics
 *      Validator-specific statistics describing the validation performed.
 *
 * Output
 * ------
 * Returns a standard ValidationResult object.
 *
 * ValidationResult Structure
 * --------------------------
 *
 * {
 *     validator,
 *     passed,
 *     statistics,
 *     errors,
 *     warnings
 * }
 *
 * Notes
 * -----
 * • Validators should not construct ValidationResult objects directly.
 * • All ValidationResults should be created using this utility.
 * • Validation passes only when the errors collection is empty.
 *
 * Dependencies
 * ------------
 * None.
 *
 * Failure Modes
 * -------------
 * None.
 *
 * Future Extension Points
 * -----------------------
 * Future versions may incorporate:
 *
 * • execution time
 * • repository version
 * • validator version
 * • timestamps
 * • execution environment
 * • additional validation metadata
 *
 * without requiring changes to individual validators.
 * -----------------------------------------------------------------------------
 */

export function buildValidationResult(
    validator,
    errors,
    warnings,
    statistics
) {
    return {
        validator,
        passed:
            errors.length === 0,
        statistics,
        errors,
        warnings
    };
}

/*
===============================================================================
Usage Examples
===============================================================================

Example 1 - Successful Validation
---------------------------------

const result = buildValidationResult(
    validator,
    [],
    [],
    {
        recordsChecked: 58
    }
);


Result
{
    validator,
    passed: true,
    statistics: {
        recordsChecked: 58
    },
    errors: [],
    warnings: []
}


Example 2 - Validation Failed
-----------------------------

const result = buildValidationResult(
    validator,
    errors,
    warnings,
    {
        recordsChecked: 58
    }
);


Result
{
    validator,
    passed: false,
    statistics: {
        recordsChecked: 58
    },
    errors: [
        ...
    ],
    warnings: [
        ...
    ]
}


Example 3 - Typical Validator Return
------------------------------------

return buildValidationResult(
    validator,
    errors,
    warnings,
    {
        recordsChecked: repository.distanceRules.length
    }
);
===============================================================================
*/