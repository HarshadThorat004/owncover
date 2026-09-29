import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

function loadDotEnv() {
  if (!existsSync(".env")) {
    return;
  }

  for (const line of readFileSync(".env", "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const eq = trimmed.indexOf("=");
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function unpooledDatabaseUrl(url) {
  return url.replace("-pooler.", ".");
}

loadDotEnv();

if (!process.env.DIRECT_URL && process.env.DATABASE_URL) {
  process.env.DIRECT_URL = unpooledDatabaseUrl(process.env.DATABASE_URL);
}

const command = process.argv[2];
const prismaCommands = {
  generate: "prisma generate",
  migrate: "prisma migrate deploy",
};

/** Failed on Neon 2026-09-18; SQL is now idempotent and must be retried. */
const KNOWN_FAILED_MIGRATIONS = ["20260804093500_premium_backend_foundation"];

function clearKnownFailedMigrations() {
  for (const name of KNOWN_FAILED_MIGRATIONS) {
    try {
      execSync(`npx prisma migrate resolve --rolled-back "${name}"`, {
        stdio: ["ignore", "pipe", "pipe"],
        env: process.env,
      });
      console.info(
        `Marked failed Prisma migration ${name} as rolled back so it can be retried.`
      );
    } catch {
      // Already applied, never recorded, or already rolled back.
    }
  }
}

if (command === "generate" && !process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    "postgresql://postgres:postgres@127.0.0.1:5432/postgres";
  process.env.DIRECT_URL = process.env.DATABASE_URL;
}

if (command === "migrate") {
  const onVercel = process.env.VERCEL === "1";
  const forced =
    process.argv.includes("--force") ||
    process.env.PRISMA_MIGRATE_DEPLOY === "1";

  if (!process.env.DATABASE_URL) {
    console.warn(
      "Skipping prisma migrate deploy because DATABASE_URL is not set."
    );
    process.exit(0);
  }

  if (!onVercel && !forced) {
    console.info(
      "Skipping prisma migrate deploy (not on Vercel). Use `npm run db:migrate` locally."
    );
    process.exit(0);
  }

  if (onVercel) {
    clearKnownFailedMigrations();
  }
}

if (!prismaCommands[command]) {
  console.error("Usage: node scripts/prisma-env.mjs generate|migrate");
  process.exit(1);
}

execSync(`npx ${prismaCommands[command]}`, {
  stdio: "inherit",
  env: process.env,
});
