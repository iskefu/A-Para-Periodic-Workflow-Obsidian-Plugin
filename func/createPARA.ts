import { getMessage } from "i18n/i18n";
import { App, Notice, TFile } from "obsidian";
import { InputModal } from "src/ModalInputAreaProjectResource";
import { MyPluginSettings } from "src/settings";

export async function createPARA(
	app: App,
	settings: MyPluginSettings
): Promise<void> {
	const modal = new InputModal(app, async (result) => {
		if (!result.area && !result.project && !result.resource) {
			new Notice(
				await getMessage("PleaseEnterAtLeastOneOfProjectDomainResource")
			);
			return;
		}
		// 创建领域,项目,资源文件
		createParaArea(app, settings, result.area);
		createParaProject(app, settings, result.project);
		createParaResource(app, settings, result.resource);
	});

	modal.open(); // 打开模态对话框
}
export async function createParaArea(
	app: App,
	settings: MyPluginSettings,
	area: string
) {
	if (!area) {
		return;
	} // 如果领域为空,则不创建领域文件

	// 创建领域文件夹
	if (!app.vault.getAbstractFileByPath(settings.areasPath)) {
		await app.vault.createFolder(settings.areasPath);
	}

	// 检查领域文件是否存在
	if (app.vault.getAbstractFileByPath(`${settings.areasPath}/${area}.md`)) {
		new Notice(
			` ${await getMessage("FileAlreadyExists")}"${area}" In "${
				settings.areasPath
			}" `
		);
		return;
	}

	// 获取模板文件路径
	const areaTemplateFilePath = `${settings.templatesPath}/${settings.areaTemplateName}.md`;

	// 如果模板文件不存在,就创建空的领域文件
	if (!app.vault.getAbstractFileByPath(areaTemplateFilePath)) {
		await app.vault.create(`${settings.areasPath}/${area}.md`, ""); //创建领域文件
		await app.workspace.openLinkText(area, settings.areasPath, true); //打开领域文件
	}

	// 如果模板文件存在,就从模板文件创建领域文件
	else {
		const areaTemplateFile = app.vault.getAbstractFileByPath(
			areaTemplateFilePath
		) as TFile; //获取模板文件
		const areaTemplateContent = await app.vault.read(areaTemplateFile); //读取模板文件内容
		await app.vault.create(
			`${settings.areasPath}/${area}.md`,
			areaTemplateContent
		); //创建领域文件

		await app.workspace.openLinkText(area, settings.areasPath, true); //打开领域文件
		new Notice(
			`${await getMessage("FileCreated")}"${areaTemplateFilePath}" `
		);
	}
}

// 创建项目文件
export async function createParaProject(
	app: App,
	settings: MyPluginSettings,
	project: string
) {
	if (!project) {
		return;
	} // 如果项目为空,则不创建项目文件

	// 创建项目文件夹
	const projectPath = `${settings.projectsPath}/${project}`;
	if (app.vault.getAbstractFileByPath(projectPath)) {
		return;
		console.error(`文件夹 "${projectPath}" 已存在！`);
	}
	// await app.vault.createFolder(projectPath);
	await app.vault.createFolder(`${projectPath}/DOC`);

	//确保库中不存在要创建的文件
	if (app.vault.getAbstractFileByPath(`${projectPath}/${project}.md`)) {
		new Notice(`${await getMessage("FileAlreadyExists")}:"${project}" `);
		return;
	}

	//获取模板文件路径
	const projectTemplateFilePath = `${settings.templatesPath}/${settings.projectTemplateName}.md`;

	//如果模板文件不存在,就创建空的项目文件
	if (!app.vault.getAbstractFileByPath(projectTemplateFilePath)) {
		await app.vault.create(`${projectPath}/${project}.md`, "");
		new Notice(`${await getMessage("FileCreated")}:"${project}" `);
	} else {
		// 如果模板文件存在,就从模板文件创建项目文件
		//TFile赋值
		const projectTemplateFile = app.vault.getAbstractFileByPath(
			projectTemplateFilePath
		) as TFile;
		//读取模板文件内容
		const projectTemplateContent = await app.vault.read(
			projectTemplateFile
		);
		//创建项目文件
		await app.vault.create(
			`${projectPath}/${project}.md`,
			projectTemplateContent
		);

		new Notice(
			`${await getMessage("FileCreated")}:  "${projectTemplateFilePath}" `
		);
	}

	//打开项目文件
	await app.workspace.openLinkText(project, projectPath, true);
}
export async function createParaResource(
	app: App,
	settings: MyPluginSettings,
	resource: string
) {
	// 如果输入了资源，则准备创建资源文件夹
	if (!resource) {
		return;
	}

	const resourcePath = `${settings.resourcesPath}/${resource}`;
	if (!app.vault.getAbstractFileByPath(resourcePath)) {
		await app.vault.createFolder(resourcePath);
		await app.vault.createFolder(`${resourcePath}/DOC`);
	}

	//确保库中不存在要创建的文件
	if (app.vault.getAbstractFileByPath(`${resourcePath}/${resource}.md`)) {
		new Notice(`${await getMessage("FileAlreadyExists")}:  "${resource}" `);
		return;
	}

	const resourceTemplateFilePath = `${settings.templatesPath}/${settings.resourceTemplateName}.md`;
	if (!app.vault.getAbstractFileByPath(resourceTemplateFilePath)) {
		await app.vault.create(`${resourcePath}/${resource}.md`, "");
		new Notice(` ${await getMessage("FileCreated")} :"${resource}" `);
	} else {
		const resourceTemplateFile = app.vault.getAbstractFileByPath(
			resourceTemplateFilePath
		) as TFile;
		//读取模板文件内容
		const resourceTemplateContent = await app.vault.read(
			resourceTemplateFile
		);
		//创建资源文件
		await app.vault.create(
			`${resourcePath}/${resource}.md`,
			resourceTemplateContent
		);
		//打开资源文件
		new Notice(
			`${await getMessage("FileCreated")}"${resourceTemplateFilePath}" `
		);
	}
	await app.workspace.openLinkText(resource, resourcePath, true);
}
