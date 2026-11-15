
import { searchSimilarChunks } from "../rag/retrievalService.js";
import { generateAnswer } from "../rag/generationService.js";
import { generateAnswerStream } from "../rag/generationService.js";
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



export const streamChatWithDocuments = async (req, res) => {
  let clientDisconnected = false;

  req.on("close", () => {
    if (!res.writableEnded) {
      clientDisconnected = true;
    }
  });

  try {
    const { question, documentId } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        message: "Please provide a question"
      });
    }

    // 1. Retrieve relevant document chunks
    const chunks = await searchSimilarChunks({
      query: question,
      supabaseClient: req.supabase,
      documentId: documentId || null,
      matchCount: 5,
      matchThreshold: 0.35
    });

    if (clientDisconnected) return;

    // 2. Configure Server-Sent Events
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");

    res.flushHeaders?.();
    const documentIds = [
  ...new Set(chunks.map((chunk) => chunk.document_id))
];

const { data: documents, error: documentsError } =
  await req.supabase
    .from("documents")
    .select("id, filename")
    .in("id", documentIds);

if (documentsError) throw documentsError;

const documentMap = new Map(
  documents.map((doc) => [doc.id, doc.filename])
);

    // 3. Send retrieved source information
res.write(`event: sources
data: ${JSON.stringify(
  chunks.map((chunk) => ({
    documentId: chunk.document_id,
    documentName: documentMap.get(chunk.document_id),
    chunkId: chunk.chunk_id,
    chunkIndex: chunk.chunk_index,
   
    similarity: chunk.similarity,
     content: chunk.content.slice(0, 250)
  }))
)}\n\n`);
    // 4. Generate and stream the answer
    for await (const token of generateAnswerStream(question, chunks)) {
      if (clientDisconnected) return;

      res.write(
        `event: token\ndata: ${JSON.stringify({ token })}\n\n`
      );
    }

    // 5. Notify frontend that generation is complete
    if (!clientDisconnected) {
      res.write("event: done\ndata: {}\n\n");
      res.end();
    }

  } catch (error) {
    console.error("Streaming chat error:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        message: "Failed to generate answer"
      });
    }

    if (!clientDisconnected && !res.writableEnded) {
      res.write(
        `event: error\ndata: ${JSON.stringify({
          message: "Failed to generate answer"
        })}\n\n`
      );

      res.end();
    }
  }
};
