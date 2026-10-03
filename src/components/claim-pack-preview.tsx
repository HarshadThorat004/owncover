import { categoryLabel, extendedCoverLabel } from "@/constants/catalog";
import { getServiceChecklist } from "@/constants/service-checklist";
import type { ClaimPackProduct } from "@/lib/exports/claim-pack";
import { formatUtcDay } from "@/lib/exports/format";

type Props = {
  product: ClaimPackProduct;
};

export default function ClaimPackPreview({ product }: Props) {
  const checklist = getServiceChecklist(product.category);
  const isSample = product.packKind === "sample";
  const fields: Array<[string, string]> = [
    ["Brand", product.brand || "—"],
    ["Model", product.model || "—"],
    ["Serial", product.serialNumber || "—"],
    ["Invoice", product.invoiceNumber || "—"],
    ["Purchased", formatUtcDay(product.purchaseDate)],
    ["Manufacturer", formatUtcDay(product.warrantyExpiry)],
    [
      extendedCoverLabel(product.extendedType),
      formatUtcDay(product.extendedExpiry),
    ],
    [
      "Amount",
      product.purchaseAmount ? `₹${product.purchaseAmount}` : "—",
    ],
  ];

  return (
    <article className="h-full rounded-2xl bg-[#f3efe6] px-5 py-6 text-left text-[#1c1c1e] md:px-7 md:py-7">
      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500">
        OwnCover
      </p>
      <h3 className="font-display mt-2 text-2xl leading-tight">
        {isSample ? "Sample claim pack" : "Claim pack"}
      </h3>
      <p className="mt-1 text-xs leading-5 text-neutral-500">
        {isSample
          ? "Fictional product. OwnCover does not file claims."
          : "Print with the GST tax invoice when you raise a request."}
      </p>
      <p className="mt-5 text-sm font-medium">{product.name}</p>
      <p className="mt-1 text-xs text-neutral-500">
        {categoryLabel(product.category) || product.category}
      </p>

      <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-neutral-300/80 pt-4">
        {fields.map(([label, value]) => (
          <div key={label}>
            <dt className="text-[10px] uppercase tracking-[0.14em] text-neutral-500">
              {label}
            </dt>
            <dd className="mt-0.5 text-sm">{value}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-6 text-[10px] uppercase tracking-[0.14em] text-neutral-500">
        {checklist.title}
      </p>
      <ul className="mt-2 space-y-1.5">
        {checklist.items.slice(0, 4).map((item) => (
          <li key={item} className="flex gap-2 text-xs leading-5 text-neutral-700">
            <span className="mt-0.5 h-3 w-3 shrink-0 rounded-sm border border-neutral-400" />
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
