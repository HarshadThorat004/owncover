-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;

-- CreateTable
CREATE TABLE IF NOT EXISTS "EmailOtp" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "EmailOtp_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "EmailOtp_email_expiresAt_idx" ON "EmailOtp"("email", "expiresAt");
CREATE INDEX IF NOT EXISTS "EmailOtp_email_idx" ON "EmailOtp"("email");

DO $$ BEGIN
    ALTER TABLE "EmailOtp" ADD CONSTRAINT "EmailOtp_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;
