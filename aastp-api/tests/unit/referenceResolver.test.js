//const referenceResolver = require("@services/referenceResolver");
import referenceResolver from "#resolvers/referenceResolver";

describe("ReferenceResolver", () => {

    test("throws when assessment has no outcome", () => {

        expect(() => {

            referenceResolver.resolve({});

        }).toThrow(
            "referenceResolver requires assessment.outcome"
        );

    });

    test("resolves a minimal assessment", () => {

        const assessment = {
            outcome: {
                hazard: "HD001"
            }
        };

        const result = referenceResolver.resolve(assessment);

        expect(result).toBe(assessment);

        expect(result.hazard).toBeDefined();

        expect(result.distanceRule).toBeNull();

        expect(result.protectionLevel).toBeNull();

        expect(result.constraints).toEqual([]);

    });

    test("resolves a typical engineering assessment", () => {

        const assessment = {
            outcome: {
                hazard: "HD001",
                distanceRule: "BD16",
                protectionLevel: "PL001"
            }
        };

        const result = referenceResolver.resolve(assessment);

        expect(result.hazard).toBeDefined();

        expect(result.hazard.id).toBe("HD001");

        expect(result.distanceRule).toBeDefined();

        expect(result.distanceRule.id).toBe("BD16");

        expect(result.protectionLevel).toBeDefined();

        expect(result.protectionLevel.id).toBe("PL001");

        expect(result.constraints).toEqual([]);

    });

    test("resolves multiple constraints", () => {

        const assessment = {
            outcome: {
                hazard: "HD001",
                distanceRule: "BD16",
                constraints: [
                    "CV001",
                    "CV003"
                ]
            }
        };

        const result = referenceResolver.resolve(assessment);

        expect(result.constraints).toHaveLength(2);

        expect(result.constraints[0].id).toBe("CV001");

        expect(result.constraints[1].id).toBe("CV003");

    });

    test("throws for an unknown distance rule", () => {

        const assessment = {
            outcome: {
                hazard: "HD001",
                distanceRule: "INVALID_RULE"
            }
        };

        expect(() => {

            referenceResolver.resolve(assessment);

        }).toThrow(
            "Unknown distance rule 'INVALID_RULE'"
        );

    });

});