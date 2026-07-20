const express = require("express");
const router = express.Router();

const referenceService = require("../services/referenceService");

router.get("/", (req, res) => {
    res.json(referenceService.getPesTypes());
});

module.exports = router;