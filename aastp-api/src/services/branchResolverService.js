//const repositoryService = require("./repositoryService");

function resolve(distanceRule, request) {

    if (!distanceRule) {
        throw new Error("A resolved distance rule must be supplied.");
    }

    if (!request) {
        throw new Error("A calculation request must be supplied.");
    }

    const branch = findMatchingBranch(
        distanceRule.calculation.branches,
        distanceRule.inputBasis,
        request
    );

    if (!branch) {
        throw new Error(
            `No calculation branch found for '${distanceRule.distanceRuleId}'.`
        );
    }

    return buildResolvedBranch(
        distanceRule,
        branch
    );

}

function findMatchingBranch(
    branches,
    inputBasis,
    request
) {

    //let value;

    const value = request[inputBasis.toLowerCase()];

    /*
    switch (inputBasis) {

        case "NEQ":
            value = request.neq;
            break;

        case "MCE":
            value = request.mce;
            break;

        default:
            throw new Error(
                `Unsupported input basis '${inputBasis}'.`
            );

    }
    */

    return branches.find(branch =>
        isWithinRange(
            value,
            branch.when[inputBasis.toLowerCase()]
        )
    );

}

function isWithinRange(value, range) {

    if (!range) {
        return true;
    }

    if (range.gt !== undefined && value <= range.gt)
        return false;

    if (range.gte !== undefined && value < range.gte)
        return false;

    if (range.lt !== undefined && value >= range.lt)
        return false;

    if (range.lte !== undefined && value > range.lte)
        return false;

    return true;

}

function buildResolvedBranch(
    distanceRule,
    branch
) {

    return {

        distanceRuleId:
            distanceRule.distanceRuleId,

        branchId:
            branch.id,

        formulaId: 
            branch.formula,

       // inputBasis:
       //     distanceRule.inputBasis,

       parameters: branch.parameters, 
       
       branch,

        transformations:
            distanceRule.transformations,

        traceability:
            distanceRule.traceability

    };

}

module.exports = {
    resolve
}