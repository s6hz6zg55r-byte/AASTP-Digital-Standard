/**
 * FormulaService
 *
 * Resolves formula definitions from the knowledge layer.
 *
 * Responsibilities:
 *  - Resolve a formula from an InteractionDecision
 *  - Validate that the formula exists
 *  - Return the complete formula definition
 *
 * This service performs NO mathematical calculations.
 * That responsibility belongs to the CalculationEngine.
 */

const repositoryService = require("./repositoryService");

function resolve(interactionDecision) {

    if (!interactionDecision) {
        throw new Error("InteractionDecision is required.");
    }

    if (!interactionDecision.formulaId) {
        throw new Error("InteractionDecision does not contain a formulaId.");
    }

    const formula = repositoryService.getFormula(
        interactionDecision.formulaId
    );

    if (!formula) {
        throw new Error(
            `Formula '${interactionDecision.formulaId}' was not found.`
        );
    }

    validate(formula);

    return formula;
}

/**
 * Validates a formula definition retrieved from the repository.
 *
 * This protects the calculation engine from malformed data.
 */
function validate(formula) {

    if (!formula.id)
        throw new Error("Formula is missing an id.");

    if (!formula.code)
        throw new Error(`Formula '${formula.id}' is missing a code.`);

    if (!formula.forwardExpression)
        throw new Error(
            `Formula '${formula.id}' is missing a forwardExpression.`
        );

    if (!formula.reverseExpression)
        throw new Error(
            `Formula '${formula.id}' is missing a reverseExpression.`
        );
}

module.exports = {
    resolve
};