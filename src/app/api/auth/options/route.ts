import { jsonSuccess } from "@/lib/api";
import { getEnabledOAuthProviders } from "@/lib/auth";
import { getEmailProviderStatus } from "@/lib/email";

/** Public: only which sign-in methods are available. Do not leak mail config. */
export async function GET() {
  const providers = getEnabledOAuthProviders();
  const email = getEmailProviderStatus();

  return jsonSuccess({
    google: providers.google,
    emailOtp: email.configured,
  });
}
