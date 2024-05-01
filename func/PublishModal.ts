import { App, SuggestModal, TAbstractFile } from "obsidian";
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { waitForDebugger } from "inspector";
interface Platform {
	name: string;
}
const ALL_PLATFORMS = [
	{
		name: "Publish To :    All Platforms",
	},
	{
		name: "Publish To :    知乎",
	},
	{
		name: "Publish To :    CSDN",
	},
	{
		name: "Publish To :    百家号",
	},
	{
		name: "Publish To :    今日头条",
	},
	{
		name: "Publish To :    哔哩哔哩",
	},
	{
		name: "Publish To :    微信公众号",
	},
	{
		name: "Publish To :    掘金",
	},
	{
		name: "Publish To :    简书",
	},
];
export class PublishModal extends SuggestModal<Platform> {
	private file: TAbstractFile; // 添加一个成员变量来存储文件信息
	constructor(app: App, file: TAbstractFile) {
		super(app);
		this.file = file;
	}
	getSuggestions(query: string): Platform[] {
		return ALL_PLATFORMS.filter((platform) =>
			platform.name.toLowerCase().includes(query.toLowerCase())
		);
	}

	// Renders each suggestion item.
	renderSuggestion(platform: Platform, el: HTMLElement) {
		el.createEl("div", { text: platform.name });
	}

