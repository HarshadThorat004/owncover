import { expect, test } from "@playwright/test";

test("register, sign in, load sample, download claim pack", async ({ page }) => {
  const email = `e2e-${Date.now()}@example.com`;
  const password = "e2e-password-123";

  const register = await page.request.post("/api/register", {
    data: { name: "E2E Tester", email, password },
  });
  expect(register.status()).toBe(201);

  try {
    await page.goto("/login");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password", { exact: true }).fill(password);
    await page.getByRole("button", { name: "Log In" }).click();
    await page.waitForURL("**/dashboard");
    await expect(page.getByRole("heading", { name: "Your vault" })).toBeVisible({
      timeout: 30_000,
    });

    const sample = await page.request.post("/api/products/sample");
    expect(sample.ok()).toBeTruthy();
    const { id } = (await sample.json()) as { id: string };

    await page.goto(`/dashboard/products/${id}`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible({
      timeout: 30_000,
    });

    const pack = await page.request.get(`/api/products/${id}/claim-pack`);
    expect(pack.status()).toBe(200);
    expect(pack.headers()["content-type"]).toContain("application/pdf");
    expect((await pack.body()).subarray(0, 4).toString()).toBe("%PDF");
  } finally {
    await page.request.delete("/api/account", { data: { email } });
  }
});
