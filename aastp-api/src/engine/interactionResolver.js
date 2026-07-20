const interactionRules =
  require("../data/interactions.json");

function resolveInteraction(input) {

    const rules =
        Object.values(
            interactionRules.interactionRules
        );

    return rules.find(rule => {

        return (
            rule.conditions.pesType === input.pesType &&
            rule.conditions.esType === input.esType &&
            rule.conditions.orientation.pes === input.pesOrientation &&
            rule.conditions.orientation.es === input.esOrientation
        );

    });

}

module.exports = {
    resolveInteraction
};