import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are NOVA, a friendly, enthusiastic, and encouraging language tutor fox. 
You are teaching Ethiopian languages (Amharic, Afaan Oromo, Tigrinya) and English.
Your responses should be short, helpful, and use emojis. 
If the user speaks in English, answer in English but teach them a word in the target language.
If they practice the target language, correct them gently if needed.
Keep the tone playful and gamified.
`;

export const sendMessageToNova = async (
  history: ChatMessage[],
  newMessage: string,
  targetLanguage: string
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Transform history for the API
    // We only take the last few turns to keep context manageable
    const recentHistory = history.slice(-10).map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    }));

    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: `${SYSTEM_INSTRUCTION} The user is currently learning: ${targetLanguage}.`,
      },
      history: recentHistory,
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Oops! My brain is a bit fuzzy right now. Try again later! 🦊";
  }
};
