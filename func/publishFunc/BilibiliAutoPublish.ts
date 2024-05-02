import { App, TAbstractFile } from "obsidian";
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { getPluginDir } from "./ZhihuAutoPublish";


export async function BilibiliAutoPublish(app: App, filePath: string) {
	const browser = await chromium.launch({ headless: false });
	const context = await browser.newContext();
	const page = await context.newPage();

	page.goto("http://localhost:8080/md/");
	await page.waitForLoadState("load",{ timeout: 120 * 1000 });
	await page.locator("input[type=file]").setInputFiles(filePath);	
	await page.waitForTimeout(3000);
	await page.getByRole("button", { name: "复制" }).click();

	const pluginId = "a-para-periodic-workflow";
	const pluginDIr = await getPluginDir(pluginId);
	const authFile = pluginDIr + "/playwright/.auth/" + "bilibili-mp-auth.json";
	if (fs.existsSync(authFile)) {
		const cookies = JSON.parse(fs.readFileSync(authFile, "utf8")).cookies;
		await context.addCookies(cookies);
	}
	await page.goto("https://www.bilibili.com/");
	await page.waitForLoadState("load");
	const logined_element = ".v-popover-wrap.header-avatar-wrap";
	const isLoginIn = await page.isVisible(logined_element);
	if (!isLoginIn) {
		try {
			await page.getByText("登录", { exact: true }).click();
			await page
				.locator("div")
				.filter({ hasText: /^微信登录$/ })
				.click();
			await page.waitForSelector(logined_element, {
				timeout: 120 * 1000,
			});
		} catch (e) {
			console.error("login timeout", e);
			await browser.close();
			return;
		}
	}
	context.storageState({ path: authFile });
	await page.waitForLoadState("load");
	await page.getByRole("link", { name: "投稿", exact: true }).click();
	page.on("popup", async (page1) => {
		await page1.waitForLoadState("load");
		await page1.locator("#nav_upload_btn").hover();
		await page1.locator("a.nav-upload-item").nth(1).click();

		const { name } = path.parse(filePath);
		await page1
			.frameLocator("div.iframe-comp-container iframe")
			.locator("textarea")
			.fill(name);
		const cont = fs.readFileSync(filePath, "utf8");
		await page1
			.frameLocator("div.iframe-comp-container iframe")
			.locator(".ql-editor")
			.click();
		await page1
			.frameLocator("div.iframe-comp-container iframe")
			.locator(".ql-editor")
			.press("Control+v");
		await page1
			.frameLocator("div.iframe-comp-container iframe")
			.locator("div.bre-settings__sec__tit.mb-s.more")
			.click();
		await page1
			.frameLocator("div.iframe-comp-container iframe")
			.getByRole("checkbox", { name: "我声明此文章为原创" })
			.click();
		await page1
			.frameLocator("div.iframe-comp-container iframe")
			.locator("div.bre-modal__close")
			.click();
		await page1
			.frameLocator("div.iframe-comp-container iframe")
			.getByRole("button", { name: "提交文章" })
			.click();
	});
}
