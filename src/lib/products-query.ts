import type { Prisma } from "@prisma/client";
import { cache } from "react";

import { getCoverageStatus, productStatusWhere } from "@/lib/coverage";
import { getHouseholdIdForUser, getMembership, vaultProductWhere } from "@/lib/household";
import { prisma } from "@/lib/prisma";
import { getReminderWindowDates } from "@/lib/reminders";
import {
  countNeedsYouProducts,
  productNeedsAttention,
  type ProductListFilter,
} from "@/lib/product-attention";
import { findDuplicateProductIds } from "@/lib/product-duplicates";
import { withDbRetry } from "@/lib/db";
import { isMissingSerial } from "@/lib/weekly-digest";

export const DASHBOARD_PRODUCTS_PAGE_SIZE = 24;

export type ProductListStatus = "all" | "active" | "expiring" | "expired";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

export function parseProductListParams(searchParams: URLSearchParams) {
  const rawLimit = Number(searchParams.get("limit") ?? DEFAULT_LIMIT);
  const limit = Number.isFinite(rawLimit)
    ? Math.min(Math.max(1, rawLimit), MAX_LIMIT)
    : DEFAULT_LIMIT;
  const cursor = searchParams.get("cursor") || undefined;
  const q = searchParams.get("q")?.trim() || undefined;
  const rawStatus = searchParams.get("status");
  const status: ProductListStatus =
    rawStatus === "active" ||
    rawStatus === "expiring" ||
    rawStatus === "expired" ||
    rawStatus === "all"
      ? rawStatus
      : "all";

  return {
    cursor,
    limit,
    q,
    status,
  };
}

export function buildProductWhere(
  userId: string,
  householdId: string | null,
  params: {
    q?: string;
    status?: ProductListStatus;
  }
): Prisma.ProductWhereInput {
  const { today, in30 } = getReminderWindowDates();
  const clauses: Prisma.ProductWhereInput[] = [
    vaultProductWhere(userId, householdId),
  ];

  if (params.q) {
    clauses.push({
      OR: [
        { name: { contains: params.q, mode: "insensitive" } },
        { brand: { contains: params.q, mode: "insensitive" } },
        { model: { contains: params.q, mode: "insensitive" } },
        { retailer: { contains: params.q, mode: "insensitive" } },
        { serialNumber: { contains: params.q, mode: "insensitive" } },
        { invoiceNumber: { contains: params.q, mode: "insensitive" } },
      ],
    });
  }

  if (params.status && params.status !== "all") {
    const extra = productStatusWhere(params.status, today, in30);
    if (extra) clauses.push(extra);
  }

  return clauses.length === 1
    ? clauses[0]
    : {
        AND: clauses,
      };
}

/** Dashboard grid — no document join (cover track UI does not use files). */
const productDashboardSelect = {
  id: true,
  name: true,
  brand: true,
  model: true,
  category: true,
  retailer: true,
  serialNumber: true,
  invoiceNumber: true,
  purchaseAmount: true,
  purchaseDate: true,
  warrantyExpiry: true,
  extendedExpiry: true,
  extendedType: true,
  createdAt: true,
} satisfies Prisma.ProductSelect;

const productListSelect = {
  ...productDashboardSelect,
  invoiceImage: true,
  notes: true,
  renewalAvailable: true,
  renewalNotes: true,
  userId: true,
  documents: {
    select: {
      id: true,
      fileUrl: true,
      fileType: true,
      documentType: true,
    },
    orderBy: {
      uploadedAt: "desc" as const,
    },
    take: 3,
  },
} satisfies Prisma.ProductSelect;

