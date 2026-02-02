const OpenAI = require("openai");
const multer = require("multer");
const path = require("path");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

const analyzeImage = async (req, res) => {
  try {
    // Check if image was uploaded
    if (!req.file) {
      console.error("No file uploaded");
      return res.status(400).json({ error: "Image file is required" });
    }

    console.log(
      "Image received:",
      req.file.originalname,
      "Size:",
      req.file.size,
    );

    // Get optional user prompt for better context
    const userPrompt = req.body.userPrompt || "";
    console.log("User prompt:", userPrompt || "(empty)");

    // Process the image with OpenAI Vision API
    const imageBuffer = req.file.buffer;
    const base64Image = imageBuffer.toString("base64");

    // Build the prompt with user guidance if provided
    // Request a structured JSON response containing both detected ingredients and recipe suggestions
    let analysisPrompt =
      'Analyze this food image and return a JSON object with two keys: "detectedIngredients" and "recipes". "detectedIngredients" should be an array of ingredient names found in the image. "recipes" should be an array of up to 3 recipe objects. Each recipe object must include: "title" (string), "ingredients" (array of strings), and "instructions" (string). Return only valid JSON with this exact structure.';

    if (userPrompt.trim()) {
      analysisPrompt = `Context about the food / user constraints: "${userPrompt}"\n\nAnalyze this food image and, taking into account the context provided, return a JSON object with two keys: \"detectedIngredients\" (array of ingredient names) and \"recipes\" (array of up to 3 recipe objects with keys \"title\", \"ingredients\", and \"instructions\"). Return only valid JSON with that structure.`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: analysisPrompt,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 800,
    });

    console.log("OpenAI response received");

    // Extract JSON object from response text
    const responseText = response.choices[0].message.content.trim();
    console.log("OpenAI response text:", responseText.substring(0, 300) + "...");

    // Attempt to find the first JSON object in the response
    const jsonStart = responseText.indexOf("{");
    const jsonEnd = responseText.lastIndexOf("}") + 1;

    if (jsonStart === -1 || jsonEnd === 0) {
      console.error("Could not find JSON object in response:", responseText);
      throw new Error(
        "Invalid response format from OpenAI - no JSON object found",
      );
    }

    const jsonString = responseText.substring(jsonStart, jsonEnd);
    console.log("Extracted JSON object:", jsonString.substring(0, 300) + "...");

    const parsed = JSON.parse(jsonString);
    const detectedIngredients = parsed.detectedIngredients || [];
    const recipes = parsed.recipes || [];

    console.log("Parsed ingredients:", detectedIngredients);
    console.log("Parsed recipes count:", recipes.length);

    res.json({
      success: true,
      detectedIngredients,
      recipes,
      message: "Image analyzed successfully",
    });
  } catch (error) {
    console.error("Error analyzing image:", error.message);
    console.error("Error details:", error);
    res
      .status(500)
      .json({ error: "Failed to analyze image", details: error.message });
  }
};

// Middleware to handle file upload
const uploadSingleImage = upload.single("image");

const analyzeImageWithUpload = async (req, res, next) => {
  uploadSingleImage(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ error: "File too large. Maximum size is 5MB." });
      }
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    return analyzeImage(req, res);
  });
};

module.exports = {
  analyzeImage: analyzeImageWithUpload,
};
