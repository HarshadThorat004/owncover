"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  MessageCircle,
  Minus,
  SendHorizontal,
  Sparkles,
  X,
} from "lucide-react";

import { BRAND_NAME } from "@/constants/brand";

import { SUPPORT_CHAT_SUGGESTIONS } from "./constants";
import { useSupportChat } from "./provider";

export default function SupportChatWidget() {
  const titleId = useId();
  const { messages, status, sendUserMessage, clearConversation } =
    useSupportChat();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    if (open) {
      scrollToBottom();
      const t = window.setTimeout(() => inputRef.current?.focus(), 120);
      return () => window.clearTimeout(t);
    }
  }, [open, messages.length, status, scrollToBottom]);

  useEffect(() => {
    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape" && open) {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  async function submit(text?: string) {
    const value = (text ?? draft).trim();
    if (!value || status === "loading") return;
    setDraft("");
    await sendUserMessage(value);
  }

  function onFormSubmit(event: FormEvent) {
    event.preventDefault();
    void submit();
  }

  function onInputKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submit();
    }
  }

  const visibleMessages = messages.filter((m) => m.role !== "system");
  const showSuggestions =
    visibleMessages.length <= 1 && status !== "loading";

  return (
    <div
      className="pointer-events-none fixed bottom-5 left-5 z-[55] flex flex-col items-start gap-3 sm:bottom-6 sm:left-6"
      aria-live="polite"
    >
      <AnimatePresence>
        {open ? (
          <motion.div
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto flex h-[min(520px,calc(100dvh-7rem))] w-[min(100vw-2.5rem,400px)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0c]/95 shadow-[0_24px_80px_rgba(0,0,0,0.65)] backdrop-blur-xl"
          >
            <header className="relative flex items-center gap-3 border-b border-white/10 px-4 py-3.5">
              <div
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"
                aria-hidden
              />
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-500/10">
                <Image
                  src="/brand/logo-mark.svg"
                  alt=""
                  width={22}
                  height={22}
                  className="opacity-90"
                />
                <span
                  className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-[#0a0a0c] ring-2 ring-[#0a0a0c]"
                  aria-hidden
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h2
                  id={titleId}
                  className="truncate text-sm font-semibold text-white"
                >
                  {BRAND_NAME} assistant
                </h2>
                <p className="truncate text-xs text-gray-500">
                  Warranties, scans & claim packs
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {clearConversation ? (
                  <button
                    type="button"
                    onClick={clearConversation}
                    className="rounded-lg p-2 text-gray-500 transition hover:bg-white/5 hover:text-gray-300"
                    aria-label="Minimize and keep chat"
                    title="New chat"
                  >
                    <Minus size={16} />
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-2 text-gray-500 transition hover:bg-white/5 hover:text-gray-300"
                  aria-label="Close chat"
                >
                  <X size={18} />
                </button>
              </div>
            </header>

            <div
              ref={listRef}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            >
              {visibleMessages.map((message) => {
                const isUser = message.role === "user";
                return (
                  <div
                    key={message.id}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    {!isUser ? (
                      <div
                        className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]"
                        aria-hidden
                      >
                        <Sparkles size={14} className="text-cyan-300/90" />
                      </div>
                    ) : null}
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-6 ${
                        isUser
                          ? "rounded-br-md bg-white text-black"
                          : "rounded-bl-md border border-white/10 bg-white/[0.04] text-gray-200"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                );
              })}

              {status === "loading" ? (
                <div className="flex justify-start pl-9">
                  <div className="flex gap-1 rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.04] px-4 py-3">
                    <span className="support-chat-dot animate-bounce [animation-delay:0ms]" />
                    <span className="support-chat-dot animate-bounce [animation-delay:120ms]" />
                    <span className="support-chat-dot animate-bounce [animation-delay:240ms]" />
                  </div>
                </div>
              ) : null}

              {showSuggestions ? (
                <div className="flex flex-wrap gap-2 pt-1 pl-9">
                  {SUPPORT_CHAT_SUGGESTIONS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => void submit(item.message)}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-gray-300 transition hover:border-cyan-400/30 hover:bg-cyan-500/10 hover:text-white"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <form
              onSubmit={onFormSubmit}
              className="border-t border-white/10 bg-black/20 p-3"
            >
              <div className="flex items-end gap-2 rounded-xl border border-white/10 bg-[#050506] px-2 py-2 focus-within:border-cyan-400/35 focus-within:shadow-[0_0_0_3px_rgba(34,211,238,0.08)]">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={onInputKeyDown}
                  placeholder="Ask about your vault…"
                  disabled={status === "loading"}
                  className="max-h-28 min-h-[2.25rem] flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-white outline-none placeholder:text-gray-600 disabled:opacity-50"
                  aria-label="Message"
                />
                <button
                  type="submit"
                  disabled={!draft.trim() || status === "loading"}
                  className="premium-btn premium-btn-solid flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-black disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30"
                  aria-label="Send message"
                >
                  <SendHorizontal size={16} />
                </button>
              </div>
              <p className="mt-2 px-1 text-[10px] leading-4 text-gray-600">
                Enter to send · Shift+Enter for new line
              </p>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        layout
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={open ? titleId : undefined}
        aria-label={open ? "Close assistant" : "Open assistant chat"}
        className="pointer-events-auto group relative flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-[#0c0c0f]/90 text-white shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md transition hover:border-cyan-400/40 hover:shadow-[0_12px_48px_rgba(34,211,238,0.15)]"
        whileTap={{ scale: 0.96 }}
      >
        <span
          className="absolute inset-0 rounded-full bg-cyan-400/20 opacity-0 blur-md transition group-hover:opacity-100"
          aria-hidden
        />
        <span
          className="absolute -inset-1 rounded-full border border-cyan-400/20 opacity-60 support-chat-pulse"
          aria-hidden
        />
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative"
            >
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative"
            >
              <MessageCircle size={24} className="text-cyan-100" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
