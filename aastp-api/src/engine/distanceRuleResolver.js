const distanceRules =
  require("../data/distanceRules.json");

function resolveDistanceRule(
    ruleId,
    neq
) {

    const rule =
        distanceRules.distanceRules.find(
            r => r.id === ruleId
        );

    const branch =
        rule.calculation.branches.find(b => {

            const n = b.when.neq;

            const gte =
                n.gte === undefined ||
                neq >= n.gte;

            const gt =
                n.gt === undefined ||
                neq > n.gt;

            const lte =
                n.lte === undefined ||
                neq <= n.lte;

            const lt =
                n.lt === undefined ||
                neq < n.lt;

            return gte && gt && lte && lt;

        });

    return {
        rule,
        branch
    };

    
}

module.exports = {
    resolveDistanceRule
};