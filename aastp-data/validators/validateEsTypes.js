const { loadRepository } = require("./utils/loadRepository");
const { buildIdMap } = require("./utils/buildIdMap");
const { validateUniqueIds } = require("./utils/validateUniqueIds")


function validateEsTypes(repository = loadRepository()) {

    const errors = [];
    const warnings = [];

    const{
        esTypes,
        structures
    } = repository;
    const structureMap = buildIdMap(structures.structures, "structures");

    // Confirm that esTypes has a valid structure with schema and metadata attached.
    validateDataset(esTypes, errors);

    // Confirm that all IDs used withn esTypes are unique
    validateUniqueIds(
        esTypes.es_types,
        errors,
        "ES Type"
    )

    for (const es of esTypes.es_types) {
        const structure = structureMap.get(es.structure);
    
        // Validate that the structure exists
        if (!structure) {
            errors.push(`${es.id}: Unknown structure ${es.structure}`);
            continue;
         }

        const supportsConstruction = structure.supportedProperties !== false;
        const supportsExposure = structure.supportedExposure !== false;


        // Validate for structures that do not support construction, the construction property must be null
        if (!supportsConstruction && es.construction !== null) {
            errors.push(`${es.id}: construction must be null for ${structure.id}`);
        }
    

        // Validate for structures that do not support exposure, the exposure property must be null
        if (!supportsExposure && es.exposure !== null) {
            errors.push(`${es.id}: exposure must be null for ${structure.id}`);
        }

        // Validate that all properties in construction are supported by the structure
        if (supportsConstruction && es.construction) {
            for (const [property, value] of Object.entries(es.construction)) {
                if (!isValueDefined(value)) {
                    continue;
                }
                if (!structure.supportedProperties[property]) {
                    errors.push(`${es.id}: ${property} is populated but not supported by ${structure.id}`);
                }
            }
        }

        if (supportsExposure && es.exposure) {
            for (const [property, value] of Object.entries(es.exposure)) {
                if (!isValueDefined(value)) {
                    continue;
                }
                if (!structure.supportedExposure[property]) {
                    errors.push(`${es.id}: exposure.${property} is populated but not supported by ${structure.id}`);
                }
            }       
        }

    // Additional validation rules here
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}
    

function isValueDefined(value) {
    return value !== null && value !== undefined;
}

function validateDataset(esTypes, errors) {
    if (!esTypes.schemaVersion) {
        errors.push(
            "Missing schemaVersion"
        );
    }
    if (!esTypes.metadata) {
        errors.push(
            "Missing metadata"
        );
    }
    if (!Array.isArray(esTypes.es_types)) {
        errors.push(
            "es_types must be an array"
        );
        return;
    }
    if (esTypes.es_types.length === 0) {
        errors.push(
            "es_types array cannot be empty"
        );
    }
}


const result = validateEsTypes();


if (result.valid) {
    console.log(
        "✓ ES Type validation passed"
    );

} else {
    console.error(
        "✗ ES Type validation failed"
    );
    result.errors.forEach(
        error => console.error(` - ${error}`)
    );
    process.exit(1);
}