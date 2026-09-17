"use client";

import { toast } from "sonner";
import { Copy, Printer, Share2 } from "lucide-react";

type Props = {
  productName: string;
  items: string[];
};

export default function CarryListActions({ productName, items }: Props) {
  const text = [
    `What to carry — ${productName}`,
    ...items.map((item) => `• ${item}`),
    "Do not leave originals at the desk. OwnCover does not file claims.",
  ].join("\n");

  async function copyList() {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Carry list copied");
    } catch {
      toast.error("Could not copy the list");
    }
  }

  async function shareList() {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: `What to carry — ${productName}`,
          text,
        });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      }
    }

    await copyList();
  }

  function printList() {
    const page = window.open("", "_blank", "noopener,noreferrer,width=640,height=720");
    if (!page) {
      toast.error("Allow pop-ups to print the list");
      return;
    }

    const rows = items
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join("");

    page.document.write(`<!doctype html><html><head><title>What to carry</title>
      <style>
        body { font-family: system-ui, sans-serif; padding: 32px; color: #111; }
        h1 { font-size: 20px; }
        p { color: #555; }
        li { margin: 8px 0; }
      </style></head><body>
      <p>OwnCover · desk list</p>
      <h1>${escapeHtml(productName)}</h1>
      <ul>${rows}</ul>
      <p>Print the GST invoice and this pack. Do not leave originals at the desk.</p>
      </body></html>`);
    page.document.close();
    page.focus();
    page.print();
  }

  return (
    <div className="mt-5 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={printList}
        className="premium-ghost inline-flex items-center gap-2 rounded-xl border border-white/10 px-3.5 py-2 text-sm font-medium text-gray-200"
      >
        <Printer size={14} />
        Print list
      </button>
      <button
        type="button"
        onClick={() => void shareList()}
        className="premium-ghost inline-flex items-center gap-2 rounded-xl border border-white/10 px-3.5 py-2 text-sm font-medium text-gray-200"
      >
        <Share2 size={14} />
        Share list
      </button>
      <button
        type="button"
        onClick={() => void copyList()}
        className="premium-ghost inline-flex items-center gap-2 rounded-xl border border-white/10 px-3.5 py-2 text-sm font-medium text-gray-200"
      >
        <Copy size={14} />
        Copy list
      </button>
    </div>
  );
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
