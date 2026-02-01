import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container">
      <div className="card">
        <h1>Welcome to MealMind AI</h1>
        <p className="subtitle">
          Your AI-powered nutrition and meal planning assistant
        </p>
        
        <div className="features">
          <div className="feature-card">
            <h3>🔍 Dish Analysis</h3>
            <p>Analyze any dish or meal to get detailed nutrition information including calories, protein, carbs, fats, and fiber.</p>
            <Link to="/dish-analyzer" className="btn btn-primary">Analyze a Dish</Link>
          </div>
          
          <div className="feature-card">
            <h3>📋 Meal Planning</h3>
            <p>Generate personalized meal plans based on your health goals, dietary preferences, and nutritional needs.</p>
            <Link to="/meal-planner" className="btn btn-primary">Create Meal Plan</Link>
          </div>
          
          <div className="feature-card">
            <h3>📱 Visual Recognition</h3>
            <p>Upload food images to automatically detect ingredients and analyze nutritional content.</p>
            <p><em>Coming soon with image upload feature!</em></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;