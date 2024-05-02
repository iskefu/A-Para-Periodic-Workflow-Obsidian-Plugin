import { App, TAbstractFile } from "obsidian";
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getPluginDir } from "./ZhihuAutoPublish";


export async function ToutiaoAutoPublish(app: App, filePath: string) {
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
	const authFile = pluginDIr + "/playwright/.auth/" + "toutiao-mp-auth.json";
	if (fs.existsSync(authFile)) {
		const cookies = JSON.parse(fs.readFileSync(authFile, "utf8")).cookies;
		await context.addCookies(cookies);
	}
	await page.goto("https://www.toutiao.com/");
	await page.waitForLoadState("load");
	//wait for login
	const logined_element = "div.user-icon span";
	const isLoginIn = await page.isVisible(logined_element);
	if (!isLoginIn) {
		try {
			await page.locator(".show-monitor a.login-button").click();
			await page.getByLabel("协议勾选框").click();
			await page.getByRole("button", { name: "微信登录" }).click();
			page.on("popup", async (page1) => {
				await page1.waitForSelector(logined_element);
			});
		} catch (e) {
			console.log("login timeout");
			await browser.close();
			return;
		}
		page.on("popup", async (page1) => {
			await page1.waitForSelector(logined_element);
			await page1.waitForLoadState("load");
			context.storageState({ path: authFile });
			await page1.locator("a.publish-item").first().click();
			page1.on("popup", async (page2) => {
				await page2.waitForLoadState("load");
				await (await page2.waitForSelector("span.icon-wrap")).click();
				const { name } = path.parse(filePath);
				await page2.locator("textarea").fill(name);

				await page2.locator("div.ProseMirror").click();
				await page2.locator("div.ProseMirror").press("Control+v");

				await page2
					.locator("label")
					.filter({ hasText: "单标题" })
					.locator("div")
					.click();
				await page2
					.locator("label")
					.filter({ hasText: "无封面" })
					.locator("div")
					.click();
				await page2.getByRole("button", { name: "预览并发布" }).click();
				await page2.waitForTimeout(1000);
				await page2.getByRole("button", { name: "确定发布" }).click();
				await page2
					.locator("button")
					.filter({ hasText: "获取验证码" })
					.click();
				//手动输入验证码
				await page2.waitForTimeout(60 * 1000);
				await browser.close();
			});
		});
	} else {
		await page.locator("a.publish-item").first().click();
		page.on("popup", async (page2) => {
			await page2.waitForLoadState("load");
			await (await page2.waitForSelector("span.icon-wrap")).click();
			const { name } = path.parse(filePath);
			await page2.locator("textarea").fill(name);

			await page2.locator("div.ProseMirror").click();
			await page2.locator("div.ProseMirror").press("Control+v");

			await page2
				.locator("label")
				.filter({ hasText: "单标题" })
				.locator("div")
				.click();
			await page2
				.locator("label")
				.filter({ hasText: "无封面" })
				.locator("div")
				.click();
			await page2.waitForTimeout(1000);
			await page2.getByRole("button", { name: "预览并发布" }).click();
			await page2.waitForTimeout(1000);
			await page2.locator("div.publish-footer button").last().click();
			await page2
				.locator("button")
				.filter({ hasText: "获取验证码" })
				.click();
			//手动输入验证码
			await page2.waitForTimeout(120 * 1000);
			// await browser.close();
		});
	}
}
