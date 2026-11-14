
import { searchSimilarChunks } from "../rag/retrievalService.js";
import { generateAnswer } from "../rag/generationService.js";

export const chatWithDocuments = async (req, res) => {
  try {
    const { question, documentId } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({
        message: "Please provide a question"
      });
    }

    console.time("TOTAL REQUEST");

    console.time("RETRIEVAL");
    const chunks = await searchSimilarChunks({
      query: question,
      supabaseClient: req.supabase,
      documentId: documentId || null,
      matchCount: 5,
      matchThreshold: 0.35
    });
    console.log("RETRIEVED CHUNKS:");
console.log("\nQUESTION:", question);

console.log("\nFULL RETRIEVED CONTEXT:");

chunks.forEach((chunk, index) => {
  console.log(`\n--- CHUNK ${index + 1} ---`);
  console.log("Similarity:", chunk.similarity);
  console.log("Content:", chunk.content);
});

    console.timeEnd("RETRIEVAL");

    console.time("GENERATION");
    const answer = await generateAnswer(question, chunks);
    console.timeEnd("GENERATION");

    console.timeEnd("TOTAL REQUEST");

console.log("\nGENERATED ANSWER:", answer);
    return res.status(200).json({
      message: "Answer generated successfully",
      answer,
      sources: chunks.map((chunk) => ({
        documentId: chunk.document_id,
        chunkId: chunk.chunk_id,
        chunkIndex: chunk.chunk_index,
        similarity: chunk.similarity
      }))
    });

  } catch (error) {
    console.error("Chat error:", error);

    return res.status(500).json({
      message: "Failed to generate answer"
    });
  }
};
