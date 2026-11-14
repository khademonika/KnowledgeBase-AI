import axios from "axios";
import { supabase } from "../lib/supabase";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

API.interceptors.request.use(
  async (config) => {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    const token = data.session?.access_token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;



export const streamChatWithDocuments = async (
  question,
  { documentId = null, onToken, onSources, signal } = {}
) => {
  // 1. Get the current user's access token
  const { data, error } = await supabase.auth.getSession();

  if (error) throw error;

  const token = data.session?.access_token;

  if (!token) {
    throw new Error("Please log in to continue.");
  }

  // 2. Send the request to the streaming endpoint
  const response = await fetch("http://localhost:5000/api/chat/stream", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ question, documentId }),
    signal
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Streaming request failed");
  }

  if (!response.body) {
    throw new Error("Streaming is not supported by this response.");
  }

  // 3. Read the response incrementally
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";
  let sources = [];

  const processEvent = (eventText) => {
    let eventName = "message";
    const dataLines = [];

    for (const line of eventText.split("\n")) {
      if (line.startsWith("event:")) {
        eventName = line.slice(6).trim();
      }

      if (line.startsWith("data:")) {
        dataLines.push(line.slice(5).trim());
      }
    }

    if (!dataLines.length) return;

    const payload = JSON.parse(dataLines.join("\n"));

    if (eventName === "sources") {
      sources = payload;
      onSources?.(sources);
    }

    if (eventName === "token") {
      onToken?.(payload.token);
    }

    if (eventName === "error") {
      throw new Error(payload.message);
    }
  };

  try {
    while (true) {
      const { value, done } = await reader.read();

      buffer += decoder.decode(value || new Uint8Array(), {
        stream: !done
      });

      // Normalize line endings
      buffer = buffer.replace(/\r\n/g, "\n");

      let boundary;

      while ((boundary = buffer.indexOf("\n\n")) !== -1) {
        const eventText = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);

        processEvent(eventText);
      }

      if (done) break;
    }

    // Process any remaining event
    if (buffer.trim()) {
      processEvent(buffer);
    }

    return { sources };

  } catch (error) {
    await reader.cancel().catch(() => {});
    throw error;
  }
};
