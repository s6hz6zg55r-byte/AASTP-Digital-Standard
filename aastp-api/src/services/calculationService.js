const calculationEngine =
    require("../engine/calculationEngine");

function calculate(input) {

    return calculationEngine.calculate(
        input
    );

}

module.exports = {
    calculate
};