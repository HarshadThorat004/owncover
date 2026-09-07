const TRANSIENT_PRISMA_CODES = new Set(["P1001", "P1002", "P1008", "P1017"]);

const TRANSIENT_MESSAGE_SNIPPETS = [
  "Can't reach database server",
  "Timed out fetching a new connection",
  "Connection reset",
  "Server has closed the connection",
  "Connection terminated unexpectedly",
];

export function withPrismaConnectionParams(databaseUrl: string) {
  const question = databaseUrl.indexOf("?");
  const base = question === -1 ? databaseUrl : databaseUrl.slice(0, question);
  const params = new URLSearchParams(
    question === -1 ? "" : databaseUrl.slice(question + 1)
  );
  const hostPart = base.split("@")[1] ?? "";

  if (hostPart.includes("-pooler.") && !params.has("pgbouncer")) {
    params.set("pgbouncer", "true");
  }

  if (!params.has("connect_timeout")) {
    params.set("connect_timeout", "30");
  }

  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

export function isTransientDbError(error: unknown) {
  if (error && typeof error === "object" && "code" in error) {
    const code = (error as { code?: unknown }).code;
    if (typeof code === "string" && TRANSIENT_PRISMA_CODES.has(code)) {
      return true;
    }
  }

  const message = error instanceof Error ? error.message : String(error);
  return TRANSIENT_MESSAGE_SNIPPETS.some((snippet) => message.includes(snippet));
}

export async function withDbRetry<T>(
  operation: () => Promise<T>,
  delaysMs: number[] = [0, 500, 1500]
): Promise<T> {
  let lastError: unknown;

  for (const delay of delaysMs) {
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (!isTransientDbError(error)) {
        throw error;
      }
    }
  }

  throw lastError;
}
