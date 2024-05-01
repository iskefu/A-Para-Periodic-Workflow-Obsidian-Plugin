import { getMessage } from "i18n/i18n";
import MyPlugin from "main";
import { PluginSettingTab, App, Setting } from "obsidian";
import { processFolder } from "./processInputFolder";

export interface MyPluginSettings {
	//项目线文件夹
	projectsPath: string;
	areasPath: string;
	resourcesPath: string;
	archivePath: string;
	//模板文件夹，
	templatesPath: string;
	//模板文件名
	projectTemplateName: string;
	areaTemplateName: string;
	resourceTemplateName: string;
	//日记线文件存放地址
	periodicNotesPath: string;
	//日记模板名称
	diaryTemplateName: string;
	weeklyTemplateName: string;
	monthlyTemplateName: string;
	quarterlyTemplateName: string;
	yearlyTemplateName: string;
	//add yaml key to tag created data
	autoAddYaml: boolean;
	yamlKey: string;
	dateTimeFormat: string;
	excludedAddYamlFolder: string;
	autoDelYaml: boolean;
	yamlKeyToDel: string;
	addTaskDate: boolean;
	excludedDelYamlFolder: string;
	taskDateFormat: string;
	DelEmptyLine: boolean;
}

export const DEFAULT_SETTINGS: MyPluginSettings = {
	//项目线文件夹
	projectsPath: "1-Projects",
	areasPath: "2-Areas",
	resourcesPath: "3-Resources",
	archivePath: "4-Archives",
	//模板文件夹，
	templatesPath: "Templates",
	//模板文件名
	projectTemplateName: "Project-Template",
	areaTemplateName: "Area-Template",
	resourceTemplateName: "Resource-Template",
	//日记线文件存放地址
	periodicNotesPath: "5-PeriodicNotes",
	//日记模板名称
	diaryTemplateName: "Daily-Template",
	weeklyTemplateName: "Weekly-Template",
	monthlyTemplateName: "Monthly-Template",
	quarterlyTemplateName: "Quarterly-Template",
	yearlyTemplateName: "Yearly-Template",
	autoAddYaml: false,
	yamlKey: "created",
	dateTimeFormat: "yyyy-MM-DD ",
	excludedAddYamlFolder: "Templates",
	autoDelYaml: false,
	yamlKeyToDel: "",
	excludedDelYamlFolder: "Templates",
	addTaskDate: true,
	taskDateFormat: "yyyy-MM-DD",
	DelEmptyLine: true,
};
export class SampleSettingTab extends PluginSettingTab {
	plugin: any;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
	}

	async display(): Promise<void> {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl("h5", {
			text: "PARA 文件夹地址以及文件模板名称设置",
		});
		new Setting(containerEl)
			.setName(await getMessage("ProjectFolder"))
			//.setDesc(await getMessage('SetYourProjectFolderAddress'))
			.addText((text) =>
				text
					.setPlaceholder("1-Projects")
					.setValue(this.plugin.settings.projectsPath)
					.onChange(async (value) => {
						value = await processFolder(value);
						//console.log('Secret: ' + value);
						this.plugin.settings.projectsPath = value;
						await this.plugin.saveData(this.plugin.settings);
					})
			);

		new Setting(containerEl)
			.setName(await getMessage("AreaFolder"))
			//.setDesc(await getMessage('SetYourAreaFolderAddress'))
			.addText((text) =>
				text
					.setPlaceholder("2-Areas")
					.setValue(this.plugin.settings.areasPath)
					.onChange(async (value) => {
						value = await processFolder(value);
						//console.log('Secret: ' + value);
						this.plugin.settings.areasPath = value;
						await this.plugin.saveData(this.plugin.settings);
					})
			);
		new Setting(containerEl)
			.setName(await getMessage("ResourceFolder"))
			//.setDesc(await getMessage('SetYourResourceFolderAddress'))
			.addText((text) =>
				text
					.setPlaceholder("3-Resources")
					.setValue(this.plugin.settings.resourcesPath)
					.onChange(async (value) => {
						value = await processFolder(value);
						//console.log('Secret: ' + value);
						this.plugin.settings.resourcesPath = value;
						await this.plugin.saveData(this.plugin.settings);
					})
			);
		new Setting(containerEl)
			.setName(await getMessage("ArchiveFolder"))
			//.setDesc(await getMessage('SetYourArchiveFolderAddress'))
			.addText((text) =>
				text
					.setPlaceholder("4-Archives")
					.setValue(this.plugin.settings.archivePath)
					.onChange(async (value) => {
						value = await processFolder(value);
						//console.log('Secret: ' + value);
						this.plugin.settings.archivePath = value;
						await this.plugin.saveData(this.plugin.settings);
					})
			);

		new Setting(containerEl)
			.setName(await getMessage("TemplatesFolder"))
			//.setDesc(await getMessage('SetYourTemplatesFolderAddress'))
			.addText((text) =>
				text
					.setPlaceholder("Templates")
					.setValue(this.plugin.settings.templatesPath)
					.onChange(async (value) => {
						value = await processFolder(value);
						//console.log('Secret: ' + value);
						this.plugin.settings.templatesPath = value;
						await this.plugin.saveData(this.plugin.settings);
					})
			);
		new Setting(containerEl)
			.setName(await getMessage("ProjectTemplateName"))
			//.setDesc(await getMessage('SetYourProjectTemplateFileName'))
			.addText((text) =>
				text
					.setPlaceholder("Project-Template")
					.setValue(this.plugin.settings.projectTemplateName)
					.onChange(async (value) => {
						value = await processFolder(value);
						//console.log('Secret: ' + value);
						this.plugin.settings.projectTemplateName = value;
						await this.plugin.saveData(this.plugin.settings);
					})
			);

		new Setting(containerEl)
			.setName(await getMessage("AreaTemplateName"))
			//.setDesc(await getMessage('SetYourAreaTemplateFileName'))
			.addText((text) =>
				text
					.setPlaceholder("Area-Template")
					.setValue(this.plugin.settings.areaTemplateName)
					.onChange(async (value) => {
						value = await processFolder(value);
						//console.log('Secret: ' + value);
						this.plugin.settings.areaTemplateName = value;
						await this.plugin.saveData(this.plugin.settings);
					})
			);

		new Setting(containerEl)
			.setName(await getMessage("ResourceTemplateName"))
			//.setDesc(await getMessage('SetYourResourceTemplateFileName'))
			.addText((text) =>
				text
					.setPlaceholder("Resource-Template")
					.setValue(this.plugin.settings.resourceTemplateName)
					.onChange(async (value) => {
						value = await processFolder(value);
						//console.log('Secret: ' + value);
						this.plugin.settings.resourceTemplateName = value;
						await this.plugin.saveData(this.plugin.settings);
					})
			);

		containerEl.createEl("h5", {
			text: await getMessage(
				"PeriodicNotesFolderAndTemplateNameSettings"
			),
		});

		new Setting(containerEl)
			.setName(await getMessage("PeriodicNotesFolder"))
			//.setDesc(await getMessage('SetYourDiaryFileStorageAddress'))
			.addText((text) =>
				text
					.setPlaceholder("5-PeriodicNotes")
					.setValue(this.plugin.settings.periodicNotesPath)
					.onChange(async (value) => {
						value = await processFolder(value);
						this.plugin.settings.periodicNotesPath = value;
						await this.plugin.saveData(this.plugin.settings);
					})
			);

		new Setting(containerEl)
			.setName(await getMessage("DiaryTemplate"))
			//.setDesc(await getMessage('SetNameOfYourDiaryTemplateFile'))
			.addText((text) =>
				text
					.setPlaceholder("Diary-Template")
					.setValue(this.plugin.settings.diaryTemplateName)
					.onChange(async (value) => {
						value = await processFolder(value);
						this.plugin.settings.diaryTemplateName = value;
						await this.plugin.saveData(this.plugin.settings);
					})
			);

		// Add similar settings for weekly, monthly, quarterly, and yearly templates
		new Setting(containerEl)
			.setName(await getMessage("WeeklyTemplate"))
			//.setDesc(await getMessage('SetNameOfYourWeeklyTemplateFile'))
			.addText((text) =>
				text
					.setPlaceholder("Weekly-Template")
					.setValue(this.plugin.settings.weeklyTemplateName)
					.onChange(async (value) => {
						value = await processFolder(value);
						this.plugin.settings.weeklyTemplateName = value;
						await this.plugin.saveData(this.plugin.settings);
					})
			);

		new Setting(containerEl)
			.setName(await getMessage("MonthlyTemplate"))
			//.setDesc(await getMessage('SetNameOfYourMonthlyTemplateFile'))
			.addText((text) =>
				text
					.setPlaceholder("Monthly-Template")
					.setValue(this.plugin.settings.monthlyTemplateName)
					.onChange(async (value) => {
						value = await processFolder(value);
						this.plugin.settings.monthlyTemplateName = value;
						await this.plugin.saveData(this.plugin.settings);
					})
			);

		new Setting(containerEl)
			.setName(await getMessage("QuarterlyTemplate"))
			//.setDesc(await getMessage('SetNameOfYourQuarterlyTemplateFile'))
			.addText((text) =>
				text
					.setPlaceholder("Quarterly-Template")
					.setValue(this.plugin.settings.quarterlyTemplateName)
					.onChange(async (value) => {
						value = await processFolder(value);
						this.plugin.settings.quarterlyTemplateName = value;
						await this.plugin.saveData(this.plugin.settings);
					})
			);

		new Setting(containerEl)
			.setName(await getMessage("YearlyTemplate"))
			//.setDesc(await getMessage('SetNameOfYourYearlyTemplateFile'))
			.addText((text) =>
				text
					.setPlaceholder("Yearly-Template")
					.setValue(this.plugin.settings.yearlyTemplateName)
					.onChange(async (value) => {
						value = await processFolder(value);
						this.plugin.settings.yearlyTemplateName = value;
						await this.plugin.saveData(this.plugin.settings);
					})
			);
		containerEl.createEl("h5", {
			text: await getMessage("AddYAMLAttributes"),
		});
		new Setting(this.containerEl)
			.setName(await getMessage("AutomaticallyAddYAML"))
			//.setDesc( await getMessage('AutomaticallyAddYAMLAttributesWhenCreatingANewNoteAndModified'))
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.autoAddYaml)
					.onChange(async (value) => {
						this.plugin.settings.autoAddYaml = value;
						await this.plugin.saveData(this.plugin.settings);
						//console.log("autoAddYaml: " + this.plugin.settings.autoAddYaml);
					})
			);
		new Setting(containerEl)
			.setName(await getMessage("excludedAddYamlFolder"))
			//			//.setDesc(await getMessage('SetYAMLAttributeValueDateFormatForDocument'))
			.addText((text) =>
				text
					.setPlaceholder(this.plugin.settings.excludedAddYamlFolder)
					.setValue(this.plugin.settings.excludedAddYamlFolder)
					.onChange(async (value) => {
						value = await processFolder(value);
						//console.log(value);
						this.plugin.settings.excludedAddYamlFolder = value;
						await this.plugin.saveData(this.plugin.settings);
					})
			);
		new Setting(containerEl)
			.setName(await getMessage("YAMLName"))
			//.setDesc(await getMessage('AddCreatedDataYAMLToCurrentDocument'))
			.addText((text) =>
				text
					.setPlaceholder("created")
					.setValue(this.plugin.settings.yamlKey)
					.onChange(async (value) => {
						value = await processFolder(value);
						//console.log("yamlKey: " + this.plugin.settings.yamlKey);
						this.plugin.settings.yamlKey = value;
						await this.plugin.saveData(this.plugin.settings);
					})
			);

		new Setting(containerEl)
			.setName(await getMessage("YAMLAttributeValueDateFormat"))
			//.setDesc(await getMessage('SetYAMLAttributeValueDateFormatForDocument'))
			.addText((text) =>
				text
					.setPlaceholder("yyyy-MM-DD")
					.setValue(this.plugin.settings.dateTimeFormat)
					.onChange(async (value) => {
						value = await processFolder(value);
						//console.log(value);
						this.plugin.settings.dateTimeFormat = value;
						await this.plugin.saveData(this.plugin.settings);
					})
			);

		containerEl.createEl("h5", {
			text: await getMessage("DeleteYAMLAttributes"),
		});
		new Setting(this.containerEl)
			.setName(await getMessage("AutomaticallyDeleteYAML"))
			//.setDesc(await getMessage('AutomaticallyDeleteYAML'))
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.autoDelYaml)
					.onChange(async (value) => {
						this.plugin.settings.autoDelYaml = value;
						await this.plugin.saveData(this.plugin.settings);
						//console.log("autoDelYaml: " + this.plugin.settings.autoDelYaml);
					})
			);

		new Setting(containerEl)
			.setName(await getMessage("YAMLAttributeNameToDelete"))
			//.setDesc(await getMessage('DeleteExistingYAMLOfCurrentDocument'))
			.addText((text) =>
				text
					.setPlaceholder("")
					.setValue(this.plugin.settings.yamlKeyToDel)
					.onChange(async (value) => {
						value = await processFolder(value);
						//console.log("yamlKey: " + this.plugin.settings.yamlKeyToDel);
						this.plugin.settings.yamlKeyToDel = value;
						await this.plugin.saveData(this.plugin.settings);
					})
			);
		new Setting(containerEl)
			.setName(await getMessage("excludedAddYamlFolder"))
			//			//.setDesc(await getMessage('SetYAMLAttributeValueDateFormatForDocument'))
			.addText((text) =>
				text
					.setPlaceholder(this.plugin.settings.excludedDelYamlFolder)
					.setValue(this.plugin.settings.excludedDelYamlFolder)
					.onChange(async (value) => {
						value = await processFolder(value);
						//console.log(value);
						this.plugin.settings.excludedDelYamlFolder = value;
						await this.plugin.saveData(this.plugin.settings);
					})
			);
		containerEl.createEl("h5", {
			text: await getMessage("SetTaskDateFormat"),
		});
		new Setting(containerEl)
			.setName(await getMessage("AddDateWhenCreatedATask"))
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.addTaskDate)
					.onChange(async (value) => {
						this.plugin.settings.addTaskDate = value;
						await this.plugin.saveData(this.plugin.settings);
						//console.log("autoAddYaml: " + this.plugin.settings.addTaskDate);
					})
			);
		new Setting(containerEl)
			.setName(await getMessage("SetTaskDateFormat"))
			.addText((text) =>
				text
					.setPlaceholder(this.plugin.settings.dateTimeFormat)
					.setValue(this.plugin.settings.dateTimeFormat)
					.onChange(async (value) => {
						value = await processFolder(value);
						this.plugin.settings.taskDateFormat = value;
						await this.plugin.saveData(this.plugin.settings);
					})
			);

		new Setting(containerEl)
			.setName(await getMessage("DeleteEmptyLine"))
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.DelEmptyLine)
					.onChange(async (value) => {
						this.plugin.settings.DelEmptyLine = value;
						await this.plugin.saveData(this.plugin.settings);
						//console.log("autoAddYaml: " + this.plugin.settings.DelEmptyLine);
					})
			);
	}
}
