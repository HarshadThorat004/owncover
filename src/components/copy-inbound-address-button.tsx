"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Copy, Loader2 } from "lucide-react";

type Props = {
  address?: string | null;
};

export default function CopyInboundAddressButton({ address }: Props) {
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  async function resolveAddress() {
    if (address) return address;

    const response = await fetch("/api/inbound/address");
    const body = (await response.json()) as {
      address?: string;
      error?: string;
    };

    if (!response.ok || !body.address) {
      throw new Error(body.error || "Could not load inbound address");
    }

    return body.address;
  }

  async function copyAddress() {
    try {
      setBusy(true);
      const value = await resolveAddress();
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Address copied");
      window.setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not copy");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void copyAddress()}
      disabled={busy}
      className="mt-2 inline-flex items-center gap-1.5 text-sm text-cyan-300/90 underline-offset-2 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
    >
      {busy ? (
        <Loader2 size={14} className="animate-spin" />
      ) : copied ? (
        <Check size={14} />
      ) : (
        <Copy size={14} />
      )}
      {copied ? "Copied" : "Copy inbound address"}
    </button>
  );
}
