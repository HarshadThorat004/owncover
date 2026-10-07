const ALERT_TIMEOUT_MS = 5000;

/**
 * Structured error log plus an optional POST to `OPS_ALERT_WEBHOOK_URL`
 * (Slack-compatible `{ text }` body). Never throws.
 */
export async function sendOpsAlert(
  event: string,
  details: Record<string, unknown> = {}
) {
  const payload = { level: "error", event, at: new Date().toISOString(), ...details };
  console.error(JSON.stringify(payload));

  const url = process.env.OPS_ALERT_WEBHOOK_URL?.trim();
  if (!url) return;

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `[OwnCover] ${event}: ${JSON.stringify(details).slice(0, 1500)}`,
        ...payload,
      }),
      signal: AbortSignal.timeout(ALERT_TIMEOUT_MS),
    });
  } catch (error) {
    console.error("OPS_ALERT_SEND_FAILED", error);
  }
}

export function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}
