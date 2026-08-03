import { repositoryService } from "@aastp/core-data";
import assessmentResolver from "#resolvers/assessmentResolver";
import calculationResolver from "#resolvers/calculationResolver";


describe("AssessmentResolver", () => {

    function createContext() {

        return {

            interaction: {

                id: "INT001",

                effects: {

                    EFF001: [
                        {
                            hazard: "HD001",
                            distanceRule: "BD03",
                            inputBasis: "NEQ",
                            protectionLevel: "PL001",
                            constraints: ["CV001"]
                        },
                        {
                            hazard: "HD002",
                            distanceRule: "BD03",
                            inputBasis: "MCE",
                            protectionLevel: "PL001",
                            constraints: ["CV001"]
                        }
                    ],

                    EFF002: [
                        {
                            hazard: "HD003",
                            status: "N_A"
                        }
                    ],

                    EFF003: [
                        {
                            hazard: "HD004",
                            status: "NO_QD"
                        }
                    ]

                }

            }

        };

    }

    test("creates one assessment for every hazard outcome", () => {

        const context = createContext();

        assessmentResolver.process(context);

        expect(context.assessments).toHaveLength(4);

    });

    test("every assessment satisfies the assessment contract", () => {

        const context = createContext();

        assessmentResolver.process(context);

        context.assessments.forEach(assessment => {

            expect(assessment).toEqual(
                expect.objectContaining({

                    interaction: expect.any(Object),

                    outcome: expect.any(Object),

                    result: expect.any(Object),

                    evaluation: expect.any(Object)

                })
            );

        });

    });

    test("stores the interaction reference", () => {

        const context = createContext();

        assessmentResolver.process(context);

        expect(context.assessments[0].interaction.id)
            .toBe("INT001");

    });

    test("stores the correct effect identifier", () => {

        const context = createContext();

        assessmentResolver.process(context);

        expect(context.assessments[0].effectId)
            .toBe("EFF001");

        expect(context.assessments[2].effectId)
            .toBe("EFF002");

        expect(context.assessments[3].effectId)
            .toBe("EFF003");

    });

    test("stores the complete engineering outcome", () => {

        const context = createContext();

        assessmentResolver.process(context);

        expect(context.assessments[0].outcome).toEqual({

            hazard: "HD001",
            distanceRule: "BD03",
            inputBasis: "NEQ",
            protectionLevel: "PL001",
            constraints: ["CV001"]

        });

    });

    test("preserves status-only outcomes", () => {

        const context = createContext();

        assessmentResolver.process(context);

        expect(context.assessments[2].outcome).toEqual({

            hazard: "HD003",
            status: "N_A"

        });

        expect(context.assessments[3].outcome).toEqual({

            hazard: "HD004",
            status: "NO_QD"

        });

    });

    test("all assessments begin in the pending state", () => {

        const context = createContext();

        assessmentResolver.process(context);

        context.assessments.forEach(assessment => {

            expect(assessment.result.status)
                .toBe("pending");

        });

    });

    test("creates one assessment for every outcome in INT003", () => {

        const interaction = repositoryService.findInteractionById("INT003");

        //console.log(context);

        const context = { interaction };

        assessmentResolver.process(context);

        expect(context.assessments).toHaveLength(15);

    });

    test("creates separate assessments for duplicate hazards with different distance rules", () => {

        const interaction = repositoryService.findInteractionById("INT003");

        const context = { interaction };

        assessmentResolver.process(context);

        const hd005 = context.assessments.filter(
            assessment => assessment.outcome.hazard === "HD005"

        );

        expect(hd005).toHaveLength(2);

        expect(hd005.map(a => a.outcome.distanceRule).sort()).toEqual(["FD10", "FD25"]);

});

});