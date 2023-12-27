import { test as setup } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
    await page.goto("http://localhost:3000/oidc/login");
    await page.getByPlaceholder("Username").click();
    await page.getByPlaceholder("Username").fill("oscar");
    await page.getByPlaceholder("Password").click();
    await page.getByPlaceholder("Password").fill("password");
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL("http://localhost:3000/");
    await page.context().storageState({ path: authFile });
});
