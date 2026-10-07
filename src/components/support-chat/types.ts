export type SupportChatRole = "user" | "assistant" | "system";

export type SupportChatMessage = {
  id: string;
  role: SupportChatRole;
  content: string;
  createdAt?: number;
  links?: { title: string; href: string }[];
};

export type SupportChatStatus = "idle" | "loading" | "error";

/** Wire your backend by passing this to `SupportChatProvider` or `attachSupportChat`. */
export type SupportChatAdapter = {
  messages: SupportChatMessage[];
  status: SupportChatStatus;
  sendUserMessage: (text: string) => void | Promise<void>;
  clearConversation?: () => void;
};

export type SupportChatSuggestion = {
  id: string;
  label: string;
  message: string;
};
