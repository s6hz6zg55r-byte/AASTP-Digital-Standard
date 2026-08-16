import { resolve } from "#resolvers/resourceResolver";


/*
==============================================================================
Test Fixtures
==============================================================================
*/

const createContext = (overrides = {}) => ({
    request: {
        pesType: "PES001",
        esType: "ES001",
        ...overrides
    },
    resolvedEntities: {},
    resourceResolutions: {
        pes: null,
        es: null
    }
});

const createValidationResult = () => ({
    valid: true,
    errors: []
});

/*
==============================================================================
Resource Resolver
==============================================================================
*/

describe("ResourceResolver", () => {

    /*
    --------------------------------------------------------------------------
    Direct-ID Resolution
    --------------------------------------------------------------------------
    */

    describe("Direct-ID Resolution", () => {

        test("resolves direct PES and ES IDs", () => {

            const context =
                createContext();

            const validationResult =
                createValidationResult();


            resolve(
                context,
                validationResult
            );


            expect(
                validationResult.errors
            ).toHaveLength(0);

            expect(
                context.resolvedEntities.pesType
            ).toBeDefined();

            expect(
                context.resolvedEntities.esType
            ).toBeDefined();

            expect(
                context.resolvedEntities.pesType.id
            ).toBe("PES001");

            expect(
                context.resolvedEntities.esType.id
            ).toBe("ES001");

        });


        test("records direct-ID resolution evidence", () => {

            const context =
                createContext();

            const validationResult =
                createValidationResult();


            resolve(
                context,
                validationResult
            );


            expect(
                context.resourceResolutions.pes
            ).toEqual({
                status: "exact_match",
                resourceId: "PES001"
            });

            expect(
                context.resourceResolutions.es
            ).toEqual({
                status: "exact_match",
                resourceId: "ES001"
            });

        });

    });


    /*
    --------------------------------------------------------------------------
    Invalid Direct IDs
    --------------------------------------------------------------------------
    */

    describe("Invalid Direct IDs", () => {

        test("rejects unknown PES ID", () => {

            const context =
                createContext({
                    pesType: "PES999"
                });

            const validationResult =
                createValidationResult();


            resolve(
                context,
                validationResult
            );


            expect(
                validationResult.errors
            ).toHaveLength(1);

            expect(
                validationResult.errors[0].code
            ).toBe("UNKNOWN_PES");

        });


        test("rejects unknown ES ID", () => {

            const context =
                createContext({
                    esType: "ES999"
                });

            const validationResult =
                createValidationResult();


            resolve(
                context,
                validationResult
            );


            expect(
                validationResult.errors
            ).toHaveLength(1);

            expect(
                validationResult.errors[0].code
            ).toBe("UNKNOWN_ES");

        });

    });


    /*
    --------------------------------------------------------------------------
    Configuration Resolution
    --------------------------------------------------------------------------

    Add the exact PES/ES configurations once R2/R3 are implemented.

    The values below MUST be replaced with configurations taken directly
    from the authoritative PES/ES datasets. Do not invent engineering values.
    --------------------------------------------------------------------------
    */

    describe("Configuration Resolution", () => {

        test(
        "resolves a valid PES configuration to an exact authoritative resource",
            () => {
                const context =
                    createContext({
                        pesType: undefined,
                        pes: {
                            structureId: "STR002",
                            construction: {
                                aperture: false,
                                barricaded: null,
                                roofType: "Protective"
                            }
                        }
                    });
                const validationResult =
                createValidationResult();
                resolve(
                    context,
                    validationResult
                );
            expect(validationResult.errors).toHaveLength(0);
            expect(context.resolvedEntities.pesType.id).toBe("PES002A");
            expect(context.resourceResolutions.pes).toEqual({
                status: "exact_match",
                resourceId: "PES002A"
            });
        });

        test("resolves a valid ES configuration to an exact authoritative resource",
            () => {const context =
                createContext({
                    esType: undefined,
                    es: {
                        structureId: "STR001",
                        construction: {
                            ecmProtectionRating: "PR003",
                            headwall: true,
                            barricaded: false,
                            roofType: null
                        }
                    }
                });
            const validationResult = createValidationResult();
            resolve(context, validationResult);
            expect(validationResult.errors).toHaveLength(0);
            expect(context.resolvedEntities.esType.id).toBe("ES003A");
            expect(context.resourceResolutions.es).toEqual({
                status: "exact_match",
                resourceId: "ES003A"
            });
        });

        test("supports configured PES with direct-ID ES",
            () => {const context =
            createContext({
                pesType: undefined,
                pes: {
                    structureId: "STR002",
                    construction: {
                        aperture: false,
                        barricaded: null,
                        roofType: "Protective"
                    }
                },
                esType: "ES001"
            });
            const validationResult = createValidationResult();
            resolve(context, validationResult);
            expect(validationResult.errors).toHaveLength(0);
            expect(context.resolvedEntities.pesType.id).toBe("PES002A");
            expect(context.resolvedEntities.esType.id).toBe("ES001");
            }
        );

        test("supports direct-ID PES with configured ES",
            () => {const context =
                createContext({
                    pesType: "PES001",
                    esType: undefined,
                    es: {
                        structureId: "STR001",
                        construction: {
                            ecmProtectionRating: "PR003",
                            headwall: true,
                            barricaded: false,
                            roofType: null
                        }
                    }
                });
            const validationResult = createValidationResult();
            resolve(context, validationResult);
            expect(validationResult.errors).toHaveLength(0);
            expect(context.resolvedEntities.pesType.id).toBe("PES001");
            expect(context.resolvedEntities.esType.id).toBe("ES003A");
            }
        );

        test("canonicalises an unresolved ES configuration using RR001",
            () => {const context =
                createContext({
                    esType: undefined,
                    es: {
                        structureId: "STR001",
                        construction: {
                            ecmProtectionRating: "PR003",
                            headwall: true,
                            barricaded: true,
                            roofType: null
                        }
                    }
                });
            const validationResult = createValidationResult();
            resolve( context, validationResult );
            expect( validationResult.errors ).toHaveLength(0);
            expect( context.resolvedEntities.esType.id ).toBe("ES003A");
            expect( context.resourceResolutions.es.status ).toBe("canonicalised");
            expect( context.resourceResolutions.es.ruleId ).toBe("RR001");
            expect( context.resourceResolutions.es.canonicalTargetId ).toBe("ES003A");
            expect( context.resourceResolutions.es.assignments ).toEqual([
                {
                    property: "construction.barricaded",
                    from: true,
                    to: false
                }
            ]);

            }
        );

        test("canonicalises an unresolved ES configuration using RR002",
            () => {const context =
                createContext({
                    esType: undefined,
                    es: {
                        structureId: "STR005",
                        construction: {
                            ecmProtectionRating: null,
                            headwall: null,
                            barricaded: false,
                            roofType: "Protective"
                        }
                    }
                });
            const validationResult = createValidationResult();
            resolve( context, validationResult );
            expect( validationResult.errors ).toHaveLength(0);
            expect( context.resolvedEntities.esType.id ).toBe("ES007C");
            expect( context.resourceResolutions.es.status ).toBe("canonicalised");
            expect( context.resourceResolutions.es.ruleId ).toBe("RR002");
            expect( context.resourceResolutions.es.canonicalTargetId ).toBe("ES007C");
            expect( context.resourceResolutions.es.assignments ).toEqual([{
                property: "construction.roofType",
                from: "Protective",
                to: null
            }]);
            }
        );

        test( "canonicalises an unresolved ES configuration using RR003 nested any condition",
            () => {const context =
                createContext({
                    esType: undefined,
                    es: {
                        structureId: "STR011",
                        construction: {
                            ecmProtectionRating: null,
                            headwall: null,
                            barricaded: null,
                            roofType: "Protective"
                        },
                        exposure: {
                            category: "criticality",
                            level: "high"
                        }
                    }
                });
            const validationResult = createValidationResult();
            resolve( context, validationResult );
            expect( validationResult.errors ).toHaveLength(0);
            expect( context.resolvedEntities.esType.id ).toBe("ES013A");
            expect( context.resourceResolutions.es.status ).toBe("canonicalised");
            expect( context.resourceResolutions.es.ruleId ).toBe("RR003");
            expect( context.resourceResolutions.es.canonicalTargetId ).toBe("ES013A");
            expect( context.resourceResolutions.es.assignments ).toEqual([
                {
                    property: "exposure.category",
                    from: "criticality",
                    to: false
                },
                {
                    property: "exposure.level",
                    from: "high",
                    to: false
                }
            ]);
            }
        );
    }
);


    /*
    --------------------------------------------------------------------------
    Resolver Preconditions
    --------------------------------------------------------------------------
    */

    describe("Resolver Preconditions", () => {

        test("rejects missing context", () => {

            const validationResult =
                createValidationResult();


            expect(() => {

                resolve(
                    null,
                    validationResult
                );

            }).toThrow(
                "resourceResolver requires a context."
            );

        });


        test("rejects missing request", () => {

            const context = {
                resolvedEntities: {}
            };

            const validationResult =
                createValidationResult();


            expect(() => {

                resolve(
                    context,
                    validationResult
                );

            }).toThrow(
                "resourceResolver requires context.request."
            );

        });


        test("rejects missing resolvedEntities", () => {

            const context = {
                request: {}
            };

            const validationResult =
                createValidationResult();


            expect(() => {

                resolve(
                    context,
                    validationResult
                );

            }).toThrow(
                "resourceResolver requires context.resolvedEntities."
            );

        });


        test("rejects invalid validation result", () => {

            const context =
                createContext();


            expect(() => {

                resolve(
                    context,
                    null
                );

            }).toThrow(
                "resourceResolver requires a validation result."
            );

        });

    });

});