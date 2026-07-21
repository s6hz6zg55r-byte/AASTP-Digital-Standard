const repository = require("../src/services/repositoryService");

const data = repository.getPesTypes();

console.log("Is array:", Array.isArray(data));
console.log("Keys:", Object.keys(data));
console.dir(data, { depth: 1 });