"use client";

import Image from "next/image";
import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import VaultScene from "@/components/vault-scene";

function Poster({ decorative }: { decorative: boolean }) {
  return (
    <Image
      src="/brand/features/claim-pack.png"
      alt={decorative ? "" : "Holographic claim pack on a cyan pedestal"}
      fill
      loading="eager"
      fetchPriority="high"
      sizes="(max-width: 1024px) 100vw, 960px"
      className="object-cover"
      aria-hidden={decorative}
    />
  );
}

class WebGLBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function canUseWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

type StageMode = {
  webgl: boolean;
  lite: boolean;
};

const SERVER_MODE: StageMode = { webgl: false, lite: false };
let clientMode: StageMode | null = null;

function prefersStaticVisual() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  return reduce || Boolean(connection?.saveData);
}

function subscribeStageMode(onChange: () => void) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const coarse = window.matchMedia("(pointer: coarse)");
  reduce.addEventListener("change", onChange);
  coarse.addEventListener("change", onChange);
  return () => {
    reduce.removeEventListener("change", onChange);
    coarse.removeEventListener("change", onChange);
  };
}

function getStageMode(): StageMode {
  const lite = window.matchMedia("(pointer: coarse)").matches;
  const webgl = !prefersStaticVisual() && canUseWebGL();
  if (clientMode && clientMode.webgl === webgl && clientMode.lite === lite) {
    return clientMode;
  }
  clientMode = { webgl, lite };
  return clientMode;
}

function useStageMode() {
  return useSyncExternalStore(
    subscribeStageMode,
    getStageMode,
    () => SERVER_MODE
  );
}

export default function VaultStage() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const { webgl, lite } = useStageMode();
  const handleReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    const node = frameRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "180px", threshold: 0.08 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={frameRef}
      className="vault-frame relative h-[340px] overflow-hidden rounded-[28px] border border-white/10 bg-[#050608] shadow-[0_30px_80px_-40px_rgba(34,211,238,0.45)] sm:h-[440px] md:h-[520px]"
    >
      <p className="sr-only">
        Live 3D preview of invoice scanning, the claim pack, and the coverage
        timeline. Move the pointer over the stage to tilt it.
      </p>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.14),transparent_62%)]" />
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          webgl && ready ? "opacity-0" : "opacity-100"
        }`}
      >
        <Poster decorative={webgl && ready} />
      </div>
      {webgl ? (
        <WebGLBoundary fallback={null}>
          <div className="absolute inset-0">
            <VaultScene active={visible} lite={lite} onReady={handleReady} />
          </div>
        </WebGLBoundary>
      ) : null}
      <div className="pointer-events-none absolute left-4 top-4 z-10 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-cyan-100/80 md:left-5 md:top-5">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.95)] motion-safe:animate-pulse" />
        Vault live
      </div>
      <div className="pointer-events-none absolute bottom-4 right-4 z-10 text-[10px] uppercase tracking-[0.16em] text-white/35 md:bottom-5 md:right-5">
        Scan · Track · Remind
      </div>
      <span className="pointer-events-none absolute left-3 top-3 h-4 w-4 border-l border-t border-cyan-300/50" />
      <span className="pointer-events-none absolute right-3 top-3 h-4 w-4 border-r border-t border-cyan-300/50" />
      <span className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b border-l border-cyan-300/50" />
      <span className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 border-b border-r border-cyan-300/50" />
    </div>
  );
}
