
import crypto from "crypto";

export const uploadDocument = async (req, res) => {
  let storagePath;

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

    // 6. Send successful response
    return res.status(201).json({
      message: "Document uploaded successfully",
      document
    });

  } catch (error) {
    console.error("Document upload error:", error);

    // Remove stored PDF if database insertion failed
    if (storagePath) {
      await req.supabase.storage
        .from("documents")
        .remove([storagePath]);
    }

    return res.status(500).json({
      message: "Failed to upload document"
    });
  }
};
