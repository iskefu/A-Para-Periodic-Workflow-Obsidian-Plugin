// 导入必要的模块
import { getMessage } from "i18n/i18n";
import { App, Notice } from "obsidian";
import path from "path";
import {
	AREA_TEMPLATE,
	FOLDER_KANBAN,
	PROJECT_TEMPLATE,
	RESOURCE_TEMPLATE,
} from "./templateFilePARA";
import { MyPluginSettings } from "src/settings";

// 初始化Para文件夹和模板
// 参数包括应用程序实例app和插件设置settings
export async function initParaFolder(app: App, settings: MyPluginSettings) {
	// 确保模板文件夹存在，若不存在则创建
	await createFolder(app, settings?.templatesPath, "Templates");
	// 创建项目、领域、资源和归档文件夹
	await createFolder(app, settings?.projectsPath, "1-Projects");
	await createFolder(app, settings?.areasPath, "2-Areas");
	await createFolder(app, settings?.resourcesPath, "3-Resources");
	await createFolder(app, settings?.archivePath, "4-Archives");
	// 创建项目、领域和资源模板文件
	await createTemplateFile(
		app,
		settings,
		settings?.projectTemplateName,
		PROJECT_TEMPLATE,
		"Project-Template"
	);
	await createTemplateFile(
		app,
		settings,
		settings?.areaTemplateName,
		AREA_TEMPLATE,
		"Area-Template"
	);
	await createTemplateFile(
		app,
		settings,
		settings?.resourceTemplateName,
		RESOURCE_TEMPLATE,
		"Resource-Template"
	);
	// 创建看板模板文件
	await createTemplateFile(app, settings, "kanban", FOLDER_KANBAN, "kanban");
	// 发送通知，表示Para文件夹和模板初始化完成
	new Notice(`${await getMessage("PARAFoldersAndTemplatesInitialized")}`);
}

// 创建文件夹的函数
// 参数包括应用程序实例app，文件夹路径folderName和默认文件夹名称defaultfoldernaem
export async function createFolder(
	app: App,
	folderName: string | undefined,
	defaultfoldernaem: string
) {
	// 若文件夹路径不存在，则使用默认文件夹名称
	if (!folderName) {
		folderName = defaultfoldernaem;
	}
	// 若文件夹路径对应的抽象文件不存在，则创建文件夹
	if (!app.vault.getAbstractFileByPath(folderName)) {
		await app.vault.createFolder(folderName);
	}
}

// 创建模板文件的函数
// 参数包括应用程序实例app，插件设置settings，模板文件名templateFilerName，模板文件templateFile和默认模板文件名称defaultTemplateFileName
export async function createTemplateFile(
	app: App,
	settings: MyPluginSettings,
	templateFilerName: string | undefined,
	templateFile: string,
	defaultTemplateFileName: string
) {
	// 若模板文件名不存在，则使用默认模板文件名称
	if (!templateFilerName) {
		templateFilerName = defaultTemplateFileName;
	}
	// 构建模板文件的路径
	const templateFilePath = `${settings?.templatesPath}/${templateFilerName}.md`;
	// 解析模板文件路径，分离出目录路径
	const dirPath = path.parse(templateFilePath).dir;

	// 检查目录路径对应的抽象文件是否存在，若不存在则创建目录
	if (!app.vault.getAbstractFileByPath(dirPath)) {
		await app.vault.createFolder(dirPath);
	}
	// 检查模板文件是否存在，若不存在则创建模板文件
	if (!app.vault.getAbstractFileByPath(templateFilePath)) {
		await app.vault.create(templateFilePath, templateFile);
	}
}
