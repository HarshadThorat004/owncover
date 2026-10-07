"use client";

import dynamic from "next/dynamic";
import Image from "next/image";

const VaultStage = dynamic(
  () =>
    import("@/components/vault-stage").catch(() => ({
      default: function VaultStageFallback() {
        return (
          <div
            className="relative h-[340px] overflow-hidden rounded-[28px] border border-white/10 bg-[#050608] sm:h-[440px] md:h-[520px]"
            aria-hidden
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.14),transparent_62%)]" />
          </div>
        );
      },
    })),
  {
  ssr: false,
  loading: () => (
    <div
      className="relative h-[340px] overflow-hidden rounded-[28px] border border-white/10 bg-[#050608] sm:h-[440px] md:h-[520px]"
      aria-hidden
    >
      <Image
        src="/brand/features/claim-pack.png"
        alt=""
        fill
        preload
        sizes="(max-width: 1024px) 100vw, 960px"
        className="object-cover"
      />
    </div>
  ),
  }
);

export default function HomeVaultStage() {
  return <VaultStage />;
}
