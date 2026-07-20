const { repository } = require("@aastp/core-data");

function getPesTypes() {
    return repository.getPESTypes;
}

function getEsTypes() {
    return repository.getESTypes;
}

module.exports = {
    getPesTypes,
    getEsTypes
};