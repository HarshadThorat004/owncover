"use client";

import { useId, useState } from "react";

type FaqItem = {
  id?: string;
  q: string;
  a: string;
};

type Props = {
  items: FaqItem[];
};

export default function FaqList({ items }: Props) {
  const uid = useId();
  const [open, setOpen] = useState<Set<string>>(() => new Set());

  function toggle(itemId: string) {
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  }

  return (
    <div className="divide-y divide-white/10 border-y border-white/10">
      {items.map((item, index) => {
        const itemId = item.id ?? `${uid}-${index}`;
        const isOpen = open.has(itemId);
        const panelId = `${itemId}-panel`;

        return (
          <div key={itemId} className="py-5">
            <button
              type="button"
              className="flex w-full items-start justify-between gap-4 text-left text-sm font-medium text-white"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(itemId)}
            >
              {item.q}
              <span className="text-gray-600" aria-hidden>
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen ? (
              <p
                id={panelId}
                className="mt-3 text-sm leading-7 text-gray-400"
              >
                {item.a}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
