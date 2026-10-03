"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

import type { FeatureSlide } from "@/components/feature-carousel";

const SLIDE_MS = 5600;

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
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduce(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const node = frameRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const playing = inView && !userPaused && !reduce && items.length > 1;
  const active = items[index] ?? items[0];

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
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-300/80">
            {eyebrow}
          </p>
          <h2 className="font-display mt-3 max-w-2xl text-3xl md:text-4xl">
            {heading}
          </h2>
        </div>
        <div className="mb-1 flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous chapter"
            className="premium-ghost inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-gray-300"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => setUserPaused((value) => !value)}
            aria-label={userPaused || reduce ? "Play preview" : "Pause preview"}
            aria-pressed={!userPaused && !reduce}
            className="premium-ghost inline-flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/30 text-cyan-100"
          >
            {userPaused || reduce ? <Play size={16} /> : <Pause size={16} />}
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next chapter"
            className="premium-ghost inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-gray-300"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="mt-10 overflow-hidden rounded-[28px] border border-white/10 bg-black shadow-[0_30px_80px_-48px_rgba(34,211,238,0.65)]">
        <div className="relative aspect-[16/10] md:aspect-video">
          {items.map((item, itemIndex) => {
            const current = itemIndex === index;
            return (
              <div
                key={item.title}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  current ? "opacity-100" : "opacity-0"
                }`}
                aria-hidden={!current}
              >
                <Image
                  src={item.image}
                  alt={current ? item.imageAlt : ""}
                  fill
                  priority={itemIndex === 0}
                  sizes="(max-width: 1152px) 100vw, 1152px"
                  className={`object-cover ${
                    current && !reduce ? "film-ken" : ""
                  }`}
                  style={
                    current && !reduce
                      ? { animationPlayState: playing ? "running" : "paused" }
                      : undefined
                  }
                />
              </div>
            );
          })}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/20" />
          {playing ? (
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="film-scanline absolute inset-x-0 top-0 h-1/5 bg-gradient-to-b from-transparent via-cyan-300/30 to-transparent" />
            </div>
          ) : null}
          <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
            <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-200/80">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(items.length).padStart(2, "0")}
            </p>
            <p className="mt-1 max-w-xl text-lg font-medium text-white md:text-2xl">
              {active.title}
            </p>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/10">
            <div
              ref={barRef}
              className="h-full origin-left scale-x-0 bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.8)]"
            />
          </div>
        </div>
      </div>

      <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-400">{active.desc}</p>

      <div
        className="mt-5 flex gap-2 overflow-x-auto pb-1"
        role="tablist"
        aria-label="Preview chapters"
      >
        {items.map((item, itemIndex) => {
          const current = itemIndex === index;
          return (
            <button
              key={item.title}
              type="button"
              role="tab"
              aria-selected={current}
              onClick={() => setIndex(itemIndex)}
              className={`min-w-[180px] shrink-0 rounded-2xl border px-4 py-3 text-left transition ${
                current
                  ? "border-cyan-300/50 bg-cyan-400/10"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20"
              }`}
            >
              <span className="text-[10px] uppercase tracking-[0.16em] text-cyan-200/70">
                {String(itemIndex + 1).padStart(2, "0")}
              </span>
              <span className="mt-1 block text-sm text-white">{item.title}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
