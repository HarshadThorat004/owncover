import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ChevronRight, Inbox, Paperclip } from "lucide-react";

type Draft = {
  id: string;
  subject: string | null;
  fromEmail: string | null;
  createdAt: Date;
  files: unknown;
};

const MAX_VISIBLE = 5;

export default function InboundInbox({ drafts }: { drafts: Draft[] }) {
  if (drafts.length === 0) return null;

  const visible = drafts.slice(0, MAX_VISIBLE);

  return (
    <section className="rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.06] p-5 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Inbox size={18} className="mt-0.5 text-cyan-300" />
          <div>
            <h2 className="text-base font-medium text-white">
              {drafts.length} {drafts.length === 1 ? "invoice" : "invoices"} to
              confirm
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Forwarded bills stay drafts until you check the dates.
            </p>
          </div>
        </div>
        <Link
          href={`/dashboard/add-product?draft=${drafts[0]!.id}`}
          className="premium-btn premium-btn-solid inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black"
        >
          Review next
        </Link>
      </div>

      <ul className="mt-4 divide-y divide-white/5 overflow-hidden rounded-xl border border-white/10 bg-black/30">
        {visible.map((draft) => {
          const fileCount = Array.isArray(draft.files) ? draft.files.length : 0;
          return (
            <li key={draft.id}>
              <Link
                href={`/dashboard/add-product?draft=${draft.id}`}
                className="flex min-h-11 items-center gap-3 px-4 py-3 transition hover:bg-white/[0.03]"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">
                    {draft.subject || "Forwarded invoice"}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-gray-500">
                    {draft.fromEmail ? `${draft.fromEmail} · ` : ""}
                    {formatDistanceToNow(draft.createdAt, { addSuffix: true })}
                  </p>
                </div>
                {fileCount > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                    <Paperclip size={12} />
                    {fileCount}
                  </span>
                )}
                <ChevronRight size={16} className="text-gray-600" />
              </Link>
            </li>
          );
        })}
      </ul>
      {drafts.length > MAX_VISIBLE && (
        <p className="mt-3 text-xs text-gray-500">
          {drafts.length - MAX_VISIBLE} more after these.
        </p>
      )}
    </section>
  );
}
