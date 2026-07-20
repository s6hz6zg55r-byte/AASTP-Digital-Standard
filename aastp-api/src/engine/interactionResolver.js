const {repository} = require("@aastp/core-data");

function resolveInteraction(input) {

    const interactionData = repository.getInteractions();

    const rules =
        Object.values(
            interactionData.interactionRules
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