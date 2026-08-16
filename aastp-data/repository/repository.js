import loadJson from "./loadJson.js";

const cache = {};

const DATASETS = {
    constraints: {
        file: "constraints.json",
        collection: "constraints"
    },
    distanceRules: {
        file: "distanceRules.json",
        collection: "distance_rules"
    },
    ecmProtectionRatings: {
        file: "ecmProtectionRatings.json",
        collection: "ecm_protection_ratings"
    },
    effects: {
        file: "effects.json",
        collection: "effects"
    },
    esTypes: {
        file: "esTypes.json",
        collection: "es_types"
    },
    formulas: {
        file: "formulas.json",
        collection: "formulas"
    },
    hazardCategories: {
        file: "hazardCategories.json",
        collection: "hazard_divisions"
    },
    orientationTypes: {
        file: "orientationTypes.json",
        collection: "orientation_types"
    },
    interactions: {
        file: "interactions.json",
        collection: "interaction_rules"
    },
    pesTypes: {
        file: "pesTypes.json",
        collection: "pes_types"
    },
    protectionLevels: {
        file: "protectionLevels.json",
        collection: "protection_levels"
    },
    resourcePropertySemantics: {
        file: "resourcePropertySemantics.json",
        collection: "property_semantics"
    },
    resourceResolutionRules: {
        file: "resourceResolutionRules.json",
        collection: "rules"
    },
    structures: {
        file: "structures.json",
        collection: "structures"
    },
    transformations: {
        file: "transformations.json",
        collection: "transformations"
    }
    
};

//This function loads a dataset
function getDataset(name) {

    const config = DATASETS[name];

    if(!config) {
        throw new Error(`Unknown dataset '${name}'`);
    }

    if (!cache[name]) {
        cache[name] = loadJson(config.file);
    }
    return cache[name];
}

//This function returns repository metadata
function getMetadata(name) {

    const dataset = getDataset(name);

    return dataset.metadata;

}

//This function returns a collection
function getCollection(name) {

    const config = DATASETS[name];

    const dataset = getDataset(name);

    return dataset[config.collection];
}

//This function finds an item by ID
function findById(datasetName, id) {
    
    const config = DATASETS[datasetName];
    if (!config) {
        throw new Error(`Unknown dataset '${datasetName}'`);
    }

    const dataset = getDataset(datasetName);

    const collection = dataset[config.collection];

    if (!Array.isArray(collection)) {
        return null;
    }

    return collection.find(item => item.id === id) || null;
}

//This function performs a generic search
function find(datasetName, predicate) {
    const collection = getCollection(datasetName);

    const items = Array.isArray(collection)
        ? collection
        : Object.values(collection);

    return items.find(predicate) ?? null;
}

//This function performs complex repository queries
function findInteraction(criteria) {

    return find(
        "interactions",
        interaction =>
            interaction.conditions.pesType === criteria.pesType &&
            interaction.conditions.esType === criteria.esType &&
            interaction.conditions.orientation.pes === criteria.pesOrientation &&
            interaction.conditions.orientation.es === criteria.esOrientation
    );
}

function getAvailableDatasets() {
    return Object.keys(DATASETS);
}

function get(name) {

    return getDataset(name);
}

export default  {
    getDistanceRules() {
        return get("distanceRules");
    },

    getEffects() {
        return get("effects");
    },

    getHazardCategories() {
        return get("hazardCategories");
    },

    getFormulas() {
        return get("formulas");
    },

    getInteractions() {
        return get("interactions");
    },

    getConstraints() {
        return get("constraints");
    },

    getProtectionLevels() {
        return get("protectionLevels");
    },

    getOrientationTypes() {
        return get("orientationTypes");
    },

    getStructures() {
        return get("structures");
    },

    getTransformations() {
        return get("transformations");
    },

    getEcmProtectionRatings() {
        return get("ecmProtectionRatings");
    },

    getDataset,

    getCollection,

    getMetadata,

    getAvailableDatasets,
    
    findById,

    findInteraction
};