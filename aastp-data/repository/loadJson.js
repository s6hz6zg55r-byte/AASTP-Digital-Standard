const fs = require("fs");
const path = require("path");

function loadJson(filename) {
    const filePath = path.join(
        __dirname,
        "..",
        "/data",
        filename
    );

    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

module.exports = loadJson;