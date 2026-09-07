import { describe, expect, it } from "vitest";

import { authErrorToast, safeAuthCallbackUrl } from "@/lib/auth-callback";

describe("safeAuthCallbackUrl", () => {
  it("allows dashboard and invite paths only", () => {
    expect(safeAuthCallbackUrl(null)).toBe("/dashboard");
    expect(safeAuthCallbackUrl("/dashboard")).toBe("/dashboard");
    expect(safeAuthCallbackUrl("/invite/abc")).toBe("/invite/abc");
    expect(safeAuthCallbackUrl("https://evil.example/dashboard")).toBe(
      "/dashboard"
    );
  });
});

describe("authErrorToast", () => {
  it("maps OAuth errors to a retry message", () => {
    expect(authErrorToast("OAuthCallback")).toBe(
      "Google sign-in failed. Please try again."
    );
    expect(authErrorToast("Configuration")).toBe(
      "Sign-in failed. Please try again."
    );
    expect(authErrorToast(null)).toBeNull();
  });
});
