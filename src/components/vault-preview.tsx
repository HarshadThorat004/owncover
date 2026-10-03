"use client";

import { motion, useReducedMotion } from "framer-motion";

type Row = {
  name: string;
  source: string;
  status: "Active" | "Expiring" | "Expired";
  label: string;
  progress: number;
};

const ROWS: Row[] = [
  {
    name: '55" 4K Smart TV',
    source: "Manufacturer cover",
    status: "Active",
    label: "214 days left",
    progress: 78,
  },
  {
    name: "1.5 Ton Split AC",
    source: "Store AMC",
    status: "Expiring",
    label: "12 days left",
    progress: 8,
  },
  {
    name: "Front-load Washing Machine",
    source: "Manufacturer cover",
    status: "Active",
    label: "1 year 4 months left",
    progress: 92,
  },
  {
    name: "Laptop",
    source: "Manufacturer cover",
    status: "Expired",
    label: "Ended last month",
    progress: 0,
  },
];

const TONE: Record<Row["status"], { text: string; bar: string; chip: string }> =
  {
    Active: {
      text: "text-emerald-300",
      bar: "bg-emerald-400",
      chip: "border-emerald-400/30 bg-emerald-400/10",
    },
    Expiring: {
      text: "text-amber-300",
      bar: "bg-amber-400",
      chip: "border-amber-400/30 bg-amber-400/10",
    },
    Expired: {
      text: "text-red-300",
      bar: "bg-red-400",
      chip: "border-red-400/30 bg-red-400/10",
    },
  };

export default function VaultPreview() {
  const reduce = useReducedMotion();

  return (
    <div className="beam-card relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-950/80 p-5 shadow-[0_30px_80px_-48px_rgba(34,211,238,0.5)] md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-cyan-200/70">
            Example vault
          </p>
          <p className="mt-1 text-base font-medium text-white">
            Home &amp; electronics
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-gray-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] motion-safe:animate-pulse" />
          4 products
        </div>
      </div>

      <ul className="mt-5 space-y-3">
        {ROWS.map((row, index) => {
          const tone = TONE[row.status];
          return (
            <li
              key={row.name}
              className="rounded-2xl border border-white/10 bg-white/[0.025] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {row.name}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">{row.source}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.1em] ${tone.chip} ${tone.text}`}
                >
                  {row.status}
                </span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
                <motion.div
                  className={`h-full rounded-full ${tone.bar}`}
                  initial={reduce ? false : { width: 0 }}
                  whileInView={{ width: `${row.progress}%` }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 1.1,
                    delay: 0.15 + index * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={reduce ? { width: `${row.progress}%` } : undefined}
                />
              </div>
              <p className={`mt-2 text-xs ${tone.text}`}>{row.label}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
