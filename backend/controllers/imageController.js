const OpenAI = require('openai');
const multer = require('multer');
const path = require('path');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

const analyzeImage = async (req, res) => {
  try {
    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    // Process the image with OpenAI Vision API
    const imageBuffer = req.file.buffer;
    const base64Image = imageBuffer.toString('base64');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this food image and list all the ingredients and food items you can identify. Respond with only a JSON array of food item names. Example: [\"banana\", \"oatmeal\", \"milk\"]"
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 300
    });

    // Extract JSON from response
    const responseText = response.choices[0].message.content.trim();
    const jsonStart = responseText.indexOf('[');
    const jsonEnd = responseText.lastIndexOf(']') + 1;
    const jsonString = responseText.substring(jsonStart, jsonEnd);
    const detectedIngredients = JSON.parse(jsonString);

    res.json({
      success: true,
      detectedIngredients,
      message: 'Image analyzed successfully'
    });

  } catch (error) {
    console.error('Error analyzing image:', error);
    res.status(500).json({ error: 'Failed to analyze image', details: error.message });
  }
};

// Middleware to handle file upload
const uploadSingleImage = upload.single('image');

const analyzeImageWithUpload = async (req, res, next) => {
  uploadSingleImage(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
      }
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    return analyzeImage(req, res);
  });
};

module.exports = {
  analyzeImage: analyzeImageWithUpload
};