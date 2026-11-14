import { searchSimilarChunks } from "../rag/retrievalService.js";

export const searchDocuments = async (req, res) => {
  try {
    const { query, documentId } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({
        message: "Please provide a search query"
      });
    }

    const results = await searchSimilarChunks({
      query,
      supabaseClient: req.supabase,
      documentId: documentId || null,
      matchCount: 5,
      matchThreshold: 0.35
    });

    return res.status(200).json({
      message: "Semantic search completed successfully",
      totalResults: results.length,
      results
    });

  } catch (error) {
    console.error("Semantic search error:", error);

    return res.status(500).json({
      message: "Failed to search documents"
    });
  }
};