# MealMind AI

A full-stack AI-powered nutrition and meal-planning web application.

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