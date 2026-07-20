//const { loadJson } = require("./utils/loadJson");
const { loadRepository } = require("./utils/loadRepository");
const { buildIdSet } = require("./utils/buildIdSet");
const { validateUniqueIds } = require("./utils/validateUniqueIds");

const {
    validateId,
    validateRange,
    validateSource,
    validateTraceability
} = require("./utils");


const VALID_TRANSFORMATIONS = [
    "round_up_metre"
];
const VALID_CALCULATION_TYPES = [
    "conditional",
    "fixed"
]
// Orchestrator function
function validateDistanceRules(repository = loadRepository()) {
    const errors = [];
    const warnings = [];
    const stats = {
        rules: 0,
        branches: 0,
        errors: 0,
        warnings: 0
    };
    const {
        distanceRules,
        formulas
    } = repository;
    const validFormulas = buildIdSet(formulas.formulas, "formulas");
    const rules = distanceRules.distanceRules;
    
    if (!validateRulesExist(rules, errors)) {
        return {
            valid: false,
            errors,
            warnings,
            stats
        };
    }

    validateUniqueIds(
        rules,
        errors,
        "distance rule"
    );

    for (const rule of rules) {
        stats.rules++;

        const branchCount =
            rule.calculation?.branches?.length ?? 0;

        stats.branches += branchCount;


        validateRequiredFields(rule, errors);

        validateApplicability(rule, errors);

        validateCalculation(rule, errors);

        validateTransformations(rule, errors);

        validateBranches(validFormulas, rule, errors);
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings,
        stats
    };
}

// Validation Helper. This function confirms that the rules actually exist. Checked
function validateRulesExist(rules, errors) {
    if (!rules) {
        errors.push("Missing distanceRules object");
        return false;
    }
    return true;
}

// Validation Helper. Validate that all required fields are present in the rule. Checked
function validateRequiredFields(rule, errors) {

    const required = [
        "id",
        "name",
        "applicability",
        "traceability",
        "calculation"
    ];
    for (const field of required) {
        if (!(field in rule)) {
            errors.push(
                `${rule.id}: missing '${field}'`
            );
        }
    }

    // validateTraceability exists in the utils.js file
    validateTraceability(
        rule.traceability,
        `Rule ${rule.id}`,
        errors
    );
}

// Validation Helper. Validate that applicability data is present and good. Checked
function validateApplicability(rule, errors) {
    const app = rule.applicability;
    
    if (!app) {
        errors.push(`${rule.id}: missing applicability`);
        return;
    }

    if (app.minNEQ == null) {
        errors.push(
            `${rule.id}: missing applicability.minNEQ`
        );
    }

    if (app.maxNEQ == null) {
        errors.push(
            `${rule.id}: missing applicability.maxNEQ`
        );
    }

    if (app.maxNEQ < app.minNEQ) {
        errors.push(
            `${rule.id}: minNEQ is greater than maxNEQ`
        );
    }

    if (
        app.minNEQ != null &&
        app.maxNEQ != null
    ) {
        validateRange(
            app.minNEQ,
            app.maxNEQ,
            `${rule.id} applicability`,
            errors
        );
    }
}

// Validation Helper. Confirm that the calculation types are supported. Checked
// Note: This function uses global variable VALID_CALCULATION_TYPE. Consider improving later
function validateCalculation(rule, errors) {
    const calc = rule.calculation;
    if (!calc) return;
    if (!VALID_CALCULATION_TYPES.includes(calc.type)) {
        errors.push(
            `${rule.id}: unsupported calculation type '${calc.type}'`
        );
    }
    if (!Array.isArray(calc.branches)) {
        errors.push(
            `${rule.id}: branches must be an array`
        );
    }
}

// Validation Helper. Confirm that the transformation type is supported. Checked
// Note: This function uses global variable VALID_TRANSFORMATIONS. Consider improving later
function validateTransformations(rule, errors) {

    if (!rule.transformations) return;

    for (const transformation of rule.transformations) {

        if (
            !VALID_TRANSFORMATIONS.includes(
                transformation
            )
        ) {
            errors.push(
                `${rule.id}: invalid transformation '${transformation}'`
            );
        }
    }
}

// Validation Helper. Steps through each branch to validate data. Checked
function validateBranches(validFormula, rule, errors) {

    const branches =
        rule.calculation?.branches ?? [];
    
    validateUniqueIds(
        branches,
        errors,
        `${rule.id} branch`
    );

    const sequences = [];

    for (const branch of branches) {

        sequences.push(branch.sequence);

        validateParameters(
            //rule.id,
            branch,
            errors
        );

        validateBranchFormula(
            validFormula,
            rule.id,
            branch,
            errors
        );

        /*validateBranchCoefficient(
            rule.id,
            branch,
            errors
        );*/
    }

    validateBranchSequence(
        rule.id,
        sequences,
        errors
    );

    validateBranchCoverage(
        rule,
        errors
    )

    validateBranchRanges(
        rule,
        errors
    );
}

