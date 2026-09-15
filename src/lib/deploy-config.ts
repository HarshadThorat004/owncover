type DeployEnv = Record<string, string | undefined>;

export function getRequiredDeployConfig(env: DeployEnv = process.env) {
  return {
    databaseUrl: Boolean(env.DATABASE_URL?.trim()),
    authSecret: Boolean(env.NEXTAUTH_SECRET?.trim()),
    nextAuthUrl: Boolean(env.NEXTAUTH_URL?.trim()),
    cronSecret: Boolean(env.CRON_SECRET?.trim()),
    resend: Boolean(env.RESEND_API_KEY?.trim()),
    uploadthing: Boolean(env.UPLOADTHING_TOKEN?.trim()),
  };
}

export function isDeployConfigReady(
  config: ReturnType<typeof getRequiredDeployConfig>
) {
  return Object.values(config).every(Boolean);
}
