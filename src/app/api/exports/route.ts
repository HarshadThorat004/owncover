import { NextResponse } from "next/server";

import { jsonError } from "@/lib/api";
import { BRAND_NAME } from "@/constants/brand";
import { productsToCsv } from "@/lib/exports/csv";
import { attachmentFilename, slugifyFilename } from "@/lib/exports/format";
import { productsToIcs } from "@/lib/exports/ics";
import { getSessionUser } from "@/lib/product-access";
import { listProductsForExport } from "@/lib/products-query";

export async function GET(req: Request) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    const url = new URL(req.url);
    const format = url.searchParams.get("format");
    const productId = url.searchParams.get("productId") || undefined;

    if (format !== "csv" && format !== "ics" && format !== "json") {
      return jsonError("Use format=csv, format=ics, or format=json", 400);
    }

    const products = await listProductsForExport(user.id, productId);

    if (productId && products.length === 0) {
      return jsonError("Product not found", 404);
    }

    if (format === "json") {
      const body = JSON.stringify(
        {
          exportedAt: new Date().toISOString(),
          account: { email: user.email, name: user.name },
          products,
        },
        null,
        2
      );

      return new NextResponse(body, {
        headers: attachmentFilename(
          "owncover-export.json",
          "application/json; charset=utf-8"
        ),
      });
    }

    if (format === "csv") {
      const body = productsToCsv(products);
      const filename = productId
        ? `${slugifyFilename(products[0]?.name ?? "product")}.csv`
        : "owncover-products.csv";

      return new NextResponse(body, {
        headers: attachmentFilename(filename, "text/csv; charset=utf-8"),
      });
    }

    const body = productsToIcs(products, {
      calendarName: productId
        ? `${products[0]?.name ?? "Product"} warranty`
        : BRAND_NAME,
    });
    const filename = productId
      ? `${slugifyFilename(products[0]?.name ?? "product")}-warranty.ics`
      : "owncover.ics";

    return new NextResponse(body, {
      headers: attachmentFilename(filename, "text/calendar; charset=utf-8"),
    });
  } catch (error) {
    console.error("EXPORT_ERROR", error);
    return jsonError("Failed to export");
  }
}
