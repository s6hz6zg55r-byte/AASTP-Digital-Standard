import {loadJson} from "./loadJson.js";

export function loadRepository() {

    return {
        
        // Core datasets
        interactions: loadJson("interactions.json"),
        effects: loadJson("effects.json"),
        distanceRulesRepository: loadJson("distanceRules.json"),

        // Reference datasets
        pesTypes: loadJson("pesTypes.json"),
        esTypes: loadJson("esTypes.json"),
        structures: loadJson("structures.json"),
        hazardCategories: loadJson("hazardCategories.json"),
        interactionDimensions: loadJson("orientationTypes.json"),

        //Formula engine
        formulas: loadJson("formulas.json"),
        transformations: loadJson("transformations.json")
    };
}