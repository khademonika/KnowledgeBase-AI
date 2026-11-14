import "dotenv/config";
import { generateEmbedding } from "./rag/embeddingService.js";

const test = async () => {
  try {
    const embedding = await generateEmbedding(
      "React is a JavaScript library for building user interfaces."
    );

    console.log("Embedding generated!");
    console.log("Dimensions:", embedding.length);
    console.log("First five values:", embedding.slice(0, 100));

  } catch (error) {
    console.error("Embedding error:", error.message);
  }
};

test();