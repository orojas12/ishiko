import { test, expect } from "@playwright/test";

test.use({ storageState: { cookies: [], origins: [] } });

test("login", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.getByRole("link", { name: "log in" }).click();
    await page.getByPlaceholder("Username").click();
    await page.getByPlaceholder("Username").fill("oscar");
    await page.getByPlaceholder("Password").click();
    await page.getByPlaceholder("Password").fill("password");
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL("http://localhost:3000/");
    await expect(page.getByRole("heading", { name: "Ishiko" })).toBeVisible();
    await expect(
        page.getByRole("link", { name: "Go to issues" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign out" })).toBeVisible();
});
