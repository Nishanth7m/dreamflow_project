
const { GoogleGenAI, Type } = require("@google/genai");

// Helper to convert string type names to Type enum values for responseSchema
const stringToType = (typeString) => {
  switch (typeString) {
    case "OBJECT": return Type.OBJECT;
    case "STRING": return Type.STRING;
    case "NUMBER": return Type.NUMBER;
    case "INTEGER": return Type.INTEGER;
    case "BOOLEAN": return Type.BOOLEAN;
    case "ARRAY": return Type.ARRAY;
    case "NULL": return Type.NULL;
    default: return Type.TYPE_UNSPECIFIED;
  }
};

// Recursive function to convert stringified Type enum values back to actual Type enum values
const convertSchemaTypes = (schema) => {
  if (!schema) return schema;
  const newSchema = { ...schema };
  if (newSchema.type) {
    newSchema.type = stringToType(newSchema.type);
  }
  if (newSchema.properties) {
    for (const key in newSchema.properties) {
      newSchema.properties[key] = convertSchemaTypes(newSchema.properties[key]);
    }
  }
  if (newSchema.items) {
    newSchema.items = convertSchemaTypes(newSchema.items);
  }
  return newSchema;
};


exports.handler = async (event) => {
  // Ensure this environment variable is set in Netlify dashboard
  const API_KEY = process.env.API_KEY; 

  if (!API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API_KEY environment variable not set for Netlify Function. Please configure it in your Netlify site settings." }),
    };
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  try {
    const { modelName, contents, config } = JSON.parse(event.body);

    if (!modelName || !contents) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing 'modelName' or 'contents' in request body." }),
      };
    }

    const finalConfig = { ...config };
    // Convert stringified Type enum values in responseSchema back to Type enum
    if (finalConfig.responseSchema) {
      finalConfig.responseSchema = convertSchemaTypes(finalConfig.responseSchema);
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: contents,
      config: finalConfig,
    });

    let resultData;
    if (finalConfig.responseMimeType === "application/json") {
      try {
        resultData = JSON.parse(response.text || '{}');
      } catch (jsonError) {
        console.warn("Failed to parse AI response as JSON:", response.text, jsonError);
        // If parsing fails, return the raw text, the client can handle it
        resultData = response.text; 
      }
    } else {
      resultData = response.text;
    }
    
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: resultData }),
    };
  } catch (error) {
    console.error("Gemini proxy error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message || "Internal server error during AI processing." }) };
  }
};
