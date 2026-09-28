import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getAuthSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a free OwnCover account. No card. You confirm every date.",
};

export default async function RegisterLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getAuthSession();

  if (session?.user) {
    redirect("/dashboard");
  }

  return children;
}
