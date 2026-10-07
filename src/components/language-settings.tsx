"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { Locale } from "@/lib/locale";

const OPTIONS: { value: Locale; label: string }[] = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिन्दी" },
];

export default function LanguageSettings({ initialLocale }: { initialLocale: Locale }) {
  const router = useRouter();
  const [locale, setLocale] = useState(initialLocale);
  const [saving, setSaving] = useState(false);

  async function choose(next: Locale) {
    if (next === locale || saving) return;
    setSaving(true);
    try {
      const response = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: next }),
      });
      if (!response.ok) throw new Error("Failed to save language");
      setLocale(next);
      router.refresh();
      toast.success(next === "hi" ? "भाषा हिन्दी पर सेट की गई" : "Language set to English");
    } catch {
      toast.error("Could not save language");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="inline-flex rounded-xl border border-white/10 p-1">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          lang={option.value}
          disabled={saving}
          aria-pressed={locale === option.value}
          onClick={() => void choose(option.value)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-60 ${
            locale === option.value
              ? "bg-white text-black"
              : "text-gray-300 hover:text-white"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
