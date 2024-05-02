import { App, TAbstractFile } from "obsidian";
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getPluginDir } from "./ZhihuAutoPublish";

export async function WXGZHAutoPublish(app: App, filePath: string) {
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
	const authFile = pluginDIr + "/playwright/.auth/" + "weixin-mp-auth.json";
	if (fs.existsSync(authFile)) {
		const cookies = JSON.parse(fs.readFileSync(authFile, "utf8")).cookies;
		await context.addCookies(cookies);
	}

	await page.goto('https://mp.weixin.qq.com/');
	await page.waitForLoadState("load");

	//wait for login
	const logined_element = ".weui-desktop-account__img";
	const isLoginIn = await page.isVisible(logined_element);
	if (!isLoginIn) {
		try {
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
	await page.locator(".new-creation__menu-content").first().click();
	page.on("popup", async (page1) => {
		await page1.waitForLoadState("load");

		const { name } = path.parse(filePath);
		await page1.getByPlaceholder("请在这里输入标题").fill(name);

		const author = "kefu1252";
		await page1.getByPlaceholder("请输入作者").fill(author);

		await page1.frameLocator("#ueditor_0").locator("body").click();
		await page1.frameLocator("#ueditor_0").locator("body").press("Control+v")

		//upload cover
		await page1.locator(".select-cover__btn").hover();
		await page1.getByRole("link", { name: "从图片库选择" }).click();
		await page1.getByRole("img", { name: "图片描述" }).first().click();
		await page1.getByRole("button", { name: "下一步" }).click();
		await page1.waitForTimeout(1000);
		await page1.getByRole("button", { name: "完成" }).click();

		//原创声明
		await page1.locator(".weui-desktop-switch__box").first().click();
		await page1
			.locator("label")
			.filter({
				hasText: "我已阅读并同意遵守《微信公众平台原创声明及相关功能使用协议》",
			})
			.locator("i")
			.click();
		await page1.getByRole("button", { name: "下一步" }).click();
		await page1.getByText("请选择文章类别").click();
		await page1.getByText("科技").first().click();
		await page1.getByText("互联网+").first().click();
		await page1.getByRole("button", { name: "确定" }).click();

		//赞赏
		await page1
			.locator(
				"#js_reward_setting_area > .setting-group__content > .setting-group__switch > .weui-desktop-switch > .weui-desktop-switch__box"
			)
			.click();
		await page1
			.locator(
				".reward-reply-switch__wrp > .weui-desktop-switch > .weui-desktop-switch__box"
			)
			.click();
		await page1.waitForTimeout(1000);
		await page1.getByRole("button", { name: "确定" }).click();

		await page1.getByRole("button", { name: "发表" }).click();

		await page1.waitForTimeout(1000);
		await page1.getByRole("button", { name: "发表" }).click();

		await page1
			.locator("#vue_app")
			.getByRole("button", { name: "发表" })
			.click();
		await page1.getByRole("button", { name: "继续发表" }).click();

		//wait for scan qrcode to publish
		await page1.waitForSelector(logined_element, { timeout: 120 * 1000 });
		await page1.close();
		await browser.close();
	});
}

