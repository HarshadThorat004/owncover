-- NotificationLog was missing from earlier migrations; create it before altering.
CREATE TABLE IF NOT EXISTS "NotificationLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),
    "dismissedAt" TIMESTAMP(3),
    CONSTRAINT "NotificationLog_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
    ALTER TABLE "NotificationLog" ADD CONSTRAINT "NotificationLog_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE "NotificationLog" ADD CONSTRAINT "NotificationLog_productId_fkey"
        FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Product fields used by the app but missing from early migrations.
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "notes" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "renewalAvailable" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "renewalNotes" TEXT;

-- Add periodKey so reminders can be scoped to an expiry cycle.
ALTER TABLE "NotificationLog"
ADD COLUMN IF NOT EXISTS "periodKey" TEXT NOT NULL DEFAULT 'legacy';

UPDATE "NotificationLog"
SET "periodKey" = COALESCE(
  TO_CHAR("Product"."warrantyExpiry", 'YYYY-MM-DD'),
  'none'
)
FROM "Product"
WHERE "Product"."id" = "NotificationLog"."productId"
  AND "NotificationLog"."periodKey" = 'legacy';

ALTER TABLE "NotificationLog"
ALTER COLUMN "periodKey" DROP DEFAULT;

DROP INDEX IF EXISTS "NotificationLog_productId_type_channel_key";

CREATE INDEX IF NOT EXISTS "Product_userId_idx"
ON "Product"("userId");

CREATE INDEX IF NOT EXISTS "Product_warrantyExpiry_idx"
ON "Product"("warrantyExpiry");

CREATE INDEX IF NOT EXISTS "Product_userId_warrantyExpiry_idx"
ON "Product"("userId", "warrantyExpiry");

CREATE INDEX IF NOT EXISTS "Document_productId_idx"
ON "Document"("productId");

CREATE INDEX IF NOT EXISTS "NotificationLog_userId_channel_sentAt_idx"
ON "NotificationLog"("userId", "channel", "sentAt");

CREATE UNIQUE INDEX IF NOT EXISTS "NotificationLog_productId_type_channel_periodKey_key"
ON "NotificationLog"("productId", "type", "channel", "periodKey");
