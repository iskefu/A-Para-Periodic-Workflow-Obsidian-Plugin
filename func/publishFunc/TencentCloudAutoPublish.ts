import { App, TAbstractFile } from "obsidian";
import { getPluginDir } from "./ZhihuAutoPublish";
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import clipboardy from "clipboardy";

export async function TencentCloudAutoPublish(app: App, filePath: string) {
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
	const authFile = pluginDIr + "/playwright/.auth/" + "tencentcloud-mp-auth.json";
	if (fs.existsSync(authFile)) {
		const cookies = JSON.parse(fs.readFileSync(authFile, "utf8")).cookies;
		await context.addCookies(cookies);
	}
	await page.goto("https://cloud.tencent.com/developer");
	await page.waitForLoadState("load");
	const logined_element = "i.cdc-header__account-avatar";
	const isLoginIn = await page.isVisible(logined_element);
	const istips= await page.isVisible("button.cdc-btn.mod-activity__btn.cdc-btn--hole");
	if (istips) {
		// await page.locator("button.cdc-btn.mod-activity__btn.cdc-btn--hole").click();
		await page.getByRole("button", { name: "不再提示" }).click();
	}
	if (!isLoginIn) {
		try {
			await page.getByRole('button', { name: '登录/注册' }).click();
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
	await page.waitForTimeout(2000);
	await page.getByText('发布').click();
	await page.getByRole('link', { name: '写文章' }).click();
	await page.waitForTimeout(2000);
	// await page.locator('div.col-editor-switch a').click();
	const {name} = path.parse(filePath);
	await page.locator('div.article-title-wrap  textarea').fill(name);
	await page.locator('div.notranslate.public-DraftEditor-content').click();
	await page.locator('div.notranslate.public-DraftEditor-content').press('Control+v');
	await page.getByRole('button', { name: '发布' }).click();

	await page.getByLabel('原创').click();
	await page.locator('.com-2-tag-input').first().fill("github")
	await page.locator('.com-2-tag-input').first().press('Enter')
	await page.waitForTimeout(2000);
	await page.getByRole('button', { name: '确认发布' }).click();

}
