export default function Loading() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 pt-8 md:px-8">
      <div className="animate-pulse rounded-2xl border border-white/10 bg-neutral-950/80 p-6 md:p-8 motion-reduce:animate-none">
        <div className="mb-8 h-10 w-52 rounded bg-neutral-800" />
        <div className="space-y-5">
          {[1, 2, 3, 4].map((item) => (
            <div key={item}>
              <div className="mb-2 h-4 w-32 rounded bg-neutral-800" />
              <div className="h-12 rounded-xl bg-neutral-800" />
            </div>
          ))}
          <div className="h-12 rounded-xl bg-neutral-800" />
        </div>
      </div>
    </main>
  );
}
