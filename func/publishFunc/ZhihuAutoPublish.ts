import { App } from "obsidian";
import { chromium } from "playwright";
import fs, { access } from "fs";
import path from "path";

export async function ZhihuAutoPublish(app: App, filePath: string) {
	const browser = await chromium.launch({ headless: false });
	const context = await browser.newContext();
	const page = await context.newPage();
	page.goto("http://localhost:8080/md/");
	await page.waitForLoadState("load",{ timeout: 120 * 1000 });
	await page.locator("input[type=file]").setInputFiles(filePath);	
	await page.waitForTimeout(3000);
	await page.getByRole("button", { name: "复制" }).click();

	//load auth file
	const pluginId = "a-para-periodic-workflow";
	const pluginDIr = await getPluginDir(pluginId);
	// console.log(pluginDIr);
	const authFile = pluginDIr + "/playwright/.auth/" + "zhihu-mp-auth.json";
	if (fs.existsSync(authFile)) {
		const cookies = JSON.parse(fs.readFileSync(authFile, "utf8")).cookies;
		await context.addCookies(cookies);
	}


	//新页面输入内容

	await page.goto("https://www.zhihu.com");
	await page.waitForLoadState("load");

	//check for login
	const logined_element = "button.GlobalWriteV2-topItem";
	const isLoginIn = await page.isVisible(logined_element);
	if (!isLoginIn) {
		try {
			await page
				.locator(".Login-socialButtonGroup > button")
				.first()
				.click();
			await page.waitForSelector(logined_element, {
				timeout: 120 * 1000,
			});
		} catch (e) {
			console.error(e);
			await browser.close();
			return;
		}
	}
	context.storageState({ path: authFile });
	await page.getByRole("button", { name: "写文章" }).click();
	page.on("popup", async (page1) => {
		await page1.waitForLoadState("load");

		const { name } = path.parse(filePath);
		await page1.locator("textarea").fill(name);

		await page1.locator('div.DraftEditor-root').click();
		await page1.locator('div.DraftEditor-root').press("Control+v");
		await page1.waitForSelector('div.css-nut0iz')
		await page1.getByRole("button", { name: "发布" }).click();
		await page1.waitForSelector('#Popover2-toggle')

		await browser.close();
	});
}
export async function getPluginDir(pluginId: string) {
	//get this plugin directory path
	const valuePath = app.vault.adapter.getBasePath();
	const plugins = Object.values(this.app.plugins.manifests);
	const myPluginDir = plugins.filter((plugin) => plugin.id === pluginId)[0]
		.dir;
	const currentFullPath = path.join(valuePath, myPluginDir);
	return currentFullPath;
}
