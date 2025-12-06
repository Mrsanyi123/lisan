import { ChatMessage } from "../types";

// Backend API endpoint - API key is kept secure on the server
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const sendMessageToNova = async (
  history: ChatMessage[],
  newMessage: string,
  targetLanguage: string
): Promise<string> => {
  try {
    console.log(`📤 Sending message to: ${API_BASE_URL}/api/chat`);

    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        history,
        message: newMessage,
        targetLanguage,
      }),
    });

    console.log(`📥 Response status: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ API Error Response:", errorData);
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    console.log("✅ Got response from API");

    if (data.text) {
      return data.text;
    }

    if (data.error) {
      console.error("API returned error:", data.error);
      return `Sorry, I encountered an error: ${
        data.message || data.error
      }. Please check if the backend server is running and the API key is configured. 🦊`;
    }

    return "Oops! My brain is a bit fuzzy right now. Try again later! 🦊";
  } catch (error: any) {
    console.error("❌ API Error:", error);

    // Network errors
    if (
      error.message?.includes("Failed to fetch") ||
      error.message?.includes("NetworkError")
    ) {
      return "I can't reach my brain right now! 😅 Make sure the backend server is running on port 3001. Check the console for details. 🦊";
    }

    return `Oops! Something went wrong: ${
      error.message || "Unknown error"
    }. Please check the console for details. 🦊`;
  }
};
