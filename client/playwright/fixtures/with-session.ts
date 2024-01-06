import { test as baseTest } from "@playwright/test";
import fs from "fs";
import path from "path";

export * from "@playwright/test";
export const test = baseTest.extend<{}, { workerStorageState: string }>({
    // Use the same storage state for all tests in this worker.
    storageState: ({ workerStorageState }, use) => use(workerStorageState),

    // Authenticate once per worker with a worker-scoped fixture.
    workerStorageState: [
        async ({ browser }, use) => {
            // Use parallelIndex as a unique identifier for each worker.
            const id = test.info().parallelIndex;
            const fileName = path.resolve(
                test.info().project.outputDir,
                `.auth/${id}.json`,
            );

            if (fs.existsSync(fileName)) {
                // Reuse existing authentication state if any.
                await use(fileName);
                return;
            }

            // Important: make sure we authenticate in a clean environment by unsetting storage state.
            const page = await browser.newPage({ storageState: undefined });

            // Perform authentication steps. Replace these actions with your own.
            await page.goto(`${process.env.BASE_URL}/oidc/login`);
            await page.getByPlaceholder("Username").click();
            await page.getByPlaceholder("Username").fill("oscar");
            await page.getByPlaceholder("Password").click();
            await page.getByPlaceholder("Password").fill("password");
            await page.getByRole("button", { name: "Sign in" }).click();
            await page.waitForURL(`${process.env.BASE_URL}`);
            // End of authentication steps.

            await page.context().storageState({ path: fileName });
            await page.close();
            await use(fileName);
        },
        { scope: "worker" },
    ],
});
