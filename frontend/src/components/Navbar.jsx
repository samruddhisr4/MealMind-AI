import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <h1>
            <span className="calligraphy-text"> MealMind </span>
            {""}
            AI
          </h1>
        </Link>
{/* <div className="navbar-links"> */}
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/image-analyzer" className="nav-link">
              Recipe Generator
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/dish-analyzer" className="nav-link">
              Analyze Dish
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/meal-planner" className="nav-link">
              Meal Planner
            </Link>
          </li>
        </ul>
{/* </div> */}
      </div>
    </nav>
  );
};

export default Navbar;
