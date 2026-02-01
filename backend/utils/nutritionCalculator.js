// Utility functions for calculating BMR and TDEE

// Calculate Basal Metabolic Rate using Mifflin-St Jeor Equation
function calculateBMR(weightKg, heightCm, age, gender = 'male') {
  // Convert imperial units to metric if needed
  const weight = parseFloat(weightKg);
  const height = parseFloat(heightCm);
  const ageNum = parseInt(age);
  
  let bmr;
  if (gender.toLowerCase() === 'female') {
    bmr = 10 * weight + 6.25 * height - 5 * ageNum - 161;
  } else {
    // Default to male calculation
    bmr = 10 * weight + 6.25 * height - 5 * ageNum + 5;
  }
  
  return Math.round(bmr);
}

// Calculate Total Daily Energy Expenditure based on activity level
function calculateTDEE(bmr, activityLevel) {
  const activityMultipliers = {
    'sedentary': 1.2,      // Little or no exercise
    'light': 1.375,        // Light exercise/sports 1-3 days/week
    'moderate': 1.55,      // Moderate exercise/sports 3-5 days/week
    'active': 1.725,       // Hard exercise/sports 6-7 days/week
    'very_active': 1.9     // Very hard exercise/physical job
  };
  
  const multiplier = activityMultipliers[activityLevel.toLowerCase()] || 1.2;
  return Math.round(bmr * multiplier);
}

module.exports = {
  calculateBMR,
  calculateTDEE
};