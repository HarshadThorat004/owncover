export default function Loading() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-8 md:px-8">
      <div className="animate-pulse rounded-3xl border border-white/10 bg-neutral-950/80 p-6 md:p-10 motion-reduce:animate-none">
        <div className="h-8 w-40 rounded bg-neutral-800" />
        <div className="mt-5 h-14 w-72 rounded bg-neutral-800" />
        <div className="mt-4 h-6 w-40 rounded bg-neutral-800" />
        <div className="mt-10 h-[400px] rounded-3xl bg-neutral-800" />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="h-32 rounded-2xl bg-neutral-800" />
          <div className="h-32 rounded-2xl bg-neutral-800" />
        </div>
      </div>
    </main>
  );
}
