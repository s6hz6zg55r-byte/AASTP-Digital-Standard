const { loadRepository } = require("../utils/loadRepository");

function validateInteractionCoverage(repository = loadRepository()) { 
    // Load JSON data
    const {
        pesTypes,
        esTypes,
        interactions,
        structures,
        interactionDimensions
    } = repository;
    
    const errors = [];
    const warnings = []; 

    const lookup = loadLookupMaps(structures, interactionDimensions);
    const structureMap = lookup.structureMap;
    const orientationTypeMap = lookup.orientationTypeMap;
    const expectedSignatures = buildExpectedSignatures(
        structureMap,
        orientationTypeMap,
        pesTypes,
        esTypes
    );
    
    const actual = buildActualSignatures(interactions);
    const actualSignatures = actual.signatures;
    const duplicateCheck = actual.duplicates;
    errors.push(...actual.errors);

    const missing = missingSignatures(expectedSignatures, actualSignatures);
    const unexpected = unexpectedSignatures(expectedSignatures, actualSignatures);

    const stats = buildStats(
        expectedSignatures,
        actualSignatures,
        duplicateCheck,
        missing,
        unexpected
    );
    
    return {
        valid: errors.length === 0,
        errors,
        warnings,
        missing,
        unexpected,
        stats
    };

}


function loadLookupMaps(structures, dimensions) {

    const structureMap = new Map(
        structures.structures.map(s => [s.id,s])
    );

    const orientationTypeMap = new Map(
        dimensions.orientation_types.map(o => [o.id, o])
    );

    return{
        structureMap,
        orientationTypeMap
    };
}

function buildExpectedSignatures(structureMap, orientationTypeMap, pesTypes, esTypes) {
    const signatures = new Set();
    for (const pes of pesTypes.pes_types) {
        const pesOrientations =
            getOrientations(pes.structure, structureMap, orientationTypeMap);

        for (const es of esTypes.es_types) {
            const esOrientations =
                getOrientations(es.structure, structureMap, orientationTypeMap);

            for (const pesOrientation of pesOrientations) {

                for (const esOrientation of esOrientations) {

                    const signature = [
                        pes.id,
                        es.id,
                        pesOrientation,
                        esOrientation
                        ].join("|");

                    signatures.add(signature);
                }
            }
        }
        
    }
    return (signatures);
}

function buildActualSignatures(interactions) {
    const signatures = new Set();
    const duplicates = new Map();
    const errors = [];

    for (const rule of interactions.interaction_rules) {
        const signature = [
            rule.conditions.pesType,
            rule.conditions.esType,
            rule.conditions.orientation.pes,
            rule.conditions.orientation.es
            ].join("|");

        signatures.add(signature);

    // Duplicate detection

        if (duplicates.has(signature)) {

            errors.push(
                `Duplicate interaction signature:\n` +
                `  ${signature}\n` +
                `  Existing: ${duplicates.get(signature)}\n` +
                `  Duplicate: ${rule.id}`
            );

        } else {

            duplicates.set(
                signature,
                rule.id
            );
        }
    }
    return {
        signatures,
        duplicates,
        errors
    };    
}

function getOrientations(
    structureId,
    structureMap,
    orientationTypeMap
) {
    const structure = structureMap.get(structureId);

    if (!structure) {
        return [];
    }

    const orientationType = orientationTypeMap.get(structure.orientationType);

    if (!orientationType) {
        return [];
    }

    return orientationType.values;
}

function missingSignatures(expected, actual) {
    const missing = [];

    for (const signature of expected) {
        if (!actual.has(signature)) {
            missing.push(signature);
        }
    }
    return (missing);
}

function unexpectedSignatures(expected, actual) {
    const unexpected = [];
    for (const signature of actual) {
        if (!expected.has(signature)) {
            unexpected.push(signature);
        }
    }
    return (unexpected);
}

function buildStats(expectedSignatures, actualSignatures, duplicateCheck, missing, unexpected) {
    const stats = {
        expected: expectedSignatures.size,
        actual: actualSignatures.size,
        duplicates: duplicateCheck.size,
        missing: missing.length,
        unexpected: unexpected.length
    };
    return (stats); 
}

const result = validateInteractionCoverage();

// -------------------------
// Output
// -------------------------

if (result.errors.length > 0) {

    console.error(
        "\nDuplicate interaction errors:\n"
    );

    result.errors.forEach(error =>
        console.error(error + "\n")
    );

    process.exit(1);
}

if (result.missing.length > 0) {

    console.error(
        "\nMissing interaction definitions:\n"
    );

    result.missing.forEach(signature =>
        console.error(signature)
    );

    process.exit(1);
}

if (result.unexpected.length > 0) {

    console.error(
        "\nUnexpected interaction definitions:\n"
    );

    result.unexpected.forEach(signature =>
        console.error(signature)
    );

    process.exit(1);
}

console.log(
    `Expected signatures: ${result.stats.expected}`
);

console.log(
    `Actual signatures: ${result.stats.actual}`
);

console.log(
    `✓ Coverage validation passed`
);

console.log(
    `${result.duplicateCheck.size} unique interaction signatures found`
);