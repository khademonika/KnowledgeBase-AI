
import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import AuthPage from "./components/AuthPage";
import Sidebar from "./components/Sidebar";
import Input from "./components/Input";
import Output from "./components/Output";
import { streamChatWithDocuments } from "./services/api";

export default function App() {
  const { user, loading, logout } = useAuth();

  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const handleSendMessage = async (question) => {
    if (!question.trim() || isStreaming) return;

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: question
    };

  const assistantMessage = {
  id: crypto.randomUUID(),
  role: "assistant",
  content: "",
  sources: [],
  status: "thinking"
};
    setMessages((prev) => [
      ...prev,
      userMessage,
      assistantMessage
    ]);

    setIsStreaming(true);

    try {
    await streamChatWithDocuments(question, {
  onToken: (token) => {
    setMessages((prev) =>
      prev.map((message) =>
        message.id === assistantMessage.id
          ? {
              ...message,
              content: message.content + token,
              status: "streaming"
            }
          : message
      )
    );
  },

  onSources: (sources) => {
    setMessages((prev) =>
      prev.map((message) =>
        message.id === assistantMessage.id
          ? { ...message, sources }
          : message
      )
    );
  }
});

setMessages((prev) =>
  prev.map((message) =>
    message.id === assistantMessage.id
      ? { ...message, status: "completed" }
      : message
  )
);
    } catch (error) {

      console.error("Chat streaming error:", error,{status: "error"});
      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantMessage.id
            ? {
                ...message,
                content: message.content ||
                  "Sorry, something went wrong. Please try again."
              }
            : message
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="flex min-w-0 flex-1 flex-col">
        <div className="flex justify-end p-3">
          <button onClick={logout}>Logout</button>
        </div>

        <Output messages={messages} />

        <Input
          onSendMessage={handleSendMessage}
          disabled={isStreaming}
        />
      </main>
    </div>
  );
}
