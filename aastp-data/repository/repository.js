const loadJson = require("./loadJson");
const cache = {};

const DATASETS = {
    constraints: {
        file: "constraints.json",
        collection: "constraints"
    },
    distanceRules: {
        file: "distanceRules.json",
        collection: "distanceRules"
    },
    ecmProtectionRatings: {
        file: "ecmProtectionRatings.json",
        collection: "ecmProtectionRatings"
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
        collection: "hazardDivisions"
    },
    orientationTypes: {
        file: "orientationTypes.json",
        collection: "orientationTypes"
    },
    interactions: {
        file: "interactions.json",
        collection: "interactionrules"
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

function getDataset(filename) {
    if (!cache[filename]) {
        cache[filename] = loadJson(filename);
    }
    return cache[filename];
}

function getAvailableDatasets() {
    return Object.keys(DATASETS);
}

function findById(datasetName, id) {

    const config = DATASETS[datasetName];
    if (!config) {
        throw new Error(`Unknown dataset '${datasetName}'`);
    }

    const dataset = getDataset(config.file);

    const collection = dataset[config.collection];

    if (!Array.isArray(collection)) {
        return null;
    }

    return collection.find(item => item.id === id) || null;
}

function get(name) {

    const filename = DATASETS[name];

    if (!filename) {
        throw new Error(`Unknown dataset '${name}'`);
    }

    return getDataset(filename);
}

function findInteraction(criteria) {

    const dataset = getDataset("interactions.json");

    // Convert the object into an array suitable for searching through interactions
    const interactions = Object.values(dataset.interactionRules);

    return interactions.find(interaction => {

        const conditions = interaction.conditions;

        return (
            conditions.pesType === criteria.pesType &&
            conditions.esType === criteria.esType
        );

    }) || null;
}

module.exports = {
    getDistanceRules() {
        return getDataset("distanceRules.json");
    },

    getEffects() {
        return getDataset("effects.json");
    },

    getHazardCategories() {
        return getDataset("hazardCategories.json");
    },

    getESTypes() {
        return getDataset("esTypes.json");
    },

    getPESTypes() {
        return getDataset("pesTypes.json");
    },

    getFormulas() {
        return getDataset("formulas.json");
    },

    getInteractions() {
        return getDataset("interactions.json");
    },

    getConstraints() {
        return getDataset("constraints.json");
    },

    getProtectionLevels() {
        return getDataset("protectionLevels.json");
    },

    getOrientationTypes() {
        return getDataset("orientationTypes.json");
    },

    getStructures() {
        return getDataset("structures.json");
    },

    getTransformations() {
        return getDataset("transformations.json");
    },

    getEcmProtectionRatings() {
        return getDataset("ecmProtectionRatings.json");
    },

    findById,

    findInteraction
};