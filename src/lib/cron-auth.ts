import { timingSafeEqual } from "node:crypto";

function secretsEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function isCronAuthorized(
  request: Request,
  env: Record<string, string | undefined> = process.env
) {
  const cronSecret = env.CRON_SECRET?.trim();
  const authorization = request.headers.get("authorization");

  if (!cronSecret || !authorization) {
    return false;
  }

  return secretsEqual(authorization, `Bearer ${cronSecret}`);
}
