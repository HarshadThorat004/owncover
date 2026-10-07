import type { Instrumentation } from "next";

import { errorMessage, sendOpsAlert } from "@/lib/ops-alert";

export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
  context
) => {
  const digest =
    typeof error === "object" && error !== null && "digest" in error
      ? String(error.digest)
      : undefined;

  await sendOpsAlert("request_error", {
    message: errorMessage(error),
    digest,
    method: request.method,
    path: request.path,
    routePath: context.routePath,
    routeType: context.routeType,
  });
};