	// Perform action on the selected suggestion.
	onChooseSuggestion(platform: Platform, evt: MouseEvent | KeyboardEvent) {
		publishToPlatform(this.app, platform.name, this.file);
	}
}
function publishToPlatform(
	app: App,
	platformName: string,
	file: TAbstractFile
) {
	// 根据平台名称执行不同的发布逻辑
	switch (platformName) {
		case "Publish To :    All Platforms":
			AllPlatformsAutoPublish(app, file);
			break;
		case "Publish To :    知乎":
			ZhihuAutoPublish(app, file);
			break;
		case "Publish To :    CSDN":
			CSDNAutoPublish(app, file);
			break;
		case "Publish To :    百家号":
			BaijiahaoAutoPublish(app, file);
			break;
		case "Publish To :    今日头条":
			ToutiaoAutoPublish(app, file);
			break;
		case "Publish To :    哔哩哔哩":
			BilibiliAutoPublish(app, file);
			break;
		case "Publish To :    微信公众号":
			WXGZHAutoPublish(app, file);
			break;
		case "Publish To :    掘金":
			JuejinAutoPublish(app, file);
			break;
		case "Publish To :    简书":
			JianshuAutoPublish(app, file);
			break;
		default:
			break;
	}
}
export async function WXGZHAutoPublish(app: App, file: TAbstractFile) {
	//get pwd
	const valuePath = app.vault.adapter.getBasePath();
	const plugins = Object.values(this.app.plugins.manifests);
	const myPluginID = "a-para-periodic-workflow";
	const myPluginDir = plugins.filter((plugin) => plugin.id === myPluginID)[0]
		.dir;
	const currentFullPath = path.join(valuePath, myPluginDir);

	// console.log(file.path);
	const browser = await chromium.launch({ headless: false });
	const context = await browser.newContext();

	//load auth file
	const authFile = currentFullPath + "/playwright/.auth/wechat-mp-auth.json";
	if (fs.existsSync(authFile)) {
		const cookies = JSON.parse(fs.readFileSync(authFile, "utf8")).cookies;
		await context.addCookies(cookies);
	}

	const page = await context.newPage();

	const xpathFile =
		currentFullPath + "/playwright/xpath/" + "publish-to-weixin-mp.json";
	let xpath;
	if (fs.existsSync(xpathFile)) {
		xpath = JSON.parse(fs.readFileSync(xpathFile, "utf8"));
	}

	await page.goto(xpath.url);

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

		const { name } = path.parse(file.path);
		await page1.getByPlaceholder("请在这里输入标题").fill(name);

		const author = "kefu1252";
		await page1.getByPlaceholder("请输入作者").fill(author);

		const fileFullPath = path.join(valuePath, file.path);
		const cont = fs.readFileSync(fileFullPath, "utf8");
		const { data, content } = matter(cont);
		await page1.frameLocator("#ueditor_0").locator("body").fill(content);

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
				hasText:
					"我已阅读并同意遵守《微信公众平台原创声明及相关功能使用协议》",
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
export async function CSDNAutoPublish(app: App, file: TAbstractFile) {
	//get pwd
	const valuePath = app.vault.adapter.getBasePath();
	const plugins = Object.values(this.app.plugins.manifests);
	const myPluginDir = plugins.filter(
		(plugin) => plugin.id === "a-para-periodic-workflow"
	)[0].dir;
	const currentFullPath = path.join(valuePath, myPluginDir);

	// console.log(file.path);
	const browser = await chromium.launch({ headless: false });
	const context = await browser.newContext();

	//load auth file
	const authFile = currentFullPath + "/playwright/.auth/csdn-mp-auth.json";
	if (fs.existsSync(authFile)) {
		const cookies = JSON.parse(fs.readFileSync(authFile, "utf8")).cookies;
		await context.addCookies(cookies);
	}

	const page = await context.newPage();

	// const xpathFile=currentFullPath+'/playwright/xpath/'+'publish-to-weixin-mp.json';
	// let xpath
	// if (fs.existsSync(xpathFile)){
	//  xpath = JSON.parse(fs.readFileSync(xpathFile, 'utf8'));
	// }
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
		const fileFullPath = path.join(valuePath, file.path);
		await page2
			.locator("#import-markdown-file-input")
			.setInputFiles(fileFullPath);
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
export async function ZhihuAutoPublish(app: App, file: TAbstractFile) {
	//get pwd
	const valuePath = app.vault.adapter.getBasePath();
	const plugins = Object.values(this.app.plugins.manifests);
	const myPluginDir = plugins.filter(
		(plugin) => plugin.id === "a-para-periodic-workflow"
	)[0].dir;
	const currentFullPath = path.join(valuePath, myPluginDir);

	// console.log(file.path);
	const browser = await chromium.launch({ headless: false });
	const context = await browser.newContext();

	//load auth file
	const authFile = currentFullPath + "/playwright/.auth/zhihu-mp-auth.json";
	if (fs.existsSync(authFile)) {
		const cookies = JSON.parse(fs.readFileSync(authFile, "utf8")).cookies;
		await context.addCookies(cookies);
	}

	const page = await context.newPage();

	// const xpathFile=currentFullPath+'/playwright/xpath/'+'publish-to-weixin-mp.json';
	// let xpath
	// if (fs.existsSync(xpathFile)){
	//  xpath = JSON.parse(fs.readFileSync(xpathFile, 'utf8'));
	// }
	await page.goto("https://www.zhihu.com");
	await page.waitForLoadState("load");
	//wait for login
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
			console.log("login timeout");
			await browser.close();
			return;
		}
	}
	context.storageState({ path: authFile });
	await page.getByRole("button", { name: "写文章" }).click();
	await page.on("popup", async (page1) => {
		await page1.waitForLoadState("load");
		await page1.getByRole("button", { name: "文档" }).click();
		await page1
			.locator(".Menu")
			.getByRole("button", { name: "文档" })
			.click();

		const fileFullPath = path.join(valuePath, file.path);
		await page1
			.locator('form input[type="file"]')
			.setInputFiles(fileFullPath);

		const { name } = path.parse(file.path);
		await page1.locator("textarea").fill(name);

		await page1.getByRole("button", { name: "添加话题" }).click();
		await page1.locator('input[aria-label="搜索话题"]').fill(name);
		await page1.getByRole("button", { name: name }).click();
		await page1.waitForTimeout(3*1000);
		await page1.getByRole("button", { name: "发布" }).click();
		await page1.waitForTimeout(1000);
		await browser.close();
	});
	
}
export async function JianshuAutoPublish(app: App, file: TAbstractFile) {
	//get pwd
	const valuePath = app.vault.adapter.getBasePath();
	const plugins = Object.values(this.app.plugins.manifests);
	const myPluginDir = plugins.filter(
		(plugin) => plugin.id === "a-para-periodic-workflow"
	)[0].dir;
	const currentFullPath = path.join(valuePath, myPluginDir);

	// console.log(file.path);
	const browser = await chromium.launch({ headless: false });
	const context = await browser.newContext();

	//load auth file
	const authFile = currentFullPath + "/playwright/.auth/jianshu-mp-auth.json";
	if (fs.existsSync(authFile)) {
		const cookies = JSON.parse(fs.readFileSync(authFile, "utf8")).cookies;
		await context.addCookies(cookies);
	}

	const page = await context.newPage();

	// const xpathFile=currentFullPath+'/playwright/xpath/'+'publish-to-weixin-mp.json';
	// let xpath
	// if (fs.existsSync(xpathFile)){
	//  xpath = JSON.parse(fs.readFileSync(xpathFile, 'utf8'));
	// }
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
				const { name } = path.parse(file.path);
				await page2.locator('div > input[type="text"]').clear();
				await page2.locator('div > input[type="text"]').fill(name);
				await page2.waitForTimeout(1000);
				const fileFullPath = path.join(valuePath, file.path);
				const cont = fs.readFileSync(fileFullPath, "utf8");
				const { data, content } = matter(cont);
				await page2.locator("div.kalamu-area").fill(content);
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
			const { name } = path.parse(file.path);
			await page2.locator('div > input[type="text"]').clear();
			await page2.locator('div > input[type="text"]').fill(name);
			await page2.waitForTimeout(1000);
			const fileFullPath = path.join(valuePath, file.path);
			const cont = fs.readFileSync(fileFullPath, "utf8");
			const { data, content } = matter(cont);
			await page2.locator("div.kalamu-area").fill(content);
			await page2.waitForTimeout(1000);
			await page2.locator('a.fa.fa-floppy-o').click();
			await page2.waitForLoadState("load", { timeout: 120 * 1000 });
			await page2.locator('a[data-action="publicize"]').hover();
			await page2.locator('a[data-action="publicize"]').click();
			await page2.waitForSelector('a:has-text("发布成功")', { timeout: 120 * 1000 });
			await browser.close();
		});
	}
}
export async function JuejinAutoPublish(app: App, file: TAbstractFile) {
	//get pwd
	const valuePath = app.vault.adapter.getBasePath();
	const plugins = Object.values(this.app.plugins.manifests);
	const myPluginDir = plugins.filter(
		(plugin) => plugin.id === "a-para-periodic-workflow"
	)[0].dir;
	const currentFullPath = path.join(valuePath, myPluginDir);

	// console.log(file.path);
	const browser = await chromium.launch({ headless: false });
	const context = await browser.newContext();

	//load auth file
	const authFile = currentFullPath + "/playwright/.auth/juejin-mp-auth.json";
	if (fs.existsSync(authFile)) {
		const cookies = JSON.parse(fs.readFileSync(authFile, "utf8")).cookies;
		await context.addCookies(cookies);
	}

	const page = await context.newPage();

	// const xpathFile=currentFullPath+'/playwright/xpath/'+'publish-to-weixin-mp.json';
	// let xpath
	// if (fs.existsSync(xpathFile)){
	//  xpath = JSON.parse(fs.readFileSync(xpathFile, 'utf8'));
	// }
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

		const fileFullPath = path.join(valuePath, file.path);
		await page1
			.locator('div.upload-area > input[type="file"]')
			.setInputFiles(fileFullPath);

		const { name } = path.parse(file.path);
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
		await page1.getByText('回到首页').click();
		await browser.close();
	});
}
export async function ToutiaoAutoPublish(app: App, file: TAbstractFile) {
	//get pwd
	const valuePath = app.vault.adapter.getBasePath();
	const plugins = Object.values(this.app.plugins.manifests);
	const myPluginDir = plugins.filter(
		(plugin) => plugin.id === "a-para-periodic-workflow"
	)[0].dir;
	const currentFullPath = path.join(valuePath, myPluginDir);

	const browser = await chromium.launch({ headless: false });
	const context = await browser.newContext();

	//load auth file with cookie
	const authFile = currentFullPath + "/playwright/.auth/toutiao-mp-auth.json";
	if (fs.existsSync(authFile)) {
		const cookies = JSON.parse(fs.readFileSync(authFile, "utf8")).cookies;
		await context.addCookies(cookies);
	}

	const page = await context.newPage();

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
				const { name } = path.parse(file.path);
				await page2.locator("textarea").fill(name);

				const fileFullPath = path.join(valuePath, file.path);
				const cont = fs.readFileSync(fileFullPath, "utf8");
				const { data, content } = matter(cont);
				await page2.locator("div.ProseMirror").fill(content);

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
			const { name } = path.parse(file.path);
			await page2.locator("textarea").fill(name);

			const fileFullPath = path.join(valuePath, file.path);
			const cont = fs.readFileSync(fileFullPath, "utf8");
			const { data, content } = matter(cont);
			await page2.locator("div.ProseMirror").fill(content);

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
			await page2.locator('div.publish-footer button').last().click();
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
export async function BaijiahaoAutoPublish(app: App, file: TAbstractFile) {
	//get pwd
	const valuePath = app.vault.adapter.getBasePath();
	const plugins = Object.values(this.app.plugins.manifests);
	const myPluginDir = plugins.filter(
		(plugin) => plugin.id === "a-para-periodic-workflow"
	)[0].dir;
	const currentFullPath = path.join(valuePath, myPluginDir);

	const browser = await chromium.launch({ headless: false });
	const context = await browser.newContext();

	//load auth file with cookie
	const authFile =
		currentFullPath + "/playwright/.auth/baijiahao-mp-auth.json";
	if (fs.existsSync(authFile)) {
		const cookies = JSON.parse(fs.readFileSync(authFile, "utf8")).cookies;
		await context.addCookies(cookies);
	}

	const page = await context.newPage();

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
	const { name } = path.parse(file.path);
	await page.locator("div.input-box textarea").fill(name);
	const fileFullPath = path.join(valuePath, file.path);

	const cont = fs.readFileSync(fileFullPath, "utf8");
	const { data, content } = matter(cont);
	await page.frameLocator("#ueditor_0").locator("body").fill(content);
	await page.locator("li.left").first().click();
	await page.getByLabel("单图").click();
	await page.locator(".coverUploaderView > .container").first().click();
	await page.locator("div.cheetah-ui-pro-base-image").click();
	await page.getByRole("button", { name: "确 认" }).click();
	await page.waitForTimeout(5 * 1000);
	await page.getByLabel("自动优化标题").click();
	await page.waitForTimeout(5 * 1000);
	await page.locator("div.op-btn-outter-content button").nth(1).click();
	await page.waitForTimeout(5 * 1000);
	await browser.close();
}
export async function BilibiliAutoPublish(app: App, file: TAbstractFile) {
	//get pwd
	const valuePath = app.vault.adapter.getBasePath();
	const plugins: unknown = Object.values(this.app.plugins.manifests);
	const myPluginDir = plugins.filter(
		(plugin) => plugin.id === "a-para-periodic-workflow"
	)[0].dir;
	const currentFullPath = path.join(valuePath, myPluginDir);

	const browser = await chromium.launch({ headless: false });
	const context = await browser.newContext();

	//load auth file with cookie
	const authFile =
		currentFullPath + "/playwright/.auth/bilibili-mp-auth.json";
	if (fs.existsSync(authFile)) {
		const cookies = JSON.parse(fs.readFileSync(authFile, "utf8")).cookies;
		await context.addCookies(cookies);
	}

	const page = await context.newPage();

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
		await page1.locator("#video-up-app").getByText("专栏投稿").click();
		const { name } = path.parse(file.path);
		await page1
			.frameLocator("div.iframe-comp-container iframe")
			.locator("textarea")
			.fill(name);
		const fileFullPath = path.join(valuePath, file.path);
		const cont = fs.readFileSync(fileFullPath, "utf8");
		const { data, content } = matter(cont);
		await page1
			.frameLocator("div.iframe-comp-container iframe")
			.locator(".ql-editor")
			.fill(content);
		await page1
			.frameLocator("div.iframe-comp-container iframe")
			.getByRole('checkbox', { name: '我声明此文章为原创' })
			.click();
		await page1
			.frameLocator("div.iframe-comp-container iframe")
			.locator('div.bre-modal__close')
			.click();
		await page1
			.frameLocator("div.iframe-comp-container iframe")
			.getByRole("button", { name: "提交文章" })
			.click();
	});
}
export async function AllPlatformsAutoPublish(app: App, file: TAbstractFile) {
	await WXGZHAutoPublish(app, file);
	await CSDNAutoPublish(app, file);
	await ZhihuAutoPublish(app, file);
	await JianshuAutoPublish(app, file);
	await JuejinAutoPublish(app, file);
	await BaijiahaoAutoPublish(app, file);
	await BilibiliAutoPublish(app, file);
}
