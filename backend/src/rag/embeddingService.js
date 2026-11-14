
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export const generateEmbedding = async (text) => {
  if (!text || !text.trim()) {
    throw new Error("Text cannot be empty");
  }

  const response = await ai.models.embedContent({
    model: "gemini-embedding-2",
    contents: text,
    config: {
      outputDimensionality: 768
    }
  });

  const embedding = response.embeddings?.[0]?.values;

  if (!embedding || embedding.length !== 768) {
    throw new Error("Invalid embedding generated");
  }

  return embedding;
};
