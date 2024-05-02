import { App, TAbstractFile } from "obsidian";
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { getPluginDir } from "./ZhihuAutoPublish";

export async function JuejinAutoPublish(app: App, filePath: string) {
	const browser = await chromium.launch({ headless: false });
	const context = await browser.newContext();
	const page = await context.newPage();

	// page.goto("http://localhost:8080/md/");
	// await page.waitForLoadState("load",{ timeout: 120 * 1000 });
	// await page.locator("input[type=file]").setInputFiles(filePath);	
	// await page.waitForTimeout(3000);
	// await page.getByRole("button", { name: "复制" }).click();

	const pluginId = "a-para-periodic-workflow";
	const pluginDIr = await getPluginDir(pluginId);
	const authFile = pluginDIr + "/playwright/.auth/" + "juejin-mp-auth.json";
	if (fs.existsSync(authFile)) {
		const cookies = JSON.parse(fs.readFileSync(authFile, "utf8")).cookies;
		await context.addCookies(cookies);
	}
	
	await page.goto("https://www.juejin.cn");
	await page.waitForLoadState("load");
	//wait for login
	const logined_element = "div.avatar-wrapper";
	const isLoginIn = await page.isVisible(logined_element);
	if (!isLoginIn) {
		try {
			await page.locator("button.login-button").click();
			await page.locator("div.oauth-bg").nth(1).click();
			await page.waitForSelector(logined_element, {
				timeout: 120 * 1000,
			});
		} catch (e) {
			console.log("login timeout");
			await browser.close();
			return;
		}
	}
	context.storageState({ path: authFile });
	await page.getByRole("button", { name: "创作者中心" }).click();
	await page.waitForLoadState("load");
	await page.getByRole("button", { name: "写文章" }).click();
	page.on("popup", async (page1) => {
		await page1.waitForLoadState("domcontentloaded");
		await page1
			.locator(
				'div.bytemd-toolbar-icon.bytemd-tippy.bytemd-tippy-right[bytemd-tippy-path="6"]'
			)
			.click();

		await page1
			.locator('div.upload-area > input[type="file"]')
			.setInputFiles(filePath);

		const { name } = path.parse(filePath);
		await page1.locator("input.title-input").fill(name);
		await page1.getByRole("button", { name: "发布" }).click();
		await page1.locator("div.item").nth(4).click();
		await page1.locator("div.byte-select__wrap").first().click();
		await page1.getByRole("button", { name: "GitHub" }).click();
		await page1
			.locator("div.summary-textarea > textarea")
			.fill("A".repeat(100));
		await page1.getByRole("button", { name: "确定并发布" }).click();
		await page1.waitForTimeout(1000);
		await page1.getByText("回到首页").click();
		await browser.close();
	});
}