export function parseDashboardProductListParams(searchParams: URLSearchParams) {
  const rawLimit = Number(
    searchParams.get("limit") ?? DASHBOARD_PRODUCTS_PAGE_SIZE
  );
  const limit = Number.isFinite(rawLimit)
    ? Math.min(Math.max(1, rawLimit), MAX_LIMIT)
    : DASHBOARD_PRODUCTS_PAGE_SIZE;
  const cursor = searchParams.get("cursor") || undefined;
  const q = searchParams.get("q")?.trim() || undefined;
  const rawFilter = searchParams.get("filter");
  const filter: ProductListFilter =
    rawFilter === "active" ||
    rawFilter === "attention" ||
    rawFilter === "expired" ||
    rawFilter === "all"
      ? rawFilter
      : "all";

  return { cursor, limit, q, filter };
}

const getAttentionProductIds = cache(async (userId: string) => {
  const householdId = await getHouseholdIdForUser(userId);
  const vault = vaultProductWhere(userId, householdId);

  const rows = await withDbRetry(() =>
    prisma.product.findMany({
      where: vault,
      select: dashboardCountSelect,
    })
  );

  const duplicateIds = findDuplicateProductIds(rows);
  return rows
    .filter((row) => productNeedsAttention(row, duplicateIds))
    .map((row) => row.id);
});

export async function listDashboardProductsForUser(
  userId: string,
  params: {
    cursor?: string;
    limit?: number;
    q?: string;
    filter?: ProductListFilter;
  }
) {
  const take = Math.min(
    Math.max(1, params.limit ?? DASHBOARD_PRODUCTS_PAGE_SIZE),
    MAX_LIMIT
  );
  const filter = params.filter ?? "all";
  const householdId = await getHouseholdIdForUser(userId);
  const { today, in30 } = getReminderWindowDates();

  const clauses: Prisma.ProductWhereInput[] = [
    vaultProductWhere(userId, householdId),
  ];

  if (params.q) {
    clauses.push({
      OR: [
        { name: { contains: params.q, mode: "insensitive" } },
        { brand: { contains: params.q, mode: "insensitive" } },
        { model: { contains: params.q, mode: "insensitive" } },
        { retailer: { contains: params.q, mode: "insensitive" } },
        { serialNumber: { contains: params.q, mode: "insensitive" } },
        { invoiceNumber: { contains: params.q, mode: "insensitive" } },
      ],
    });
  }

  if (filter === "active") {
    const activeWhere = productStatusWhere("active", today, in30);
    if (activeWhere) clauses.push(activeWhere);
  } else if (filter === "expired") {
    const expiredWhere = productStatusWhere("expired", today, in30);
    if (expiredWhere) clauses.push(expiredWhere);
  } else if (filter === "attention") {
    const attentionIds = await getAttentionProductIds(userId);
    if (attentionIds.length === 0) {
      return { items: [], nextCursor: null, hasMore: false };
    }
    clauses.push({ id: { in: attentionIds } });
  }

  const where: Prisma.ProductWhereInput =
    clauses.length === 1 ? clauses[0]! : { AND: clauses };

  const products = await withDbRetry(() =>
    prisma.product.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      ...(params.cursor
        ? {
            cursor: { id: params.cursor },
            skip: 1,
          }
        : {}),
      take: take + 1,
      select: productDashboardSelect,
    })
  );

  const hasMore = products.length > take;
  const items = hasMore ? products.slice(0, take) : products;

  return {
    items,
    nextCursor: hasMore ? items.at(-1)?.id ?? null : null,
    hasMore,
  };
}

export async function listProductsForUser(
  userId: string,
  params: {
    cursor?: string;
    limit?: number;
    q?: string;
    status?: ProductListStatus;
  }
) {
  const take = Math.min(Math.max(1, params.limit ?? DEFAULT_LIMIT), MAX_LIMIT);
  const householdId = await getHouseholdIdForUser(userId);
  const where = buildProductWhere(userId, householdId, {
    q: params.q,
    status: params.status ?? "all",
  });

  const products = await prisma.product.findMany({
    where,
    orderBy: [
      { createdAt: "desc" },
      { id: "desc" },
    ],
    ...(params.cursor
      ? {
          cursor: { id: params.cursor },
          skip: 1,
        }
      : {}),
    take: take + 1,
    select: productListSelect,
  });

  const hasMore = products.length > take;
  const items = hasMore ? products.slice(0, take) : products;

  return {
    items,
    nextCursor: hasMore ? items.at(-1)?.id ?? null : null,
    hasMore,
  };
}

