export function resolveDistanceRule(
  distanceRuleData,
  ruleId,
  neq
) {
    console.log(distanceRuleData);
    console.log(ruleId);
    console.log("Rule ID:", ruleId);
    console.log("NEQ:", neq);
  const rule =
    distanceRuleData.distanceRules[ruleId];
    console.log("Rule Found:", rule);

  if (!rule) {
    return null;
  }

    const matchingBranch =
    rule.calculation.branches.find((branch) => {

        const range = branch.when.neq;

        const gteMatch =
            range.gte === undefined ||
            neq >= range.gte;

        const gtMatch =
            range.gt === undefined ||
            neq > range.gt;

        const lteMatch =
            range.lte === undefined ||
            neq <= range.lte;

        const ltMatch =
            range.lt === undefined ||
            neq < range.lt;

    return (
      gteMatch &&
      gtMatch &&
      lteMatch &&
      ltMatch
    );
  });
  console.log("Matching Branch:", matchingBranch);
  if (!matchingBranch) {
    return null;
  }

  return {
    rule,
    branch: matchingBranch
  };
}