import { test, expect } from "../playwright/fixtures/with-session";

test("logout", async ({ page }) => {
    await page.goto("http://localhost:3000/oidc/logout");
    await page.waitForURL("http://localhost:3000/");
    await expect(page.getByRole("link", { name: "log in" })).toBeVisible();
});
