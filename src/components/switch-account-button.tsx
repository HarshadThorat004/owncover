"use client";

import { signOut } from "next-auth/react";

export default function SwitchAccountButton({ callbackUrl }: { callbackUrl: string }) {
  return (
    <button
      type="button"
      onClick={() =>
        void signOut({
          callbackUrl: `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`,
        })
      }
      className="premium-ghost inline-flex w-full items-center justify-center rounded-[10px] border border-white/15 py-2.5 text-sm font-medium text-white"
    >
      Sign out and switch account
    </button>
  );
}
