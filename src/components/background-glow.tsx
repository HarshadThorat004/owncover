export default function BackgroundGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />
      <div className="ambient-orb absolute left-1/2 top-[-80px] h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-cyan-400/[0.09] blur-3xl" />
      <div className="ambient-orb absolute -bottom-24 -right-16 h-[360px] w-[360px] rounded-full bg-white/[0.04] blur-3xl [animation-delay:-6s]" />
      <div className="ambient-orb absolute -bottom-10 -left-24 h-[280px] w-[280px] rounded-full bg-cyan-500/[0.04] blur-3xl [animation-delay:-3s]" />
    </div>
  );
}
