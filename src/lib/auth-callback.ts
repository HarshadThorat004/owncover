const INVITE_PATH = /^\/invite\/[A-Za-z0-9_-]+$/;
const OAUTH_ERRORS = new Set([
  "OAuthCallback",
  "OAuthSignin",
  "OAuthCreateAccount",
  "Callback",
  "AccessDenied",
  "google",
]);

export function safeAuthCallbackUrl(raw: string | null | undefined): string {
  if (!raw) {
    return "/dashboard";
  }

  if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\")) {
    return "/dashboard";
  }

  const path = raw.split("?")[0]?.split("#")[0] ?? "";

  if (
    path === "/dashboard" ||
    path.startsWith("/dashboard/") ||
    INVITE_PATH.test(path)
  ) {
    return path;
  }

  return "/dashboard";
}

export function authErrorToast(error: string | null | undefined): string | null {
  if (!error) {
    return null;
  }

  if (OAUTH_ERRORS.has(error)) {
    return "Google sign-in failed. Please try again.";
  }

  return "Sign-in failed. Please try again.";
}
