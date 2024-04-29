import { getMessage } from 'i18n/i18n';
import { App,  Notice, TFile} from 'obsidian';
import { InputModal } from 'src/ModalInputAreaProjectResource';
import { MyPluginSettings } from 'src/settings';

export async function createPARA(app: App, settings: MyPluginSettings): Promise<void> {
  const modal = new InputModal(app, async (result) => {  // 创建模态对话框实例


    // 如全部为空，抛出异常
    try{
      if (!result.area&&!result.project&&!result.resource) {
      new Notice(await getMessage('PleaseEnterAtLeastOneOfProjectDomainResource'));
      throw new Error('请至少输入项目,领域,资源,其中一个的值！\n Please Enter At Least One Value For The Project, Domain, Or Resource! ');
      }
    }catch(e){return;}
    
    // 创建领域,项目,资源文件
    createParaArea(app,settings,result.area);
    createParaProject(app,settings,result.project);
    createParaResource(app,settings,result.resource);
  });

  modal.open();  // 打开模态对话框
}
export async function createParaArea(app:App,settings: MyPluginSettings,area: string){
  if (area){  // 如果输入了领域，则准备创建领域文件夹

    try {
      if (!app.vault.getAbstractFileByPath(settings.areasPath)) {      //确保创建到的文件夹存在

        await app.vault.createFolder(settings.areasPath);
      }
      if (app.vault.getAbstractFileByPath(`${settings.areasPath}/${area}.md`)) {      //确保库中不存在要创建的文件

        new Notice(` ${await getMessage('FileAlreadyExists')}"${area}" In "${settings.areasPath}" `);
        throw new Error(`领域文件夹 "${settings.areasPath}" 下,已存在名为 "${area}" 的领域文件！`);
        //已经存在同名文件,后续可以添加功能将项目或者resource连接到这里
      }

      // 创建领域文件
      // 获取模板文件路径
      const areaTemplateFilePath = `${settings.templatesPath}/${settings.areaTemplateName}.md`

      if (!app.vault.getAbstractFileByPath(areaTemplateFilePath)) {      //如果模板文件不存在,就创建空的领域文件
        
        await app.vault.create(`${settings.areasPath}/${area}.md`,'');//创建领域文件

        await app.workspace.openLinkText(area,settings.areasPath,true);        //打开领域文件

      }else{        // 如果模板文件存在,就从模板文件创建领域文件

        const areaTemplateFile = app.vault.getAbstractFileByPath(areaTemplateFilePath) as TFile;        //获取模板文件

        const areaTemplateContent = await app.vault.read(areaTemplateFile);        //读取模板文件内容

        await app.vault.create(`${settings.areasPath}/${area}.md`,areaTemplateContent);        //创建领域文件

        await app.workspace.openLinkText(area,settings.areasPath,true);        //打开领域文件

        new Notice(`${ await getMessage('FileCreated')}"${areaTemplateFilePath}" `);
      }
    }catch (error) {      // 显示错误消息
      console.error('An error occurred:', error.message);
    }
  } 
    
}
export async function createParaProject(app:App,settings: MyPluginSettings,project: string){
  if (project){  // 如果输入了项目，则准备创建项目文件夹

    try {

      //确保创建到的文件夹存在
      if (!app.vault.getAbstractFileByPath(settings.projectsPath)) {
        // 创建项目文件夹
        await app.vault.createFolder(settings.projectsPath);
      }
      //确保创建到的文件夹存在
      const projectPath = `${settings.projectsPath}/${project}`
      if (!app.vault.getAbstractFileByPath(projectPath)) {
        // 创建项目文件夹
        await app.vault.createFolder(projectPath);
      }
      if (!app.vault.getAbstractFileByPath(`${projectPath}/DOC}`)) {
        // 创建项目文件夹
        await app.vault.createFolder(`${projectPath}/DOC`);
      }
      //确保库中不存在要创建的文件
      if (app.vault.getAbstractFileByPath(`${projectPath}/${project}.md`)) {
        new Notice(`${await getMessage("FileAlreadyExists")}:"${project}" `);
        console.error(`文件夹 "${projectPath}" 已存在名为 "${project}" 的文件！`);
        throw new Error(`项目文件夹 "${projectPath}" 下,已存在名为 "${project}" 的项目文件！`);
        //已经存在同名文件,后续可以添加功能将项目或者resource连接到这里
      }
      //获取模板文件路径
      const projectTemplateFilePath = `${settings.templatesPath}/${settings.projectTemplateName}.md`
      //如果模板文件不存在,就创建空的项目文件
      if (!app.vault.getAbstractFileByPath(projectTemplateFilePath)) {
        //创建项目文件
        await app.vault.create(`${projectPath}/${project}.md`,'');
        new Notice(`${await getMessage("FileCreated")}:"${project}" `);
        //打开项目文件:
        await app.workspace.openLinkText(project,projectPath,true);
  
      }else{
        // 如果模板文件存在,就从模板文件创建项目文件
        //TFile赋值
        const projectTemplateFile = app.vault.getAbstractFileByPath(projectTemplateFilePath) as TFile;
        //读取模板文件内容
        const projectTemplateContent = await app.vault.read(projectTemplateFile);
        //创建项目文件
        await app.vault.create(`${projectPath}/${project}.md`,projectTemplateContent);
        
        new Notice(`${await getMessage("FileCreated")}:  "${projectTemplateFilePath}" `);
        //打开项目文件
        await app.workspace.openLinkText(project,projectPath,true);
      }
    }catch (error) {
      // 显示错误消息
      console.error('An error occurred:', error.message);
    }
  } 
    
} 
export async function createParaResource(app:App,settings: MyPluginSettings,resource: string){
    // 如果输入了资源，则准备创建资源文件夹
    if (resource){
      try {

        //确保创建到的文件夹存在
        if (!app.vault.getAbstractFileByPath(settings.resourcesPath)) {
          // 创建资源文件夹
          await app.vault.createFolder(settings.resourcesPath);
        }
        //确保创建到的文件夹存在
        const resourcePath = `${settings.resourcesPath}/${resource}`
        if (!app.vault.getAbstractFileByPath(resourcePath)) {
          // 创建资源文件夹
          await app.vault.createFolder(resourcePath);
        }
        if (!app.vault.getAbstractFileByPath(`${resourcePath}/DOC`))
         {
          // 创建DOC文件夹
          await app.vault.createFolder(`${resourcePath}/DOC`);
        } 
        //确保库中不存在要创建的文件
        if (app.vault.getAbstractFileByPath(`${resourcePath}/${resource}.md`)) {
          new Notice(`${await getMessage("FileAlreadyExists")}:  "${resource}" `);
          throw new Error(`资源文件夹 "${resourcePath}" 下,已存在名为 "${resource}" 的资源文件！`);
          //已经存在同名文件,后续可以添加功能将资源或者resource连接到这里
        }
        // 创建资源文件
        const resourceTemplateFilePath = `${settings.templatesPath}/${settings.resourceTemplateName}.md`
        //如果模板文件不存在,就创建空的资源文件
        if (!app.vault.getAbstractFileByPath(resourceTemplateFilePath)) {
          //创建资源文件
          await app.vault.create(`${resourcePath}/${resource}.md`,'');
          new Notice(` ${await getMessage("FileCreated")} :"${resource}" `);
          //打开资源文件
          await app.workspace.openLinkText(resource,resourcePath,true);
    
        }else{
          // 如果模板文件存在,就从模板文件创建资源文件
          //TFile赋值
          const resourceTemplateFile = app.vault.getAbstractFileByPath(resourceTemplateFilePath) as TFile;
          //读取模板文件内容
          const resourceTemplateContent = await app.vault.read(resourceTemplateFile);
          //创建资源文件
          await app.vault.create(`${resourcePath}/${resource}.md`,resourceTemplateContent);
          //打开资源文件
          await app.workspace.openLinkText(resource,resourcePath,true);
          new Notice(`${await getMessage("FileCreated")}"${resourceTemplateFilePath}" `);
        }
      }catch (error) {
        // 显示错误消息
        console.error('An error occurred:', error.message);
      }
    } 
      
  } 