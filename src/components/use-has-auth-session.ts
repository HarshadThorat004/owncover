"use client";

import { useEffect, useState } from "react";

function hasAuthSessionCookie() {
  return document.cookie.split(";").some((part) => {
    const name = part.trim().split("=")[0] ?? "";
    return (
      name === "next-auth.session-token" ||
      name === "__Secure-next-auth.session-token" ||
      name.startsWith("next-auth.session-token.") ||
      name.startsWith("__Secure-next-auth.session-token.")
    );
  });
}

export function useHasAuthSession() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    setSignedIn(hasAuthSessionCookie());
  }, []);

  return signedIn;
}
