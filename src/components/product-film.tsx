"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  FileText,
  Layers,
  Pause,
  Play,
  ScanLine,
  Users,
  type LucideIcon,
} from "lucide-react";

import type { FeatureSlide } from "@/components/feature-carousel";

const SLIDE_MS = 5600;

const FEATURE_ICONS: LucideIcon[] = [
  ScanLine,
  Layers,
  Bell,
  FileText,
  Users,
];

type Props = {
  items: FeatureSlide[];
  eyebrow?: string;
  heading?: string;
};

export default function ProductFilm({
  items,
  eyebrow = "Modules / Features",
  heading = "What stays in the vault.",
}: Props) {
  const frameRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [index, setIndex] = useState(0);
  const [inView, setInView] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const node = frameRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const reduce = reduceMotion === true;
  const playing = inView && !userPaused && !reduce && items.length > 1;
  const active = items[index] ?? items[0];
  const ActiveIcon = FEATURE_ICONS[index] ?? ScanLine;

  useEffect(() => {
    progressRef.current = 0;
    if (barRef.current) barRef.current.style.transform = "scaleX(0)";
  }, [index]);

  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      progressRef.current += (now - last) / SLIDE_MS;
      last = now;
      if (progressRef.current >= 1) {
        progressRef.current = 0;
        if (barRef.current) barRef.current.style.transform = "scaleX(0)";
        setIndex((current) => (current + 1) % items.length);
        return;
      }
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progressRef.current})`;
      }
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [playing, index, items.length]);

  const goTo = (next: number) => {
    const count = items.length;
    setIndex(((next % count) + count) % count);
  };

  if (!active) return null;

  return (
    <section
      ref={frameRef}
      id="features"
      className="relative mx-auto max-w-6xl px-5 pb-24 md:px-8"
    >
      <div className="pointer-events-none absolute -left-20 top-32 h-64 w-64 rounded-full bg-cyan-500/[0.07] blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-64 h-48 w-48 rounded-full bg-white/[0.04] blur-3xl" />

      <div className="relative flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-300/80">
            {eyebrow}
          </p>
          <h2 className="font-display mt-3 max-w-2xl text-3xl md:text-4xl">
            {heading}
          </h2>
        </div>
        <div className="mb-1 flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous feature"
            className="premium-ghost inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-gray-300"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => setUserPaused((value) => !value)}
            aria-label={userPaused || reduce ? "Play tour" : "Pause tour"}
            aria-pressed={!userPaused && !reduce}
            className="premium-ghost inline-flex h-9 w-9 items-center justify-center rounded-full border border-cyan-300/30 text-cyan-100"
          >
            {userPaused || reduce ? <Play size={14} /> : <Pause size={14} />}
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next feature"
            className="premium-ghost inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-gray-300"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="relative mt-10 grid gap-5 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-6">
        {/* Feature rail — desktop */}
        <div
          className="hidden flex-col gap-2 lg:flex"
          role="tablist"
          aria-label="Feature modules"
        >
          {items.map((item, itemIndex) => {
            const current = itemIndex === index;
            const Icon = FEATURE_ICONS[itemIndex] ?? ScanLine;
            return (
              <FeatureRailCard
                key={item.title}
                item={item}
                itemIndex={itemIndex}
                current={current}
                reduce={reduce}
                showProgress={current && playing}
                barRef={current ? barRef : undefined}
                onSelect={() => setIndex(itemIndex)}
                Icon={Icon}
              />
            );
          })}
        </div>

        {/* Main stage */}
        <div className="film-stage beam-card relative min-h-[280px] overflow-hidden rounded-2xl border border-white/10 bg-[#050506] shadow-[0_32px_80px_-48px_rgba(34,211,238,0.75)] md:min-h-[340px] lg:min-h-[420px]">
          <div className="film-stage-grid pointer-events-none absolute inset-0 opacity-40" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(34,211,238,0.12),transparent_55%)]" />

          <span className="pointer-events-none absolute left-3 top-3 z-10 h-5 w-5 border-l border-t border-cyan-300/45" />
          <span className="pointer-events-none absolute right-3 top-3 z-10 h-5 w-5 border-r border-t border-cyan-300/45" />
          <span className="pointer-events-none absolute bottom-3 left-3 z-10 h-5 w-5 border-b border-l border-cyan-300/45" />
          <span className="pointer-events-none absolute bottom-3 right-3 z-10 h-5 w-5 border-b border-r border-cyan-300/45" />

          <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-cyan-100/90 backdrop-blur-md">
            <ActiveIcon size={12} className="text-cyan-300" />
            Module {String(index + 1).padStart(2, "0")}
          </div>

          <div className="relative aspect-[16/10] w-full lg:absolute lg:inset-0 lg:aspect-auto">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.title}
                className="absolute inset-0"
                initial={reduce ? false : { opacity: 0, filter: "blur(8px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={reduce ? undefined : { opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={active.image}
                  alt={active.imageAlt}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1024px) 100vw, 720px"
                  className={`object-cover ${!reduce ? "film-ken" : ""}`}
                  style={
                    !reduce
                      ? { animationPlayState: playing ? "running" : "paused" }
                      : undefined
                  }
                />
              </motion.div>
            </AnimatePresence>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050506] via-[#050506]/20 to-transparent" />
            {playing ? (
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="film-scanline absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-transparent via-cyan-300/20 to-transparent" />
              </div>
            ) : null}

            <div className="absolute inset-x-0 bottom-0 z-10 p-5 md:p-6">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`stage-caption-${index}`}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="max-w-md text-lg font-medium text-white md:text-2xl">
                    {active.title}
                  </p>
                  <p className="mt-2 max-w-lg text-sm leading-7 text-gray-300/90">
                    {active.desc}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile / tablet — snap carousel cards */}
        <div
          className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 lg:hidden"
          role="tablist"
          aria-label="Feature modules"
        >
          {items.map((item, itemIndex) => {
            const current = itemIndex === index;
            const Icon = FEATURE_ICONS[itemIndex] ?? ScanLine;
            return (
              <FeatureSnapCard
                key={item.title}
                item={item}
                itemIndex={itemIndex}
                current={current}
                reduce={reduce}
                onSelect={() => setIndex(itemIndex)}
                Icon={Icon}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

type RailProps = {
  item: FeatureSlide;
  itemIndex: number;
  current: boolean;
  reduce: boolean;
  showProgress: boolean;
  barRef?: RefObject<HTMLDivElement | null>;
  onSelect: () => void;
  Icon: LucideIcon;
};

function FeatureRailCard({
  item,
  itemIndex,
  current,
  reduce,
  showProgress,
  barRef,
  onSelect,
  Icon,
}: RailProps) {
  return (
    <motion.button
      type="button"
      role="tab"
      aria-selected={current}
      onClick={onSelect}
      layout
      className={`film-rail-card group relative w-full overflow-hidden rounded-xl border text-left transition-colors ${
        current
          ? "beam-card border-cyan-400/30 bg-cyan-500/[0.08]"
          : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
      }`}
      whileHover={reduce ? undefined : { x: current ? 0 : 4 }}
      whileTap={reduce ? undefined : { scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    >
      <div className="relative flex gap-3 p-3">
        <div
          className={`relative h-[4.25rem] w-[4.25rem] shrink-0 overflow-hidden rounded-lg border ${
            current ? "border-cyan-400/40 shadow-[0_0_24px_-4px_rgba(34,211,238,0.5)]" : "border-white/10"
          }`}
        >
          <Image
            src={item.image}
            alt=""
            fill
            sizes="68px"
            className={`object-cover transition duration-500 ${
              current ? "scale-100" : "scale-105 opacity-70 group-hover:opacity-90"
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <span className="absolute bottom-1 left-1 flex h-6 w-6 items-center justify-center rounded-md bg-black/60 text-cyan-300 backdrop-blur-sm">
            <Icon size={13} />
          </span>
        </div>

        <div className="min-w-0 flex-1 py-0.5">
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-cyan-200/70">
            {String(itemIndex + 1).padStart(2, "0")}
          </p>
          <p
            className={`mt-0.5 truncate text-sm font-medium ${
              current ? "text-white" : "text-gray-400 group-hover:text-gray-200"
            }`}
          >
            {item.title}
          </p>
          <AnimatePresence initial={false}>
            {current ? (
              <motion.p
                key="desc"
                initial={reduce ? false : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={reduce ? undefined : { opacity: 0, height: 0 }}
                className="mt-1.5 line-clamp-2 text-xs leading-5 text-gray-400"
              >
                {item.desc}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {current && showProgress && barRef ? (
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/10">
          <div
            ref={barRef}
            className="h-full origin-left scale-x-0 bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
          />
        </div>
      ) : null}
    </motion.button>
  );
}

type SnapProps = {
  item: FeatureSlide;
  itemIndex: number;
  current: boolean;
  reduce: boolean;
  onSelect: () => void;
  Icon: LucideIcon;
};

function FeatureSnapCard({
  item,
  itemIndex,
  current,
  reduce,
  onSelect,
  Icon,
}: SnapProps) {
  return (
    <motion.button
      type="button"
      role="tab"
      aria-selected={current}
      onClick={onSelect}
      className={`film-snap-card relative w-[72vw] max-w-[280px] shrink-0 snap-center overflow-hidden rounded-xl border text-left ${
        current
          ? "beam-card border-cyan-400/35 bg-cyan-500/[0.06]"
          : "border-white/10 bg-white/[0.02]"
      }`}
      animate={
        reduce
          ? undefined
          : {
              scale: current ? 1 : 0.96,
              opacity: current ? 1 : 0.65,
            }
      }
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
    >
      <div className="relative h-28 w-full">
        <Image
          src={item.image}
          alt=""
          fill
          sizes="280px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050506] via-transparent to-transparent" />
        <span className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg border border-white/15 bg-black/50 text-cyan-300 backdrop-blur-sm">
          <Icon size={14} />
        </span>
      </div>
      <div className="p-3">
        <p className="text-[10px] uppercase tracking-[0.14em] text-cyan-200/70">
          {String(itemIndex + 1).padStart(2, "0")} · {item.title}
        </p>
        {current ? (
          <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-gray-400">
            {item.desc}
          </p>
        ) : null}
      </div>
    </motion.button>
  );
}
