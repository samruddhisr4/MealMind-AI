const express = require("express");
const { generateMealPlan } = require("../controllers/mealPlanController");
const router = express.Router();

router.post("/generate-meal-plan", generateMealPlan);

module.exports = router;
