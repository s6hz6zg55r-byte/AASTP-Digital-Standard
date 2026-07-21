const repositoryService = require("./repositoryService");

function resolve(resolvedInteraction) {

    if (!resolvedInteraction) {
        throw new Error("A resolved interaction must be supplied.");
    }

    const distanceRule =
        repositoryService.findDistanceRuleById(
            resolvedInteraction.distanceRuleId
        );

    if (!distanceRule) {
        throw new Error(
            `Distance rule '${resolvedInteraction.distanceRuleId}' not found.`
        );
    }

    return buildResolvedDistanceRule(
        resolvedInteraction,
        distanceRule
    );

}

function buildResolvedDistanceRule(
    interaction,
    distanceRule
) {

    return {

        distanceRuleId: distanceRule.id,

        source: interaction.source,

        inputBasis: interaction.inputBasis,

        applicability: distanceRule.applicability,

        calculation: distanceRule.calculation,

        transformations: distanceRule.transformations,

        traceability: distanceRule.traceability

    };

}

module.exports = {
    resolve
};