const validationService =
    require("../src/services/validationService");

const assessmentResolver =
    require("../src/services/assessmentResolver");

const request = {

    // Required request fields

    pesType: "PES001",
    esType: "ES001",

    hazardId: "HD001",
    effectId: "EFF001",

    pesOrientation: "rear",
    esOrientation: "rear",

    // Assessment input
    neq: 1000

};

console.log("========================================");
console.log(" Assessment Resolver Test");
console.log("========================================");

try {

    //--------------------------------------------------
    // Validate request
    //--------------------------------------------------

    const {
        request: validatedRequest,
        context
    } = validationService.validate(request);

    console.log("✓ Validation succeeded");

    //--------------------------------------------------
    // Resolve assessment
    //--------------------------------------------------
 
    assessmentResolver.resolve(
        validatedRequest,
        context
    );

    console.log("✓ Assessment resolution succeeded\n");

    //--------------------------------------------------
    // Display resolved context
    //--------------------------------------------------

    console.log(JSON.stringify(context, null, 4));

}
catch (err) {

    console.log("✗ Assessment resolution failed\n");

    console.error(err);

}