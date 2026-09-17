"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function NotFoundActions() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/auth/session")
      .then((response) => response.json())
      .then((session) => {
        if (!cancelled) setSignedIn(Boolean(session?.user));
      })
      .catch(() => {
        if (!cancelled) setSignedIn(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
      <Link
        href={signedIn ? "/dashboard" : "/"}
        className="premium-btn premium-btn-solid rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black"
      >
        {signedIn ? "Dashboard" : "Home"}
      </Link>
      <Link
        href="/help"
        className="premium-ghost rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-gray-300"
      >
        Help
      </Link>
      <Link
        href={signedIn ? "/" : "/register"}
        className="premium-ghost rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-gray-300"
      >
        {signedIn ? "Home" : "Create free account"}
      </Link>
    </div>
  );
}
