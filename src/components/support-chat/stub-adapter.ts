"use client";

import { useCallback, useMemo, useState } from "react";

import type { SupportChatAdapter, SupportChatMessage } from "./types";

const WELCOME_ID = "welcome";

function welcomeMessage(): SupportChatMessage {
  return {
    id: WELCOME_ID,
    role: "assistant",
    content:
      "Hi — I can help with GST scan, claim packs, reminders, and your vault. Ask anything about OwnCover.",
    createdAt: Date.now(),
  };
}

/** Placeholder until you plug in your chat backend from the other branch. */
export function useStubSupportChatAdapter(): SupportChatAdapter {
  const [messages, setMessages] = useState<SupportChatMessage[]>(() => [
    welcomeMessage(),
  ]);
  const [status, setStatus] = useState<SupportChatAdapter["status"]>("idle");

  const sendUserMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: SupportChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      createdAt: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setStatus("loading");

    await new Promise((resolve) => setTimeout(resolve, 400));

    setMessages((prev) => [
      ...prev,
      {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content:
          "Chat backend is not connected on this build yet. Hook your assistant via `SupportChatProvider adapter={...}` or `attachSupportChat()`.",
        createdAt: Date.now(),
      },
    ]);
    setStatus("idle");
  }, []);

  const clearConversation = useCallback(() => {
    setMessages([welcomeMessage()]);
    setStatus("idle");
  }, []);

  return useMemo(
    () => ({
      messages,
      status,
      sendUserMessage,
      clearConversation,
    }),
    [messages, status, sendUserMessage, clearConversation]
  );
}
