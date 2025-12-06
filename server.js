import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
// CORS configuration - allow requests from frontend
const allowedOrigins = [
  "https://mrsanyi123.github.io/lisan/",
  process.env.FRONTEND_URL, // Add an env variable for the frontend URL
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null, // Add an env variable for the vercel URL
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        process.env.NODE_ENV !== "production"
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

// Serve static files from dist in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("dist"));
}

// Check if API key is loaded
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("❌ ERROR: GEMINI_API_KEY is not set in .env file!");
  console.error("Please add GEMINI_API_KEY=your_key_here to your .env file");
} else {
  console.log("✅ GEMINI_API_KEY loaded successfully");
}

// Initialize Gemini Client on the server
const ai = new GoogleGenAI({ apiKey: API_KEY });

const SYSTEM_INSTRUCTION = `
You are NOVA, a friendly, enthusiastic, and encouraging language tutor fox. 
You are teaching Ethiopian languages (Amharic, Afaan Oromo, Tigrinya) and English.
Your responses should be short, helpful, and use emojis. 
If the user speaks in English, answer in English but teach them a word in the target language.
If they practice the target language, correct them gently if needed.
Keep the tone playful and gamified.
`;

// Proxy endpoint for Gemini API
app.post("/api/chat", async (req, res) => {
  try {
    // Check if API key is available
    if (!API_KEY) {
      return res.status(500).json({
        error: "API key not configured",
        message: "GEMINI_API_KEY is missing from .env file",
        text: "Oops! My brain is a bit fuzzy right now. Try again later! 🦊",
      });
    }

    const { history, message, targetLanguage } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    console.log(`📨 Received message: "${message.substring(0, 50)}..."`);
    console.log(`🌍 Target language: ${targetLanguage || "Amharic"}`);

    const model = "gemini-2.5-flash";

    // Transform history for the API
    const recentHistory = (history || []).slice(-10).map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    console.log(
      `💬 Sending to Gemini API with ${recentHistory.length} history messages`
    );

    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: `${SYSTEM_INSTRUCTION} The user is currently learning: ${
          targetLanguage || "Amharic"
        }.`,
      },
      history: recentHistory,
    });

    const result = await chat.sendMessage({ message });

    console.log(`✅ Got response from Gemini API`);

    res.json({
      text: result.text,
      success: true,
    });
  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });

    // Return more detailed error information
    res.status(500).json({
      error: "Failed to get response from AI",
      message: error.message || "Unknown error",
      code: error.code,
      text: "Oops! My brain is a bit fuzzy right now. Try again later! 🦊",
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "NOVA Backend Server is running",
    apiKeyConfigured: !!API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Test endpoint to verify API key
app.get("/api/test", async (req, res) => {
  try {
    if (!API_KEY) {
      return res.status(500).json({
        error: "API key not configured",
        message: "GEMINI_API_KEY is missing from .env file",
      });
    }

    const model = "gemini-2.5-flash";
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction:
          "You are a helpful assistant. Respond with 'Hello! API is working!'",
      },
    });

    const result = await chat.sendMessage({ message: "Say hello" });

    res.json({
      success: true,
      message: "API key is working!",
      response: result.text,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code,
    });
  }
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 NOVA Backend Server running on port ${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/chat`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  if (!API_KEY) {
    console.warn(
      `⚠️  WARNING: GEMINI_API_KEY not found! Chat functionality will not work.`
    );
  }
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
  });
});
