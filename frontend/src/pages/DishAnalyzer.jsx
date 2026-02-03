import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const DishAnalyzer = () => {
  const [dishInput, setDishInput] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5001/api";

  // Initialize with dish from ImageAnalyzer if available
  useEffect(() => {
    if (location.state?.dishDescription) {
      setDishInput(location.state.dishDescription);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dishInput.trim()) {
      setError("Please enter a dish description");
      return;
    }

    setLoading(true);
    setError("");
    setResults(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/analyze-dish`, {
        dishDescription: dishInput,
      });

      if (response.data.success) {
        setResults(response.data);
      } else {
        setError(response.data.error || "Analysis failed");
      }
    } catch (err) {
      console.error("Error analyzing dish:", err);
      setError(
        err.response?.data?.error ||
          "An error occurred while analyzing the dish",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>🔍 Dish Nutrition Analyzer</h2>
        <p>Enter a dish description to analyze its nutritional content</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="dishInput" className="form-label">
              Dish Description
            </label>
            <textarea
              id="dishInput"
              className="form-textarea"
              value={dishInput}
              onChange={(e) => setDishInput(e.target.value)}
              placeholder="Example: '2 boiled eggs and 1 roti' or 'chicken curry with rice'"
              rows={4}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Analyzing..." : "Analyze Dish"}
          </button>
        </form>

        {error && <div className="error">{error}</div>}

        {loading && (
          <div className="loading">
            <p>Analyzing your dish...</p>
          </div>
        )}

        {results && (
          <div className="results-section">
            <h3 className="results-title">📊 Nutrition Analysis</h3>
            <p className="analyzed-dish">"{results.dishDescription}"</p>

            <div className="nutrition-grid">
              <div className="nutrition-card">
                <div className="nutrition-value">
                  {results.totalNutrition.calories}
                </div>
                <div className="nutrition-label">Calories</div>
              </div>
              <div className="nutrition-card">
                <div className="nutrition-value">
                  {results.totalNutrition.protein}g
                </div>
                <div className="nutrition-label">Protein</div>
              </div>
              <div className="nutrition-card">
                <div className="nutrition-value">
                  {results.totalNutrition.carbs}g
                </div>
                <div className="nutrition-label">Carbs</div>
              </div>
              <div className="nutrition-card">
                <div className="nutrition-value">
                  {results.totalNutrition.fats}g
                </div>
                <div className="nutrition-label">Fats</div>
              </div>
              <div className="nutrition-card">
                <div className="nutrition-value">
                  {results.totalNutrition.fiber}g
                </div>
                <div className="nutrition-label">Fiber</div>
              </div>
            </div>

            <div className="breakdown-section">
              <h4>📋 Ingredient Breakdown</h4>
              <div className="breakdown-list">
                {results.nutritionBreakdown.map((item, index) => (
                  <div key={index} className="ingredient-breakdown-item">
                    <div className="ingredient-header">
                      <strong>{item.name}</strong>
                      <span className="ingredient-quantity">
                        ({item.quantity})
                      </span>
                    </div>
                    <div className="ingredient-details">
                      <span className="detail-item">
                        🔥 {item.calories} cal
                      </span>
                      <span className="detail-item">
                        💪 {item.protein}g protein
                      </span>
                      <span className="detail-item">
                        🌾 {item.carbs}g carbs
                      </span>
                      <span className="detail-item">🧈 {item.fats}g fats</span>
                      <span className="detail-item">
                        🥬 {item.fiber}g fiber
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DishAnalyzer;
