import { App, TAbstractFile } from "obsidian";
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { getPluginDir } from "./ZhihuAutoPublish";

export async function CSDNAutoPublish(app: App, filePath: string) {
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
	const authFile = pluginDIr + "/playwright/.auth/" + "csdn-mp-auth.json";
	if (fs.existsSync(authFile)) {
		const cookies = JSON.parse(fs.readFileSync(authFile, "utf8")).cookies;
		await context.addCookies(cookies);
	}
	const url = "https://www.csdn.net";
	await page.goto(url);
	await page.waitForLoadState("load");
	//wait for login
	const logined_element = "a.hasAvatar";
	const isLoginIn = await page.isVisible(logined_element);
	if (!isLoginIn) {
		try {
			await page.getByText("登录", { exact: true }).click();
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
	await page.getByRole("link", { name: "发布", exact: true }).click();
	await page.waitForLoadState("load");
	await page.getByLabel("使用 MD 编辑器").click();

	page.on("popup", async (page2) => {
		await page2.waitForLoadState("load");
		await page2
			.locator("#import-markdown-file-input")
			.setInputFiles(filePath);
		await page2.getByRole("button", { name: "发布文章" }).click();
		await page2.getByRole("button", { name: "添加文章标签" }).hover();
		await page2.waitForTimeout(1000);
		await page2.locator(".el-tag.el-tag--light").first().click();
		await page2.getByLabel("关闭").nth(2).click();
		await page2
			.getByLabel("Insert publishArticle")
			.getByRole("button", { name: "发布文章" })
			.click();
		//wait for scan qrcode to publish
		await page2.waitForSelector(logined_element, { timeout: 120 * 1000 });
		await page2.close();
		await browser.close();
	});
}
