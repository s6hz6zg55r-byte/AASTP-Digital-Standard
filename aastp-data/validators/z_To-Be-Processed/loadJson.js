import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Loads a JSON file from the API data directory.
 *
 * @param {string} filename - e.g. "distanceRules.json"
 * @returns {object}
 */
export function loadJson(filename) {

    const filePath = path.join(
        __dirname,
        "../../data",
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
