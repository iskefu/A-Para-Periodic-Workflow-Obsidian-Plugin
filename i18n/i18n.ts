interface Message {
    [key: string]: string;
    publish_folder_not_supported: string;
    TranlatePlugins: string;
    SetTaskDateFormat: string;
    AddTask: string;
    hello: string;
    goodbye: string;
    PARAPeriodicWorkflow: string;
    InitializePARAFoldersAndTemplate: string;
    CreatePARAWork: string;
    InitializePeriodicNotesFoldersAndTemplate: string;
    MoveCurrentProjectDomainResourceToArchive: string;
    AddYAMLAttributes: string;
    DeleteYAMLAttributes: string;
    PleaseEnterAtLeastOneOfProjectDomainResource: string;
    FileAlreadyExists: string;
    FileCreated: string;
    PARAFoldersAndTemplatesInitialized: string;
    PeriodicNotesFoldersAndTemplatesCreatedSuccessfully: string;
    WhichAreaWhatSProjectAnyResource: string;
    AreaName: string;
    AreaNone: string;
    ProjectName: string;
    ResourceName: string;
    ProjectFolder: string;
    SetYourProjectFolderAddress: string;
    AreaFolder: string;
    SetYourAreaFolderAddress: string;
    ResourceFolder: string;
    SetYourResourceFolderAddress: string;
    ArchiveFolder: string;
    SetYourArchiveFolderAddress: string;
    TemplatesFolder: string;
    SetYourTemplatesFolderAddress: string;
    ProjectTemplateName: string;
    SetYourProjectTemplateFileName: string;
    AreaTemplateName: string;
    SetYourAreaTemplateFileName: string;
    ResourceTemplateName: string;
    SetYourResourceTemplateFileName: string;
    PeriodicNotesFolderAndTemplateNameSettings: string;
    PeriodicNotesFolder: string;
    SetYourDiaryFileStorageAddress: string;
    DiaryTemplate: string;
    SetNameOfYourDiaryTemplateFile: string;
    WeeklyTemplate: string;
    SetNameOfYourWeeklyTemplateFile: string;
    MonthlyTemplate: string;
    SetNameOfYourMonthlyTemplateFile: string;
    QuarterlyTemplate: string;
    SetNameOfYourQuarterlyTemplateFile: string;
    YearlyTemplate: string;
    SetNameOfYourYearlyTemplateFile: string;
    AutomaticallyAddYAML: string;
    AutomaticallyAddYAMLAttributesWhenCreatingANewNoteAndModified: string;
    YAMLName: string;
    AddCreatedDataYAMLToCurrentDocument: string;
    YAMLAttributeValueDateFormat: string;
    SetYAMLAttributeValueDateFormatForDocument: string;
    AutomaticallyDeleteYAML: string;
    AutomaticallyDeleteYAMLAttributesWhenCreatingANewNoteAndModified: string;
    YAMLAttributeNameToDelete: string;
    DeleteExistingYAMLOfCurrentDocument: string;
    excludedAddYamlFolder:string;
    AddDateWhenCreatedATask: string;
    DeleteEmptyLine:string;

}
const langEn: Message = {
    publish_folder_not_supported: 'Publish folder not supported',
    TranlatePlugins: 'Translate Plugins',
    AddDateWhenCreatedATask: 'Add Date When Created A Task',
    DeleteEmptyLine:'Delete  Empty Lines',
    SetTaskDateFormat: 'Set Task Date Format',
    AddTask: 'Add Task',
    AreaName:'Area Name',
    hello: 'Hello',
    goodbye: 'Goodbye',
    PARAPeriodicWorkflow: 'Para Periodic Workflow',
    InitializePARAFoldersAndTemplate: 'Initialize PARA Folders and Template',
    CreatePARAWork: 'Create PARA Work',
    InitializePeriodicNotesFoldersAndTemplate: 'Initialize Periodic Notes Folders and Template',
    MoveCurrentProjectDomainResourceToArchive: 'Move Current Project/Domain/Resource to Archive',
    AddYAMLAttributes: 'Add YAML Attributes',
    DeleteYAMLAttributes: 'Delete YAML Attributes',
    PleaseEnterAtLeastOneOfProjectDomainResource: 'Please Enter At Least One Of Project, Area, Resource',
    FileAlreadyExists: 'File Already Exists',
    FileCreated: 'File Created',
    PARAFoldersAndTemplatesInitialized: 'PARA Folders and Templates Initialized',
    PeriodicNotesFoldersAndTemplatesCreatedSuccessfully: 'Periodic Notes Folders and Templates Created Successfully',
    WhichAreaWhatSProjectAnyResource: 'Which Area? What\'s Project? Any Resource?',
    ResourceName: 'Resource Name',
    ProjectName: 'Project Name',
    ProjectFolder: 'Project Folder',
    SetYourProjectFolderAddress: 'Set Your Project Folder Address',
    AreaFolder: 'Area Folder',
    SetYourAreaFolderAddress: 'Set Your Area Folder Address',
    ResourceFolder: 'Resource Folder',
    SetYourResourceFolderAddress: 'Set Your Resource Folder Address',
    ArchiveFolder: 'Archive Folder',
    SetYourArchiveFolderAddress: 'Set Your Archive Folder Address',
    TemplatesFolder: 'Templates Folder',
    SetYourTemplatesFolderAddress: 'Set Your Templates Folder Address',
    ProjectTemplateName: 'Project Template Name',
    SetYourProjectTemplateFileName: 'Set Your Project Template File Name',
    AreaTemplateName: 'Area Template Name',
    SetYourAreaTemplateFileName: 'Set Your Area Template File Name',
    ResourceTemplateName: 'Resource Template Name',
    SetYourResourceTemplateFileName: 'Set Your Resource Template File Name',
    PeriodicNotesFolderAndTemplateNameSettings: 'Periodic Notes Folder and Template Name Settings',
    PeriodicNotesFolder: 'Periodic Notes Folder',
    SetYourDiaryFileStorageAddress: 'Set Your Diary File Storage Address',
    DiaryTemplate: 'Diary Template',
    SetNameOfYourWeeklyTemplateFile: 'Set the Name of Your Weekly Template File',

    WeeklyTemplate: 'Weekly Template',
    SetNameOfYourDiaryTemplateFile: 'Set the Name of Your Diary Template File',

    MonthlyTemplate: 'Monthly Template',

    SetNameOfYourMonthlyTemplateFile: 'Set the Name of Your Monthly Template File',

    QuarterlyTemplate: 'Quarterly Template',
    SetNameOfYourQuarterlyTemplateFile: 'Set the Name of Your Quarterly Template File',
    YearlyTemplate: 'Yearly Template',
    SetNameOfYourYearlyTemplateFile: 'Set the Name of Your Yearly Template File',
    AutomaticallyAddYAML: 'Automatically Add YAML',
    AutomaticallyAddYAMLAttributesWhenCreatingANewNoteAndModified: 'Automatically Add YAML Attributes When Creating a New Note and Modified',
    YAMLName: 'YAML Name',
    AddCreatedDataYAMLToCurrentDocument: 'Add Created Data YAML to Current Document',
    YAMLAttributeValueDateFormat: 'YAML Attribute Value Date Format',
    SetYAMLAttributeValueDateFormatForDocument: 'Set the Date Format of the YAML Attribute Value to be Added to the Document, Referencing moment.js',

    AutomaticallyDeleteYAML: 'Automatically Delete YAML',
    AutomaticallyDeleteYAMLAttributesWhenCreatingANewNoteAndModified: 'Automatically Delete YAML Attributes When Creating a New Note and Modified',
    YAMLAttributeNameToDelete: 'YAML Attribute Name to Delete',
    DeleteExistingYAMLOfCurrentDocument: 'Delete the Existing YAML of the Current Document',
    AreaNone: "",
    excludedAddYamlFolder:"exclude Folder",
}

