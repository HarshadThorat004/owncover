type BrandEnv = Record<string, string | undefined>;

const DEFAULT_BRAND_DOMAIN = "owncover.hvtx.in";

function hostnameFromUrl(value: string) {
  const normalized = value.trim().replace(/\/$/, "");
  const withProtocol = /^https?:\/\//i.test(normalized)
    ? normalized
    : `https://${normalized}`;

  return new URL(withProtocol).hostname;
}

export function getBrandDomain(env: BrandEnv = process.env) {
  const explicit =
    env.NEXT_PUBLIC_BRAND_DOMAIN?.trim() || env.BRAND_DOMAIN?.trim();

  if (explicit) {
    return explicit;
  }

  const authUrl = env.NEXTAUTH_URL?.trim();
  if (authUrl) {
    try {
      return hostnameFromUrl(authUrl);
    } catch {
      // fall through
    }
  }

  return DEFAULT_BRAND_DOMAIN;
}

export function getInboundDomain(env: BrandEnv = process.env) {
  const configured =
    env.INBOUND_EMAIL_DOMAIN?.trim() ||
    env.NEXT_PUBLIC_INBOUND_EMAIL_DOMAIN?.trim();

  if (configured) {
    return configured;
  }

  return `inbound.${getBrandDomain(env)}`;
}

export function getBrandSiteUrl(env: BrandEnv = process.env) {
  const authUrl = env.NEXTAUTH_URL?.trim();
  if (authUrl) {
    try {
      return hostnameFromUrl(authUrl).startsWith("http")
        ? authUrl.replace(/\/$/, "")
        : `https://${hostnameFromUrl(authUrl)}`;
    } catch {
      // fall through
    }
  }

  return `https://${getBrandDomain(env)}`;
}
