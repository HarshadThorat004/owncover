import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getAuthSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your OwnCover vault.",
};

export default async function LoginLayout({ children }: { children: ReactNode }) {
  const session = await getAuthSession();

  if (session?.user) {
    redirect("/dashboard");
  }

  return children;
}
