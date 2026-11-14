
const Output = ({ messages = [] }) => {
  if (messages.length === 0) {
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
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-5 py-4 ${
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "border border-gray-200 bg-white text-gray-800 shadow-sm"
              }`}
            >
              <p className="whitespace-pre-wrap text-sm leading-7">
               {message.content}

{message.role === "assistant" &&
  message.status === "thinking" && (
    <span className="animate-pulse text-gray-400">
      Thinking...
    </span>
  )}

{message.role === "assistant" &&
  message.status === "error" && (
    <span className="text-red-500">
      Something went wrong.
    </span>
  )}
              </p>

              {message.role === "assistant" && message.sources?.length > 0 && (
                <p className="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-500">
                  Retrieved {message.sources.length} relevant document passages.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Output;
