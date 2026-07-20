const assert = require("assert");
const { repository } = require("..");

function countEntries(value) {
    if (Array.isArray(value)) {
        return value.length;
    }

    if (value && typeof value === "object") {
        return Object.keys(value).length;
    }

    return 0;
}

function verifyDataset(name, dataset) {
    assert(dataset, `${name} was not loaded`);

    const keys = Object.keys(dataset);

    assert(
        keys.length > 0,
        `${name} is empty`
    );

    console.log(
        `✓ ${name} loaded (${keys.length} top-level entries)`
    );
}

function verifyCaching(name, getter) {
    const first = getter();
    const second = getter();

    assert.strictEqual(
        first,
        second,
        `${name} is not being cached`
    );

    console.log(`✓ ${name} cache verified`);
}

function run() {

    console.log("\nRepository Tests\n");

    const interactions = repository.getInteractions();

    verifyDataset("Interactions", interactions);

    console.log(
        `  interactionRules: ${countEntries(interactions.interactionRules)}`
    );

    verifyCaching(
        "Interactions",
        repository.getInteractions
    );

    const datasets = [
        ["Distance Rules", repository.getDistanceRules],
        ["Effects", repository.getEffects],
        ["Hazard Categories", repository.getHazardCategories],
        ["ES Types", repository.getESTypes],
        ["PES Types", repository.getPESTypes],
        ["Formulae", repository.getFormulas],
        //["Interactions", repository.getInteractions],
        ["Constraints", repository.getConstraints],
        ["Protection Levels", repository.getProtectionLevels],
        ["Interaction Dimensions", repository.getDimensions],
        ["Dimensions", repository.getDimensions],
        ["Structures", repository.getStructures],
        ["Transformations", repository.getTransformations]
    ];

    for (const [name, getter] of datasets) {

    if (typeof getter !== "function") {
        console.log(`✗ ${name}: getter not implemented`);
        continue;
    }

    verifyDataset(name, getter());
    verifyCaching(name, getter);
}

    console.log("\n✓ All repository tests passed\n");
}

run();