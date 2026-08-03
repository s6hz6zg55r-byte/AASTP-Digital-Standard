import { create, all } from "mathjs";
const math = create(all);
// Override the default natural log function to use base e instead of base 10
// This is necessary because the mathjs library uses base 10 for the natural log function by default, which is not what we want for our calculations.
// Additional math functions can be added here as needed, for example, if we need to add a custom function for a specific formula, we can do that here as well.
math.import({
    ln(value) { return math.log(value); }
});
   
/*
 *
 * Evaluates the resolved mathematical expression for an assessment.
 * 
 *
 * Responsibilities:
 *  - Determine calculation direction.
 *  - Select the appropriate calculation branch.
 *  - Resolve the formula definition.
 *  - Resolve the expression
 *  - Merge parameters.
 *  - Build assessment.calculation
 *
 * Inputs:
 *  assessment.calculation = {
 *    ...
 *    direction: "forward",
 *    inputValue: 2500,
 *    branch: {...},
 *    formula: {...},
 *    resolvedExpression: "coefficient * sqrt(neq)",
 *    parameters: {
 *      input: "neq",
 *      output: "distance",
 *      coefficient: 1.73
 *    }
 *  
 *  }
 *
 * Outputs:
 *  assessment.calculation = {
 *  ...
 *  rawResult: number
 *  
 *  }
 */

export function resolve(assessment) {

    if (!assessment) {
        throw new Error(
            "formulaEvaluator requires an assessment."
        );
    }

    validateCalculation(assessment);

    const calculation = assessment.calculation;

    

    const context = buildEvaluationContext(calculation);

    const rawResult = evaluateExpression(calculation.resolvedExpression, context);

    validateResult(calculation, rawResult);

    assessment.calculation.rawResult = rawResult;

    return assessment;

}

// Ensures the contract for the resolver is complete (e.g. resolvedExpression, parameters and inputValue are present)
function validateCalculation(assessment) {
    
    if (!assessment.calculation) {
        throw new Error(
            "formulaEvaluator requires assessment.calculation."
        );
    }

    if (!assessment.calculation.resolvedExpression) {
        throw new Error(
            "formulaEvaluator requires calculation.resolvedExpression."
        );
    }

    if (!assessment.calculation.parameters) {
        throw new Error(
            "formulaEvaluator requires calculation.parameters."
        );
    }

    if (!assessment.calculation.parameters.input) {
        throw new Error(
            "formulaEvaluator requires calculation.parameters.input."
        );
    }

    if (!assessment.calculation.parameters.output) {
        throw new Error(
            "formulaEvaluator requires calculation.parameters.output."
        );
    }

    if (assessment.calculation.inputValue === undefined) {
        throw new Error(
            "formulaEvaluator requires calculation.inputValue."
        );
    }

}

// Constucts the variable scope for the expression using the parameter metadata (input tells you whether to expose neq or distance)
function buildEvaluationContext(calculation) {
    
    const context = {
        ...calculation.parameters
    };
    delete context.input;
    delete context.output;
    context[
        calculation.parameters.input
    ] = calculation.inputValue;

    return context;
}

// Performs a mathematical evaluation using the expression and context
function evaluateExpression(resolvedExpression, context) {

    const compiledExpression = math.compile(resolvedExpression);

    return compiledExpression.evaluate(context);
}

// Confirms the output is a finite number before storing it as assessment.calculation.rawResult
function validateResult(calculation, rawResult) {

    if (!Number.isFinite(rawResult)) {
        throw new Error(
            `Expression '${calculation.resolvedExpression}' evaluated to be '${rawResult}'.`
        );
    }

}

