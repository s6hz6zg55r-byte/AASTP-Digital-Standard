const repository = require("./repository/repository")

module.exports = { 
    repository,
    metadata: {
        version: require("./package.json").version
    } 

};