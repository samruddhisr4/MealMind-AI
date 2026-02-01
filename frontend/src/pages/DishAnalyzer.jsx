import React, { useState } from 'react';
import axios from 'axios';

const DishAnalyzer = () => {
  const [dishInput, setDishInput] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dishInput.trim()) {
      setError('Please enter a dish description');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/analyze-dish`, {
        dishDescription: dishInput
      });

      if (response.data.success) {
        setResults(response.data);
      } else {
        setError(response.data.error || 'Analysis failed');
      }
    } catch (err) {
      console.error('Error analyzing dish:', err);
      setError(err.response?.data?.error || 'An error occurred while analyzing the dish');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Dish Nutrition Analyzer</h2>
        <p>Enter a dish description to analyze its nutritional content</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="dishInput" className="form-label">Dish Description</label>
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
            {loading ? 'Analyzing...' : 'Analyze Dish'}
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
            <h3>Nutrition Analysis for: "{results.dishDescription}"</h3>
            
            <div className="nutrition-grid">
              <div className="nutrition-card">
                <div className="nutrition-value">{results.totalNutrition.calories}</div>
                <div className="nutrition-label">Calories</div>
              </div>
              <div className="nutrition-card">
                <div className="nutrition-value">{results.totalNutrition.protein}g</div>
                <div className="nutrition-label">Protein</div>
              </div>
              <div className="nutrition-card">
                <div className="nutrition-value">{results.totalNutrition.carbs}g</div>
                <div className="nutrition-label">Carbs</div>
              </div>
              <div className="nutrition-card">
                <div className="nutrition-value">{results.totalNutrition.fats}g</div>
                <div className="nutrition-label">Fats</div>
              </div>
              <div className="nutrition-card">
                <div className="nutrition-value">{results.totalNutrition.fiber}g</div>
                <div className="nutrition-label">Fiber</div>
              </div>
            </div>
            
            <h4>Breakdown by Ingredient:</h4>
            <div className="breakdown-list">
              {results.nutritionBreakdown.map((item, index) => (
                <div key={index} className="ingredient-breakdown">
                  <strong>{item.name}</strong> ({item.quantity}): 
                  {item.calories} cal, {item.protein}g protein, {item.carbs}g carbs, {item.fats}g fats, {item.fiber}g fiber
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DishAnalyzer;