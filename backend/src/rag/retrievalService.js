
import { generateEmbedding } from "./embeddingService.js";

export const searchSimilarChunks = async ({
  query,
  supabaseClient,
  documentId = null,
  matchCount = 5,
  matchThreshold = 0.35
}) => {
  if (!query || !query.trim()) {
    throw new Error("Search query cannot be empty");
  }

  // 1. Convert the user's question into an embedding
  const queryEmbedding = await generateEmbedding(query);

  // 2. Search Supabase using vector similarity
  const { data, error } = await supabaseClient.rpc(
    "match_document_chunks",
    {
      query_embedding: queryEmbedding,
      match_threshold: matchThreshold,
      match_count: matchCount,
      filter_document_id: documentId
    }
  );

  if (error) {
    throw error;
  }

  // 3. Return the matching document chunks
  return data;
};
