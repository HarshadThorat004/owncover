import { getReminderSchedule } from "@/lib/reminder-schedule";
import { CalendarDays } from "lucide-react";

type Props = {
  expiry: Date | null;
  coverLabel?: string | null;
  calendarHref?: string;
};

export default function ReminderSchedule({
  expiry,
  coverLabel,
  calendarHref,
}: Props) {
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
          ? `Alerts fire against ${coverLabel.toLowerCase()} — the cover that is still running.`
          : "Email and browser alerts on this cover."}
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

      {calendarHref && (
        <a
          href={calendarHref}
          className="premium-ghost mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 px-3.5 py-2 text-sm font-medium text-gray-200"
        >
          <CalendarDays size={14} />
          Add expiry to calendar
        </a>
      )}
    </section>
  );
}
