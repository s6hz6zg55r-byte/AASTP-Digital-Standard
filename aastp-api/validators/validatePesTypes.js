const { loadRepository } = require("./utils/loadRepository");
const { buildIdMap } = require("./utils/buildIdMap");
const { validateUniqueIds } = require("./utils/validateUniqueIds")

function validatePesTypes(repository = loadRepository()) {
    const errors = [];
    const warnings = [];
    const seenIds = new Set();
    const{
        pesTypes,
        structures
    } = repository;
    const structureMap = buildIdMap(
        structures.structures,
        "structures"
    );



    validateDataset(pesTypes, errors);
    validateUniqueIds(
        pesTypes.pes_types,
        errors,
        "PES Type"
    );

    for (const pes of pesTypes.pes_types) {

        const structure = structureMap.get(pes.structure);

        // Validate that the structure exists
        if (!structure) {
            errors.push(
                `${pes.id}: Unknown structure ${pes.structure}`
            );
            continue;
        }
        
        const supportsConstruction = structure.supportedProperties !== false;
        // Validate for structures that do not support construction, the construction property must be null
        if (!supportsConstruction && es.construction !== null) {
            errors.push(`${pes.id}: construction must be null for ${structure.id}`);
        }

    // Identify any duplicate PES IDs
    //if (seenIds.has(pes.id)) {
    //    errors.push(
    //        `${pes.id}: Duplicate PES id`
    //    );
    //}

        seenIds.add(pes.id);


        // Validate that all populated construction properties
        // are supported by the structure
        if (supportsConstruction && pes.construction) {
            for (const [property, value] of Object.entries(
                pes.construction
            )) {
                if (!isValueDefined(value)) {
                    continue;
                }

            if (!structure.supportedProperties[property]) {

                errors.push(
                    `${pes.id}: construction.${property} is populated but not supported by ${structure.id}`
                );
            }
        }
    }
}


    return{
        valid: errors.length === 0,
        errors,
        warnings
    };

}

function validateDataset(pesTypes, errors) {
    if (!pesTypes.schemaVersion) {
        errors.push(
            "Missing schemaVersion"
        );
    }
    if (!pesTypes.metadata) {
        errors.push(
            "Missing metadata"
        );
    }
    if (!Array.isArray(pesTypes.pes_types)) {
        errors.push(
            "pes_types must be an array"
        );
        return;
    }
    if (pesTypes.pes_types.length === 0) {
        errors.push(
            "pes_types array cannot be empty"
        );
    }
}

function isValueDefined(value) {
    return value !== null && value !== undefined;
}

const result = validatePesTypes();

if (result.valid) {
    console.log(
        "✓ PES Type validation passed"
    );

} else {
    console.error(
        "✗ PES Type validation failed"
    );
    result.errors.forEach(
        error => console.error(` - ${error}`)
    );
    process.exit(1);
}