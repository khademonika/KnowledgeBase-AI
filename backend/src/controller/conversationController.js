export const createConversation = async (req, res) => {
  try {
    const { title } = req.body;

    const { data, error } = await req.supabase
      .from("conversations")
      .insert({
        user_id: req.user.id,
        title: title?.trim() || "New Chat"
      })
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      message: "Conversation created successfully",
      conversation: data
    });

  } catch (error) {
    console.error("Create conversation error:", error);

    return res.status(500).json({
      message: "Failed to create conversation"
    });
  }
};


export const getConversations = async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from("conversations")
      .select("id, title, created_at, updated_at")
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return res.status(200).json({
      conversations: data
    });

  } catch (error) {
    console.error("Get conversations error:", error);

    return res.status(500).json({
      message: "Failed to fetch conversations"
    });
  }
};


export const saveMessage = async (req, res) => {
  try {
    const { conversationId, role, content, sources = [] } = req.body;

    // Validate required fields
    if (!conversationId || !role || !content?.trim()) {
      return res.status(400).json({
        message: "Conversation ID, role and content are required"
      });
    }

    if (!["user", "assistant"].includes(role)) {
      return res.status(400).json({
        message: "Invalid message role"
      });
    }

    // Save the message
    const { data, error } = await req.supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        role,
        content,
        sources
      })
      .select()
      .single();

    if (error) throw error;

    // Update conversation's last activity
    const { error: updateError } = await req.supabase
      .from("conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId);

    if (updateError) throw updateError;

    return res.status(201).json({
      message: "Message saved successfully",
      savedMessage: data
    });

  } catch (error) {
    console.error("Save message error:", error);

    return res.status(500).json({
      message: "Failed to save message"
    });
  }
};


export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!conversationId) {
      return res.status(400).json({
        message: "Conversation ID is required"
      });
    }

    const { data, error } = await req.supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return res.status(200).json({
      messages: data
    });

  } catch (error) {
    console.error("Get messages error:", error);

    return res.status(500).json({
      message: "Failed to fetch messages"
    });
  }
};