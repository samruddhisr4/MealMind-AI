const express = require('express');
const { analyzeImage } = require('../controllers/imageController');
const router = express.Router();

router.post('/analyze-image', analyzeImage);

module.exports = router;