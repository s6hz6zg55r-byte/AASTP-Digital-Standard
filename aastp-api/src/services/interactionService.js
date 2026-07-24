const repositoryService = require("./repositoryService");

function findApplicableInteraction(request) {
    //validateRequest(request);

    const interaction =
        repositoryService.findInteraction(request);

    if (!interaction) {
        throw new Error(
            "No matching interaction rule was found."
        );
    }

    return interaction;
}

function resolve(request) {

    const interaction = findApplicableInteraction(request);

    const effectRules =
        interaction.effects[request.effectId];

    console.log({
    effect: context.effect,
    effectId: context.effect?.id,
    availableEffects: Object.keys(interaction.effects)
});
    if (!effectRules) {
        throw new Error(
            `Effect '${request.effectId}' is not supported by interaction '${interaction.id}'.`
        );
    }

    const engineeringRule =
        effectRules.findApplicableInteraction(rule =>
            rule.hazard === request.hazardId &&
            (
                !request.protectionLevelId ||
                rule.protectionLevel === request.protectionLevelId
            )
        );

    if (!engineeringRule) {
        throw new Error(
            "No engineering rule matched the supplied hazard and protection level."
        );
    }

    return buildResolvedInteraction(
        interaction,
        engineeringRule,
        request
    );
}

function buildResolvedInteraction(
    interaction,
    engineeringRule,
    request
) {

    return {

        interactionId: interaction.id,

        source: interaction.source,

        effectId: request.effectId,

        hazardId: engineeringRule.hazard,

        protectionLevelId:
            engineeringRule.protectionLevel ?? null,

        inputBasis:
            engineeringRule.inputBasis ?? null,

        distanceRuleId:
            engineeringRule.distanceRule ?? null,

        constraintIds:
            engineeringRule.constraints ?? [],

        status:
            engineeringRule.status ?? null
    };
}

/*
function validateRequest(request) {

    if (!request)
        throw new Error("Request is required.");

    if (!request.pesType)
        throw new Error("pesType is required.");

    if (!request.esType)
        throw new Error("esType is required.");

    if (!request.effectId)
        throw new Error("effectId is required.");

    if (!request.hazardId)
        throw new Error("hazardId is required.");
}
*/

module.exports = {
    resolve
};