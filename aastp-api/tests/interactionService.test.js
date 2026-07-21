const interactionService = require("../src/services/interactionService");

const request = {
    pesType: "PES001",
    esType: "ES001",
    pesOrientation: "front",
    esOrientation: "front",
    effectId: "EFF001",
    hazardId: "HD001",
    protectionLevelId: "PL001"
};

try {

    const result = interactionService.resolve(request);

    console.assert(result.interactionId === "INT001");
    console.assert(result.distanceRuleId === "BD03");
    console.assert(result.inputBasis === "NEQ");
    console.assert(result.effectId === "EFF001");

    console.log("PASS");
    console.dir(result, { depth: null });

} catch (err) {

    console.error("FAIL");
    console.error(err.message);

}