type AppUrlEnv = Record<string, string | undefined>;

function originFromValue(value: string | undefined) {
  const stripped = value?.trim().replace(/\/$/, "");

  if (!stripped) {
    return null;
  }

  if (/^https?:\/\//i.test(stripped)) {
    return stripped;
  }

  return `https://${stripped}`;
}

export function getAppBaseUrl(env: AppUrlEnv = process.env) {
  const configured = originFromValue(env.NEXTAUTH_URL);
  if (configured) {
    return configured;
  }

  if (env.VERCEL_ENV === "production") {
    const production = originFromValue(env.VERCEL_PROJECT_PRODUCTION_URL);
    if (production) {
      return production;
    }
  }

  const deployment = originFromValue(env.VERCEL_URL);
  if (deployment) {
    return deployment;
  }

  return "http://localhost:3000";
}
