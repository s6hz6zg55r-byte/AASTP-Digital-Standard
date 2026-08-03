import repository from "./repository.js";

// Single object lookups

const findFormulaById = createFinder("formulas");

const findDistanceRuleById = createFinder("distanceRules");

const findPesTypeById = createFinder("pesTypes");

const findEsTypeById = createFinder("esTypes");

const findStructureById = createFinder("structures");

const findOrientationTypeById = createFinder("orientationTypes");

const findHazardById = createFinder("hazardCategories");

const findEffectById = createFinder("effects");

const findEcmProtectionRatingById = createFinder("ecmProtectionRatings");

const findInteractionById = createFinder("interactions");

const findProtectionLevelById = createFinder("protectionLevels");

const findConstraintById = createFinder("constraints");

// Collection returns

function getPesTypes() {
    return repository.getCollection("pesTypes");
}
function getEsTypes() {
    return repository.getCollection("esTypes");
}
function getHazardCategories() {
    return repository.getCollection("hazardCategories");
}
function getOrientationTypes() {
    return repository.getCollection("orientationTypes");
}
function getEcmProtectionRatings() {
    return repository.getCollection("ecmProtectionRatings");
}

// Domain queries
function findInteraction(criteria) {
    return repository.findInteraction(criteria);
}

// Helper function
function createFinder(datasetName) {
    return id => repository.findById(datasetName, id);
}

export default {
    getPesTypes,
    getEsTypes,
    getHazardCategories,
    getOrientationTypes,
    getEcmProtectionRatings,
    findFormulaById,
    findInteraction,
    findDistanceRuleById,
    findPesTypeById,
    findEsTypeById,
    findStructureById,
    findOrientationTypeById,
    findHazardById,
    findEffectById,
    findEcmProtectionRatingById,
    findInteractionById,
    findProtectionLevelById,
    findConstraintById
};