import { App, Notice } from "obsidian";
import { createFolder } from "./init-para-folder";
import { getMessage } from "i18n/i18n";
import { MyPluginSettings } from "src/settings";
import {
	DIARY_TEMPLATE,
	MONTHLY_TEMPLATE,
	QUARTERLY_TEMPLATE,
	WEEKLY_TEMPLATE,
	YEARLY_TEMPLATE,
} from "./templateFilePeriodic";

// 定义一个模态窗口，继承自Modal类
export async function InitPeriodicFolderAndTemplate(
	app: App,
	settings: MyPluginSettings
) {
	await createFolder(app, settings?.templatesPath, "Templates");
	await createFolder(app, settings?.periodicNotesPath, "5-PeriodicNotes");
	await createFolder(
		app,
		`${settings?.templatesPath}/${settings?.periodicNotesPath}`,
		"Templates/5-PeriodicNotes"
	);
	await createPeriodicTemplateFile(
		app,
		settings,
		settings?.diaryTemplateName,
		DIARY_TEMPLATE,
		"Diary-Template"
	);
	await createPeriodicTemplateFile(
		app,
		settings,
		settings?.weeklyTemplateName,
		WEEKLY_TEMPLATE,
		"Weekly-Template"
	);
	await createPeriodicTemplateFile(
		app,
		settings,
		settings?.monthlyTemplateName,
		MONTHLY_TEMPLATE,
		"Monthly-Template"
	);
	await createPeriodicTemplateFile(
		app,
		settings,
		settings?.quarterlyTemplateName,
		QUARTERLY_TEMPLATE,
		"Quarterly-Template"
	);
	await createPeriodicTemplateFile(
		app,
		settings,
		settings?.yearlyTemplateName,
		YEARLY_TEMPLATE,
		"Yearly-Template"
	);
	new Notice(
		await getMessage("PeriodicNotesFoldersAndTemplatesCreatedSuccessfully")
	);
}
export async function createPeriodicTemplateFile(
	app: App,
	settings: MyPluginSettings,
	templateFilerName: string | undefined,
	templateFile: string,
	defaultTemplateFileName: string
) {
	if (!templateFilerName) {
		templateFilerName = defaultTemplateFileName;
	}
	const templateFilePath = `${settings?.templatesPath}/${settings?.periodicNotesPath}/${templateFilerName}.md`;
	//再判断是否设置了值
	if (app.vault.getAbstractFileByPath(templateFilePath)) {
		return;
	}
	await app.vault.create(templateFilerName, templateFile);
}
