const validationService = require("../src/services/validationService");
const assessmentResolver = require("../src/services/assessmentResolver");

describe("Assessment Resolver", () => {

    /**
     * Verifies that a resolved branch has the expected structure.
     * This helper keeps the individual tests concise and provides
     * a single place to update if the AssessmentContext evolves.
     */
    function expectResolvedBranch(branch) {

        expect(branch).toBeDefined();

        expect(branch.id).toBeDefined();

        expect(branch.formula).toBeDefined();
        expect(branch.formula.id).toBeDefined();

        expect(branch.expression).toBeDefined();
        expect(branch.expression.forward).toBeDefined();
        expect(branch.expression.reverse).toBeDefined();

        expect(branch.parameters).toBeDefined();

        expect(branch.transformations).toBeDefined();

        expect(branch.traceability).toBeDefined();

    }

    /**
     * Returns a valid request that should resolve successfully.
     *
     * Update these values to match your current demonstration
     * dataset.
     */
    function createValidRequest() {

        return {

            pesType: "PES001",
            pesOrientation: "rear",
            
            esType: "ES001",
            esOrientation: "rear",
            
            hazardId: "HD001",

            neq: 250,

        };

    }

    describe("Validation", () => {

        test("accepts a valid request", () => {

            const request = createValidRequest();

            expect(() =>
                assessmentResolver.resolve(request)
            ).not.toThrow();

        });

        test("returns a populated assessment context", () => {

            const context =
                assessmentResolver.resolve(
                    createValidRequest()
                );

            expect(context).toBeDefined();

            expect(context.request).toBeDefined();

        });

    });

    describe("Interaction Resolution", () => {

        test("resolves an interaction", () => {

            const context =
                assessmentResolver.resolve(
                    createValidRequest()
                );

            expect(context.interaction)
                .toBeDefined();

        });

    });

    describe("Distance Rule Resolution", () => {

        test("resolves a distance rule", () => {

            const context =
                assessmentResolver.resolve(
                    createValidRequest()
                );

            expect(context.distanceRule)
                .toBeDefined();

            expect(context.distanceRule.distanceRuleId)
                .toBeDefined();

        });

    });

    describe("Branch Resolution", () => {

        test("resolves a complete executable branch", () => {

            const context =
                assessmentResolver.resolve(
                    createValidRequest()
                );

            expectResolvedBranch(
                context.branch
            );

        });

        test("resolves the expected formula", () => {

            const context =
                assessmentResolver.resolve(
                    createValidRequest()
                );

            expect(context.branch.formula.id)
                .toBe("FORM001");

        });

        test("builds executable expressions", () => {

            const context =
                assessmentResolver.resolve(
                    createValidRequest()
                );

            expect(context.branch.expression.forward)
                .toBeDefined();

            expect(context.branch.expression.reverse)
                .toBeDefined();

        });

    });

    describe("Failure Cases", () => {

        test("throws when no matching branch exists", () => {

            const request = createValidRequest();

            request.neq = 999999999;

            expect(() =>
                assessmentResolver.resolve(request)
            ).toThrow();

        });

        test("throws when an invalid PES type is supplied", () => {

            const request = createValidRequest();

            request.pesType = "INVALID";

            expect(() =>
                assessmentResolver.resolve(request)
            ).toThrow();

        });

        test("throws when an invalid ES type is supplied", () => {

            const request = createValidRequest();

            request.esType = "INVALID";

            expect(() =>
                assessmentResolver.resolve(request)
            ).toThrow();

        });

    });

    describe("FORM005", () => {

        /**
         * Replace the request below with one that
         * intentionally selects a FORM005 branch.
         */
        test.skip("uses branch expressions when FORM005 is selected", () => {

            const request = createValidRequest();

            const context =
                assessmentResolver.resolve(request);

            expect(context.branch.formula.id)
                .toBe("FORM005");

            expect(context.branch.expression.forward)
                .toBe(
                    context.branch.parameters.forwardExpression
                );

            expect(context.branch.expression.reverse)
                .toBe(
                    context.branch.parameters.reverseExpression
                );

        });

    });

});