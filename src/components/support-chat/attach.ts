import type { SupportChatAdapter } from "./types";

let attached: SupportChatAdapter | null = null;

/**
 * Optional imperative hook-up for a client-only chat engine (e.g. after dynamic import).
 * Prefer passing `adapter` to `SupportChatProvider` when possible.
 */
export function attachSupportChat(adapter: SupportChatAdapter | null) {
  attached = adapter;
}

export function getAttachedSupportChat() {
  return attached;
}
