import { GoogleGenerativeAI } from '@google/generative-ai'; // Import Gemini SDK
import dotenv from 'dotenv';

dotenv.config();

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const invokeLLM = async ({ prompt, add_context_from_internet, response_json_schema }) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in environment variables.');
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' }); // Use gemini-pro model

    let fullPrompt = prompt;
    let systemInstruction = 'You are a helpful AI assistant. Provide concise and accurate answers.';

    // Augment prompt for structured output if schema is provided
    if (response_json_schema && typeof response_json_schema === 'object' && response_json_schema.type === 'object') {
      systemInstruction += ` Your response MUST be a JSON object conforming to the following JSON schema:\n${JSON.stringify(response_json_schema, null, 2)}\n`;
      fullPrompt = `Output your response as JSON. ${prompt}`; // Prepend to user prompt
    }

    // Augment prompt for external context if requested
    if (add_context_from_internet) {
      systemInstruction += " When appropriate, leverage common knowledge or simulate external data where relevant.";
    }
    
    const generationConfig = {
      temperature: 0.7, // Adjust creativity (0.0 - 1.0)
      topP: 1,
      topK: 1,
      maxOutputTokens: 2048, // Max response length
    };

    // For Gemini, we typically send the system instruction and user prompt as parts of a single turn.
    // However, the `getGenerativeModel` can also take a `systemInstruction` directly,
    // which is a better way to handle it for persistent instructions.
    // If systemInstruction is dynamic based on schema, then combining into the prompt is fine.
    // For simplicity with gemini-pro's `generateContent` taking a string, we combine.

    // A better way to structure system instructions with Gemini SDK:
    const chat = model.startChat({
        generationConfig,
        history: [
            // Potentially add some system-like context here if needed, or let model manage
            // For general API calls, a simple generateContent(prompt) is often sufficient
        ],
        // The `systemInstruction` feature is more robust in newer Gemini models (like 1.5 Pro)
        // For gemini-pro, including in prompt is often more reliable
    });

    // For gemini-pro, often the simplest way is to put instructions directly in the prompt
    // and rely on model's ability to follow instructions.
    const combinedPrompt = `${systemInstruction}\n\nUser query: ${fullPrompt}`;

    const result = await model.generateContent(combinedPrompt);
    const response = await result.response;
    const text = response.text();

    // Attempt to parse JSON if structured output was requested
    if (response_json_schema) {
      try {
        return JSON.parse(text);
      } catch (jsonError) {
        console.warn('Failed to parse Gemini response as JSON. Returning raw text.', jsonError);
        // Fallback to returning raw text if JSON parsing fails
        return { content: text, model: 'Gemini Pro (JSON parse failed)' };
      }
    }

    return { content: text, model: 'Gemini Pro' };

  } catch (error) {
    console.error('Error invoking Gemini LLM:', error.message);
    if (error.message.includes('API_KEY_INVALID')) {
      throw new Error('Google Gemini API Key is invalid. Please check your GEMINI_API_KEY.');
    }
    if (error.message.includes('quota') || error.message.includes('rate limit')) {
      throw new Error('You exceeded your current Gemini quota or rate limit. Please check your project usage.');
    }
    throw new Error('Failed to get response from AI. Please try again later. Details: ' + error.message);
  }
};
