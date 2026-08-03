//const interactionService = require("@services/interactionService");
import interactionService from "#services/interactionService";


describe("InteractionService", () => {


    function createValidContext() {
        return {
            request: {
                pesOrientation: "rear",
                esOrientation: "rear"
            },

            resolvedEntities: {
                pesType: {
                    id: "PES001"
                },
                esType: {
                    id: "ES001"
                }
            },
            interaction: null

        };

    }


    test("resolves correct interaction for PES, ES and orientation", () => {

        const context = createValidContext();


        const result =
            interactionService.process(context);


        expect(result.interaction).toBeDefined();

        expect(result.interaction.id)
            .toBe("INT001");


    });


    test("resolves correct interaction for a orientation", () => {

        const context = createValidContext();


        context.request.pesOrientation = "front";

        const result = interactionService.process(context);


        expect(result.interaction.id).toBe("INT003");


    });


    test("rejects unknown PES and ES combination", () => {

        const context = createValidContext();


        context.resolvedEntities.pesType.id =
            "UNKNOWN";


        expect(() => {

            interactionService.process(context);

        })
        .toThrow();


    });

    test("resolves correct interaction for a orientation", () => {

        const context = createValidContext();


        context.request.pesOrientation = "any";

        expect(() => {

            interactionService.process(context);

        })
        .toThrow();


    });


});