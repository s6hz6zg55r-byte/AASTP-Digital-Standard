const loadJson = require("./loadJson");
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
    structures: {
        file: "structures.json",
        collection: "structures"
    },
    transformations: {
        file: "transformations.json",
        collection: "transformations"
    }
    
};

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

function getAvailableDatasets() {
    return Object.keys(DATASETS);
}

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

function find(datasetName, predicate) {
    const collection = getCollection(datasetName);

    const items = Array.isArray(collection)
        ? collection
        : Object.values(collection);

    return items.find(predicate) ?? null;
}

function get(name) {

    return getDataset(name);
}

function getCollection(name) {

    const config = DATASETS[name];

    const dataset = getDataset(name);

    return dataset[config.collection];
}

function findInteraction(criteria) {

    return find(
    "interactions",
    interaction =>
        interaction.conditions.pesType === criteria.pesType.id &&
        interaction.conditions.esType === criteria.esType.id
    );

}

module.exports = {
    getDistanceRules() {
        return get("distance_rules");
    },

    getEffects() {
        return get("effects");
    },

    getHazardCategories() {
        return get("hazard_categories");
    },

    getESTypes() {
        return get("es_types");
    },

    getPESTypes() {
        return get("pes_types");
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
        return get("protection_levels");
    },

    getOrientationTypes() {
        return get("orientation_types");
    },

    getStructures() {
        return get("structures");
    },

    getTransformations() {
        return get("transformations");
    },

    getEcmProtectionRatings() {
        return get("ecm_protection_ratings");
    },

    findById,

    findInteraction
};