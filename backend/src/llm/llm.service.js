import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const invokeLLM = async ({ prompt, add_context_from_internet, response_json_schema }) => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API Key is not set in environment variables.");
  }
  
  try {
    let messages = [
      { role: 'system', content: 'You are a helpful AI assistant. Provide concise and accurate answers.' },
      { role: 'user', content: prompt },
    ];

    let tools = [];
    let tool_choice = 'none';

    // OpenAI function calling for structured output
    if (response_json_schema) {
      // Ensure the response_json_schema is a valid JSON schema object
      if (typeof response_json_schema !== 'object' || !response_json_schema.type || response_json_schema.type !== 'object') {
        console.warn("Invalid response_json_schema provided. Falling back to text output.");
        response_json_schema = null; // Ignore invalid schema
      } else {
        tools.push({
          type: 'function',
          function: {
            name: 'get_structured_response',
            description: 'Generates a structured JSON response based on the request.',
            parameters: response_json_schema,
          },
        });
        tool_choice = { type: 'function', function: { name: 'get_structured_response' } };
      }
    }

    // For add_context_from_internet, in a real app, you'd integrate with a search API
    // and inject relevant results into the prompt. For this example, we'll just acknowledge it.
    if (add_context_from_internet) {
      messages[0].content += " The user has requested information that may require external context. Consider common knowledge or simulate external data.";
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // You can use "gpt-4" if you have access and configured
      messages: messages,
      tools: tools.length > 0 ? tools : undefined,
      tool_choice: tools.length > 0 ? tool_choice : undefined,
    });

    if (completion.choices[0].message.tool_calls && completion.choices[0].message.tool_calls.length > 0) {
      // Assuming only one tool call for structured output
      return JSON.parse(completion.choices[0].message.tool_calls[0].function.arguments);
    } else {
      return completion.choices[0].message.content;
    }

  } catch (error) {
    console.error("Error invoking LLM:", error.response ? error.response.data : error.message);
    throw new Error("Failed to get response from AI. Please check your OpenAI API key and balance.");
  }
};
