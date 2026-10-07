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

type ReplyBody = {
  reply?: string;
  links?: SupportChatMessage["links"];
  error?: string;
};

/** Answers from the help pages, plus vault counts when signed in. */
export function useRagSupportChatAdapter(): SupportChatAdapter {
  const [messages, setMessages] = useState<SupportChatMessage[]>(() => [
    welcomeMessage(),
  ]);
  const [status, setStatus] = useState<SupportChatAdapter["status"]>("idle");

  const sendUserMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: "user", content: trimmed, createdAt: Date.now() },
    ]);
    setStatus("loading");

    let reply: SupportChatMessage;
    try {
      const response = await fetch("/api/support/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const body = (await response.json().catch(() => ({}))) as ReplyBody;

      reply = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content:
          response.ok && body.reply
            ? body.reply
            : body.error || "I could not answer that right now. Try again in a moment.",
        links: response.ok ? body.links : undefined,
        createdAt: Date.now(),
      };
      setStatus(response.ok ? "idle" : "error");
    } catch {
      reply = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: "You seem to be offline. Check your connection and try again.",
        createdAt: Date.now(),
      };
      setStatus("error");
    }

    setMessages((prev) => [...prev, reply]);
  }, []);

  const clearConversation = useCallback(() => {
    setMessages([welcomeMessage()]);
    setStatus("idle");
  }, []);

  return useMemo(
    () => ({ messages, status, sendUserMessage, clearConversation }),
    [messages, status, sendUserMessage, clearConversation]
  );
}
