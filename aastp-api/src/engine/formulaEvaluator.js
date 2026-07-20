function evaluateFormula(
    formulaId,
    neq,
    coefficient
) {

    switch(formulaId) {

        case "FORM001":
            return coefficient *
                Math.pow(neq, 1/3);

        case "FORM002":
            return coefficient *
                Math.pow(neq, 2/3);

        case "FORM003":
            return coefficient *
                Math.sqrt(neq);

        case "FORM004":
            return coefficient;

        default:
            throw new Error(
                `Unknown formula ${formulaId}`
            );
    }
}

module.exports = {
    evaluateFormula
};