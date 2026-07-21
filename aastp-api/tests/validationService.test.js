const validationService = require("../src/services/validationService");

const request = {

    pesType: "PES002A",
    esType: "ES001",

    hazardId: "HD001",
    effectId: "EFF001",

    neq: 1000,

    pesOrientation: "all",
    esOrientation: "front"

};

console.log("========================================");
console.log(" Validation Service Test");
console.log("========================================");

try {

    const result = validationService.validate(request);

    console.log("✓ Validation succeeded\n");

    //console.log(JSON.stringify(result, null, 4));

}
catch (err) {

    console.log("✗ Validation failed\n");

    console.error(err.message);

}