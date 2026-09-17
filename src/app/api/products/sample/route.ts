import { jsonError, jsonSuccess } from "@/lib/api";
import { getHouseholdIdForUser, vaultProductWhere } from "@/lib/household";
import { getSessionUser } from "@/lib/product-access";
import { prisma } from "@/lib/prisma";
import { consumeRateLimit } from "@/lib/rate-limit";
import {
  SAMPLE_PRODUCT_SERIAL,
  sampleVaultProductCreateData,
} from "@/lib/sample-vault-product";

export async function POST() {
  try {
    const user = await getSessionUser();

    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    const limit = consumeRateLimit({
      key: `products:sample:${user.id}`,
      limit: 10,
      windowMs: 60 * 60 * 1000,
    });

    if (!limit.success) {
      return jsonError("Too many attempts. Try again later.", 429);
    }

    const householdId = await getHouseholdIdForUser(user.id);
    const existing = await prisma.product.findFirst({
      where: {
        AND: [
          vaultProductWhere(user.id, householdId),
          { serialNumber: SAMPLE_PRODUCT_SERIAL },
        ],
      },
      select: { id: true },
    });

    if (existing) {
      return jsonSuccess({
        id: existing.id,
        alreadyExisted: true,
      });
    }

    const product = await prisma.product.create({
      data: {
        ...sampleVaultProductCreateData(),
        userId: user.id,
        householdId,
      },
      select: { id: true },
    });

    return jsonSuccess(
      {
        id: product.id,
        alreadyExisted: false,
      },
      201
    );
  } catch (error) {
    console.error("SAMPLE_PRODUCT_CREATE_ERROR", error);
    return jsonError("Could not load sample product");
  }
}
