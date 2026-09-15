import { getReminderSchedule } from "@/lib/reminder-schedule";

type Props = {
  expiry: Date | null;
  coverLabel?: string | null;
};

export default function ReminderSchedule({ expiry, coverLabel }: Props) {
  if (!expiry) {
    return (
      <section className="rounded-2xl border border-white/10 p-5 md:p-6">
        <h2 className="text-sm font-medium text-white">Reminder schedule</h2>
        <p className="mt-2 text-sm leading-7 text-gray-500">
          Add an expiry date to schedule email and browser alerts at 30 days, 7
          days, and the day before cover ends.
        </p>
      </section>
    );
  }

  const items = getReminderSchedule(expiry);

  return (
    <section className="rounded-2xl border border-white/10 p-5 md:p-6">
      <h2 className="text-sm font-medium text-white">Reminder schedule</h2>
      <p className="mt-1 text-xs leading-6 text-gray-500">
        {coverLabel
          ? `Alerts fire against ${coverLabel.toLowerCase()} — the cover that still matters.`
          : "Email and browser alerts on this cover."}{" "}
        We do not run the service centre. We get you desk-ready.
      </p>

      <ul className="mt-5 space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between rounded-xl border border-white/5 bg-black/25 px-3.5 py-3"
          >
            <div>
              <p className="text-sm text-white">{item.label}</p>
              <p className="mt-0.5 text-xs text-gray-500">
                {item.date.toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <span
              className={`text-[11px] uppercase tracking-[0.12em] ${
                item.state === "today"
                  ? "text-cyan-300"
                  : item.state === "passed"
                    ? "text-gray-600"
                    : "text-gray-400"
              }`}
            >
              {item.state === "today"
                ? "Today"
                : item.state === "passed"
                  ? "Passed"
                  : "Scheduled"}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
