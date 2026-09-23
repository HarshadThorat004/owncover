/** Token for `<meta name="google-site-verification" content="…" />` (Search Console HTML tag). */
export function getGoogleSiteVerificationToken(
  env: Record<string, string | undefined> = process.env
) {
  const raw = env.GOOGLE_SITE_VERIFICATION?.trim();
  if (!raw) {
    return undefined;
  }

  const contentMatch = raw.match(/content\s*=\s*["']([^"']+)["']/i);
  if (contentMatch?.[1]) {
    return contentMatch[1].trim();
  }

  if (/^google-site-verification=/i.test(raw)) {
    return raw.replace(/^google-site-verification=/i, "").trim();
  }

  return raw.replace(/^["']|["']$/g, "");
}
