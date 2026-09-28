import type { Metadata } from "next";
import { redirect } from "next/navigation";

import DashboardNavbar from "@/components/dashboard-navbar";
import BackgroundGlow from "@/components/background-glow";
import InstallPrompt from "@/components/install-prompt";

import { getAuthSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Vault",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="relative min-h-screen bg-[#030304] text-white">
      <BackgroundGlow />
      <DashboardNavbar name={session.user.name} />
      <div className="relative z-10">{children}</div>
      <InstallPrompt />
    </div>
  );
}
