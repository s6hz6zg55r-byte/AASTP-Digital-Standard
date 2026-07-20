const express = require("express");
const router = express.Router();

const calculationService = require("../services/calculationService");

router.post("/", (req, res) => {

    const result = calculationService.calculate(req.body);

    res.json(result);

});

module.exports = router;