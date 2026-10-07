"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import type { FeatureSlide } from "@/components/feature-carousel";

type Props = {
  items: FeatureSlide[];
  eyebrow?: string;
  heading?: string;
};

function FilmPlaceholder({ eyebrow, heading }: Omit<Props, "items">) {
  return (
    <div
      className="mx-auto max-w-6xl px-5 pb-24 md:px-8"
      aria-busy
      aria-label="Loading features"
    >
      {eyebrow && (
        <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-300/80">
          {eyebrow}
        </p>
      )}
      {heading && (
        <h2 className="font-display mt-3 text-3xl md:text-4xl">{heading}</h2>
      )}
      <div className="mt-8 h-64 animate-pulse rounded-2xl border border-white/10 bg-neutral-950 motion-reduce:animate-none md:h-80" />
    </div>
  );
}

const ProductFilm = dynamic(() => import("@/components/product-film"), {
  ssr: false,
});

export default function HomeProductFilm(props: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        observer.disconnect();
      },
      { rootMargin: "600px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {near ? (
        <ProductFilm {...props} />
      ) : (
        <FilmPlaceholder eyebrow={props.eyebrow} heading={props.heading} />
      )}
    </div>
  );
}
