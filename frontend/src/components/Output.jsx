
import React from 'react'

const Output = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">

      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
        ✨
      </div>

      <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
        Welcome to KnowledgeBase AI
      </h1>

      <p className="mt-3 max-w-lg text-sm leading-6 text-gray-500">
        Your intelligent document assistant. Upload your documents,
        ask questions, and get accurate answers backed by your sources.
      </p>

      <div className="mt-10 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">

        <div className="rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-blue-300 hover:shadow-sm">
          <p className="font-medium text-gray-800">
            📄 Understand documents
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Get simple explanations from your uploaded PDFs.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-blue-300 hover:shadow-sm">
          <p className="font-medium text-gray-800">
            🔍 Find information
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Search your documents using natural language.
          </p>
        </div>

      </div>
    </div>
  )
}

export default Output