const productExportSelect = {
  id: true,
  name: true,
  brand: true,
  model: true,
  category: true,
  retailer: true,
  serialNumber: true,
  invoiceNumber: true,
  purchaseAmount: true,
  purchaseDate: true,
  warrantyExpiry: true,
  extendedExpiry: true,
  extendedType: true,
  notes: true,
} satisfies Prisma.ProductSelect;

export async function listProductsForExport(userId: string, productId?: string) {
  const householdId = await getHouseholdIdForUser(userId);
  const vault = vaultProductWhere(userId, householdId);

  return prisma.product.findMany({
    where: productId
      ? { AND: [{ id: productId }, vault] }
      : vault,
    orderBy: [{ name: "asc" }, { id: "asc" }],
    select: productExportSelect,
  });
}

export async function getDashboardCounts(userId: string) {
  const householdId = await getHouseholdIdForUser(userId);
  const vault = vaultProductWhere(userId, householdId);

  const rows = await prisma.product.findMany({
    where: vault,
    select: dashboardCountSelect,
  });

  return summarizeDashboardCounts(rows);
}

const dashboardCountSelect = {
  id: true,
  name: true,
  brand: true,
  model: true,
  category: true,
  retailer: true,
  serialNumber: true,
  invoiceNumber: true,
  purchaseAmount: true,
  purchaseDate: true,
  warrantyExpiry: true,
  extendedExpiry: true,
  extendedType: true,
} as const;

type DashboardCountRow = {
  id: string;
  name: string;
  brand: string | null;
  model: string | null;
  category: string | null;
  retailer: string | null;
  serialNumber: string | null;
  invoiceNumber: string | null;
  purchaseAmount: string | null;
  purchaseDate: Date | null;
  warrantyExpiry: Date | null;
  extendedExpiry: Date | null;
  extendedType: string | null;
};

export function summarizeDashboardCounts(rows: DashboardCountRow[]) {
  let activeProducts = 0;
  let expiringProducts = 0;
  let expiredProducts = 0;
  let missingSerial = 0;

  for (const row of rows) {
    const status = getCoverageStatus(row);
    if (status === "active") activeProducts += 1;
    else if (status === "expiring") expiringProducts += 1;
    else if (status === "expired") expiredProducts += 1;

    if (isMissingSerial(row.serialNumber)) missingSerial += 1;
  }

  return {
    totalProducts: rows.length,
    activeProducts,
    expiringProducts,
    expiredProducts,
    missingSerial,
    attentionProducts: countNeedsYouProducts(rows),
  };
}

const getVaultStatsRows = cache(async (userId: string) => {
  const householdId = await getHouseholdIdForUser(userId);
  const vault = vaultProductWhere(userId, householdId);

  return withDbRetry(() =>
    prisma.product.findMany({
      where: vault,
      select: dashboardCountSelect,
    })
  );
});

export const getDashboardHomeData = cache(async (userId: string) => {
  const householdId = await getHouseholdIdForUser(userId);

  const [statsRows, membership, inboundDrafts, inbound, productPage] =
    await Promise.all([
      getVaultStatsRows(userId),
      getMembership(userId),
      prisma.inboundDraft.findMany({
        where: {
          status: "pending",
          ...(householdId
            ? { householdId }
            : { userId, householdId: null }),
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { inboundSlug: true },
      }),
      listDashboardProductsForUser(userId, {
        limit: DASHBOARD_PRODUCTS_PAGE_SIZE,
        filter: "all",
      }),
    ]);

  return {
    items: productPage.items,
    productsNextCursor: productPage.nextCursor,
    productsHasMore: productPage.hasMore,
    statsRows,
    counts: summarizeDashboardCounts(statsRows),
    membership,
    inboundDrafts,
    inboundSlug: inbound?.inboundSlug ?? null,
  };
});
