"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

import { getAttachedSupportChat } from "./attach";
import { useRagSupportChatAdapter } from "./rag-adapter";
import SupportChatWidget from "./widget";
import type { SupportChatAdapter } from "./types";

const SupportChatContext = createContext<SupportChatAdapter | null>(null);

export function useSupportChat() {
  const ctx = useContext(SupportChatContext);
  if (!ctx) {
    throw new Error("useSupportChat must be used within SupportChatProvider");
  }
  return ctx;
}

type Props = {
  children: ReactNode;
  /** Pass a custom chat engine here. Falls back to `attachSupportChat`, then the help-search adapter. */
  adapter?: SupportChatAdapter;
  /** Set false to hide the floating launcher (e.g. in tests). Default true. */
  showWidget?: boolean;
};

export function SupportChatProvider({
  children,
  adapter,
  showWidget = true,
}: Props) {
  const help = useRagSupportChatAdapter();
  const attached = getAttachedSupportChat();

  const value = useMemo(
    () => adapter ?? attached ?? help,
    [adapter, attached, help]
  );

  return (
    <SupportChatContext.Provider value={value}>
      {children}
      {showWidget ? <SupportChatWidget /> : null}
    </SupportChatContext.Provider>
  );
}
