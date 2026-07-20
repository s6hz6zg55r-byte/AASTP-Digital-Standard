const { resolveInteraction } =
    require("./interactionResolver");

const { resolveDistanceRule } =
    require("./distanceRuleResolver");

const { evaluateFormula } =
    require("./formulaEvaluator");

const { applyTransformations} = 
    require("./transformationEngine");

function calculate(input) {

    // 1. Find matching interaction

    const interaction =
        resolveInteraction(input);

    if (!interaction) {
        throw new Error(
            "No matching interaction rule found"
        );
    }

    // 2. Find effect

    const effectRules =
        interaction.effects[input.effect];

    if (!effectRules) {
        throw new Error(
            `Effect ${input.effect} not supported`
        );
    }

    // 3. Find hazard entry

    const hazardRule =
        effectRules.find(
            h => h.hazard === input.hazard
        );

    if (!hazardRule) {
        throw new Error(
            `Hazard ${input.hazard} not found`
        );
    }

    // Handle N_A / NO_QD later

    if (hazardRule.status) {
        return {
            status: hazardRule.status
        };
    }

    // 4. Resolve distance rule

    const {
        rule,
        branch
    } = resolveDistanceRule(
        hazardRule.distanceRule,
        input.neq
    );

    if (!branch) {
        throw new Error(
            `No matching branch for ${hazardRule.distanceRule}`
        );
    }

    // 5. Calculate distance

    const rawDistance = evaluateFormula(
            branch.formula,
            input.neq,
            branch.parameters.coefficient
    );

    const distance = applyTransformations(
        rawDistance,
        rule.transformations || []
    );

    // 6. Return result and trace

    return {

        distance,

        trace: {

            rawDistance,

            transformations:
                rule.transformations || [],

            interaction: interaction.id,

            effect: input.effect,

            hazard: input.hazard,

            distanceRule: rule.id,

            branch: branch.id,

            formula: branch.formula,

            coefficient:
                branch.parameters.coefficient

        }

    };

}

module.exports = {
    calculate
};