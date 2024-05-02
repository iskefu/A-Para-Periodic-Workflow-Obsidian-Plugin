import { App, TAbstractFile } from "obsidian";
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getPluginDir } from "./ZhihuAutoPublish";

export async function JianshuAutoPublish(app: App, filePath: string) {
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
	const authFile = pluginDIr + "/playwright/.auth/" + "jianshu-mp-auth.json";
	if (fs.existsSync(authFile)) {
		const cookies = JSON.parse(fs.readFileSync(authFile, "utf8")).cookies;
		await context.addCookies(cookies);
	}
	
	await page.goto("https://www.jianshu.com");
	await page.waitForLoadState("load");
	//wait for login
	const logined_element = "div.user";
	const isLoginIn = await page.isVisible(logined_element);
	if (!isLoginIn) {
		try {
			await page.locator("#sign_in").click();
			await page.locator("a.weixin").click();
			page.once("popup", async (page1) => {
				await page1.waitForSelector(logined_element, {
					timeout: 120 * 1000,
				});
			});
		} catch (e) {
			console.log("login timeout");
			await browser.close();
			return;
		}
		page.on("popup", async (page1) => {
			// await page1.waitForLoadState('load')
			await page.locator("a.btn.write-btn").click();
			page.on("popup", async (page2) => {
				context.storageState({ path: authFile });

				// await page2.waitForLoadState('load')
				await page2.locator("div._1GsW5").click();
				await page2.waitForTimeout(1000);
				const { name } = path.parse(filePath);
				await page2.locator('div > input[type="text"]').clear();
				await page2.locator('div > input[type="text"]').fill(name);
				await page2.waitForTimeout(1000);
				await page2.locator("div.kalamu-area").click();
				await page2.locator("div.kalamu-area").press("Control+v");
				await page2.waitForTimeout(1000);
				await page2.locator('a[data-action="publicize"]').click();
				await page2.waitForTimeout(1000);
				await browser.close();
			});
		});
	} else {
		await page.locator("a.btn.write-btn").click();
		page.on("popup", async (page2) => {
			context.storageState({ path: authFile });

			// await page2.waitForLoadState('load')
			await page2.locator("div._1GsW5").click();
			await page2.waitForTimeout(1000);
			const { name } = path.parse(filePath);
			await page2.locator('div > input[type="text"]').clear();
			await page2.locator('div > input[type="text"]').fill(name);
			await page2.waitForTimeout(1000);
			await page2.locator("div.kalamu-area").click();
			await page2.locator("div.kalamu-area").press("Control+v");
			await page2.waitForTimeout(1000);
			await page2.locator("a.fa.fa-floppy-o").click();
			await page2.waitForTimeout(1000);
			// await page2.waitForLoadState("load", { timeout: 120 * 1000 });
			await page2.locator('a[data-action="publicize"]').hover();
			await page2.locator('a[data-action="publicize"]').click();
			await page2.waitForSelector('a:has-text("发布成功")', {
				timeout: 120 * 1000,
			});
			await browser.close();
		});
	}
}
