"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Tv } from "lucide-react";

type Props = {
  className?: string;
  variant?: "solid" | "ghost";
};

export default function LoadSampleProductButton({
  className = "",
  variant = "ghost",
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function loadSample() {
    try {
      setLoading(true);

      const response = await fetch("/api/products/sample", {
        method: "POST",
      });
      const body = (await response.json()) as {
        id?: string;
        alreadyExisted?: boolean;
        error?: string;
      };

      if (!response.ok || !body.id) {
        throw new Error(body.error || "Could not load sample TV");
      }

      toast.success(
        body.alreadyExisted
          ? "Sample TV is already in your vault"
          : "Sample TV added — download the claim pack"
      );
      router.push(`/dashboard/products/${body.id}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Could not load sample TV"
      );
    } finally {
      setLoading(false);
    }
  }

  const styles =
    variant === "solid"
      ? "premium-btn premium-btn-solid inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50"
      : "premium-ghost inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-gray-200 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <button
      type="button"
      onClick={loadSample}
      disabled={loading}
      className={`${styles} ${className}`.trim()}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Tv size={16} />
      )}
      {loading ? "Loading sample…" : "Load sample TV"}
    </button>
  );
}
