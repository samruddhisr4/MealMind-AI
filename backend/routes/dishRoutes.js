const express = require("express");
const { analyzeDish } = require("../controllers/dishController");
const router = express.Router();

router.post("/analyze-dish", analyzeDish);

module.exports = router;
