# Troubleshooting: "Failed to analyze image" Error

## Quick Diagnostics

### Step 1: Check Backend is Running

Open terminal and run:

```bash
netstat -ano | findstr :5001
```

If no output, backend is NOT running. Start it:

```bash
cd "c:\Users\samru\OneDrive\Desktop\MealMind AI\MealMind-AI\backend"
npm run dev
```

Should see: `Server running on port 5001`

### Step 2: Check Frontend Env Variable

Verify frontend `.env` file has:

```
VITE_API_URL=http://localhost:5001/api
```

### Step 3: Check OpenAI API Key

Backend `.env` must have valid:

```
OPENAI_API_KEY=sk-proj-xxxxx
```

(Should start with `sk-proj-`)

---

## Debugging the Error

### Step 1: Open Browser Console

1. Press `F12` in browser
2. Go to "Console" tab
3. Upload image and click "Generate Meal"
4. Look for messages like:
   - `API_BASE_URL: http://localhost:5001/api` ✅ Good
   - `API_BASE_URL: undefined` ❌ Bad - env not loaded
   - Network errors in console

### Step 2: Check Backend Logs

In backend terminal window, after clicking "Generate Meal", you should see:

```
Image received: filename.jpg Size: 12345
User prompt: (empty) or (your prompt)
OpenAI response received
Parsed ingredients: ["item1", "item2", ...]
```

If you see nothing, the request didn't reach backend:

- Check if backend is actually running
- Check if API_BASE_URL is correct

### Step 3: Check Error Details

The error message will show what went wrong:

- "Image file is required" → Image didn't upload
- "Failed to analyze image" + details → OpenAI API issue
- "Invalid response format" → OpenAI returned unexpected format

---

## Common Issues & Fixes

### Issue 1: "Image file is required"

**Cause:** Image not uploading correctly
**Fix:**

1. Clear browser cache (Ctrl+Shift+Delete)
2. Try different image file
3. Ensure file < 5MB
4. Check browser console for upload errors

### Issue 2: Backend Connection Error

**Cause:** Backend not running or wrong URL
**Fix:**

1. Start backend: `npm run dev` in backend folder
2. Verify port 5001 shows in netstat
3. Check VITE_API_URL in frontend/.env
4. Restart frontend dev server

### Issue 3: OpenAI API Error

**Cause:** Invalid API key or quota exceeded
**Fix:**

1. Check OpenAI API key in backend/.env
2. Verify key starts with `sk-proj-`
3. Go to openai.com and check account status
4. Check usage/quota limits

### Issue 4: "Failed to analyze image" + no details

**Cause:** Network or timeout issue
**Fix:**

1. Check internet connection
2. Wait a few seconds, try again
3. OpenAI API might be slow
4. Check backend logs for timeouts

### Issue 5: Unexpected response format

**Cause:** OpenAI didn't return JSON array
**Fix:**

1. Backend logs will show the actual response
2. If it's text instead of JSON, OpenAI model might have changed
3. Try the request again - might be temporary issue

---

## Testing Checklist

Before using feature, verify each step:

- [ ] Backend running on port 5001
- [ ] Frontend VITE_API_URL = http://localhost:5001/api
- [ ] OpenAI API key valid in backend/.env
- [ ] Browser shows no console errors
- [ ] Can upload image (preview shows)
- [ ] Backend logs show "Image received..."
- [ ] No timeout errors in logs

---

## Detailed Debugging

### Enable Full Logging

The frontend and backend now log detailed info:

**Frontend Console (F12):**

```
API_BASE_URL: http://localhost:5001/api
Image file: photo.jpg 2048576
User prompt: Thai curry
```

**Backend Terminal:**

```
Image received: photo.jpg Size: 2048576
User prompt: Thai curry
OpenAI response received
Extracted JSON: ["chicken", "curry paste", ...]
Parsed ingredients: (4) ["chicken", "curry paste", ...]
```

### If Logs Show Everything OK

But still get error, it could be:

1. OpenAI API temporarily down
2. Your API key has no credits
3. OpenAI rate limit exceeded
4. Unusual response format from OpenAI

### Test with Simple Image

1. Try a clear, simple image (not blurry)
2. Try without optional prompt first
3. Then try with prompt

---

## Still Having Issues?

### Check These Files

1. **Frontend:** `frontend/src/pages/ImageAnalyzer.jsx`
   - Line 16: Check `API_BASE_URL`
   - Line 65-75: Check FormData construction

2. **Backend:** `backend/controllers/imageController.js`
   - Line 29-35: Check image validation
   - Line 37: Check OpenAI client initialization
   - Line 85: Check JSON parsing

3. **Env Files:**
   - `frontend/.env` → VITE_API_URL correct?
   - `backend/.env` → OPENAI_API_KEY valid?

### Manual Testing

Try testing the API directly using curl/Postman:

```bash
# Test if backend is responding
curl http://localhost:5001/

# Should return:
# {"message":"MealMind AI Backend is running!"}
```

---

## Contact Info

When reporting issues, include:

1. Browser console error (F12 → Console)
2. Backend terminal output
3. Screenshot of error message
4. Image file size and format
5. Operating system (Windows/Mac/Linux)

---

## Prevention

To avoid "Failed to analyze image" errors:

1. ✅ Keep backend running while using app
2. ✅ Use valid OpenAI API key
3. ✅ Keep images under 5MB
4. ✅ Use clear, well-lit food photos
5. ✅ Reload frontend after backend restarts
6. ✅ Clear browser cache periodically

---

**Last Updated:** February 2, 2026
**Status:** Debugging guide for image analyzer errors
