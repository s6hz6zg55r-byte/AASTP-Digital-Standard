const express = require("express");
const cors = require("cors");

const pesRoutes = require("./routes/pesRoutes");
const calculationRoutes = require("./routes/calculationRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/pes-types", pesRoutes);
app.use("/api/calculate", calculationRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "AASTP API Running"
    });
});

module.exports = app;