const langZh: Message = {
    publish_folder_not_supported: '不支持发布文件夹',
    TranlatePlugins: '翻译插件',
    AddDateWhenCreatedATask: '在添加任务时自动添加日期',
    DeleteEmptyLine:'删除多余空行',
    SetTaskDateFormat: '自定义添加任务时的日期格式',
    AddTask: '添加任务|Task',
    AreaName:'领域名称',
    hello: '你好',
    goodbye: '再见',
    PARAPeriodicWorkflow: '周期性工作流',
    InitializePARAFoldersAndTemplate: '初始化PARA文件夹及模板',
    CreatePARAWork: '创建PARA工作',
    InitializePeriodicNotesFoldersAndTemplate: '初始化Periodic Notes 文件夹及模板',
    MoveCurrentProjectDomainResourceToArchive: '移动当前项目/领域/资源到归档',
    AddYAMLAttributes: '添加YAML属性',
    DeleteYAMLAttributes: '删除YAML属性',
    PleaseEnterAtLeastOneOfProjectDomainResource: '请至少输入项目/领域/资源其中的一个值！',
    FileAlreadyExists: '文件已存在',
    FileCreated: '已创建文件',
    PARAFoldersAndTemplatesInitialized: 'PARA 文件夹和模板初始化完成',
    PeriodicNotesFoldersAndTemplatesCreatedSuccessfully: 'Periodic Notes 文件夹和模板创建成功',
    WhichAreaWhatSProjectAnyResource: '哪个领域？什么项目？有资源吗？',
    ProjectName: '项目名称',
    ResourceName: '资源名称',
    ProjectFolder: '项目文件夹',
    SetYourProjectFolderAddress: '设置你的项目文件夹地址：',

    AreaFolder: '领域文件夹',
    SetYourAreaFolderAddress: '设置你的领域文件夹地址：',
    ResourceFolder: '资源文件夹',
    SetYourResourceFolderAddress: '设置你的资源文件夹地址：',
    ArchiveFolder: '归档文件夹',
    SetYourArchiveFolderAddress: '设置你的归档文件夹地址：',
    TemplatesFolder: '模板文件夹',
    SetYourTemplatesFolderAddress: '设置你的模板文件夹地址：',
    ProjectTemplateName: '项目模板名称',
    SetYourProjectTemplateFileName: '设置你的项目模板文件名：',
    AreaTemplateName: '领域模板名称',
    SetYourAreaTemplateFileName: '设置你的领域模板文件名：',
    ResourceTemplateName: '资源模板名称',
    SetYourResourceTemplateFileName: '设置你的资源模板文件名：',
    PeriodicNotesFolderAndTemplateNameSettings: '周期性笔记文件夹及模板名称设置',
    PeriodicNotesFolder: '周期性笔记文件夹',
    SetYourDiaryFileStorageAddress: '设置你的日记线文件存放地址',
    DiaryTemplate: '日记模板',
    SetNameOfYourDiaryTemplateFile: '设置你的日记模板文件名：',
    WeeklyTemplate: '周报模板',
    SetNameOfYourWeeklyTemplateFile: '设置你的周报模板文件名：',
    MonthlyTemplate: '月报模板',
    SetNameOfYourMonthlyTemplateFile: '设置你的月报模板文件名：',

    QuarterlyTemplate: '季报模板',
    SetNameOfYourQuarterlyTemplateFile: '设置你的季报模板文件名：',
    YearlyTemplate: '年报模板',
    SetNameOfYourYearlyTemplateFile: '设置你的年报模板文件名：',
    AutomaticallyAddYAML: '自动添加YAML',
    AutomaticallyAddYAMLAttributesWhenCreatingANewNoteAndModified: '创建新笔记和修改时自动添加YAML属性',
    YAMLName: 'YAML名称',
    AddCreatedDataYAMLToCurrentDocument: '将创建数据的YAML添加到当前文档',
    YAMLAttributeValueDateFormat: 'YAML属性值的日期格式',
    SetYAMLAttributeValueDateFormatForDocument: '设置要添加到文档的YAML属性值的日期格式，参考moment.js',
    AutomaticallyDeleteYAML: '自动删除YAML',
    AutomaticallyDeleteYAMLAttributesWhenCreatingANewNoteAndModified: '创建新笔记和修改时自动删除YAML属性',
    YAMLAttributeNameToDelete: '要删除的YAML属性名',
    DeleteExistingYAMLOfCurrentDocument: '删除当前文档中已存在的YAML属性',
    AreaNone: "",
    excludedAddYamlFolder: '排除文件夹',

}
export async function getMessage(key: string) {

    const language = navigator.language// 获取浏览器语言
    if (language.startsWith('zh')) {
        return langZh[key];
    } else {
        return langEn[key];
    }
}

//console.log(getMessage('hello'));  // 输出："你好"或者"Hello"
//console.log(getMessage('goodbye'));  // 输出："再见"或者"Goodbye"