import { test as setup } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
    await page.goto(`${process.env.BASE_URL}/oidc/login`);
    await page.getByLabel("Username").fill("oscar");
    await page.getByLabel("Password").fill("password");
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL(`${process.env.BASE_URL}`);
    await page.context().storageState({ path: authFile });
});
