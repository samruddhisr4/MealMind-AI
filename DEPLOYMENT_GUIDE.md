# MealMind AI - Deployment Guide (Render + Vercel)

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Backend Deployment (Render)](#backend-deployment-render)
4. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
5. [Connecting Frontend & Backend](#connecting-frontend--backend)
6. [Post-Deployment Testing](#post-deployment-testing)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

- **GitHub Account**: Create one at [github.com](https://github.com) if you don't have it
- **Render Account**: Sign up at [render.com](https://render.com) (free tier available)
- **Vercel Account**: Sign up at [vercel.com](https://vercel.com) (free tier available)
- **Git Installed**: [Download here](https://git-scm.com/downloads)
- **OpenAI API Key**: Already configured in your `.env` file
- **Node.js 18+**: Already installed on your system

---

## Project Setup

### Step 1: Create a GitHub Repository

1. **Go to GitHub** → Click **New** (or visit https://github.com/new)
2. **Repository Name**: `MealMind-AI`
3. **Description**: "AI-powered nutrition and meal planning assistant"
4. **Visibility**: Public (required for free tier on Render/Vercel)
5. **Click "Create repository"**

### Step 2: Initialize Git & Push to GitHub

Open PowerShell in your project root folder:

```bash
cd "c:\Users\samru\OneDrive\Desktop\MealMind AI\MealMind-AI"

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: MealMind AI application"

# Add remote (replace YOUR_GITHUB_USERNAME with your actual username)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/MealMind-AI.git

# Push to GitHub (use your GitHub token if prompted for password)
git branch -M main
git push -u origin main
```

**Note**: If you don't have a GitHub token:

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Enable `repo` scope
4. Copy the token and use it as your password when pushing

### Step 3: Create Environment Configuration Files

#### Backend (.env for production)

Create `.env` file in the `backend` folder:

```env
PORT=5001
OPENAI_API_KEY=sk-your-actual-openai-key-here
NODE_ENV=production
```

#### Frontend (.env.production for production)

Create `.env.production` file in the `frontend` folder:

```env
VITE_API_URL=https://mealmind-ai-backend.onrender.com/api
```

**Replace** `mealmind-ai-backend` with your actual Render service name (we'll create this in the next step).

### Step 4: Verify Project Structure

Ensure your project has:

```
MealMind-AI/
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── .env (with OpenAI key)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── utils/
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.production
│   ├── index.html
│   └── src/
├── .gitignore
└── README.md
```

### Step 5: Update .gitignore

Create/update `.gitignore` in project root:

```gitignore
# Node modules
node_modules/
npm-debug.log
yarn-error.log

# Environment variables
.env
.env.local
.env.production
.env.*.local

# Frontend dist
frontend/dist/

# Backend
.DS_Store
*.log

# IDE
.vscode/
.idea/
*.swp
*.swo
```

Push the updated files:

```bash
git add .
git commit -m "Add .gitignore and environment configuration"
git push
```

---

## Backend Deployment (Render)

### Step 1: Connect GitHub to Render

1. **Visit** [render.com](https://render.com)
2. **Click "Sign up"** → Use your GitHub account
3. **Authorize** Render to access your GitHub repositories
4. **Click "Dashboard"** after signing in

### Step 2: Create a New Web Service

1. **Click "New +"** → Select **"Web Service"**
2. **Connect Repository**:
   - Look for `MealMind-AI` in the list
   - If not visible, click **"Connect account"** and authorize GitHub again
   - Select the repository and click **"Connect"**

### Step 3: Configure Render Service

Fill in the following fields:

| Field              | Value                 |
| ------------------ | --------------------- |
| **Name**           | `mealmind-ai-backend` |
| **Root Directory** | `backend`             |
| **Environment**    | `Node`                |
| **Build Command**  | `npm install`         |
| **Start Command**  | `npm start`           |
| **Branch**         | `main`                |

### Step 4: Add Environment Variables

1. **Scroll down** to "Environment Variables"
2. **Add the following**:

| Key              | Value                            |
| ---------------- | -------------------------------- |
| `PORT`           | `5001`                           |
| `OPENAI_API_KEY` | Paste your actual OpenAI API key |
| `NODE_ENV`       | `production`                     |

**⚠️ CRITICAL**: Never commit your OpenAI key to GitHub. Add it **only** in Render's environment variables section.

### Step 5: Instance Type & Plans

- **Instance Type**: Keep default (free tier)
- **Plan**: Select **"Free"** if available (limited resources, but works fine)

### Step 6: Deploy

1. **Click "Deploy Web Service"**
2. **Wait** for the deployment (5-10 minutes)
3. **Check Logs** for any errors
4. **Copy the URL** when deployment succeeds (e.g., `https://mealmind-ai-backend.onrender.com`)

### Step 7: Verify Backend

Once deployed:

```
Visit: https://mealmind-ai-backend.onrender.com
Expected: Server running message or 404 (which is fine)

Visit: https://mealmind-ai-backend.onrender.com/api/analyze-image
Expected: 404 or POST method error (confirms API endpoint exists)
```

**Save this URL** - you'll need it for the frontend configuration.

---

## Frontend Deployment (Vercel)

### Step 1: Connect GitHub to Vercel

1. **Visit** [vercel.com](https://vercel.com)
2. **Click "Sign up"** → Use your GitHub account
3. **Click "New Project"**

### Step 2: Import Your Project

1. **Select Repository**: Choose `MealMind-AI`
2. **Framework Preset**: Select **"Vite"** (it should auto-detect)
3. **Root Directory**: Click **"Edit"** → Select `frontend`

### Step 3: Configure Build & Environment

**Build Settings**:

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

**Environment Variables**:

1. **Add variable**:
   - Key: `VITE_API_URL`
   - Value: `https://mealmind-ai-backend.onrender.com/api`

   (Replace with your actual Render URL from Step 7 of Backend Deployment)

### Step 4: Deploy

1. **Click "Deploy"**
2. **Wait** for deployment (2-5 minutes)
3. **Copy the URL** when deployment succeeds (e.g., `https://mealmind-ai.vercel.app`)

### Step 5: Verify Frontend

Once deployed:

```
Visit: https://mealmind-ai.vercel.app
Expected: Home page loads with navbar, footer, and features
```

---

## Connecting Frontend & Backend

### Step 1: Update Backend CORS Settings (if needed)

If you see **CORS errors** in browser console, update your backend `server.js`:

```javascript
const cors = require("cors");

// Add this after creating the app
app.use(
  cors({
    origin: ["https://mealmind-ai.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
```

Then commit and push:

```bash
git add backend/server.js
git commit -m "Update CORS for production"
git push
```

Render will **auto-redeploy** when you push.

### Step 2: Test the Connection

1. **Visit your frontend**: https://mealmind-ai.vercel.app
2. **Go to Recipe Generator**
3. **Upload a food image**
4. **Click "Generate Recipes"**
5. **Check browser console** (F12) for errors

If it works → ✅ Deployment successful!

---

## Post-Deployment Testing

### Test Recipe Generator

1. Upload a clear food image
2. Add an optional prompt (e.g., "vegetarian, low salt")
3. Click "Generate Recipes"
4. **Expected**: Recipe suggestions appear within 10-30 seconds

### Test Dish Analyzer

1. Type any dish name (e.g., "Grilled chicken with broccoli")
2. Click "Analyze Dish"
3. **Expected**: Nutrition breakdown with calories, macros, etc.

### Test Meal Planner

1. Set daily calorie target (e.g., 2000)
2. Select diet type (e.g., "Balanced")
3. Click "Generate Meal Plan"
4. **Expected**: Daily meal plan with recipes

### Check Performance

- Open DevTools (F12)
- Go to **Performance** tab
- Reload page
- **Expected**: Page loads in < 3 seconds

---

## Troubleshooting

### Issue 1: Backend Shows "Service Unavailable"

**Cause**: Server might be in build phase (free tier on Render spins down after 15 min of inactivity)

**Solution**:

1. Wait 2-3 minutes
2. Visit your frontend URL
3. Try calling the API again (this wakes up the backend)

### Issue 2: CORS Errors in Console

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:

1. Update `backend/server.js` with Vercel URL in CORS settings
2. Commit and push
3. Wait for Render to redeploy
4. Clear browser cache (Ctrl+Shift+Delete)
5. Reload

### Issue 3: "Cannot find module" Errors

**Solution**:

1. Check that `package.json` has all dependencies
2. In backend folder, verify:
   ```bash
   npm list
   ```
3. If missing, add missing packages in `backend/package.json`
4. Push changes → Render will reinstall

### Issue 4: OpenAI API Key Error

**Error**: `401 Unauthorized` or `Invalid API Key`

**Solution**:

1. Go to Render Dashboard
2. Select `mealmind-ai-backend` service
3. Click **Environment** tab
4. Update `OPENAI_API_KEY` with a valid key from [openai.com](https://platform.openai.com/api-keys)
5. Save → Render auto-restarts

### Issue 5: Images Not Uploading

**Error**: `413 Payload Too Large`

**Solution**: Add to `backend/server.js`:

```javascript
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
```

Then commit, push, and wait for Render to redeploy.

### Issue 6: Frontend Shows Blank Page

**Error**: Page loads but content is empty

**Solution**:

1. Check browser console (F12) for JavaScript errors
2. Check **Network tab** → look for failed requests
3. Verify `VITE_API_URL` is set correctly in Vercel
4. Clear site data (DevTools → Application → Clear storage)
5. Hard refresh (Ctrl+Shift+R)

---

## Performance Optimization Tips

### Backend (Render)

1. **Upgrade to Paid Plan** (if traffic increases):
   - Click service → Plan → Upgrade to Standard ($7/month)
   - Better CPU & RAM = faster API responses

2. **Add Caching Headers**:
   ```javascript
   app.use((req, res, next) => {
     res.set("Cache-Control", "public, max-age=3600");
     next();
   });
   ```

### Frontend (Vercel)

1. **Enable Image Optimization**:
   - Vercel auto-optimizes images
   - No additional config needed

2. **Monitor Performance**:
   - Go to Vercel Dashboard
   - Click your project → Analytics
   - Check page load times

---

## Monitoring & Maintenance

### Check Logs

**Backend (Render)**:

1. Dashboard → `mealmind-ai-backend`
2. Click **Logs** tab
3. View real-time logs

**Frontend (Vercel)**:

1. Dashboard → `mealmind-ai`
2. Click **Deployments**
3. Click latest deployment → View logs

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update in package.json, then push
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

Render/Vercel will auto-redeploy.

---

## Rolling Back to Previous Version

If a deployment breaks:

**Render**:

1. Dashboard → Service → Deployments
2. Click **Redeploy** on any previous successful build

**Vercel**:

1. Dashboard → Project → Deployments
2. Click **⋮** on previous deployment
3. Select **Promote to Production**

---

## Next Steps for Production

- [ ] Set up custom domain (optional)
  - Render: Settings → Custom domains
  - Vercel: Settings → Domains
- [ ] Enable SSL/HTTPS (auto-enabled by default)

- [ ] Set up error monitoring (e.g., Sentry.io)

- [ ] Configure automatic backups (if using database)

- [ ] Monitor API costs at [OpenAI Dashboard](https://platform.openai.com/account/billing/overview)

---

## Additional Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **OpenAI API**: https://platform.openai.com/docs

---

## Support

If you encounter issues:

1. **Check Render Logs**: Look for error messages
2. **Check Vercel Logs**: Look for build/runtime errors
3. **Check Browser Console**: F12 → Console tab
4. **Check Network Tab**: F12 → Network → See failed requests

---

**Last Updated**: February 3, 2026
**Application**: MealMind AI v1.0
