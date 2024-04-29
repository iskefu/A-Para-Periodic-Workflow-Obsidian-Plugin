import { getMessage } from "i18n/i18n";
import { App, Notice } from "obsidian";
import path from "path";
import { AREA_TEMPLATE, FOLDER_KANBAN, PROJECT_TEMPLATE, RESOURCE_TEMPLATE } from "./templateFilePARA";
import { MyPluginSettings } from "src/settings";


// 定义一个模态窗口，继承自Modal类
export async function initParaFolder(app:App, settings: MyPluginSettings ) {
	await createFolder(app, settings?.templatesPath, "Templates");
	await createFolder(app, settings?.projectsPath, "1-Projects");
	await createFolder(app, settings?.areasPath, "2-Areas");
	await createFolder(app, settings?.resourcesPath, "3-Resources");
	await createFolder(app, settings?.archivePath, "4-Archives");
	await createTemplateFile(app, settings, settings?.projectTemplateName, PROJECT_TEMPLATE, "Project-Template");
	await createTemplateFile(app, settings, settings?.areaTemplateName, AREA_TEMPLATE, "Area-Template");
	await createTemplateFile(app, settings, settings?.resourceTemplateName, RESOURCE_TEMPLATE, "Resource-Template");
	await createTemplateFile(app, settings, "kanban", FOLDER_KANBAN, "kanban");
	new Notice(`${await getMessage('PARAFoldersAndTemplatesInitialized')}`);
}
//创建文件夹函数
export async function createFolder(app:App, folderName: string | undefined, defaultfoldernaem: string) {
	if (!folderName) {
		folderName = defaultfoldernaem;
	}
	if (!app.vault.getAbstractFileByPath(folderName)) {
		await app.vault.createFolder(folderName);
	} 

}

export async function createTemplateFile(app:App, settings: MyPluginSettings, templateFilerName: string | undefined, templateFile: string, defaultTemplateFileName: string) {
	if (!templateFilerName) {
		templateFilerName=defaultTemplateFileName;
	}
	const templateFilePath = `${settings?.templatesPath}/${templateFilerName}.md`;
    const parsedPath = path.parse(templateFilePath);
    const dirPath = parsedPath.dir;
	
    if (!app.vault.getAbstractFileByPath(dirPath)) {
		await app.vault.createFolder(dirPath);
	}
	if (!app.vault.getAbstractFileByPath(templateFilePath)) {
		await app.vault.create(templateFilePath, templateFile);
	}
}
export async function createFile(app: App,fileName: string, fileContent: string, defaultFileName: string) {
	if (!fileName) {
		fileName=defaultFileName;
	}
	// 使用 path.parse 分离出路径和文件名
    const parsedPath = path.parse(fileName);
	// 构建目录路径
    const dirPath = parsedPath.dir;
	// 检查目录是否存在，如果不存在则创建
    if (!app.vault.getAbstractFileByPath(dirPath)) {
		await app.vault.createFolder(dirPath);
	}
	if (!app.vault.getAbstractFileByPath(fileName)) {
		await app.vault.create(fileName+".md", fileContent);
	}
}