const formulaService = require("../src/services/formulaService");



const interactionDecision = {
    formulaId: "FORM001"
};

try {
    const formula = formulaService.resolve(interactionDecision);

    console.log("PASS");
    console.log(formula);

} catch (err) {

    console.error("FAIL");
    console.error(err.message);

}