import { test, expect } from "../playwright/fixtures/with-session";

test("logout", async ({ page }) => {
    await page.goto(`${process.env.BASE_URL}/oidc/logout`);
    await page.waitForURL(`${process.env.BASE_URL}/api/auth/signin`);
    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
    await page.goto(`${process.env.BASE_URL}`);
    await page.waitForURL(`${process.env.BASE_URL}/api/auth/signin`);
    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
});
