const fs = require("fs");
const path = require("path");

/**
 * Loads a JSON file from the API data directory.
 *
 * @param {string} filename - e.g. "distanceRules.json"
 * @returns {object}
 */
function loadJson(filename) {

    const filePath = path.join(
        __dirname,
        "../../src/data",
        filename
    );

    if (!fs.existsSync(filePath)) {
        throw new Error(
            `JSON file not found: ${filePath}`
        );
    }

    try {

        return JSON.parse(
            fs.readFileSync(filePath, "utf8")
        );

    } catch (err) {

        throw new Error(
            `Unable to parse ${filename}: ${err.message}`
        );

    }

}

module.exports = {
    loadJson
};