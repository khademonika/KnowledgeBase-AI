
import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import AuthPage from "./components/AuthPage";
import Sidebar from "./components/Sidebar";
import Input from "./components/Input";
import Output from "./components/Output";
import { streamChatWithDocuments } from "./services/api";
import {
  getConversations,
  createConversation,
  saveMessage,
  getMessages

} from "./services/conversationService";
export default function App() {
  const { user, loading, logout } = useAuth();

  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
useEffect(() => {
  if (!user) return;

  const loadConversations = async () => {
    try {
      const data = await getConversations();

      setConversations(data);

      // Restore the latest conversation
      if (data.length > 0) {
        const latestConversation = data[0];

        setActiveConversationId(latestConversation.id);

        const previousMessages = await getMessages(
          latestConversation.id
        );

        setMessages(previousMessages);
      }
    } catch (error) {
      console.error("Failed to restore conversations:", error);
    }
  };

  loadConversations();
}, [user]);
const handleSelectConversation = async (conversationId) => {
  try {
    const data = await getMessages(conversationId);

    setMessages(data);
    setActiveConversationId(conversationId);

  } catch (error) {
    console.error("Failed to load messages:", error);
  }
};
  const handleSendMessage = async (question) => {
    if (!question.trim() || isStreaming) return;
    let conversationId = activeConversationId;

    if (!conversationId) {
      const newConversation = await createConversation(
        question.slice(0, 40)
      );

      conversationId = newConversation.id;

      setActiveConversationId(conversationId);

      setConversations((prev) => [
        newConversation,
        ...prev
      ]);
    }
    await saveMessage({
      conversationId,
      role: "user",
      content: question
    });
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
    const completedMessage = messages.find(
      (message) => message.id === assistantMessage.id
    );

    setIsStreaming(true);
    let assistantContent = "";
    let assistantSources = [];

    try {
      await streamChatWithDocuments(question, {
        onToken: (token) => {
          assistantContent += token;
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
          assistantSources = sources;
          setMessages((prev) =>
            prev.map((message) =>
              message.id === assistantMessage.id
                ? { ...message, sources }
                : message
            )
          );
        }
      });
      await saveMessage({
        conversationId,
        role: "assistant",
        content: assistantContent,
        sources: assistantSources
      });
      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantMessage.id
            ? { ...message, status: "completed" }
            : message
        )
      );
    } catch (error) {

      console.error("Chat streaming error:", error, { status: "error" });
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
      <Sidebar conversations={conversations}
        activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation} />

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
