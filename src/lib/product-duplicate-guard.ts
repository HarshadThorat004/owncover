import type { Prisma } from "@prisma/client";

import { vaultProductWhere } from "@/lib/household";
import {
  findDuplicateOfProduct,
  type ProductDuplicateFields,
} from "@/lib/product-duplicates";
import { prisma } from "@/lib/prisma";

const duplicateSelect = {
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
} satisfies Prisma.ProductSelect;

export async function findVaultDuplicateProduct(
  userId: string,
  householdId: string | null,
  candidate: ProductDuplicateFields,
  excludeProductId?: string
) {
  const vault = vaultProductWhere(userId, householdId);
  const products = await prisma.product.findMany({
    where: vault,
    select: duplicateSelect,
  });

  return findDuplicateOfProduct(products, candidate, excludeProductId);
}
