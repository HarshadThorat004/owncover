-- CreateTable
CREATE TABLE IF NOT EXISTS "Household" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Family vault',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Household_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "HouseholdMember" (
    "id" TEXT NOT NULL,
    "householdId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HouseholdMember_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "HouseholdInvite" (
    "id" TEXT NOT NULL,
    "householdId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "invitedById" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HouseholdInvite_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "householdId" TEXT;

CREATE INDEX IF NOT EXISTS "Product_householdId_idx" ON "Product"("householdId");

DO $$ BEGIN
    ALTER TABLE "Product" ADD CONSTRAINT "Product_householdId_fkey"
        FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "HouseholdMember_userId_key" ON "HouseholdMember"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "HouseholdMember_householdId_userId_key" ON "HouseholdMember"("householdId", "userId");
CREATE INDEX IF NOT EXISTS "HouseholdMember_householdId_idx" ON "HouseholdMember"("householdId");

CREATE UNIQUE INDEX IF NOT EXISTS "HouseholdInvite_token_key" ON "HouseholdInvite"("token");
CREATE INDEX IF NOT EXISTS "HouseholdInvite_email_idx" ON "HouseholdInvite"("email");
CREATE INDEX IF NOT EXISTS "HouseholdInvite_householdId_idx" ON "HouseholdInvite"("householdId");

DO $$ BEGIN
    ALTER TABLE "HouseholdMember" ADD CONSTRAINT "HouseholdMember_householdId_fkey"
        FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE "HouseholdMember" ADD CONSTRAINT "HouseholdMember_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE "HouseholdInvite" ADD CONSTRAINT "HouseholdInvite_householdId_fkey"
        FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE "HouseholdInvite" ADD CONSTRAINT "HouseholdInvite_invitedById_fkey"
        FOREIGN KEY ("invitedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DROP INDEX IF EXISTS "NotificationLog_productId_type_channel_periodKey_key";
CREATE UNIQUE INDEX IF NOT EXISTS "NotificationLog_userId_productId_type_channel_periodKey_key"
ON "NotificationLog"("userId", "productId", "type", "channel", "periodKey");
