"use client";

import { useEffect, useState } from "react";
import { Smartphone, X } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "oc_install_hint_dismissed";

export default function InstallAppHint() {
  const [promptEvent, setPromptEvent] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY)) return;

    function onPrompt(event: Event) {
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
    }

    function onInstalled() {
      setPromptEvent(null);
      localStorage.setItem(DISMISS_KEY, "1");
    }

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!promptEvent) return null;

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setPromptEvent(null);
  }

  async function install() {
    if (!promptEvent) return;
    await promptEvent.prompt();
    await promptEvent.userChoice;
    dismiss();
  }

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-neutral-950/80 p-4">
      <Smartphone size={18} className="shrink-0 text-cyan-300" />
      <p className="min-w-0 flex-1 text-sm text-gray-400">
        Add OwnCover to your home screen to scan bills straight from your phone.
      </p>
      <button
        type="button"
        onClick={() => void install()}
        className="min-h-11 rounded-xl bg-white px-4 text-sm font-semibold text-black"
      >
        Install
      </button>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss install hint"
        className="flex h-11 w-11 items-center justify-center rounded-xl text-gray-500 hover:bg-white/5 hover:text-white"
      >
        <X size={16} />
      </button>
    </div>
  );
}
