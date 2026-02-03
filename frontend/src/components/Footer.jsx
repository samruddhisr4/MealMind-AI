import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>MealMind AI</h3>
            <p>
              Your intelligent AI-powered nutrition and meal planning assistant.
              Make informed decisions about your diet and health.
            </p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/recipe-generator">Recipe Generator</Link>
              </li>
              <li>
                <Link to="/dish-analyzer">Analyze Dish</Link>
              </li>
              <li>
                <Link to="/meal-planner">Meal Planner</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Features</h4>
            <ul>
              <li>
                <Link to="/image-analyzer">Visual Food Recognition</Link>
              </li>
              <li>
                <Link to="/dish-analyzer">Nutrition Analysis</Link>
              </li>
              <li>
                <Link to="/meal-planner">Personalized Meal Plans</Link>
              </li>
              <li>
                <Link to="/image-analyzer">AI Recipe Suggestions</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>About</h4>
            <p>
              MealMind AI combines cutting-edge computer vision and AI
              technology to help you achieve your health and nutrition goals
              with ease.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 MealMind AI. All rights reserved.</p>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
