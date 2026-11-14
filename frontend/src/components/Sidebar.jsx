
import React from 'react'
import API from '../services/api'
import { useState } from 'react'
import { uploadDocument } from "../services/documentService";
const Sidebar = () => {
  const [file, setFile]  =useState("")
  const [uploading, setUploading] = useState(false);
const [uploadMessage, setUploadMessage] = useState("");

  const handleFileChange = async (event) => {
  const file = event.target.files[0];

  if (!file) return;

  if (file.type !== "application/pdf") {
    setUploadMessage("Please select a PDF file.");
    return;
  }

  try {
    setUploading(true);
    setUploadMessage("");

    const response = await uploadDocument(file);

    setUploadMessage(response.message);
    console.log("Uploaded document:", response.document);

  } catch (error) {
    console.error("Upload failed:", error);

    setUploadMessage(
      error.response?.data?.message || "Upload failed."
    );

  } finally {
    setUploading(false);
    event.target.value = "";
  }
};
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-[#111318] p-4 text-white">

      {/* Logo */}
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold">
          K
        </div>
        <h1 className="text-lg font-semibold tracking-tight">
          KnowledgeBase <span className="text-blue-400">AI</span>
        </h1>
      </div>

      {/* New Chat */}
      <button className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium transition hover:bg-blue-500">
        <span className="text-lg">+</span>
        New Chat
      </button>

      {/* History */}
      <div className="mt-8 flex-1">
        <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Recent Chats
        </p>

        <div className="space-y-1">
          <button className="w-full rounded-lg bg-white/10 px-3 py-2.5 text-left text-sm text-white">
            What is React?
          </button>

          <button className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-gray-400 transition hover:bg-white/5 hover:text-white">
            Explain authentication
          </button>

          <button className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-gray-400 transition hover:bg-white/5 hover:text-white">
            Database indexing
          </button>
        </div>
      </div>

      {/* Bottom section */}
    
{/* Bottom section */}
<div className="border-t border-white/10 pt-4">
{uploadMessage && (
  <p className="text-sm text-gray-400">
    {uploadMessage}
  </p>
)}
  <label
    htmlFor="document-upload"
    className="flex w-full cursor-pointer items-center gap-3 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-500"
  >
    <span className="text-lg" >+</span>
    {uploading ? "Uploading..." : "Upload Documents"}
  </label>

  <input
  id="document-upload"
  type="file"
  accept=".pdf,application/pdf"
  onChange={handleFileChange}
  disabled={uploading}
  className="hidden"
/>

  <p className="mt-3 px-2 text-xs text-gray-500">
    Upload PDFs to build your knowledge base.
  </p>

  <p className="mt-3 px-2 text-xs text-gray-600">
    KnowledgeBase AI v1.0
  </p>

</div>

    </aside>
  )
}

export default Sidebar
