const OpenAI = require('openai');
const nutritionData = require('../models/nutritionData');
const { parseDishInput } = require('../utils/dishParser');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const analyzeDish = async (req, res) => {
  try {
    const { dishDescription } = req.body;

    if (!dishDescription) {
      return res.status(400).json({ error: 'Dish description is required' });
    }

    // Parse the dish input to extract food items and quantities
    const parsedItems = parseDishInput(dishDescription);

    // Calculate nutrition for each item
    let totalCalories = 0;
    let totalProtein = 0;
    let totalFiber = 0;
    let totalCarbs = 0;
    let totalFats = 0;
    let nutritionDetails = [];

    for (const item of parsedItems) {
      const foodItem = item.name.toLowerCase().trim();
      const quantity = parseFloat(item.quantity) || 1;
      const unit = item.unit || 'piece';

      // Look up nutrition data
      let nutritionInfo = nutritionData.find(nutrition => 
        nutrition.name.toLowerCase().includes(foodItem) || 
        foodItem.includes(nutrition.name.toLowerCase())
      );

      // If not found, use AI to estimate nutrition
      if (!nutritionInfo) {
        nutritionInfo = await estimateNutritionWithAI(foodItem);
      }

      if (nutritionInfo) {
        // Convert to appropriate units based on quantity and original serving size
        const multiplier = calculateMultiplier(quantity, unit, nutritionInfo.serving_size);
        
        const itemCalories = Math.round(nutritionInfo.calories * multiplier);
        const itemProtein = Math.round(nutritionInfo.protein * multiplier * 100) / 100;
        const itemFiber = Math.round(nutritionInfo.fiber * multiplier * 100) / 100;
        const itemCarbs = Math.round(nutritionInfo.carbs * multiplier * 100) / 100;
        const itemFats = Math.round(nutritionInfo.fats * multiplier * 100) / 100;

        totalCalories += itemCalories;
        totalProtein += itemProtein;
        totalFiber += itemFiber;
        totalCarbs += itemCarbs;
        totalFats += itemFats;

        nutritionDetails.push({
          name: foodItem,
          quantity: `${quantity} ${unit}`,
          calories: itemCalories,
          protein: itemProtein,
          fiber: itemFiber,
          carbs: itemCarbs,
          fats: itemFats
        });
      }
    }

    res.json({
      success: true,
      dishDescription,
      totalNutrition: {
        calories: totalCalories,
        protein: totalProtein,
        fiber: totalFiber,
        carbs: totalCarbs,
        fats: totalFats
      },
      nutritionBreakdown: nutritionDetails
    });

  } catch (error) {
    console.error('Error analyzing dish:', error);
    res.status(500).json({ error: 'Failed to analyze dish', details: error.message });
  }
};

// Helper function to calculate multiplier based on serving size
const calculateMultiplier = (quantity, unit, servingSize) => {
  // Default to 1 if we can't determine the conversion
  if (!servingSize) return quantity;

  // Simple conversion logic - in a real app, this would be more sophisticated
  const baseQuantity = parseFloat(servingSize.match(/\d+/)?.[0]) || 1;
  return quantity / baseQuantity;
};

// Estimate nutrition using AI if not found in our database
const estimateNutritionWithAI = async (foodItem) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a nutrition expert. Return only JSON with the following format: {name: string, serving_size: string, calories: number, protein: number, fiber: number, carbs: number, fats: number}. Provide realistic nutritional values based on common food databases. Do not include any text outside the JSON."
        },
        {
          role: "user",
          content: `Provide nutritional information for ${foodItem}. Give typical values per standard serving size.`
        }
      ],
      temperature: 0.3
    });

    // Extract JSON from response
    const responseText = completion.choices[0].message.content.trim();
    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}') + 1;
    const jsonString = responseText.substring(jsonStart, jsonEnd);
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error estimating nutrition with AI:', error);
    // Return default values if AI fails
    return {
      name: foodItem,
      serving_size: "100g",
      calories: 100,
      protein: 2,
      fiber: 1,
      carbs: 20,
      fats: 2
    };
  }
};

module.exports = {
  analyzeDish
};