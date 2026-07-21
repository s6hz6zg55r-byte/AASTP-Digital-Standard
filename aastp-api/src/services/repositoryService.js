const { repository } = require("@aastp/core-data");

function getPesTypes() {
    return repository.getPESTypes();
}

function getEsTypes() {
    return repository.getESTypes();
}

function findFormulaById(id) {
    return repository.findById(
        "formulas", 
        id
    );
}

function findInteraction(criteria) {
    return repository.findInteraction(criteria);
}

function findDistanceRuleById(id) {
    return repository.findById(
        "distanceRules",
        id
    );
}

function findPesTypeById(id) {
    return repository.findById(
        "pesTypes",
        id
    )
}

function findEsTypeById(id) {
    return repository.findById(
        "esTypes",
        id
    )
}

function findStructureById(id) {
    return repository.findById(
        "structures",
        id
    )
}

function findOrientationTypeById(id) {
    return repository.findById(
        "orientationTypes",
        id
    )
}

function findHazardById(id) {
    return repository.findById(
        "hazardCategories",
        id
    )
}

function findEffectById(id) {
    return repository.findById(
        "effects",
        id
    )
}

function findEcmProtectionRatingById(id) {
    return repository.findById(
        "ecmProtectionRatings",
        id
    )
}

module.exports = {
    getPesTypes,
    getEsTypes,
    findFormulaById,
    findInteraction,
    findDistanceRuleById,
    findPesTypeById,
    findEsTypeById,
    findStructureById,
    findOrientationTypeById,
    findHazardById,
    findEffectById,
    findEcmProtectionRatingById
};