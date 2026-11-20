import { test, expect } from "@playwright/test";

test.describe("End-to-End Client & Case Lifecycle Test", () => {
  test("Create client, create case, view case, update hearing, and verify running cases", async ({ page }) => {
    // 1. Sign in
    await page.goto("/auth/sign-in/", { timeout: 30000 });
    await page.waitForLoadState("networkidle");

    const emailInput = page.locator('input[type="email"]');
    const passInput = page.locator('input[type="password"]');
    await emailInput.fill("admin@peshify.pk");
    await passInput.fill("Admin1234!");

    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeEnabled({ timeout: 10000 });
    await submitBtn.click();

    // Wait until navigated away from sign-in
    await page.waitForURL(url => !url.pathname.includes("/auth/sign-in"), { timeout: 20000 });
    console.log("Logged in successfully. Current URL:", page.url());

    // 2. Navigate to /clients/new
    await page.goto("/clients/new/", { timeout: 20000 });
    await page.waitForLoadState("networkidle");

    const timestamp = Date.now().toString().slice(-4);
    const clientName = `Auto Test Client ${timestamp}`;
    const phone = "03331234567";

    // Fill Client form
    await page.locator('input[name="full_name"]').fill(clientName);
    const phoneField = page.locator('input[name="phone"]');
    if (await phoneField.count() > 0) {
      await phoneField.fill(phone);
    }
    const cityField = page.locator('input[name="city"]');
    if (await cityField.count() > 0) {
      await cityField.fill("Lahore");
    }

    const saveClientBtn = page.getByRole("button", { name: /save|create/i }).last();
    await saveClientBtn.click();

    // Verify redirected to client view or clients list
    await page.waitForURL(url => url.pathname.includes("/clients/view") || url.pathname === "/clients/", { timeout: 20000 });
    console.log("Client saved successfully! Current URL:", page.url());

    // 3. Navigate to /cases/new
    await page.goto("/cases/new/", { timeout: 20000 });
    await page.waitForLoadState("networkidle");

    // Select Client in ClientSearchSelect
    const clientSelectBtn = page.locator('button[aria-haspopup="listbox"]').first();
    await clientSelectBtn.click();
    await page.waitForTimeout(500);

    // Look for client in search select or type in search
    const clientOption = page.locator('[role="listbox"]').getByText(clientName).first();
    if (await clientOption.isVisible()) {
      await clientOption.click();
    } else {
      const searchBox = page.locator('input[placeholder*="Search"]').first();
      if (await searchBox.isVisible()) {
        await searchBox.fill(clientName);
        await page.waitForTimeout(500);
      }
      await page.locator('[role="listbox"] button').first().click();
    }
    console.log("Client selected for new case");

    // Case Details
    const caseRef = `TEST-${timestamp}/2026`;
    const caseRefInput = page.locator('input[placeholder="WP-1234/2024"]');
    if (await caseRefInput.count() > 0) {
      await caseRefInput.fill(caseRef);
    }

    // Plaintiff & Defendant
    const plaintiffInput = page.locator('input[placeholder="Muhammad Aslam Khan"]');
    await plaintiffInput.fill(`${clientName} Plaintiff`);

    const defendantInput = page.locator('input[placeholder="Province of Punjab"]');
    await defendantInput.fill("Opponent Defendant");

    // Case type selection
    const caseTypeSelect = page.locator('select').first();
    await caseTypeSelect.waitFor({ state: "visible" });
    const options = await caseTypeSelect.locator("option").all();
    console.log(`Available case types count: ${options.length}`);
    if (options.length > 1) {
      const val = await options[1].getAttribute("value");
      if (val) await caseTypeSelect.selectOption(val);
    }

    // First Hearing Details
    const serialInput = page.locator('input[name="serial_no"]');
    if (await serialInput.count() > 0) {
      await serialInput.fill("12");
    }

    // Next date (set to 2027-05-15)
    const nextDateInput = page.locator('input[type="date"]').first();
    if (await nextDateInput.count() > 0) {
      await nextDateInput.fill("2027-05-15");
    }

    const nextProceeding = page.locator('textarea[name="next_proceeding"]');
    if (await nextProceeding.count() > 0) {
      await nextProceeding.fill("Final Arguments Hearing");
    }

    // Submit case form
    const saveCaseBtn = page.getByRole("button", { name: /^save$/i });
    await saveCaseBtn.click();

    // Verify redirect to case view page
    await page.waitForURL(url => url.pathname.includes("/cases/view"), { timeout: 25000 });
    console.log("Case created successfully! Navigated to:", page.url());

    // 4. Verify Case View page content
    await expect(page.locator("body")).toContainText(caseRef);
    await expect(page.locator("body")).toContainText(`${clientName} Plaintiff`);
    console.log("Verified case details displayed correctly in case view.");

    // 5. Check Running Cases list
    await page.goto("/cases/running/", { timeout: 20000 });
    await page.waitForLoadState("networkidle");

    // Ensure NO "Something went wrong" banner
    await expect(page.getByText("Something went wrong")).toHaveCount(0);
    console.log("Running Cases loaded cleanly with NO error banners!");

    // Search for our created case
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    await searchInput.fill(caseRef);
    await page.waitForTimeout(1000);

    await expect(page.locator("body")).toContainText(caseRef);
    console.log(`PASS: Case ${caseRef} appears in Running Cases table!`);

    // 6. Check Super Admin Page
    await page.goto("/admin/", { timeout: 20000 });
    await page.waitForLoadState("networkidle");
    await expect(page.locator("body")).toContainText("DiaryLex Admin");
    await expect(page.getByText("Something went wrong")).toHaveCount(0);
    console.log("PASS: Admin dashboard loads cleanly with NO errors!");
  });
});
