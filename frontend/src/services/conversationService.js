import API from "./api";

// Create a new conversation
export const createConversation = async (title = "New Chat") => {
  const { data } = await API.post("/api/conversations", {
    title
  });

  return data.conversation;
};

// Get all conversations
export const getConversations = async () => {
  const { data } = await API.get("/api/conversations");

  return data.conversations;
};

// Save a message
export const saveMessage = async ({
  conversationId,
  role,
  content,
  sources = []
}) => {
  const { data } = await API.post("/api/conversations/messages", {
    conversationId,
    role,
    content,
    sources
  });

  return data.savedMessage;
};

// Get messages of a conversation
export const getMessages = async (conversationId) => {
  const { data } = await API.get(
    `/api/conversations/${conversationId}/messages`
  );

  return data.messages;
};

// Delete a conversation
export const deleteConversation = async (conversationId) => {
  const { data } = await API.delete(
    `/api/conversations/${conversationId}`
  );

  return data;
};