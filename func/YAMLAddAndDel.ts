// 从 'obsidian' 模块导入 App 类
// 从 'moment' 模块导入 moment 方法
// 从 'gray-matter' 模块导入 matter 方法
import { App } from 'obsidian';
import moment from 'moment';
import matter from 'gray-matter';
import { MyPluginSettings } from 'src/settings';

// 添加 YAML 属性的异步函数
export async function addYamlAttributes(app: App, settings: MyPluginSettings) {
  try {
    // 获取当前活动文件
    const activeFile = app.workspace.getActiveFile();
    if (!activeFile) {
      // 如果没有活动文件，则返回
      return;
    }
    // 检查文件是否在排除的文件夹中
    const isExcluded = activeFile.path.startsWith(settings.excludedAddYamlFolder);
    if (isExcluded) {
      // 如果文件应该被排除，则不执行任何操作
      return;  
    } 

    // 读取文件内容
    const content = await app.vault.read(activeFile);

    // 解构内容中的 YAML 数据和文件内容
    const { data, content: fileContent } = matter(content);

    // 获取文件的创建时间
    const fileCreatedDate = new Date(activeFile.stat.ctime);

    // 检查 'created' 字段并更新
    if (!data.hasOwnProperty('created') || data.created === '') {
      // 如果 'created' 字段不存在或为空，则创建一个新的时间戳
      data.created = moment(fileCreatedDate).format(settings.dateTimeFormat);
    } else {
      // 如果 'created' 字段存在，则检查格式并更新
      const created = moment(data.created, settings.dateTimeFormat, true);
      if (!created.isValid() || moment(fileCreatedDate).isBefore(created)) {
        // 如果 'created' 字段的格式无效或文件创建时间在之前，则更新时间戳
        data.created = moment(fileCreatedDate).format(settings.dateTimeFormat);
      } 
    }

    // 更新文件内容，包括 YAML 数据
    const newContent = matter.stringify(fileContent, data);
    await app.vault.modify(activeFile, newContent);
  } catch (error) {
    // 处理异常
    //console.log(`Error updating 'created' date in YAML frontmatter: ${error.message}`);
  }
} 

// 删除 YAML 属性的异步函数
export async function deleteYamlAttributes(app: App, settings: MyPluginSettings) {
  // 如果 settings.yamlKey 包含 settings.yamlKeyToDel，则返回
  if (settings.yamlKey.includes(settings.yamlKeyToDel)) {
    return
  }
  // 获取当前活动文件
  const activeFile = app.workspace.getActiveFile();
  if (!activeFile) {
    // 如果没有活动文件，则返回
    return;
  }
  // 检查文件是否在被排除的文件夹中
  if (activeFile.path.includes(settings.excludedDelYamlFolder)) {
    return  
  }
  // 读取文件内容
  const content = await app.vault.read(activeFile);
  // 解构内容中的 YAML 数据和文件内容
  const { data, content: fileContent } = matter(content);
  // 检查要删除的键是否存在并删除
  if (settings.yamlKeyToDel in data) {
    delete data[settings.yamlKeyToDel];
    // 更新文件内容，不包括被删除的 YAML 数据
    const newContent = matter.stringify(fileContent, data);
    await app.vault.modify(activeFile, newContent);
  }
}