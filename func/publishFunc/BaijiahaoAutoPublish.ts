import { App, TAbstractFile } from "obsidian";
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { getPluginDir } from "./ZhihuAutoPublish";


export async function BaijiahaoAutoPublish(app: App, filePath: string) {
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
	const authFile = pluginDIr + "/playwright/.auth/" + "baijiahao-mp-auth.json";
	if (fs.existsSync(authFile)) {
		const cookies = JSON.parse(fs.readFileSync(authFile, "utf8")).cookies;
		await context.addCookies(cookies);
	}
	await page.goto("https://baijiahao.baidu.com/");
	await page.waitForLoadState("load");
	const logined_element = ".author";
	const isLoginIn = await page.isVisible(logined_element);
	if (!isLoginIn) {
		try {
			await page.locator("div.btnlogin--bI826").click();
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
	await page.locator("div.nav-switch-btn").first().click();
	await page.getByRole("button", { name: "发布" }).hover();
	await page.locator("li.edit-news").click();
	await page.waitForLoadState("load");
	const { name } = path.parse(filePath);
	await page.locator("div.input-box textarea").fill(name);

	await page.frameLocator("#ueditor_0").locator("body").click();
	await page.frameLocator("#ueditor_0").locator("body").press("Control+v");

	await page.locator("li.left").first().click();
	await page.getByLabel("单图").click();
	await page.locator(".coverUploaderView > .container").first().click();
	await page.locator("div.cheetah-ui-pro-base-image").click();
	await page.getByRole("button", { name: "确 认" }).click();
	await page.waitForTimeout(5 * 1000);
	await page.getByLabel("自动优化标题").click();
	await page.waitForTimeout(10 * 1000);
	await page.locator("div.op-btn-outter-content button").nth(1).click();
	await page.waitForSelector('a.btn.write-another', { timeout: 120 * 1000 });
	await browser.close();
}
