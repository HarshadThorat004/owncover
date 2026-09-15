import { ReactNode } from "react";

import PageWrapper from "@/components/page-wrapper";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function DashboardShell({
  children,
  className = "",
}: Props) {
  return (
    <PageWrapper>
      <main className={`mx-auto max-w-7xl px-4 pb-24 pt-8 md:px-8 ${className}`}>
        {children}
      </main>
    </PageWrapper>
  );
}
