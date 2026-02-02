import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="container">
      <div className="card hero-section">
        <h1>🥗 Welcome to MealMind AI</h1>
        <p className="subtitle">
          Your intelligent AI-powered nutrition and meal planning assistant
        </p>
        
        <div className="project-intro">
          <h2>About MealMind AI</h2>
          <p>
            MealMind AI is a comprehensive nutrition platform powered by advanced artificial intelligence. 
            It combines visual food recognition, detailed nutritional analysis, and personalized meal planning 
            to help you make informed decisions about your diet and health.
          </p>
          <p>
            Whether you're looking to understand the nutritional content of your favorite dishes, 
            get recipe suggestions based on available ingredients, or create a customized meal plan tailored 
            to your dietary goals and preferences, MealMind AI is here to guide you every step of the way.
          </p>
          
          <div className="key-benefits">
            <h3>Why Choose MealMind AI?</h3>
            <ul>
              <li>✅ <strong>AI-Powered Analysis:</strong> Advanced computer vision and natural language processing</li>
              <li>✅ <strong>Accurate Nutritional Data:</strong> Detailed breakdown of calories, macros, and micronutrients</li>
              <li>✅ <strong>Smart Recipe Generator:</strong> Get personalized recipe suggestions from food images</li>
              <li>✅ <strong>Personalized Meal Plans:</strong> Custom plans based on your health goals and preferences</li>
              <li>✅ <strong>Easy to Use:</strong> Simple, intuitive interface for all users</li>
            </ul>
          </div>
        </div>

        <h2 className="features-heading">Explore Our Features</h2>
        <div className="features">
          <div className="feature-card">
            <h3>🔍 Dish Analysis</h3>
            <p>
              Analyze any dish or meal to get detailed nutrition information
              including calories, protein, carbs, fats, and fiber.
            </p>
            <Link to="/dish-analyzer" className="btn btn-primary">
              Analyze a Dish →
            </Link>
          </div>

          <div className="feature-card">
            <h3>📋 Meal Planning</h3>
            <p>
              Generate personalized meal plans based on your health goals,
              dietary preferences, and nutritional needs.
            </p>
            <Link to="/meal-planner" className="btn btn-primary">
              Create Meal Plan →
            </Link>
          </div>

          <div className="feature-card">
            <h3>🍳 Recipe Generator</h3>
            <p>
              Upload food images to automatically detect ingredients and get AI-suggested 
              recipes tailored to your preferences.
            </p>
            <Link to="/image-analyzer" className="btn btn-primary">
              Generate Recipes →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
