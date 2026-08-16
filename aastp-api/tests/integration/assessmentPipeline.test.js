import validationService
    from "#services/validationService";

import interactionService
    from "#services/interactionService";

import * as engineeringService
    from "#services/engineeringService";


function processRequest(request) {

    const validationResult =
        validationService.validate(
            request
        );
    if (!validationResult.valid) {
        return {
            valid: false,
            request,
            context:
                validationResult.context,
            errors:
                validationResult.errors
        };
    }
    const context =
        validationResult.context;
    interactionService.process(
        context
    );
    engineeringService.process(
        context
    );
    return {
        valid: true,
        request,
        context,
        errors: []
    };
}


describe(
    "AASTP Assessment Pipeline",
    () => {

        /*
        ==============================================================
        1. Legacy Direct-ID Path
        ==============================================================
        */

        test(
            "processes a valid direct-ID request through the complete pipeline",
            () => {

                const request = {
                    pesType: "PES001",
                    esType: "ES001",
                    hazardId: "HD001",
                    pesOrientation: "rear",
                    esOrientation: "rear",
                    neq: 2000
                };
                const result = processRequest( request );
                expect( result.valid ).toBe(true);
                expect( result.context.resolvedEntities.pesType.id ).toBe("PES001");
                expect( result.context.resolvedEntities.esType.id ).toBe("ES001");
                expect( result.context.interaction ).toBeDefined();
                expect( result.context.assessments.length ).toBeGreaterThan(0);
            }
        );


        /*
        ==============================================================
        2. Exact Configuration Resolution
        ==============================================================
        */

        test(
            "processes configuration-based PES and ES exact matches",
            () => {

                const request = {

                    pes: {
                        structureId: "STR002",
                        construction: {
                            aperture: false,
                            barricaded: null,
                            roofType: "Protective"
                        }
                    },

                    es: {
                        structureId: "STR001",
                        construction: {
                            ecmProtectionRating: "PR003",
                            headwall: true,
                            barricaded: false,
                            roofType: null
                        }
                    },

                    /*
                     * Use orientation and hazard values that correspond
                     * to an actual interaction between the resolved
                     * resources.
                     *
                     * Populate these from the authoritative repository.
                     */
                    pesOrientation: "all",
                    esOrientation: "rear",
                    hazardId: "HD001",
                    neq: 2000
                };

                const result = processRequest( request );
                expect( result.valid ).toBe(true);
                expect( result.context.resolvedEntities.pesType.id ).toBe("PES002A");
                expect( result.context.resolvedEntities.esType.id ).toBe("ES003A");
                expect( result.context.resourceResolutions.pes.status ).toBe("exact_match");
                expect( result.context.resourceResolutions.es.status ).toBe("exact_match");
                expect( result.context.interaction ).toBeDefined();
            }
        );


        /*
        ==============================================================
        3. Governed Canonicalisation
        ==============================================================
        */

        test(
            "canonicalises an ES through RR001 before interaction resolution",
            () => {

                const request = {

                    pesType: "PES001",

                    es: {
                        structureId: "STR001",

                        construction: {
                            ecmProtectionRating: "PR003",
                            headwall: true,
                            barricaded: true,
                            roofType: null
                        }
                    },
                    pesOrientation: "rear",
                    esOrientation: "rear",
                    hazardId: "HD001",
                    neq: 2000
                };
                const result = processRequest( request );
                expect( result.valid ).toBe(true);
                expect( result.context.resolvedEntities.esType.id ).toBe("ES003A");
                expect( result.context.resourceResolutions.es.status ).toBe("canonicalised");
                expect( result.context.resourceResolutions.es.ruleId ).toBe("RR001");
                expect( result.context.interaction ).toBeDefined();
                expect( result.context.assessments.length ).toBeGreaterThan(0);
            }
        );


        /*
        ==============================================================
        4. Validation Stops Invalid Resource Configuration
        ==============================================================
        */

        test(
            "stops an unresolved resource configuration before engineering assessment",
            () => {

                const request = {

                    pesType: "PES001",

                    es: {
                        structureId: "STR001",

                        construction: {
                            ecmProtectionRating: "PR003",
                            headwall: false,
                            barricaded: true,
                            roofType: "Protective"
                        }
                    },

                    pesOrientation: "rear",
                    esOrientation: "rear",
                    hazardId: "HD001",
                    neq: 2000
                };


                const result =
                    processRequest(
                        request
                    );


                expect(
                    result.valid
                ).toBe(false);

                expect(
                    result.errors.length
                ).toBeGreaterThan(0);

                expect(
                    result.context.interaction
                ).toBeNull();

                expect(
                    result.context.assessments
                ).toHaveLength(0);

            }
        );


        /*
        ==============================================================
        5. Reverse Calculation
        ==============================================================
        */

        test(
            "processes a reverse calculation through the complete pipeline",
            () => {

                const request = {
                    pesType: "PES001",
                    esType: "ES001",
                    hazardId: "HD001",
                    pesOrientation: "rear",
                    esOrientation: "rear",
                    distance: 35
                };


                const result =
                    processRequest(
                        request
                    );


                expect(
                    result.valid
                ).toBe(true);

                expect(
                    result.context.resolvedEntities.mode
                ).toBe("REVERSE");

                expect(
                    result.context.assessments.length
                ).toBeGreaterThan(0);

                const assessment =
                    result.context.assessments[0];

                expect(
                    assessment.calculation
                ).toBeDefined();

                expect(
                    assessment.calculation.rawResult
                ).toBeDefined();

                expect(
                    assessment.calculation.transformedResult
                ).toBeDefined();

            }
        );


        /*
        ==============================================================
        6. Request Immutability
        ==============================================================
        */

        test(
            "does not modify the original request during resource resolution or assessment",
            () => {

                const request = {

                    pesType: "PES001",

                    es: {
                        structureId: "STR001",

                        construction: {
                            ecmProtectionRating: "PR003",
                            headwall: true,
                            barricaded: true,
                            roofType: null
                        }
                    },

                    pesOrientation: "rear",
                    esOrientation: "rear",
                    hazardId: "HD001",
                    neq: 2000
                };


                const original =
                    structuredClone(
                        request
                    );


                const result =
                    processRequest(
                        request
                    );


                expect(
                    result.valid
                ).toBe(true);

                expect(
                    request
                ).toEqual(
                    original
                );

            }
        );

    }
);