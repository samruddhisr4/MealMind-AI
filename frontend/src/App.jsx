import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import DishAnalyzer from "./pages/DishAnalyzer";
import MealPlanner from "./pages/MealPlanner";
import ImageAnalyzer from "./pages/ImageAnalyzer";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dish-analyzer" element={<DishAnalyzer />} />
          <Route path="/meal-planner" element={<MealPlanner />} />
          <Route path="/image-analyzer" element={<ImageAnalyzer />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
