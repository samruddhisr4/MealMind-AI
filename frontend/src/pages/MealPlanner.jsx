import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const MealPlanner = () => {
  const [formData, setFormData] = useState({
    age: "",
    height: "",
    weight: "",
    activityLevel: "moderate",
    dietPreference: "non-veg",
    goal: "weight_loss",
    excludeIngredients: "",
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5001/api";

  // Initialize with suggested ingredients from ImageAnalyzer if available
  useEffect(() => {
    if (location.state?.suggestedIngredients) {
      setFormData((prev) => ({
        ...prev,
        excludeIngredients: location.state.suggestedIngredients.join(", "),
      }));
    }
  }, [location.state]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.age || !formData.height || !formData.weight) {
      setError("Please fill in age, height, and weight");
      return;
    }

    setLoading(true);
    setError("");
    setResults(null);

    try {
      const payload = {
        ...formData,
        age: parseInt(formData.age),
        height: parseInt(formData.height),
        weight: parseFloat(formData.weight),
        excludeIngredients: formData.excludeIngredients
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item),
      };

      const response = await axios.post(
        `${API_BASE_URL}/generate-meal-plan`,
        payload,
      );

      if (response.data.success) {
        setResults(response.data);
      } else {
        setError(response.data.error || "Meal plan generation failed");
      }
    } catch (err) {
      console.error("Error generating meal plan:", err);
      setError(
        err.response?.data?.error ||
          "An error occurred while generating the meal plan",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Personalized Meal Planner</h2>
        <p>
          Fill in your details to get a customized meal plan based on your goals
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group half-width">
              <label htmlFor="age" className="form-label">
                Age (years)
              </label>
              <input
                type="number"
                id="age"
                name="age"
                className="form-input"
                value={formData.age}
                onChange={handleChange}
                min="1"
                max="120"
              />
            </div>

            <div className="form-group half-width">
              <label htmlFor="height" className="form-label">
                Height (cm)
              </label>
              <input
                type="number"
                id="height"
                name="height"
                className="form-input"
                value={formData.height}
                onChange={handleChange}
                min="50"
                max="250"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="weight" className="form-label">
              Weight (kg)
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              className="form-input"
              value={formData.weight}
              onChange={handleChange}
              min="1"
              max="500"
              step="0.1"
            />
          </div>

          <div className="form-row">
            <div className="form-group half-width">
              <label htmlFor="activityLevel" className="form-label">
                Activity Level
              </label>
              <select
                id="activityLevel"
                name="activityLevel"
                className="form-select"
                value={formData.activityLevel}
                onChange={handleChange}
              >
                <option value="sedentary">
                  Sedentary (little or no exercise)
                </option>
                <option value="light">Light (exercise 1-3 days/week)</option>
                <option value="moderate">
                  Moderate (exercise 3-5 days/week)
                </option>
                <option value="active">Active (exercise 6-7 days/week)</option>
                <option value="very_active">
                  Very Active (hard exercise daily)
                </option>
              </select>
            </div>

            <div className="form-group half-width">
              <label htmlFor="goal" className="form-label">
                Goal
              </label>
              <select
                id="goal"
                name="goal"
                className="form-select"
                value={formData.goal}
                onChange={handleChange}
              >
                <option value="weight_loss">Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half-width">
              <label htmlFor="dietPreference" className="form-label">
                Diet Preference
              </label>
              <select
                id="dietPreference"
                name="dietPreference"
                className="form-select"
                value={formData.dietPreference}
                onChange={handleChange}
              >
                <option value="veg">Vegetarian</option>
                <option value="non-veg">Non-Vegetarian</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="excludeIngredients" className="form-label">
              Exclude Ingredients (comma separated)
            </label>
            <input
              type="text"
              id="excludeIngredients"
              name="excludeIngredients"
              className="form-input"
              value={formData.excludeIngredients}
              onChange={handleChange}
              placeholder="e.g., nuts, dairy, gluten"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Generating Meal Plan..." : "Generate Meal Plan"}
          </button>
        </form>

        {error && <div className="error">{error}</div>}

        {loading && (
          <div className="loading">
            <p>Generating your personalized meal plan...</p>
          </div>
        )}

        {results && (
          <div className="results-section">
            <h3 className="results-title">🍽️ Your Personalized Meal Plan</h3>
            
            <div className="plan-info-grid">
              <div className="plan-info-card">
                <span className="info-label">Daily Calorie Target</span>
                <span className="info-value">{results.dailyCalorieTarget}</span>
              </div>
              <div className="plan-info-card">
                <span className="info-label">Diet Type</span>
                <span className="info-value">{results.dietPreference}</span>
              </div>
              <div className="plan-info-card">
                <span className="info-label">Your Goal</span>
                <span className="info-value">{results.goal}</span>
              </div>
            </div>

            <div className="nutrition-summary">
              <h4>📊 Daily Nutrition Summary</h4>
              <div className="nutrition-grid">
                <div className="nutrition-card">
                  <div className="nutrition-value">
                    {results.summary.totalCalories}
                  </div>
                  <div className="nutrition-label">Calories</div>
                </div>
                <div className="nutrition-card">
                  <div className="nutrition-value">
                    {results.summary.totalProtein}g
                  </div>
                  <div className="nutrition-label">Protein</div>
                </div>
                <div className="nutrition-card">
                  <div className="nutrition-value">
                    {results.summary.totalCarbs}g
                  </div>
                  <div className="nutrition-label">Carbs</div>
                </div>
                <div className="nutrition-card">
                  <div className="nutrition-value">
                    {results.summary.totalFats}g
                  </div>
                  <div className="nutrition-label">Fats</div>
                </div>
              </div>
            </div>

            <h4 className="meals-heading">🍳 Your Daily Meals</h4>
            <div className="meals-list">
              {results.meals.map((meal, index) => (
                <div key={index} className="meal-card">
                  <div className="meal-header">
                    <div className="meal-title">{meal.name}</div>
                    <div className="meal-time">⏰ {meal.time}</div>
                  </div>

                  <div className="meal-ingredients">
                    <strong>Ingredients:</strong>
                    <div className="ingredients-tags">
                      {meal.ingredients.map((ingredient, idx) => (
                        <span key={idx} className="ingredient-tag">
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="meal-nutrition">
                    <div className="nutrition-item">
                      <span className="icon">🔥</span>
                      <span><strong>Calories:</strong> {meal.calories}</span>
                    </div>
                    <div className="nutrition-item">
                      <span className="icon">💪</span>
                      <span><strong>Protein:</strong> {meal.protein}g</span>
                    </div>
                    <div className="nutrition-item">
                      <span className="icon">🌾</span>
                      <span><strong>Carbs:</strong> {meal.carbs}g</span>
                    </div>
                    <div className="nutrition-item">
                      <span className="icon">🧈</span>
                      <span><strong>Fats:</strong> {meal.fats}g</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealPlanner;
