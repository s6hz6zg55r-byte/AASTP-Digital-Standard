const express = require("express");
const router = express.Router();

const repositoryService = require("../services/repositoryService");

router.get("/", (req, res) => {
    res.json(repositoryService.getPesTypes());
});

module.exports = router;