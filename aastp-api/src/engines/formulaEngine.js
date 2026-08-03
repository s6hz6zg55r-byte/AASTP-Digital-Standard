import formulaEvaluator from "#evaluators/formulaEvaluator";

function process(assessment) {

    const formulaDefinition =
        assessment.distanceRule.formula;

    if (!formulaDefinition) {
        return assessment;
    }

    assessment.calculatedValue =
        formulaEvaluator.evaluate(
            formulaDefinition.id,
            assessment.request.neq,
            assessment.distanceRule.coefficient
        );
    return assessment;
}

export default { process };