// Validation Helper. This function determines if the parameter is correct for the different FORM types. Checked
// This will require additional work once the BD equations are properly fleshed out
//function validateParameters(ruleId, branch, errors) {
function validateParameters(branch, errors) {
    switch (branch.formula) {
        case "FORM001":
        case "FORM002":
        case "FORM003":
        case "FORM004":
            if (
                typeof branch.parameters?.coefficient !== "number"
            ) {
                errors.push(`${branch.id}: coefficient must be numeric`);
            }
        break;

        case "FORM005":
            if (
                typeof branch.parameters?.distanceFromQuantity !== "string"
            ) {
                errors.push(`${branch.id}: distanceFromQuantity missing`);
            }

            if (
                typeof branch.parameters?.quantityFromDistance !== "string"
            ) {

                errors.push(`${branch.id}: quantityFromDistance missing`);
            }
        break;

        default:
            errors.push(`${branch.id}: unknown formula ${branch.formula}`);
    }
}

//Validation Helper. This funciton identifies if a branch has used a valid formula. Checked
function validateBranchFormula(
    validFormula,
    ruleId,
    branch,
    errors
) {
    if (!validFormula.has(branch.formula)) {
        errors.push(
            `${ruleId}/${branch.id}: invalid formula '${branch.formula}'`
        );
        
    };
}

// This function is no longer required as it is being checked elsewhere
/*function validateBranchCoefficient(
    ruleId,
    branch,
    errors
) {

    const coeff =
        branch.parameters?.coefficient;

    if (typeof coeff !== "number") {

        errors.push(
            `${ruleId}/${branch.id}: coefficient must be numeric`
        );

        return;
    }

    if (coeff <= 0) {

        errors.push(
            `${ruleId}/${branch.id}: coefficient must be > 0`
        );
    }
}*/

// Validation Helper. This function confirms that the sequence numbers are sequential. Checked
function validateBranchSequence(
    ruleId,
    sequences,
    errors
) {

    sequences.sort((a, b) => a - b);

    for (let i = 0; i < sequences.length; i++) {

        const expected = i + 1;

        if (sequences[i] !== expected) {

            errors.push(
                `${ruleId}: expected sequence ${expected}, found ${sequences[i]}`
            );
        }
    }
}

// Validation Helper. Makes sure that branches cover the full applicability without overlapping or going outside. Checked
// Will need to expand this to include distance branches as well.
function validateBranchCoverage(rule, errors){
    const ranges = [];
    const branches = rule.calculation?.branches ?? [];
    // Return if there is only one branch
    if (branches.length <= 1) {
        return;
    }
    for (const branch of rule.calculation.branches) {

        const neq = branch.when?.neq;

        ranges.push({
            id: branch.id,
            min: neq.gte,
            max:
                neq.lte ??
                neq.lt,
            maxInclusive:
                neq.lte !== undefined
        });
    }
    for (let i = 0; i < ranges.length - 1; i++) {

        const current = ranges[i];
        const next = ranges[i + 1];

        const currentEnd =
            current.maxInclusive
                ? current.max + 1
                : current.max;

        if (currentEnd < next.min) {

            errors.push(
                `${rule.id}: gap between ${current.id} and ${next.id}`
            );
        }
    }
    ranges.sort((a, b) => a.min - b.min);
    const appMin = rule.applicability.minNEQ;
    const appMax = rule.applicability.maxNEQ;
    if (ranges[0].min !== appMin) {
        errors.push(
            `${rule.id}: first branch begins at ${ranges[0].min} but applicability starts at ${appMin}`
        );
    }
    const last = ranges[ranges.length - 1];
    if (last.max !== appMax) {
        errors.push(
            `${rule.id}: last branch ends at ${last.max} but applicability ends at ${appMax}`
        );
    }
    for (let i = 0; i < ranges.length - 1; i++) {

        const current = ranges[i];
        const next = ranges[i + 1];

        if (current.max > next.min) {

            errors.push(
                `${rule.id}: overlap between ${current.id} and ${next.id}`
            );

            continue;
        }

        if (
            current.max === next.min &&
            current.maxInclusive
        ) {

            errors.push(
                `${rule.id}: overlap between ${current.id} and ${next.id} at ${current.max}`
            );
        }
    }
    for (const range of ranges) {
        if (range.min < appMin) {
            errors.push(
                `${rule.id}: ${range.id} starts below applicability`
            );
        }
        if (range.max > appMax) {
            errors.push(
                `${rule.id}: ${range.id} exceeds applicability`
            );
        }
    }
}

// Validation Helper. Makes sure that branches don't overlap. Checked
function validateBranchRanges(rule, errors) {

    const branches =
        rule.calculation.branches;

    const ranges = branches.map(branch => {

        const neq = branch.when?.neq;

        return {
            id: branch.id,
            gte: neq?.gte,
            lte: neq?.lte,
            lt: neq?.lt
        };
    });

    for (let i = 0; i < ranges.length - 1; i++) {

        const current = ranges[i];
        const next = ranges[i + 1];

        const currentMax =
            current.lte ?? current.lt;

        const nextMin =
            next.gte;

        if (
            current.lte !== undefined &&
            nextMin === currentMax
        ) {

            errors.push(
                `${rule.id}: overlap detected between ${current.id} and ${next.id}`
            );
        }
    }
}


const result = validateDistanceRules();

console.log("\nDistance Rules Validation\n");

console.log(`Rules Checked:    ${result.stats.rules}`);
console.log(`Branches Checked: ${result.stats.branches}`);
console.log(`Errors:           ${result.errors.length}`);
console.log(`Warnings:         ${result.warnings.length}`);
console.log("");

if (result.errors.length === 0) {

    console.log("PASS");

} else {

    console.log("FAIL\n");

    result.errors.forEach(error =>
        console.log(`ERROR: ${error}`)
    );
}