
import { GoogleGenAI, GenerateContentResponse, Chat } from '@google/genai';
import { GEMINI_MODEL_TEXT } from '../constants';

// This file is a placeholder for more complex Gemini interactions.
// Currently, basic chat and content generation are initialized directly in components.
// For a larger application, you would centralize API calls here.

/**
 * Initializes a new Gemini chat session.
 * @param apiKey The Google AI API Key.
 * @param systemInstruction Optional system instruction for the chat model.
 * @returns A new Chat instance.
 * @throws Error if API key is missing or initialization fails.
 */
export const initializeChat = (apiKey: string, systemInstruction?: string): Chat => {
  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
    throw new Error("Gemini API Key is not configured.");
  }
  const ai = new GoogleGenAI({ apiKey });
  return ai.chats.create({
    model: GEMINI_MODEL_TEXT,
    config: {
      ...(systemInstruction && { systemInstruction }),
    },
  });
};

/**
 * Generates content from the Gemini model.
 * @param apiKey The Google AI API Key.
 * @param prompt The prompt to send to the model.
 * @returns The generated text content.
 * @throws Error if API key is missing or generation fails.
 */
export const generateContent = async (apiKey: string, prompt: string): Promise<string> => {
  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
    throw new Error("Gemini API Key is not configured.");
  }
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: GEMINI_MODEL_TEXT,
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    throw error;
  }
};

// Example usage (not called directly by components yet, they handle their own instances):
/*
export const getAIChatReplyStream = async (chatInstance: Chat, message: string) => {
  try {
    const result = await chatInstance.sendMessageStream({ message });
    return result; // Stream of GenerateContentResponse
  } catch (error) {
    console.error("Error sending message to Gemini Chat:", error);
    throw error;
  }
};
*/
