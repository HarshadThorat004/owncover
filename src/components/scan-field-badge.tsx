"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

import type { FieldSource, ScanHint } from "@/lib/document-extract/types";

export type { ScanHint };

const SOURCE_MEANING: Record<FieldSource, string> = {
  qr: "Read from the GST QR on the tax invoice.",
  layout: "Read from a labelled line on the document.",
  regex: "Read from text on the document.",
  retailer: "Matched a known marketplace invoice layout.",
  vision: "Read with extra vision extraction.",
};

export function scanTagCopy(hint: ScanHint) {
  const verify = hint.confidence === "medium" || hint.confidence === "low";
  const label = verify ? "Verify" : "Scanned";
  const meaning = hint.derived
    ? "Calculated from the purchase date and the warranty period on the document. Confirm the date before you save."
    : verify
      ? "Filled from the invoice, but we are less sure. Confirm it or clear it before you save."
      : "Filled from the invoice. We are reasonably sure — still check it before you save.";
  const source = hint.source ? SOURCE_MEANING[hint.source] : null;
  return { label, meaning, source, verify };
}

type Props = {
  show: boolean;
  hint?: ScanHint;
};

export default function ScanFieldBadge({ show, hint }: Props) {
  const [open, setOpen] = useState(false);

  if (!show || !hint) return null;

  const { label, meaning, source, verify } = scanTagCopy(hint);

  return (
    <button
      type="button"
      className={`group relative ml-1 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
        verify
          ? "border-amber-500/20 bg-amber-500/10 text-amber-200"
          : "border-cyan-500/20 bg-cyan-500/10 text-cyan-300"
      }`}
      aria-label={`${label}. ${meaning}${source ? ` ${source}` : ""}`}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setOpen((current) => !current);
      }}
      onBlur={() => setOpen(false)}
    >
      <Sparkles size={10} />
      {label}
      <span
        role="tooltip"
        className={`pointer-events-none absolute left-0 top-[calc(100%+6px)] z-30 w-56 rounded-xl border border-white/10 bg-neutral-950 px-3 py-2 text-left text-xs font-normal normal-case leading-5 tracking-normal text-gray-300 shadow-[0_12px_40px_rgba(0,0,0,0.45)] transition-opacity ${
          open
            ? "opacity-100"
            : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
        }`}
      >
        <span className="block font-medium text-white">{label}</span>
        <span className="mt-1 block">{meaning}</span>
        {source ? <span className="mt-1 block text-gray-500">{source}</span> : null}
      </span>
    </button>
  );
}
