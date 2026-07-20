const pesTypes = require("../data/pesTypes.json");
const esTypes = require("../data/esTypes.json");

function getPesTypes() {
    return pesTypes;
}

function getEsTypes() {
    return esTypes;
}

module.exports = {
    getPesTypes,
    getEsTypes
};