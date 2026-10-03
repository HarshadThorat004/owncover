"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Package, Search, ArrowUpRight } from "lucide-react";

import type { Product } from "@/types/product";
import {
  getDaysRemaining,
  getProductThumbnail,
  productUsesPdfCover,
} from "@/lib/warranty";
import { getCoverageStatus, getEffectiveExpiry, coverageStatusLabel } from "@/lib/coverage";
import { formatDateIN } from "@/lib/format-date";
import PdfPlaceholder from "@/components/pdf-placeholder";

type Props = {
  products: Product[];
};

type FilterType = "all" | "active" | "expiring" | "expired";

export default function ProductSearch({ products }: Props) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const reduce = useReducedMotion();

  const filteredProducts = useMemo(() => {
    const list = products.filter((product) => {
      const searchText = search.toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(searchText) ||
        (product.brand ?? "").toLowerCase().includes(searchText) ||
        (product.model ?? "").toLowerCase().includes(searchText) ||
        (product.retailer ?? "").toLowerCase().includes(searchText) ||
        (product.serialNumber ?? "").toLowerCase().includes(searchText) ||
        (product.invoiceNumber ?? "").toLowerCase().includes(searchText);

      const expiry = getEffectiveExpiry(product);
      if (!expiry) {
        return filter === "all" ? matchesSearch : false;
      }

      const status = getCoverageStatus(product);
      const expired = status === "expired";
      const expiring = status === "expiring";

      if (filter === "active") return matchesSearch && !expired;
      if (filter === "expiring") return matchesSearch && expiring;
      if (filter === "expired") return matchesSearch && expired;
      return matchesSearch;
    });

    return list.sort((a, b) => {
      const aExpiry = getEffectiveExpiry(a);
      const bExpiry = getEffectiveExpiry(b);
      if (!aExpiry) return 1;
      if (!bExpiry) return -1;
      return getDaysRemaining(aExpiry) - getDaysRemaining(bExpiry);
    });
  }, [products, search, filter]);

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            placeholder="Search name, brand, serial, invoice…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search products"
            className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-cyan-400/60 focus:shadow-[0_0_0_3px_rgba(34,211,238,0.12)]"
          />
        </div>

        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter products"
        >
          {(
            [
              { key: "all", label: "All" },
              { key: "active", label: "Active cover" },
              { key: "expiring", label: "Needs attention" },
              { key: "expired", label: "Cover ended" },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key)}
              className={`premium-ghost rounded-xl border px-3.5 py-2 text-xs font-medium ${
                filter === item.key
                  ? "border-white bg-white text-black"
                  : "border-white/10 text-gray-400"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 px-6 py-14 text-center">
          <Search className="mx-auto text-gray-600" size={24} />
          <p className="mt-3 text-sm font-medium text-gray-300">
            No matching products
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Try another search or filter.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product, index) => {
            const thumbnail = getProductThumbnail(product);
            const pdfCover = productUsesPdfCover(product);
            const expiry = getEffectiveExpiry(product);
            const daysRemaining = expiry ? getDaysRemaining(expiry) : null;
            const status = getCoverageStatus(product);

            return (
              <motion.div
                key={product.id}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: Math.min(index, 8) * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
              <Link
                href={`/dashboard/products/${product.id}`}
                className="premium-card group block h-full rounded-2xl border border-white/10 bg-neutral-950/80"
              >
                <div className="premium-media relative overflow-hidden rounded-t-2xl border-b border-white/5">
                  {thumbnail ? (
                    <Image
                      src={thumbnail}
                      alt={product.name}
                      width={500}
                      height={280}
                      className="h-40 w-full object-cover"
                      unoptimized
                    />
                  ) : pdfCover ? (
                    <PdfPlaceholder sizeClassName="h-40" />
                  ) : (
                    <div className="flex h-40 items-center justify-center bg-black/40 text-gray-600">
                      <Package size={32} />
                    </div>
                  )}

                  <span
                    className={`absolute left-3 top-3 rounded-full border px-2.5 py-1 text-[11px] font-medium backdrop-blur-md ${
                      status === "expired"
                        ? "border-red-500/30 bg-red-500/20 text-red-200"
                        : status === "expiring"
                          ? "border-amber-500/30 bg-amber-500/20 text-amber-200"
                          : status === "unknown"
                            ? "border-white/15 bg-black/50 text-gray-300"
                            : "border-emerald-500/30 bg-emerald-500/20 text-emerald-200"
                    }`}
                  >
                    {coverageStatusLabel(status, daysRemaining)}
                  </span>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-white">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">
                        {product.brand || "Unknown brand"}
                      </p>
                    </div>
                    <ArrowUpRight
                      size={16}
                      className="shrink-0 text-gray-600 transition group-hover:text-cyan-300"
                    />
                  </div>

                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex justify-between text-gray-500">
                      <span>Purchase</span>
                      <span className="text-gray-300">
                        {product.purchaseDate
                          ? formatDateIN(product.purchaseDate)
                          : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Expiry</span>
                      <span className="text-gray-300">
                        {expiry ? formatDateIN(expiry) : "—"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
