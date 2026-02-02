const OpenAI = require("openai");
const { calculateBMR, calculateTDEE } = require("../utils/nutritionCalculator");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateMealPlan = async (req, res) => {
  try {
    const {
      age,
      height,
      weight,
      activityLevel,
      dietPreference,
      goal,
      excludeIngredients = [],
    } = req.body;

    if (
      !age ||
      !height ||
      !weight ||
      !activityLevel ||
      !dietPreference ||
      !goal
    ) {
      return res.status(400).json({
        error:
          "Missing required fields: age, height, weight, activityLevel, dietPreference, goal",
      });
    }

    // Calculate BMR and TDEE
    const bmr = calculateBMR(weight, height, age, "male"); // Assuming male, could be parameterized
    const tdee = calculateTDEE(bmr, activityLevel);

    // Adjust calories based on goal
    let targetCalories;
    if (goal === "weight_loss") {
      targetCalories = tdee - 500; // 500 calorie deficit for weight loss
    } else if (goal === "muscle_gain") {
      targetCalories = tdee + 300; // 300 calorie surplus for muscle gain
    } else {
      targetCalories = tdee; // maintenance
    }

    // Generate meal plan with AI
    const mealPlanPrompt = `
      Create a personalized daily meal plan for 7 days with the following specifications:
      - Target daily calories: ${targetCalories}
      - Diet preference: ${dietPreference}
      - Excluded ingredients: ${excludeIngredients.join(", ") || "None"}
      
      Provide the response in the following JSON format:
      {
        "dailyCalorieTarget": number,
        "dietPreference": string,
        "goal": string,
        "meals": [
          {
            "name": string,
            "time": string,
            "ingredients": [string],
            "calories": number,
            "protein": number,
            "carbs": number,
            "fats": number
          }
        ],
        "summary": {
          "totalCalories": number,
          "totalProtein": number,
          "totalCarbs": number,
          "totalFats": number
        }
      }
      
      Make the meals realistic, nutritious, and appropriate for the given diet preference.
      Ensure the total calories are close to the target.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a professional nutritionist and meal planner. Create healthy, balanced meal plans that meet the specified criteria. Always respond with valid JSON format only.",
        },
        {
          role: "user",
          content: mealPlanPrompt,
        },
      ],
      temperature: 0.7,
    });

    // Extract JSON from response
    const responseText = completion.choices[0].message.content.trim();
    const jsonStart = responseText.indexOf("{");
    const jsonEnd = responseText.lastIndexOf("}") + 1;
    const jsonString = responseText.substring(jsonStart, jsonEnd);
    const mealPlan = JSON.parse(jsonString);

    res.json({
      success: true,
      ...mealPlan,
    });
  } catch (error) {
    console.error("Error generating meal plan:", error);
    res
      .status(500)
      .json({ error: "Failed to generate meal plan", details: error.message });
  }
};

module.exports = {
  generateMealPlan,
};
