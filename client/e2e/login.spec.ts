import { test, expect } from "@playwright/test";

// reset session state for these tests
test.use({ storageState: { cookies: [], origins: [] } });

test("login", async ({ page }) => {
    await page.goto(`${process.env.BASE_URL}`);
    await page.getByLabel("Username").fill("oscar");
    await page.getByLabel("Password").fill("password");
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL(`${process.env.BASE_URL}`);
    await expect(page.getByRole("heading", { name: "Ishiko" })).toBeVisible();
});
