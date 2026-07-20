const loadJson = require("./loadJson");
const cache = {};

const DATASETS = {
    distanceRules: "distanceRules.json",
    effects: "effects.json",
    hazardCategories: "hazardCategories.json",
    esTypes: "esTypes.json",
    pesTypes: "pesTypes.json",
    formulas: "formulas.json",
    interactions: "interactions.json",
    constraints: "constraints.json",
    protectionLevels: "protectionLevels.json",
    dimensions: "interactionDimensions.json",
    structures: "structures.json",
    transformations: "transformations.json"
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

function get(name) {

    const filename = DATASETS[name];

    if (!filename) {
        throw new Error(`Unknown dataset '${name}'`);
    }

    return getDataset(filename);
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

    getDimensions() {
        return getDataset("interactionDimensions.json");
    },

    getStructures() {
        return getDataset("structures.json");
    },

    getTransformations() {
        return getDataset("transformations.json")
    }
};