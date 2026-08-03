import { describe, expect, test } from "@jest/globals";
import { resolve } from "../../src/evaluators/formulaEvaluator.js";

describe("FormulaEvaluator.resolve()", () => {
    describe("Happy Path", () => {

        test("evaluates FORM001", () => {

            const assessment = {
                calculation: {
                    inputValue: 4500,
                    resolvedExpression: "coefficient * sqrt(neq)",
                    parameters: {
                        input: "neq",
                        output: "distance",
                        coefficient: 7
                    }
                }
            };
            const result = resolve(assessment);
            expect(result.calculation.rawResult).toBeCloseTo(7 * Math.sqrt(4500));

        });

        test("evaluates FORM003", () => {
            const assessment = {
                calculation: {
                    inputValue: 2500,
                    resolvedExpression: "coefficient * sqrt(neq)",
                    parameters: {
                        input: "neq",
                        output: "distance",
                        coefficient: 1.73
                    }
                }
            };
            const result = resolve(assessment);
            expect(result.calculation.rawResult).toBeCloseTo(1.73 * Math.sqrt(2500));
        });

        test("evaluates a reverse calculation", () => {
            const assessment = {
                calculation: {
                    inputValue: 117,
                    resolvedExpression: "(distance - 91) / 2.687",
                    parameters: {
                        input: "distance",
                        output: "neq"
                    }
                }
            };
            const result = resolve(assessment);
            expect(result.calculation.rawResult).toBeCloseTo((117 - 91) / 2.687);
        });

        test("evaluates FORM005 without coefficients", () => {
            const assessment = {
                calculation: {
                    inputValue: 25,
                    resolvedExpression: "91 + 2.687 * neq",
                    parameters: {
                        input: "neq",
                        output: "distance"
                    }
                }
            };
            const result = resolve(assessment);
            expect(result.calculation.rawResult).toBeCloseTo(91 + 2.687 * 25);

        });

        test("evaluates expressions with multiple constants", () => {
            const assessment = {
                calculation: {
                    inputValue: 2500,
                    resolvedExpression: "coefficient * pow(neq, exponent) + offset",
                    parameters: {
                        input: "neq",
                        output: "distance",
                        coefficient: 7,
                        exponent: 0.667,
                        offset: 91
                    }
                }
            };
            const result = resolve(assessment);
            expect(result.calculation.rawResult).toBeCloseTo(7 * Math.pow(2500, 0.667) + 91);
        });

        test("does not mutate the parameters object", () => {
            const assessment = {
                calculation: {
                    inputValue: 2500,
                    resolvedExpression: "coefficient * sqrt(neq)",
                    parameters: {
                        input: "neq",
                        output: "distance",
                        coefficient: 1.73
                    }
                }
            };
            resolve(assessment);
            expect(assessment.calculation.parameters).toEqual({
                input: "neq",
                output: "distance",
                coefficient: 1.73
            });

        });

    });

    describe("Expression Support", () => {

        test("supports sqrt()", () => {
            const assessment = {
                calculation: {
                    inputValue: 2500,
                    resolvedExpression: "coefficient * sqrt(neq)",
                    parameters: {
                        input: "neq",
                        output: "distance",
                        coefficient: 1.73
                    }
                }
            };
            const result = resolve(assessment);
            expect(result.calculation.rawResult).toBeCloseTo(1.73 * Math.sqrt(2500));
        });

        test("supports pow()", () => {
            const assessment = {
                calculation: {
                    inputValue: 2500,
                    resolvedExpression: "coefficient * pow(neq, exponent)",
                    parameters: {
                        input: "neq",
                        output: "distance",
                        coefficient: 7,
                        exponent: 0.667
                    }
                }
            };
            const result = resolve(assessment);
            expect(result.calculation.rawResult).toBeCloseTo(7 * Math.pow(2500, 0.667));
        }); 

        test("supports exp()", () => {
            const assessment = {
                calculation: {
                    inputValue: 2,
                    resolvedExpression: "coefficient * exp(neq)",
                    parameters: {
                        input: "neq",
                        output: "distance",
                        coefficient: 1.73
                    }
                }
            };
            const result = resolve(assessment);
            expect(result.calculation.rawResult).toBeCloseTo(1.73 * Math.exp(2));
        });

        test("supports ln()", () => {
            const assessment = {
                calculation: {
                    inputValue: 2500,
                    resolvedExpression: "coefficient * ln(neq)",
                    parameters: {
                        input: "neq",
                        output: "distance",
                        coefficient: 1.73
                    }
                }
            };
            const result = resolve(assessment);
            expect(result.calculation.rawResult).toBeCloseTo(1.73 * Math.log(2500));
        });

        test("supports mixed expressions", () => {
            const assessment = {
                calculation: {
                    inputValue: 2500,
                    resolvedExpression: "64.995 + 7.249 * ln(neq) + 6.693 * pow(ln(neq),2)",
                    parameters: {
                        input: "neq",
                        output: "distance"
                    }
                }
            };
            const result = resolve(assessment);
            expect(result.calculation.rawResult).toBeCloseTo(64.995 + 7.249 * Math.log(2500) + 6.693 * Math.pow(Math.log(2500), 2));
        });
    });

    describe("Parameter Resolution", () => {
        test("Test for no constants", () => {
            const assessment = {
                calculation: {
                    inputValue: 2,
                    resolvedExpression: "sqrt(neq)",
                    parameters: {
                        input: "neq",
                        output: "distance"
                    }
                }
            };
            const result = resolve(assessment);
            expect(result.calculation.rawResult).toBeCloseTo(Math.sqrt(2));
        });

        test("Test for one constant", () => {
            const assessment = {
                calculation: {
                    inputValue: 2,
                    resolvedExpression: "coefficient * sqrt(neq)",
                    parameters: {
                        input: "neq",
                        output: "distance",
                        coefficient: 1.73
                    }
                }
            };
            const result = resolve(assessment);
            expect(result.calculation.rawResult).toBeCloseTo(1.73 * Math.sqrt(2));
        });

        test("Test for three constants", () => {
            const assessment = {
                calculation: {
                    inputValue: 2,
                    resolvedExpression: "coefficient * pow(neq, exponent) + offset",
                    parameters: {
                        input: "neq",
                        output: "distance",
                        coefficient: 1.73,
                        exponent: 0.667,
                        offset: 91
                    }
                }
            };
            const result = resolve(assessment);
            expect(result.calculation.rawResult).toBeCloseTo(1.73 * Math.pow(2, 0.667) + 91);
        });

        test("Reverse input", () => {
            const assessment = {
                calculation: {
                    inputValue: 117,
                    resolvedExpression: "(distance - 91) / 2.687",
                    parameters: {
                        input: "distance",
                        output: "neq"
                    }
                }
            };
            const result = resolve(assessment);
            expect(result.calculation.rawResult).toBeCloseTo((117 - 91) / 2.687);
        });

        test("Future variable (i.e. pressure)", () => {
            const assessment = {
                calculation: {
                    inputValue: 1.5,
                    resolvedExpression: "(distance - 91) / (2.687 * pressure)",
                    parameters: {
                        input: "pressure",
                        output: "neq",
                        distance: 117
                    }
                }
            };
            const result = resolve(assessment);
            expect(result.calculation.rawResult).toBeCloseTo((117 - 91) / (2.687 * 1.5));
        });

    });

    describe("Validation", () => {
        test("Missing assessment", () => {
            expect(() => {resolve()}).toThrow(
                "formulaEvaluator requires an assessment."
            );
        });

        test("Missing calculation", () => {
            const assessment = {};
            expect(() => {resolve(assessment)}).toThrow(
                "formulaEvaluator requires assessment.calculation."
            );
        });

        test("Missing resolvedExpression", () => {
            const assessment = {
                calculation: {
                    inputValue: 100,
                    parameters: {
                        input: "neq",
                        output: "distance"
                    }
                }
            };
            expect(() => {resolve(assessment)}).toThrow(
                "formulaEvaluator requires calculation.resolvedExpression."
            );
        });

        test("Missing parameters", () => {
            const assessment = {
                calculation: {
                    inputValue: 100,
                    resolvedExpression: "coefficient * sqrt(neq)"
                }
            };
            expect(() => {resolve(assessment)}).toThrow(
                "formulaEvaluator requires calculation.parameters."
            );
        });
        
        test("Missing input parameter", () => {
            const assessment = {
                calculation: {
                    inputValue: 100,
                    resolvedExpression: "coefficient * sqrt(neq)",
                    parameters: {
                        output: "distance",
                        coefficient: 1.73
                    }
                }
            };
            expect(() => {resolve(assessment)}).toThrow(
                "formulaEvaluator requires calculation.parameters.input."
            );
        });

        test("Missing output parameter", () => {
            const assessment = {
                calculation: {
                    inputValue: 100,
                    resolvedExpression: "coefficient * sqrt(neq)",
                    parameters: {
                        input: "neq",
                        coefficient: 1.73
                    }
                }
            };
            expect(() => {resolve(assessment)}).toThrow(
                "formulaEvaluator requires calculation.parameters.output."
            );
        });
        
        test("Missing input value", () => {
            const assessment = {
                calculation: {
                    resolvedExpression: "coefficient * sqrt(neq)",
                    parameters: {
                        input: "neq",
                        output: "distance",
                        coefficient: 1.73
                    }
                }
            };
            expect(() => {resolve(assessment)}).toThrow(
                "formulaEvaluator requires calculation.inputValue."
            );
        });

    
    });

    describe("Error Handling", () => {
        test("Unknown variable", () => {
            const assessment = {
                calculation: {
                    inputValue: 100,
                    resolvedExpression: "coefficient * sqrt(neq) + unknownVariable",
                    parameters: {
                        input: "neq",
                        output: "distance",
                        coefficient: 1.73
                    }
                }
            };
            expect(() => {resolve(assessment)}).toThrow();
        });

        test("Unknown syntax", () => {
            const assessment = {
                calculation: {
                    inputValue: 100,
                    resolvedExpression: "sqrt(",
                    parameters: {
                        input: "neq",
                        output: "distance",
                        coefficient: 1.73
                    }
                }
            };
            expect(() => {resolve(assessment)}).toThrow();
        });

        test("Division by zero", () => {
            const assessment = {
                calculation: {
                    inputValue: 100,
                    resolvedExpression: "coefficient / 0",
                    parameters: {
                        input: "neq",
                        output: "distance",
                        coefficient: 1.73
                    }
                }
            };
            expect(() => {resolve(assessment)}).toThrow();
        });

        test("Invalid result (NaN)", () => {
            const assessment = {
                calculation: {
                    inputValue: -100,
                    resolvedExpression: "sqrt(-1)",
                    parameters: {
                        input: "neq",
                        output: "distance"
                    }
                }
            };
            expect(() => {resolve(assessment)}).toThrow();
        });

        test("Invalid result (Infinity)", () => {
            const assessment = {
                calculation: {
                    inputValue: 100,
                    resolvedExpression: "pow(10,1000)",
                    parameters: {
                        input: "neq",
                        output: "distance"
                    }
                }
            };
            expect(() => {resolve(assessment)}).toThrow();
        });    
    });
});