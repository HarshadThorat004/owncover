import type { ReactNode } from "react";

import BackgroundGlow from "@/components/background-glow";
import MarketingHeader from "@/components/marketing-header";
import SiteFooter from "@/components/site-footer";

export default function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030304] text-white">
      <BackgroundGlow />
      <MarketingHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
