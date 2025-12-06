# Chat Mode Troubleshooting Guide

If you're seeing "My brain is a bit fuzzy" error messages, follow these steps:

## Step 1: Check if Backend Server is Running

The chat requires the backend server to be running. Make sure you've started it:

```bash
# Option 1: Run both frontend and backend together
npm run dev:all

# Option 2: Run separately (in two terminals)
# Terminal 1:
npm run dev:server

# Terminal 2:
npm run dev
```

**Check:** You should see in the terminal:

```
🚀 NOVA Backend Server running on port 3001
✅ GEMINI_API_KEY loaded successfully
```

If you see `❌ ERROR: GEMINI_API_KEY is not set`, go to Step 2.

## Step 2: Verify .env File Setup

1. **Check if `.env` file exists** in the root directory (`lisan/.env`)

2. **Verify the API key is set correctly:**

   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   PORT=3001
   VITE_API_URL=http://localhost:3001
   ```

3. **Important:**

   - The `.env` file should be in the `lisan/` directory (same level as `package.json`)
   - Make sure there are NO spaces around the `=` sign
   - Make sure there are NO quotes around the API key value
   - The API key should start with something like `AIza...`

4. **Restart the server** after changing `.env`:
   - Stop the server (Ctrl+C)
   - Start it again: `npm run dev:server`

## Step 3: Test the Backend API

Open your browser and visit:

- Health check: http://localhost:3001/health
- API test: http://localhost:3001/api/test

**Expected response from `/health`:**

```json
{
  "status": "ok",
  "message": "NOVA Backend Server is running",
  "apiKeyConfigured": true,
  "timestamp": "..."
}
```

**Expected response from `/api/test`:**

```json
{
  "success": true,
  "message": "API key is working!",
  "response": "Hello! API is working!"
}
```

If `/api/test` fails, check the error message - it will tell you what's wrong.

## Step 4: Check Browser Console

1. Open your browser's Developer Tools (F12)
2. Go to the **Console** tab
3. Try sending a message in the chat
4. Look for error messages

**Common errors:**

- `Failed to fetch` → Backend server is not running
- `HTTP error! status: 500` → Check backend server logs
- `NetworkError` → CORS issue or server not accessible

## Step 5: Check Backend Server Logs

When you send a message, you should see in the terminal:

```
📨 Received message: "your message..."
🌍 Target language: Amharic
💬 Sending to Gemini API with X history messages
✅ Got response from Gemini API
```

If you see error messages, they will tell you what's wrong.

## Step 6: Verify API Key

1. Get your API key from: https://makersuite.google.com/app/apikey
2. Make sure it's a **Gemini API key** (not a different Google API key)
3. The key should look like: `AIzaSy...` (starts with "AIza")

## Step 7: Common Issues

### Issue: "API key not configured"

**Solution:** Make sure `.env` file exists and has `GEMINI_API_KEY=your_key`

### Issue: "Failed to fetch"

**Solution:**

- Make sure backend server is running on port 3001
- Check if port 3001 is already in use
- Try changing PORT in `.env` to a different number

### Issue: "Invalid API key"

**Solution:**

- Verify the API key is correct
- Make sure there are no extra spaces or quotes
- Regenerate the API key if needed

### Issue: Server starts but API calls fail

**Solution:**

- Check the backend terminal for detailed error messages
- Verify the API key has proper permissions
- Make sure you're using a Gemini API key (not Vertex AI or other)

## Still Not Working?

1. **Check all terminal windows** - make sure backend is running
2. **Check browser console** - look for specific error messages
3. **Check backend terminal** - look for error logs
4. **Verify .env file location** - should be in `lisan/.env`
5. **Restart everything:**
   ```bash
   # Stop all servers (Ctrl+C)
   # Then restart:
   npm run dev:all
   ```

## Quick Test

Run this in your browser console (when on the chat page):

```javascript
fetch("http://localhost:3001/api/test")
  .then((r) => r.json())
  .then(console.log)
  .catch(console.error);
```

This will tell you if the backend is accessible and if the API key works.
