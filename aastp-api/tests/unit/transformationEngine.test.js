import * as transformationEngine from "../../src/engines/transformationEngine.js";
import * as calculationResolver from "../../src/resolvers/calculationResolver.js";
import * as formulaEvaluator from "../../src/evaluators/formulaEvaluator.js";

describe("TransformationEngine", () => {
    describe("Happy Path", () => {
        test("resolves round_up_metre for a valid assessment", () => {

            const assessment = {
                calculation: {
                    rawResult: 469.57,
                    transformations: [
                        "round_up_metre"
                    ]
                }
            };
            transformationEngine.resolve(assessment);
            expect(assessment.calculation.transformedResult).toBe(470);
        });

        test("resolves round_down_metre for a valid assessment", () => {

            const assessment = {
                calculation: {
                    rawResult: 469.57,
                    transformations: [
                        "round_down_metre"
                    ]
                }
            };
            transformationEngine.resolve(assessment);
            expect(assessment.calculation.transformedResult).toBe(469);
        });

        test("resolves round_down_10kg for a valid assessment", () => {

            const assessment = {
                calculation: {
                    rawResult: 469.57,
                    transformations: [
                        "round_down_10kg"
                    ]
                }
            };
            transformationEngine.resolve(assessment);
            expect(assessment.calculation.transformedResult).toBe(460);
        });

        test("resolve no transformations for a valid assessment", () => {

            const assessment = {
                calculation: {
                    rawResult: 469.57,
                    transformations: []
                }
            };
            transformationEngine.resolve(assessment);
            expect(assessment.calculation.transformedResult).toBe(469.57);
        });
    });

    describe("Validation", () => {
        test("throws an error if assessment is missing", () => {
            expect(() => {
                transformationEngine.resolve(null);
            }).toThrow("transformationEngine requires an assessment.");
        });

        test("throws an error if calculation is missing", () => {
            const assessment = {};
            expect(() => {
                transformationEngine.resolve(assessment);
            }).toThrow("transformationEngine requires assessment.calculation.");
        });

        test("throws an error if rawResult is missing", () => {
            const assessment = {
                calculation: {
                    transformations: ["round_up_metre"]
                }
            };
            expect(() => {
                transformationEngine.resolve(assessment);
            }).toThrow("transformationEngine requires calculation.rawResult.");
        });

        test("throws an error if transformations is missing", () => {
            const assessment = {
                calculation: {
                    rawResult: 469.57
                }
            };
            expect(() => {
                transformationEngine.resolve(assessment);
            }).toThrow("transformationEngine requires calculation.transformations.");
        });
        
        test("throws an error if transformations is not an array", () => {
            const assessment = {
                calculation: {
                    rawResult: 469.57,
                    transformations: "not an array"
                }
            };
            expect(() => {
                transformationEngine.resolve(assessment);
            }).toThrow("transformationEngine requires calculation.transformations to be an array.");
        });

        test("throws an error if a transformation is invalid", () => {
            const assessment = {
                calculation: {
                    rawResult: 469.57,
                    transformations: ["invalid_transformation"]
                }
            };
            expect(() => {
                transformationEngine.resolve(assessment);
            }).toThrow("Unknown transformation 'invalid_transformation'.");
        });

        test("throws an error if a rawResult is NaN", () => {
            const assessment = {
                calculation: {
                    rawResult: NaN,
                    transformations: ["round_up_metre"]
                }
            };
            expect(() => {
                transformationEngine.resolve(assessment);
            }).toThrow("Transformation 'round_up_metre' resulted in NaN from input NaN.");
        });

    });

    describe("Transformation Order", () => {
        test("applies transformations in the order they are specified - 1", () => {
            const assessment = {
                calculation: {
                    rawResult: 469.57,
                    transformations: [
                        "round_down_10kg",
                        "round_up_metre"
                    ]
                }
            };
            transformationEngine.resolve(assessment);
            expect(assessment.calculation.transformedResult).toBe(460);
        });
        
        test("applies transformations in the order they are specified - 2", () => {
            const assessment = {
                calculation: {
                    rawResult: 469.57,
                    transformations: [
                        "round_up_metre",
                        "round_down_10kg"
                    ]
                }
            };
            transformationEngine.resolve(assessment);
            expect(assessment.calculation.transformedResult).toBe(470);
        });

        test("Validate rounding - 1", () => {
            const assessment = {
                calculation: {
                    rawResult: 12.3,
                    transformations: [
                        "round_up_metre"
                    ]
                }
            };
            transformationEngine.resolve(assessment);
            expect(assessment.calculation.transformedResult).toBe(13);
        });

        test("Validate rounding - 2", () => {
            const assessment = {
                calculation: {
                    rawResult: 12.0,
                    transformations: [
                        "round_down_metre"
                    ]
                }
            };
            transformationEngine.resolve(assessment);
            expect(assessment.calculation.transformedResult).toBe(12);
        });
    });
});