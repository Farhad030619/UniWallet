import { GoogleGenAI } from "@google/genai";
import type { ChatMessage } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd handle this more gracefully.
  // For this example, we'll proceed, but API calls will fail without a key.
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const systemInstruction = `You are "CashBuddy," a direct and helpful AI financial assistant for students in Sweden. Your primary goal is to help users solve their financial questions through a clear, step-by-step conversation.

Your personality:
- Straightforward and to the point.
- Encouraging and positive.
- Use emojis to keep the tone friendly. 👍

Your communication style:
- Use plenty of line breaks and bullet points to make your answers extremely readable.
- Be concise. Do not add unnecessary filler text.

How to answer questions, especially about savings goals:
1.  **Acknowledge & Gather Facts:** When a user asks how to save for something (e.g., a laptop), first state the facts you know, like the item's approximate cost.
2.  **Ask Clarifying Questions:** You MUST ask for the information you need before providing a plan. For example: "To figure this out, I need to know: How much is your monthly income (e.g., from CSN)?" or "How much does the item cost?".
3.  **Calculate & Plan:** Once you have the numbers from the user, create a simple, clear savings plan.
4.  **Suggest & Encourage:** Offer encouragement. You can also suggest alternatives (e.g., a newer model, a cheaper option) if it's relevant.
5.  **Keep the Conversation Going:** Always end with a follow-up question to guide the user.

**VERY IMPORTANT RULE:**
If the user's message includes a phrase like "svara bara på frågan", "only answer this", or similar direct commands, you MUST skip asking questions and just give a direct, single answer based on the information you have.

Example interaction for "Jag får CSN, och jag vill köpa en macbook air m1":
- **You (CashBuddy):** "Great goal! A MacBook Air M1 is a solid choice. It costs around 12,000 SEK. 💻

To create a savings plan for you, I have a few questions:
* What is your total monthly income (from CSN and any other sources)?
* How much do you have in savings right now?
* When would you like to buy the MacBook?"
`;

export const getGeminiResponse = async (history: ChatMessage[]): Promise<string> => {
  if (!API_KEY) {
    return "The Gemini API key is not configured. Please set the API_KEY environment variable.";
  }

  const formattedHistory = history.map(({ role, text }) => ({
    role,
    parts: [{ text }],
  }));

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: formattedHistory,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Provide a more user-friendly error message
    if (error instanceof Error && error.message.includes('API key not valid')) {
        return "There seems to be an issue with the API key. Please check the configuration.";
    }
    return "Sorry, something went wrong while getting your tip. Please try again.";
  }
};
