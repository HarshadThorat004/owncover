import { jsonError, jsonSuccess } from "@/lib/api";
import {
  listDashboardProductsForUser,
  listProductsForUser,
  parseDashboardProductListParams,
  parseProductListParams,
} from "@/lib/products-query";
import { getHouseholdIdForUser, vaultProductWhere } from "@/lib/household";
import { getSessionUser } from "@/lib/product-access";
import { prisma } from "@/lib/prisma";
import { findVaultDuplicateProduct } from "@/lib/product-duplicate-guard";
import { SAMPLE_PRODUCT_SERIAL } from "@/lib/sample-vault-product";
import { productCreateSchema } from "@/lib/validations/product";

export async function GET(req: Request) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    const url = new URL(req.url);

    if (url.searchParams.get("scope") === "dashboard") {
      const page = await listDashboardProductsForUser(
        user.id,
        parseDashboardProductListParams(url.searchParams)
      );
      return jsonSuccess(page);
    }

    const products = await listProductsForUser(
      user.id,
      parseProductListParams(url.searchParams)
    );

    return jsonSuccess(products);
  } catch (error) {
    console.error("PRODUCT_LIST_ERROR", error);
    return jsonError("Failed to load products");
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    const householdId = await getHouseholdIdForUser(user.id);

    const body = await req.json();
    const parsed = productCreateSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError("Validation failed", 400, {
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const data = parsed.data;

    const duplicate = await findVaultDuplicateProduct(
      user.id,
      householdId,
      {
        name: data.name,
        brand: data.brand || null,
        model: data.model || null,
        category: data.category || null,
        retailer: data.retailer || null,
        serialNumber: data.serialNumber || null,
        invoiceNumber: data.invoiceNumber || null,
        purchaseAmount: data.purchaseAmount?.replace(/,/g, "").trim() || null,
        purchaseDate: new Date(data.purchaseDate),
        warrantyExpiry: new Date(data.warrantyExpiry),
        extendedExpiry: data.extendedExpiry
          ? new Date(data.extendedExpiry)
          : null,
        extendedType: data.extendedExpiry
          ? data.extendedType?.trim() || "store"
          : null,
      }
    );

    if (duplicate) {
      return jsonError(
        "This product is already in your vault with the same details.",
        409,
        {
          code: "DUPLICATE_PRODUCT",
          details: { duplicateOfId: duplicate.id },
        }
      );
    }

    const existingRealProducts = await prisma.product.count({
      where: {
        AND: [
          vaultProductWhere(user.id, householdId),
          {
            OR: [
              { serialNumber: null },
              { serialNumber: { not: SAMPLE_PRODUCT_SERIAL } },
            ],
          },
        ],
      },
    });

    const product = await prisma.product.create({
      data: {
        name: data.name,
        brand: data.brand || null,
        model: data.model || null,
        category: data.category || null,
        retailer: data.retailer || null,
        serialNumber: data.serialNumber || null,
        invoiceNumber: data.invoiceNumber || null,
        purchaseAmount: data.purchaseAmount?.replace(/,/g, "").trim() || null,
        purchaseDate: new Date(data.purchaseDate),
        warrantyExpiry: new Date(data.warrantyExpiry),
        extendedExpiry: data.extendedExpiry
          ? new Date(data.extendedExpiry)
          : null,
        extendedType: data.extendedExpiry
          ? data.extendedType?.trim() || "store"
          : null,
        invoiceImage: data.invoiceImage || null,
        notes: data.notes || null,
        renewalAvailable: data.renewalAvailable ?? false,
        renewalNotes: data.renewalNotes || null,
        userId: user.id,
        householdId,
        documents:
          data.documents && data.documents.length > 0
            ? {
                create: data.documents.map((doc) => ({
                  fileUrl: doc.fileUrl,
                  fileType: doc.fileType,
                  documentType: doc.documentType,
                })),
              }
            : undefined,
      },
      include: {
        documents: true,
      },
    });

    const firstProduct = existingRealProducts === 0;
    if (firstProduct) {
      console.info("activation:first_product", { userId: user.id });
    }

    return jsonSuccess({ ...product, firstProduct }, 201);
  } catch (error) {
    console.error("PRODUCT_CREATE_ERROR", error);
    return jsonError("Something went wrong");
  }
}
