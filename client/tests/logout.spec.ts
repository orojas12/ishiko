import { test, expect } from "../playwright/fixtures/with-session";

test("logout", async ({ page }) => {
    await page.goto(`${process.env.BASE_URL}/oidc/logout`);
    await page.waitForURL(`${process.env.BASE_URL}`);
    await expect(page.getByRole("link", { name: "log in" })).toBeVisible();
});
