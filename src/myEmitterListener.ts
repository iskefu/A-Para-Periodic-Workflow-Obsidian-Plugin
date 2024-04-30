import {
	createParaArea,
	createParaProject,
	createParaResource,
} from "func/createPARA";
import { myEmitter } from "./EventEmitter";
import { initParaFolder } from "func/init-para-folder";
import { InitPeriodicFolderAndTemplate } from "func/initPeriodicFolderAndTemplate";
import { MyPluginSettings } from "./settings";
import { App } from "obsidian";
import {
	BackupPlugins,
	ExtractTranslationJson,
	RestorePlugins,
	tranlatePlugins,
} from "func/translatePlugins";

export async function myEmitterListener(app: App, settings: MyPluginSettings) {
	//初始化 init 面板
	myEmitter.on(
		"formSubmitted",
		(e: { area: string; project: string; resource: string }) => {
			//监听用户在视图 PARA 面板的输入
			createParaArea(app, settings, e.area);
			createParaProject(app, settings, e.project);
			createParaResource(app, settings, e.resource);
		}
	);
	myEmitter.on("InitParaButtonClicked", () => {
		initParaFolder(app, settings);
	});

	myEmitter.on("InitPeriodicButtonClicked", () => {
		InitPeriodicFolderAndTemplate(app, settings);
	});

	//插件翻译面板
	myEmitter.on("BackupPluginButtonClicked", () => {
		//TODO:实现备份插件功能
		console.log("BackupPluginButtonClicked");
		BackupPlugins(app);
	});
	myEmitter.on("ExtractTranslationButtonClicked", () => {
		ExtractTranslationJson(app);
	});
	myEmitter.on("TranslatePluginButtonClicked", () => {
		tranlatePlugins(app);
	});
	myEmitter.on("RestorePluginButtonClicked", () => {
		RestorePlugins(app);
	});

	//文章自动发布面板
	myEmitter.on("WeChatAutoPublishClicked", () => {});
	myEmitter.on("CSDNAutoPublishClicked", () => {});
	myEmitter.on("ZhihuAutoPublishClicked", () => {});
	myEmitter.on("JianshuAutoPublishClicked", () => {});
	myEmitter.on("JuejinAutoPublishClicked", () => {});
	myEmitter.on("ToutiaoAutoPublishClicked", () => {});
	myEmitter.on("BaijiahaoAutoPublishClicked", () => {});
	myEmitter.on("BilibiliAutoPublishClicked", () => {});
}
