"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type FeatureSlide = {
  title: string;
  desc: string;
  image: string;
  imageAlt: string;
};

type Props = {
  items: FeatureSlide[];
  eyebrow?: string;
  heading?: string;
};

function useVisibleCount() {
  const [count, setCount] = useState(1);

  useEffect(() => {
    function update() {
      const width = window.innerWidth;
      if (width >= 1024) setCount(3);
      else if (width >= 768) setCount(2);
      else setCount(1);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return count;
}

export default function FeatureCarousel({
  items,
  eyebrow = "Modules / Features",
  heading = "Outcomes, not another folder.",
}: Props) {
  const visible = useVisibleCount();
  const maxIndex = Math.max(0, items.length - visible);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const slideIndex = Math.min(index, maxIndex);

  const goTo = useCallback(
    (next: number) => {
      if (maxIndex === 0) {
        setIndex(0);
        return;
      }
      const wrapped = ((next % (maxIndex + 1)) + (maxIndex + 1)) % (maxIndex + 1);
      setIndex(wrapped);
    },
    [maxIndex]
  );

  const prev = useCallback(() => goTo(slideIndex - 1), [goTo, slideIndex]);
  const next = useCallback(() => goTo(slideIndex + 1), [goTo, slideIndex]);

  useEffect(() => {
    if (paused || reduceMotion || maxIndex === 0) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current >= maxIndex ? 0 : current + 1));
    }, 4500);
    return () => window.clearInterval(id);
  }, [paused, maxIndex, reduceMotion]);

  const slidePercent = 100 / visible;

  return (
    <section id="features" className="relative mx-auto max-w-6xl px-5 pb-24 md:px-8">
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
            onClick={prev}
            aria-label="Previous features"
            className="premium-ghost inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-gray-300"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next features"
            className="premium-ghost inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-gray-300"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        className="mt-10 overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setPaused(false);
          }
        }}
      >
        <div
          className="flex will-change-transform"
          style={{
            transform: `translateX(-${slideIndex * slidePercent}%)`,
            transition: reduceMotion
              ? "none"
              : "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {items.map((item) => (
            <article
              key={item.title}
              className="shrink-0 px-1.5 sm:px-2"
              style={{ width: `${slidePercent}%` }}
            >
              <div className="premium-card group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/70">
                <div className="premium-media relative aspect-[16/10] overflow-hidden border-b border-white/5 bg-black/40">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent"
                    aria-hidden
                  />
                </div>
                <div className="flex flex-1 flex-col p-5 md:p-6">
                  <h3 className="text-base font-medium leading-snug text-white md:text-lg">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-gray-500">
                    {item.desc}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div
        className="mt-7 flex items-center justify-center gap-2"
        role="tablist"
        aria-label="Feature slides"
      >
        {Array.from({ length: maxIndex + 1 }).map((_, i) => {
          const active = i === slideIndex;
          return (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                active
                  ? "w-8 bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.55)]"
                  : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
            />
          );
        })}
      </div>
    </section>
  );
}
