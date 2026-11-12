
import React from 'react'

const Input = () => {
  return (
    <div className="w-full px-6 pb-6">
      <div className="mx-auto max-w-3xl">

        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">

          <input
            type="text"
            placeholder="Ask anything about your uploaded documents..."
            className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
          />

          <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-500">
            ↑
          </button>

        </div>

        <p className="mt-3 text-center text-xs text-gray-400">
          KnowledgeBase AI can make mistakes. Verify important information with the original sources.
        </p>

      </div>
    </div>
  )
}

export default Input
