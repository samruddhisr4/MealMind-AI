# MealMind AI

MealMind AI is a full-stack AI-powered nutrition and meal-planning web application built as a practical, recruiter-friendly showcase of modern full-stack development and applied AI. Key functionalities include:

- Visual Recipe Generator: Upload food images and (optionally) provide a short prompt; the AI detects likely ingredients and returns curated recipe suggestions tailored to dietary preferences and serving size.
- Dish Nutrition Analysis: Enter dish names or descriptions to receive a detailed nutritional breakdown (calories, macros, and key micronutrients) with clear visuals.
- Personalized Meal Planner: Generate multi-day meal plans based on user goals (weight loss, maintenance, muscle gain), dietary preferences (vegetarian, vegan, low-carb), and calorie targets.
- Interactive UI: Responsive React + Vite frontend with a consistent earthy theme, accessible components, and mobile-first design.
- Extensible API: Modular Express backend with endpoints for image analysis, dish analysis, and meal-plan generation — easy to extend and test.
- Secure Configuration: Sensitive keys (OpenAI API key) are loaded via environment variables and never committed to the repository.

These features demonstrate practical skills in API integration, image handling, UX design, and deploying a production-ready web application.

## Frontend and Implementation
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/a39ff5be-0d4a-4b86-8f2a-7dd78b4c5776" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/dd8aa7f0-7363-4b46-971b-47ae694a0b85" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/84b60470-41c7-41c2-8266-9e2fe8579cc4" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/cbfd4756-fdc6-490b-ac75-568852ee6e5e" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/0cbf0a42-d544-4cf9-a9d2-76bd7b8cdb72" />


## Live Demo

The frontend is deployed on Vercel: https://meal-mind-ai-plum.vercel.app/

## Deployment

- Frontend: Deploy to Vercel
- Backend: Deploy to Render
- Make sure to set environment variables in your deployment platforms



## API Endpoints

- `POST /api/analyze-dish` - Analyze dish nutrition
- `POST /api/analyze-image` - Analyze food image (requires image upload)
- `POST /api/generate-meal-plan` - Generate personalized meal plan

## Tech Stack

- Frontend: React, Vite
- Backend: Node.js, Express
- AI: OpenAI API (GPT-3.5-turbo, GPT-4-vision-preview)
- Deployment: Vercel (frontend), Render (backend)


## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the backend directory with your OpenAI API key:

```env
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=development
PORT=5000
```

4. Start the backend server:

```bash
npm run dev
```

The backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:

```bash
npm run dev
```

The frontend will run on http://localhost:5173

## Usage

1. Start both backend and frontend servers
2. Open your browser and navigate to http://localhost:5173
3. Use the application to:
   - Analyze dish nutrition by entering dish descriptions
   - Generate personalized meal plans based on your profile
   - (Future feature) Upload food images for ingredient detection

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the backend directory with your OpenAI API key:

```env
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=development
PORT=5000
```

4. Start the backend server:

```bash
npm run dev
```

The backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:

```bash
npm run dev
```

The frontend will run on http://localhost:5173

## Usage

1. Start both backend and frontend servers
2. Open your browser and navigate to http://localhost:5173
3. Use the application to:
   - Analyze dish nutrition by entering dish descriptions
   - Generate personalized meal plans based on your profile
   - (Future feature) Upload food images for ingredient detection
