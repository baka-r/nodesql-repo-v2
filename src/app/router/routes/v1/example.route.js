const express = require("express");
const Router = express.Router();

Router.get('/generate', (req, res) => {
    return res.status(200).json({ message: "welcome to nodesql repo v2" })
});

module.exports = Router;