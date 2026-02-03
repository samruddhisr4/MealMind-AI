import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/ImageAnalyzer.css";

const ImageAnalyzer = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [userPrompt, setUserPrompt] = useState("");
  const [detectedIngredients, setDetectedIngredients] = useState(null);
  const [suggestedRecipes, setSuggestedRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5001/api";

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file (JPG, PNG, etc.)");
        setImage(null);
        setImagePreview(null);
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        setImage(null);
        setImagePreview(null);
        return;
      }

      setImage(file);
      setError("");

      // Create image preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image upload and analysis
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setError("Please select an image to analyze");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");
    setDetectedIngredients(null);

    try {
      console.log("API_BASE_URL:", API_BASE_URL);
      console.log("Image file:", image.name, image.size);
      console.log("User prompt:", userPrompt);

      const formData = new FormData();
      formData.append("image", image);
      if (userPrompt.trim()) {
        formData.append("userPrompt", userPrompt);
      }

      const response = await axios.post(
        `${API_BASE_URL}/analyze-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.success) {
        setDetectedIngredients(response.data.detectedIngredients || []);
        setSuggestedRecipes(response.data.recipes || []);
        setSuccessMessage(response.data.message);
      } else {
        setError(response.data.error || "Analysis failed");
      }
    } catch (err) {
      console.error("Error analyzing image:", err);
      setError(
        err.response?.data?.error ||
          "An error occurred while analyzing the image. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle analyzing detected ingredients
  const handleAnalyzeIngredients = () => {
    if (detectedIngredients && detectedIngredients.length > 0) {
      const ingredientString = detectedIngredients.join(", ");
      navigate("/dish-analyzer", {
        state: { dishDescription: ingredientString },
      });
    }
  };

  // Handle creating meal plan from ingredients
  const handleCreateMealPlan = () => {
    if (detectedIngredients && detectedIngredients.length > 0) {
      navigate("/meal-planner", {
        state: { suggestedIngredients: detectedIngredients },
      });
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>🍽️ Visual Recipe Generator</h2>
        <p>
          Upload one or two food images and optionally provide a prompt. The AI
          will detect ingredients from the image(s) and suggest up to 3 recipes
          tailored to your prompt and constraints.
        </p>

        <form onSubmit={handleSubmit} className="image-upload-form">
          <div className="form-group">
            <label htmlFor="userPrompt" className="form-label">
              Tell the AI what you want (Optional)
            </label>
            <textarea
              id="userPrompt"
              className="form-textarea"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Example: 'Vegetarian, low salt' or 'Make a quick dinner for 2 with Italian flavors' — include dietary constraints, desired cuisine, or serving size"
              rows={3}
            />
            <small className="prompt-hint">
              💡 Tip: Specify dietary needs, cuisine, servings, or any
              ingredient to avoid. This helps the AI suggest recipes that fit
              your goals.
            </small>
          </div>

          <div className="image-upload-area">
            {imagePreview ? (
              <div className="image-preview-container">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="image-preview"
                />
                <button
                  type="button"
                  className="btn btn-secondary btn-small"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                    setDetectedIngredients(null);
                    setUserPrompt("");
                  }}
                >
                  Remove Image
                </button>
              </div>
            ) : (
              <div className="upload-placeholder">
                <div className="upload-icon">📸</div>
                <p>Drag and drop your food image here</p>
                <p className="upload-subtext">or click to browse</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
              id="imageInput"
            />
          </div>

          <div className="file-requirements">
            <small>
              ✓ Supported formats: JPG, PNG, GIF, WebP
              <br />✓ Maximum file size: 5MB
              <br />✓ Best results: Clear, well-lit images of food
            </small>
          </div>

          {error && <div className="error">{error}</div>}
          {successMessage && <div className="success">{successMessage}</div>}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !image}
          >
            {loading ? "Generating Recipes..." : "Generate Recipes"}
          </button>
        </form>

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Generating recipe suggestions from image(s) and prompt...</p>
          </div>
        )}

        {suggestedRecipes && suggestedRecipes.length > 0 && (
          <div className="recipes-section">
            <div className="recipes-header">
              <h3>🍳 AI-Generated Recipes</h3>
              <p className="recipes-subtitle">
                Based on detected ingredients and your preferences
              </p>
            </div>
            <div className="recipes-grid">
              {suggestedRecipes.map((recipe, idx) => (
                <div key={idx} className="recipe-card-enhanced">
                  <div className="recipe-card-header">
                    <h4 className="recipe-title">
                      <span className="recipe-number">{idx + 1}</span>
                      {recipe.title}
                    </h4>
                  </div>

                  {recipe.ingredients && recipe.ingredients.length > 0 && (
                    <div className="recipe-ingredients">
                      <h5 className="section-title">📝 Ingredients</h5>
                      <div className="ingredients-list">
                        {recipe.ingredients.map((ing, i) => (
                          <div key={i} className="ingredient-item">
                            <span className="ingredient-bullet">•</span>
                            <span className="ingredient-text">{ing}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {recipe.instructions && (
                    <div className="recipe-instructions">
                      <details className="instructions-details">
                        <summary className="instructions-summary">
                          <span className="summary-text">
                            👨‍🍳 View Instructions
                          </span>
                          <span className="summary-icon">▼</span>
                        </summary>
                        <div className="instructions-content">
                          <p>{recipe.instructions}</p>
                        </div>
                      </details>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {detectedIngredients && (
          <div className="results-section">
            <h3>🎯 Detected Ingredients (from images)</h3>
            <div className="ingredients-grid">
              {detectedIngredients.map((ingredient, index) => (
                <div key={index} className="ingredient-badge">
                  {ingredient}
                </div>
              ))}
            </div>

            <div className="analysis-options">
              <div className="option-card">
                <h4>📊 Nutrition Analysis</h4>
                <p>
                  Get a detailed nutritional breakdown based on detected
                  ingredients.
                </p>
                <button
                  className="btn btn-primary btn-block"
                  onClick={handleAnalyzeIngredients}
                >
                  Analyze Ingredients →
                </button>
              </div>

              <div className="option-card">
                <h4>🍽️ Create Meal Plan</h4>
                <p>Generate a personalized meal plan using these ingredients</p>
                <button
                  className="btn btn-success btn-block"
                  onClick={handleCreateMealPlan}
                >
                  Plan Meals →
                </button>
              </div>
            </div>

            <button
              className="btn btn-secondary"
              onClick={() => {
                setImage(null);
                setImagePreview(null);
                setDetectedIngredients(null);
                setUserPrompt("");
                setSuggestedRecipes([]);
              }}
            >
              Analyze Another Image / Prompt
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageAnalyzer;
