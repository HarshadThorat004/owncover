import Link from "next/link";
import { FileText } from "lucide-react";

import ClaimPackPreview from "@/components/claim-pack-preview";
import CoverageTimeline from "@/components/coverage-timeline";
import { extendedCoverLabel } from "@/constants/catalog";
import { SAMPLE_CLAIM_PACK_PRODUCT } from "@/constants/sample-claim-pack";

type Props = {
  caption?: boolean;
  showPdfCta?: boolean;
};

function asDate(value: Date | string | null | undefined) {
  if (!value) return null;
  return value instanceof Date ? value : new Date(value);
}

export default function HeroArtifact({
  caption = true,
  showPdfCta = true,
}: Props) {
  const product = SAMPLE_CLAIM_PACK_PRODUCT;

  return (
    <div>
      <div className="grid items-stretch gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <ClaimPackPreview product={product} />
        <div className="flex flex-col gap-4">
          <CoverageTimeline
            purchaseDate={asDate(product.purchaseDate)}
            manufacturerExpiry={asDate(product.warrantyExpiry)}
            extendedExpiry={asDate(product.extendedExpiry)}
            extendedLabel={extendedCoverLabel(product.extendedType)}
          />
          {showPdfCta ? (
            <div className="flex flex-1 flex-col justify-between rounded-2xl border border-white/10 p-5 md:p-6">
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-300/80">
                  Sample — not a real claim
                </p>
                <p className="mt-2 text-sm leading-7 text-gray-400">
                  Same layout your vault uses. Print the PDF, carry the GST
                  invoice, do not leave originals at the counter.
                </p>
              </div>
              <a
                href="/api/sample-pack"
                className="premium-btn premium-btn-solid mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black"
              >
                <FileText size={16} />
                Open sample PDF
              </a>
            </div>
          ) : null}
        </div>
      </div>
      {caption && (
        <p className="mt-4 text-center text-sm text-gray-600">
          Serial {product.serialNumber}.{" "}
          <Link
            href="/sample-pack"
            className="text-gray-400 underline-offset-4 hover:text-white hover:underline"
          >
            What is in the pack
          </Link>
          . We do not file claims.
        </p>
      )}
    </div>
  );
}
