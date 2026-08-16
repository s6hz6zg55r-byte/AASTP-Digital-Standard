const interactionService = require("../../src/services/interactionService");
const distanceRuleService = require("../src/services/distanceRuleService");

const request = {

    pesType: "PES001",
    esType: "ES001",

    pesOrientation: "front",
    esOrientation: "all",

    effectId: "EFF001",
    hazardId: "HD001",
    protectionLevelId: "PL001"

};

try {

    const interaction =
        interactionService.resolve(request);

    const distanceRule =
        distanceRuleService.resolve(interaction);

    console.assert(distanceRule.distanceRuleId === "BD03");
    console.assert(distanceRule.inputBasis === "NEQ");

    console.log("PASS");

    console.dir(distanceRule, {
        depth: null
    });

}
catch (err) {

    console.log("FAIL");
    console.error(err.message);

}