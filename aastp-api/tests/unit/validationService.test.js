//const validationService = require("@services/validationService");
import validationService from "#services/validationService";

const VALID_REQUEST = Object.freeze({
    pesType: "PES001",
    esType: "ES001",
    hazardId: "HD001",
    pesOrientation: "rear",
    esOrientation: "rear",
    neq: 1000
});

const createValidRequest = () => ({
    ...VALID_REQUEST
});

describe("ValidationService", () => {

    test("validate a correct request", () => {
        
        const request = createValidRequest();

        const result = validationService.validate(request);

        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
        expect(result.context).toBeDefined();
        expect(result.request).toEqual(request);

    });

    test("stress test multiple errors", () => {

        const request = createValidRequest();
        request.pesType = "";
        request.esType = 123;
        request.neq = -50;

        const result = validationService.validate(request);

        expect(result.valid).toBe(false);
        expect(result.errors).toHaveLength(3);
        expect(result).toHaveProperty("valid");
        expect(result).toHaveProperty("errors");
        expect(result).toHaveProperty("request");
        expect(result).toHaveProperty("context");

    })

    describe("Required Fields", () => {

        test("missing pesType", () => {
        
            const request = createValidRequest();
            delete request.pesType;

            const result = validationService.validate(request);

            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].code).toBe("RESOURCE_SELECTION_REQUIRED");

        });

        test("missing esType", () => {
        
            const request = createValidRequest();
            delete request.esType;

            const result = validationService.validate(request);

            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].code).toBe("RESOURCE_SELECTION_REQUIRED");

        });

        test("missing hazardId", () => {
        
            const request = createValidRequest();
            delete request.hazardId;

            const result = validationService.validate(request);

            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].code).toBe("MISSING_FIELD");

        });

        test("missing pesOrientation", () => {
        
            const request = createValidRequest();
            delete request.pesOrientation;

            const result = validationService.validate(request);

            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].code).toBe("MISSING_FIELD");

        });

        test("missing esOrientation", () => {
        
            const request = createValidRequest();
            delete request.esOrientation;

            const result = validationService.validate(request);

            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].code).toBe("MISSING_FIELD");

        });
    });

    describe("Field Types", () => {
        
        test("pesType must be a string", () =>{

            const request = createValidRequest();
            request.pesType = 1;

            const result = validationService.validate(request);

            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].code).toBe("INCORRECT_FIELD_TYPE");

        });

        test("esType must be a string", () =>{

            const request = createValidRequest();
            request.esType = 1;

            const result = validationService.validate(request);

            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].code).toBe("INCORRECT_FIELD_TYPE");

        });

        test("hazardId must be a string", () =>{

            const request = createValidRequest();
            request.hazardId = 1;

            const result = validationService.validate(request);

            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].code).toBe("INCORRECT_FIELD_TYPE");

        });

        test("pesOrientation must be a string", () =>{

            const request = createValidRequest();
            request.pesOrientation = 1;

            const result = validationService.validate(request);

            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].code).toBe("INCORRECT_FIELD_TYPE");

        });

        test("esOrientation must be a string", () =>{

            const request = createValidRequest();
            request.esOrientation = 1;

            const result = validationService.validate(request);

            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].code).toBe("INCORRECT_FIELD_TYPE");

        });

    });


    describe("Empty Strings", () => {

        test("pesType must not be empty", () =>{

            const request = createValidRequest();
            request.pesType = "";

            const result = validationService.validate(request);

            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].code).toBe("FIELD_EMPTY");

        });

        test("esType must not be empty", () =>{

            const request = createValidRequest();
            request.esType = "";

            const result = validationService.validate(request);

            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].code).toBe("FIELD_EMPTY");

        });

        test("hazardId must not be empty", () =>{

            const request = createValidRequest();
            request.hazardId = "";

            const result = validationService.validate(request);

            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].code).toBe("FIELD_EMPTY");

        });

        test("pesOrientation must not be empty", () =>{

            const request = createValidRequest();
            request.pesOrientation = "";

            const result = validationService.validate(request);

            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].code).toBe("FIELD_EMPTY");

        });

        test("esOrientation must not be empty", () =>{

            const request = createValidRequest();
            request.esOrientation = "";

            const result = validationService.validate(request);

            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].code).toBe("FIELD_EMPTY");

        });

    });

    describe("Assessment Model", () => {

        test("accepts NEQ", () =>{

            const request = createValidRequest();
            request.neq = 1000;

            const result = validationService.validate(request);

            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
            expect(result.context.resolvedEntities.mode).toBe("FORWARD");

        });

        test("accepts Distance", () =>{

            const request = createValidRequest();
            delete request.neq;
            request.distance = 1000;

            const result = validationService.validate(request);

            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
            expect(result.context.resolvedEntities.mode).toBe("REVERSE");

        });

        test("rejects both", () =>{

            const request = createValidRequest();
            request.neq = 1000;
            request.distance = 1000;

            const result = validationService.validate(request);

            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].code).toBe("BOTH_NEQ_AND_DISTANCE");

        });

        test("rejects neither", () =>{

            const request = createValidRequest();
            delete request.neq;

            const result = validationService.validate(request);

            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].code).toBe("NEQ_OR_DISTANE_REQUIRED");

        });

        test("NEQ must be numeric", () =>{

            const request = createValidRequest();
            request.neq = "banana";

            const result = validationService.validate(request);

            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].code).toBe("NEQ_NUMBER");

        });

        test("Distance must be numeric", () =>{

            const request = createValidRequest();
            request.distance = "banana";
            delete request.neq;

            const result = validationService.validate(request);

            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].code).toBe("DISTANCE_NUMBER");

        });

    });

    describe("Numeric Values", () => {

        test("NEQ > 0", () =>{

            const request = createValidRequest();
            request.neq = 0;

            const result = validationService.validate(request);

            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].code).toBe("NEQ_INVALID");

        });

        test("Distance > 0", () =>{

            const request = createValidRequest();
            request.distance = 0;
            delete request.neq;

            const result = validationService.validate(request);

            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].code).toBe("DISTANCE_INVALID");

        });

    });

    describe("Reference Resolution", () => {

        test("rejects unknown PES", () =>{

            const request = createValidRequest();
            request.pesType = "PES002";

            const result = validationService.validate(request);

            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].code).toBe("UNKNOWN_PES");

        });

        test("rejects unknown ES", () =>{

            const request = createValidRequest();
            request.esType = "ES002A";

            const result = validationService.validate(request);

            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].code).toBe("UNKNOWN_ES");

        });

        test("rejects unknown Hazard", () =>{

            const request = createValidRequest();
            request.hazardId = "HD000";

            const result = validationService.validate(request);

            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].code).toBe("UNKNOWN_HAZARD");

        });

    });

    describe("Orientation Resolution", () => {

        test("valid PES orientation accepted", () =>{

            const request = createValidRequest();
            request.pesOrientation = "front";

            const result = validationService.validate(request);

            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);

        });

        test("invalid PES orientation rejected", () =>{

            const request = createValidRequest();
            request.pesOrientation = "all";

            const result = validationService.validate(request);

            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].code).toBe("ORIENTATION_INVALID");

        });

        test("alternate structure PES orientation accepted", () =>{

            const request = createValidRequest();
            request.pesOrientation = "all";
            request.pesType = "PES002A"

            const result = validationService.validate(request);

            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);

        });

        test("alternate structure PES orientation rejected", () =>{

            const request = createValidRequest();
            //request.pesOrientation = "all";
            request.pesType = "PES002A"

            const result = validationService.validate(request);

            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].code).toBe("ORIENTATION_INVALID");

        });

        test("valid ES orientation accepted", () =>{

            const request = createValidRequest();
            request.esOrientation = "front";

            const result = validationService.validate(request);

            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);

        });

        test("invalid ES orientation rejected", () =>{

            const request = createValidRequest();
            request.esOrientation = "all";

            const result = validationService.validate(request);

            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].code).toBe("ORIENTATION_INVALID");

        });

        test("alternate structure ES orientation accepted", () =>{

            const request = createValidRequest();
            request.esOrientation = "all";
            request.esType = "ES004A"

            const result = validationService.validate(request);

            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);

        });

        test("alternate structure PES orientation rejected", () =>{

            const request = createValidRequest();
            request.esType = "ES004A"

            const result = validationService.validate(request);

            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].code).toBe("ORIENTATION_INVALID");

        });

    });

});
