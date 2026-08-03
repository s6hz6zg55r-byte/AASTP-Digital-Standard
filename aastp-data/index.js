import packageJson from "./package.json" with { type: "json" };

export { default as repository } from "./repository/repository.js";

export { default as repositoryService } from "./repository/repositoryService.js";

export const metadata = {
    version: packageJson.version
};
