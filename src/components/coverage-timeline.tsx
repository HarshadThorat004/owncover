type Point = {
  label: string;
  date: Date | null;
  detail?: string;
};

type Props = {
  purchaseDate: Date | null;
  manufacturerExpiry: Date | null;
  extendedExpiry: Date | null;
  extendedLabel?: string;
};

function formatDate(date: Date | null) {
  if (!date) return "Not set";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function pointState(date: Date | null, now: Date) {
  if (!date) return "missing" as const;
  if (date.getTime() < now.getTime()) return "done" as const;
  return "upcoming" as const;
}

export default function CoverageTimeline({
  purchaseDate,
  manufacturerExpiry,
  extendedExpiry,
  extendedLabel,
}: Props) {
  const now = new Date();
  const points: Point[] = [
    { label: "Purchased", date: purchaseDate },
    { label: "Manufacturer cover ends", date: manufacturerExpiry },
  ];

  if (extendedExpiry || extendedLabel) {
    points.push({
      label: `${extendedLabel || "Store / extra cover"} ends`,
      date: extendedExpiry,
    });
  }

  const upcomingIndex = points.findIndex(
    (point) => point.date && point.date.getTime() >= now.getTime()
  );

  return (
    <section className="rounded-2xl border border-white/10 p-5 md:p-6">
      <h2 className="text-sm font-medium text-white">Coverage timeline</h2>
      <p className="mt-1 text-xs leading-6 text-gray-500">
        Purchase through brand cover, then any store or AMC layer.
      </p>

      <ol className="mt-6 space-y-0">
        {points.map((point, index) => {
          const state = pointState(point.date, now);
          const current = upcomingIndex === index;
          return (
            <li key={point.label} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span
                  className={`mt-0.5 h-2.5 w-2.5 rounded-full ${
                    current
                      ? "bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                      : state === "done"
                        ? "bg-white/50"
                        : state === "missing"
                          ? "border border-white/25 bg-transparent"
                          : "bg-white/20"
                  }`}
                />
                {index < points.length - 1 && (
                  <span className="min-h-10 w-px flex-1 bg-white/10" />
                )}
              </div>
              <div className="pb-6">
                <p className="text-sm text-white">{point.label}</p>
                <p
                  className={`mt-0.5 text-xs ${
                    current ? "text-cyan-200/80" : "text-gray-500"
                  }`}
                >
                  {formatDate(point.date)}
                  {current ? " · next date" : ""}
                  {state === "missing" ? " · add this date" : ""}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
