"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Loader2, Search } from "lucide-react";

import ProductCoverTrack from "@/components/product-cover-track";
import { categoryLabel } from "@/constants/catalog";
import { getCoverTrackDisplay } from "@/lib/cover-track";
import type { ProductListFilter } from "@/lib/product-attention";
import { getEffectiveExpiry } from "@/lib/coverage";
import { formatDateIN } from "@/lib/format-date";
import { isMissingSerial } from "@/lib/weekly-digest";

export type DashboardProductListItem = {
  id: string;
  name: string;
  brand: string | null;
  model?: string | null;
  category?: string | null;
  retailer?: string | null;
  serialNumber?: string | null;
  invoiceNumber?: string | null;
  purchaseDate: Date | null;
  purchaseAmount?: string | null;
  warrantyExpiry: Date | null;
  extendedExpiry?: Date | null;
  extendedType?: string | null;
};

type Props = {
  initialProducts: DashboardProductListItem[];
  initialNextCursor: string | null;
  initialHasMore: boolean;
  totalProducts: number;
};

type ApiProduct = Omit<
  DashboardProductListItem,
  "purchaseDate" | "warrantyExpiry" | "extendedExpiry"
> & {
  purchaseDate: string | null;
  warrantyExpiry: string | null;
  extendedExpiry?: string | null;
};

function parseProduct(row: ApiProduct): DashboardProductListItem {
  return {
    ...row,
    purchaseDate: row.purchaseDate ? new Date(row.purchaseDate) : null,
    warrantyExpiry: row.warrantyExpiry ? new Date(row.warrantyExpiry) : null,
    extendedExpiry: row.extendedExpiry ? new Date(row.extendedExpiry) : null,
  };
}

export default function ProductSearch({
  initialProducts,
  initialNextCursor,
  initialHasMore,
  totalProducts,
}: Props) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ProductListFilter>("all");
  const [products, setProducts] = useState(initialProducts);
  const [nextCursor, setNextCursor] = useState<string | null>(
    initialNextCursor
  );
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const requestId = useRef(0);
  const skipInitialFetch = useRef(true);

  const fetchPage = useCallback(
    async (opts: {
      cursor?: string;
      append?: boolean;
      q: string;
      filter: ProductListFilter;
    }) => {
      const id = ++requestId.current;
      const params = new URLSearchParams({
        scope: "dashboard",
        filter: opts.filter,
      });
      if (opts.q.trim()) params.set("q", opts.q.trim());
      if (opts.cursor) params.set("cursor", opts.cursor);

      const response = await fetch(`/api/products?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Could not load products");
      }

      const data = (await response.json()) as {
        items: ApiProduct[];
        nextCursor: string | null;
        hasMore: boolean;
      };

      if (id !== requestId.current) return;

      const parsed = data.items.map(parseProduct);
      setProducts((prev) => (opts.append ? [...prev, ...parsed] : parsed));
      setNextCursor(data.nextCursor);
      setHasMore(data.hasMore);
      setError(null);
    },
    []
  );

  useEffect(() => {
    if (
      skipInitialFetch.current &&
      search.trim() === "" &&
      filter === "all"
    ) {
      skipInitialFetch.current = false;
      return;
    }

    const q = search.trim();
    const timer = globalThis.setTimeout(() => {
      setLoading(true);
      void fetchPage({ q, filter, append: false })
        .catch(() => setError("Could not refresh the list. Try again."))
        .finally(() => setLoading(false));
    }, q ? 320 : 0);

    return () => globalThis.clearTimeout(timer);
  }, [search, filter, fetchPage]);

  async function loadMore() {
    if (!hasMore || !nextCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      await fetchPage({
        q: search,
        filter,
        cursor: nextCursor,
        append: true,
      });
    } catch {
      setError("Could not load more products.");
    } finally {
      setLoadingMore(false);
    }
  }

  const showingLabel =
    totalProducts > 0
      ? `Showing ${products.length} of ${totalProducts}`
      : null;

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

        <div className="flex flex-wrap items-center gap-2">
          {showingLabel ? (
            <p className="text-xs text-gray-500">{showingLabel}</p>
          ) : null}
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Filter products"
          >
            {(
              [
                { key: "all", label: "All" },
                { key: "active", label: "Active cover" },
                { key: "attention", label: "Needs attention" },
                { key: "expired", label: "Cover ended" },
              ] as const satisfies ReadonlyArray<{
                key: ProductListFilter;
                label: string;
              }>
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
      </div>

      {error ? (
        <p className="mb-4 text-sm text-amber-300/90">{error}</p>
      ) : null}

      {loading && products.length === 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-52 animate-pulse rounded-2xl border border-white/10 bg-neutral-950/80 motion-reduce:animate-none"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
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
        <>
          <div
            className={`grid gap-4 md:grid-cols-2 lg:grid-cols-3 ${
              loading ? "opacity-60" : ""
            }`}
          >
            {products.map((product, index) => {
              const track = getCoverTrackDisplay(product);
              const expiry = getEffectiveExpiry(product);
              const serialMissing = isMissingSerial(product.serialNumber);

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
                    className="premium-card group block h-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/80 transition hover:border-cyan-400/25 hover:shadow-[0_20px_50px_-36px_rgba(34,211,238,0.45)]"
                  >
                    <ProductCoverTrack
                      compact
                      name={product.name}
                      coverSource={track.coverSource}
                      chip={track.chip}
                      timeLabel={track.timeLabel}
                      progress={track.progress}
                    />

                    <div className="p-4 pt-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-xs text-gray-500">
                            {product.brand || "Unknown brand"}
                            {product.category
                              ? ` · ${categoryLabel(product.category)}`
                              : ""}
                          </p>
                          {serialMissing ? (
                            <p className="mt-1 text-[11px] font-medium text-amber-300/90">
                              Serial missing
                            </p>
                          ) : product.serialNumber ? (
                            <p className="mt-1 truncate text-[11px] text-gray-600">
                              SN {product.serialNumber}
                            </p>
                          ) : null}
                        </div>
                        <ArrowUpRight
                          size={16}
                          className="shrink-0 text-gray-600 transition group-hover:text-cyan-300"
                        />
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                        <div className="rounded-lg border border-white/5 bg-white/[0.02] px-2.5 py-2">
                          <p className="text-gray-600">Purchase</p>
                          <p className="mt-0.5 font-medium text-gray-300">
                            {product.purchaseDate
                              ? formatDateIN(product.purchaseDate)
                              : "—"}
                          </p>
                        </div>
                        <div className="rounded-lg border border-white/5 bg-white/[0.02] px-2.5 py-2">
                          <p className="text-gray-600">Cover ends</p>
                          <p className="mt-0.5 font-medium text-gray-300">
                            {expiry ? formatDateIN(expiry) : "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {hasMore ? (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => void loadMore()}
                disabled={loadingMore}
                className="premium-ghost inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-2.5 text-sm font-medium text-gray-200 disabled:opacity-50"
              >
                {loadingMore ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : null}
                Load more
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
