const express = require("express");
const Router = express.Router();
const exampleRoutes = require("./routes/v1/example.route");
const { authGuard } = require("../middleware/authGuard");

Router.use(function (req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

Router.use(`/${process.env.ROUTENAME}/v1/`, authGuard, exampleRoutes);

module.exports = Router;