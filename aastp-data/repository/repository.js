const loadJson = require("./loadJson");
const cache = {};

function getDataset(filename) {
    if (!cache[filename]) {
        cache[filename] = loadJson(filename);
    }
    return cache[filename];
}

module.exports = {
    getDistanceRules() {
        return getDataset("distanceRules.json");
    },

    getFormulas() {
        return getDataset("formulas.json");
    },

    getInteractions() {
        return getDataset("interactions.json");
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

    getProtectionLevels() {
        return getDataset("protectionLevels.json");
    },

    getConstraints() {
        return getDataset("constraints.json");
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