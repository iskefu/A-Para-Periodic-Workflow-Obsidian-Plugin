import { spawn } from "child_process";
import { App, TAbstractFile } from "obsidian";
import path from "path";
import { chromium } from "playwright";
import { MyPluginSettings } from "src/settings";

export async function t(
	app: App,
	settings: MyPluginSettings,
	filePath: string
) {

	// const python = spawn("google-chrome-stable", ['--remote-debugging-port=9222']); // 替换为你的Python脚本路径
	const browser = await chromium.connectOverCDP('http://localhost:9222')// Your Chrome websocket URL
	  
	  const context = await browser.newContext();
	  const page = await context.newPage();
	  await page.goto('https://www.example.com');
	  
	  await browser.close();

}
