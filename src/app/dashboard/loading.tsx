export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-4 pb-24 pt-8 md:px-8">
      <div className="animate-pulse motion-reduce:animate-none">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="h-10 w-52 rounded-xl bg-neutral-800" />
            <div className="mt-3 h-5 w-40 rounded-xl bg-neutral-800" />
          </div>
          <div className="h-12 w-40 rounded-xl bg-neutral-800" />
        </div>

        <div className="mb-10 grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-neutral-950/80 p-5"
            >
              <div className="h-4 w-24 rounded bg-neutral-800" />
              <div className="mt-4 h-10 w-16 rounded bg-neutral-800" />
            </div>
          ))}
        </div>

        <div className="mb-8 h-14 rounded-2xl bg-neutral-900" />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-neutral-950/80 p-6"
            >
              <div className="mb-4 h-40 rounded-xl bg-neutral-800" />
              <div className="h-7 w-40 rounded bg-neutral-800" />
              <div className="mt-3 h-4 w-28 rounded bg-neutral-800" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
