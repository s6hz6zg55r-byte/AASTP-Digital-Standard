const interactionService = require("../src/services/interactionService");
const distanceRuleService = require("../src/services/distanceRuleService");
const branchResolverService = require("../src/services/branchResolverService");

const request = {

    pesType: "PES001",
    esType: "ES001",

    pesOrientation: "front",
    esOrientation: "all",

    neq: 500,

    effectId: "EFF001",
    hazardId: "HD001",
    protectionLevelId: "PL001"

};

try {

    //
    // Resolve the engineering interaction
    //
    const interaction =
        interactionService.resolve(request);

    //
    // Resolve the applicable distance rule
    //
    const distanceRule =
        distanceRuleService.resolve(interaction);

    //
    // Resolve the applicable calculation branch
    //
    const branch =
        branchResolverService.resolve(
            distanceRule,
            request
        );

    //
    // Assertions
    //
    console.assert(
        interaction.interactionId === "INT001",
        "Incorrect interaction selected."
    );

    console.assert(
        distanceRule.distanceRuleId === "BD03",
        "Incorrect distance rule selected."
    );

    console.assert(
        branch.branchId !== undefined,
        "No branch was selected."
    );

    console.assert(
        branch.formulaId !== undefined,
        "No formula was selected."
    );

    console.assert(
        branch.parameters !== undefined,
        "Branch parameters missing."
    );

    console.log("\nPASS\n");

    console.log("Interaction");
    console.dir(interaction, { depth: null });

    console.log("\nDistance Rule");
    console.dir(distanceRule, { depth: null });

    console.log("\nResolved Branch");
    console.dir(branch, { depth: null });

}
catch (err) {

    console.log("\nFAIL\n");
    console.error(err);

}