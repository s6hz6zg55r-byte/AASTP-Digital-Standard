import calculationResolver from "#resolvers/calculationResolver";
import { repositoryService } from "@aastp/core-data";

const branchTests = [
    {
        name: "BD04 Single Branch",
        ruleId: "BD01",
        request: {
            direction: "forward",
            neq: 5000
        }
    },
    {
        name: "BD16 lower boundary",
        ruleId: "BD16",
        request: {
            direction: "forward",
            neq: 2499
        }
    },
    {
        name: "BD16 inclusive lower",
        ruleId: "BD16",
        request: {
            direction: "forward",
            neq: 2500
        }
    },
    {
        name: "BD16 upper boundary",
        ruleId: "BD16",
        request: {
            direction: "forward",
            neq: 4499
        }
    },
    {
        name: "BD16 inclusive upper",
        ruleId: "BD16",
        request: {
            direction: "forward",
            neq: 4500
        }
    },
    {
        name: "BD16 reverse lower boundary",
        ruleId: "BD16",
        request: {
            direction: "reverse",
            distance: 86
        }
    },
    {
        name: "BD16 reverse inclusive upper boundary",
        ruleId: "BD16",
        request: {
            direction: "reverse",
            distance: 87
        }
    },
    {
        name: "P2D2 lower boundary",
        ruleId: "P2D2",
        request: {
            direction: "forward",
            neq: 199
        }
    },
    {
        name: "P2D2 upper inclusive",
        ruleId: "P2D2",
        request: {
            direction: "forward",
            neq: 200
        }
    }


];

function determineBranchRange(branch, direction) {

    return direction === "forward"
        ? branch.when.neq
        : branch.result.distance;

}

function determineInputValue(request, direction) {

    return direction === "forward"
        ? request.neq
        : request.distance;

}

function matchesRange(value, range) {
    if (!range) {return true;}
    if (range.gt !== undefined && value <= range.gt) {
        return false;
    }
    if (range.gte !== undefined && value < range.gte) {
        return false;
    }
    if (range.lt !== undefined &&value >= range.lt) {
        return false;
    }
    if (range.lte !== undefined && value > range.lte) {
        return false;
    }
    return true;
}

function matchesCondition(request, when) {

    return Object.entries(when).every(([property, range]) =>
        matchesRange(request[property], range)
    );

}

describe("calculationResolver Testing", () => {

    describe("Branch selection", () => {

        branchTests.forEach(testCase => {

            test(testCase.name, () => {
                const distanceRule =
                    repositoryService.findDistanceRuleById(
                        testCase.ruleId
                    );
                const assessment = {
                    request: structuredClone(testCase.request),
                    distanceRule
                };
                const result =
                    calculationResolver.resolve(assessment);
                const selectedBranch =
                    result.calculation.branch;
                // Verifies that the returned branch matches the request
                expect(
                    matchesRange(
                        testCase.request.neq,
                        selectedBranch.when.neq
                    )
                ).toBe(true);
                const matchingBranches =
                    distanceRule.calculation.branches.filter(branch =>
                        matchesRange(
                            determineInputValue(
                                testCase.request,
                                testCase.request.direction
                            ),
                            determineBranchRange(
                                branch,
                                testCase.request.direction
                            )
                        )
                    );

                // Ensures that the data is internally consistant (i.e. branches are not overlaped.)
                expect(matchingBranches).toHaveLength(1);
                expect(selectedBranch).toBe(matchingBranches[0]);
            });
        });
    });
});


    
