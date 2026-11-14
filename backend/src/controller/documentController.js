
import crypto from "crypto";
import { extractPdfText } from "../services/pdfService.js";
import { splitTextIntoChunks } from "../rag/chunkService.js";
import { generateEmbedding } from "../rag/embeddingService.js";
export const uploadDocument = async (req, res) => {
  let storagePath;
let storageUploaded = false;
let documentId = null;

  try {
    // 1. Check whether a file was received
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a PDF file"
      });
    }

    // 2. Verify the actual PDF signature
    const isPDF = req.file.buffer
      .subarray(0, 5)
      .toString() === "%PDF-";

    if (!isPDF) {
      return res.status(400).json({
        message: "Invalid PDF file"
      });
    }
    // Extract text from the uploaded PDF
const extractedText = await extractPdfText(req.file.buffer);
// Generate text chunks
const chunks = splitTextIntoChunks(extractedText);

console.log("Total chunks generated:", chunks.length);
console.log("PDF text extracted successfully!");
console.log("Total characters:", extractedText.length);
console.log("Text preview:", extractedText.slice(0, 500));

    // 3. Generate a unique storage path
    const safeFilename = req.file.originalname.replace(
      /[^a-zA-Z0-9._-]/g,
      "_"
    );

    storagePath = `${req.user.id}/${crypto.randomUUID()}-${safeFilename}`;

    // 4. Upload PDF to Supabase Storage
    const { error: storageError } = await req.supabase
      .storage
      .from("documents")
      .upload(storagePath, req.file.buffer, {
        contentType: "application/pdf",
        upsert: false
      });

    if (storageError) {
      throw storageError;
    }
storageUploaded = true;

    // 5. Save document metadata in PostgreSQL
    const { data: document, error: databaseError } = await req.supabase
      .from("documents")
      .insert({
        user_id: req.user.id,
        filename: req.file.originalname,
        storage_path: storagePath,
        file_size: req.file.size,
        status: "uploaded"
      })
      .select()
      .single();
    if (databaseError) {
      throw databaseError;
    }
documentId = document.id;

// Update document status
// const { error: statusError } = await req.supabase
//   .from("documents")
//   .update({ status: "processing" })
//   .eq("id", document.id);

// if (statusError) {
//   throw statusError;
// }

// 1. Update document status
const { error: statusError } = await req.supabase
  .from("documents")
  .update({ status: "processing" })
  .eq("id", document.id);

if (statusError) throw statusError;

// 2. Generate embeddings for every chunk
const chunkRecords = [];

for (const chunk of chunks) {
  console.log(`Generating embedding for chunk ${chunk.chunk_index}`);

  const embedding = await generateEmbedding(chunk.content);

  chunkRecords.push({
    document_id: document.id,
    chunk_index: chunk.chunk_index,
    content: chunk.content,
    embedding: embedding
  });
}

// 3. Store chunks and embeddings in PostgreSQL
if (chunkRecords.length > 0) {
  const { error: chunkError } = await req.supabase
    .from("document_chunks")
    .insert(chunkRecords);

  if (chunkError) throw chunkError;
}

console.log("Chunks and embeddings stored successfully!");


// 4. Mark processing as completed
const { error: completedError } = await req.supabase
  .from("documents")
  .update({ status: "completed" })
  .eq("id", document.id);

if (completedError) throw completedError;

// Prepare chunk records
// const chunkRecords = chunks.map((chunk) => ({
//   document_id: document.id,
//   chunk_index: chunk.chunk_index,
//   content: chunk.content
// }));


  return res.status(201).json({
  message: "Document uploaded and processed successfully",
  document: {
    ...document,
    status: "completed"
  }
});

  } catch (error) {
  console.error("Document processing error:", error);

  if (documentId) {
    const { error: updateError } = await req.supabase
      .from("documents")
      .update({ status: "failed" })
      .eq("id", documentId);

    if (updateError) {
      console.error("Failed to update document status:", updateError);
    }

  } else if (storageUploaded && storagePath) {
    const { error: cleanupError } = await req.supabase
      .storage
      .from("documents")
      .remove([storagePath]);

    if (cleanupError) {
      console.error("Storage cleanup failed:", cleanupError);
    }
  }

  return res.status(500).json({
    message: "Document processing failed"
  });
}}


export const getUserDocuments = async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from("documents")
      .select("id, filename, file_size, status, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return res.status(200).json({
      message: "Documents fetched successfully",
      documents: data
    });

  } catch (error) {
    console.error("Fetch documents error:", error);

    return res.status(500).json({
      message: "Failed to fetch documents"
    });
  }
}
