"use client";

import type { ReactNode } from "react";

import { SupportChatProvider } from "@/components/support-chat";

export default function SupportChatRoot({ children }: { children: ReactNode }) {
  return <SupportChatProvider>{children}</SupportChatProvider>;
}
