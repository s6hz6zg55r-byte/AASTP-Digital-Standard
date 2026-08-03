import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function loadJson(filename) {
    const filePath = path.join(
        __dirname,
        "..",
        "/data",
        filename
    );

    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}