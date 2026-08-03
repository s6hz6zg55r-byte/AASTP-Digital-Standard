const distanceRuleResolver = require("@services/distanceRuleResolver");

const assessment = {};

describe("InteractionService", () => {


    function createValidContext() {

        assessment.outcome = {
            hazard: "HD001",
            distanceRule: "BD03",
            inputBasis: "NEQ",
            protectionLevel: "PL001",
            constraints: ["CV001"]
        }
        return assessment;

    }


    test("resolves correct interaction for PES, ES and orientation", () => {

        const assessment = createValidContext();

        const result =
            distanceRuleResolver.process(assessment);


        expect(result.hazard.id).toBe("HD001");
        expect(result.distanceRule.id).toBe("BD03");
        expect(result.inputBasis.id).toBe("NEQ");
        expect(result.protectionLevel.id).toBe("PL001");
        expect(result.constraints.length).toBe(1);
        expect(result.constraints[0].id).toBe("CV001");
            


    });

})