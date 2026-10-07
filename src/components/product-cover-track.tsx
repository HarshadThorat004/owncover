"use client";

import { motion, useReducedMotion } from "framer-motion";

import type { CoverTrackChip } from "@/lib/cover-track";

const TONE: Record<
  CoverTrackChip,
  { text: string; bar: string; chip: string }
> = {
  Active: {
    text: "text-emerald-300",
    bar: "bg-emerald-400",
    chip: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  },
  Expiring: {
    text: "text-amber-300",
    bar: "bg-amber-400",
    chip: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  },
  Expired: {
    text: "text-red-300",
    bar: "bg-red-400",
    chip: "border-red-400/30 bg-red-400/10 text-red-300",
  },
  Unknown: {
    text: "text-gray-400",
    bar: "bg-gray-500",
    chip: "border-white/15 bg-white/5 text-gray-300",
  },
};

type Props = {
  name: string;
  coverSource: string;
  chip: CoverTrackChip;
  timeLabel: string;
  progress: number;
  compact?: boolean;
  animate?: boolean;
};

export default function ProductCoverTrack({
  name,
  coverSource,
  chip,
  timeLabel,
  progress,
  compact = false,
  animate = true,
}: Props) {
  const reduce = useReducedMotion();
  const tone = TONE[chip];
  const shouldAnimate = animate && !reduce;

  return (
    <div
      className={`relative overflow-hidden border-b border-white/5 bg-[radial-gradient(ellipse_90%_80%_at_50%_0%,rgba(34,211,238,0.08),transparent_55%)] ${
        compact ? "p-3.5" : "p-4 md:p-5"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.35]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            className={`truncate font-medium text-white ${
              compact ? "text-sm" : "text-base"
            }`}
          >
            {name}
          </p>
          <p className="mt-0.5 text-xs capitalize text-gray-500">{coverSource}</p>
        </div>
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em] ${tone.chip}`}
        >
          {chip}
        </span>
      </div>

      <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
        {shouldAnimate ? (
          <motion.div
            className={`h-full rounded-full ${tone.bar}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{
              duration: 0.85,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ) : (
          <div
            className={`h-full rounded-full ${tone.bar}`}
            style={{ width: `${progress}%` }}
          />
        )}
      </div>
      <p className={`relative mt-2 text-xs ${tone.text}`}>{timeLabel}</p>
    </div>
  );
}
