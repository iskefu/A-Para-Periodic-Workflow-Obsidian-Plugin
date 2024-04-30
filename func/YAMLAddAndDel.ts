// 从 'obsidian' 模块导入 App 类
// 从 'moment' 模块导入 moment 方法
// 从 'gray-matter' 模块导入 matter 方法
import { App } from "obsidian";
import moment from "moment";
import matter from "gray-matter";
import { MyPluginSettings } from "src/settings";

// 添加 YAML 属性的异步函数
export async function addYamlAttributes(app: App, settings: MyPluginSettings) {
  // 获取当前活动文件
  const activeFile = app.workspace.getActiveFile();
  if (!activeFile) {
    return;
  }
  // 检查文件是否在被排除的文件夹中
  const isExcluded = activeFile.path.startsWith(
    settings.excludedAddYamlFolder
  );
  if (isExcluded) {
    return;
  }
  // 检查文件是否为 Markdown 文件
  const isMarkdown = activeFile.path.endsWith(".md");
  if (!isMarkdown) {
    return;
  }

  // 读取文件内容
  const content = await app.vault.read(activeFile);
  // 解构内容中的 YAML 数据和文件内容
  const { data, content: fileContent } = matter(content);
  // 获取文件的创建时间
  const fileCreatedDate = new Date(activeFile.stat.ctime);
  // 检查 'created' 字段并更新
  if (!data.hasOwnProperty("created") || data.created === "") {
    // 如果 'created' 字段不存在或为空，则创建一个新的时间戳
    data.created = moment(fileCreatedDate).format(settings.dateTimeFormat);
  } else {
    // 如果 'created' 字段存在，则检查格式并更新
    const created = moment(data.created, settings.dateTimeFormat, true);
    if (!created.isValid() || moment(fileCreatedDate).isBefore(created)) {
      // 如果 'created' 字段的格式无效或文件创建时间在之前，则更新时间戳
      data.created = moment(fileCreatedDate).format(
        settings.dateTimeFormat
      );
    }
  }
  // 更新文件内容，包括 YAML 数据
  const newContent = matter.stringify(fileContent, data);
  await app.vault.modify(activeFile, newContent);
}

// 删除 YAML 属性的异步函数
export async function deleteYamlAttributes(
  app: App,
  settings: MyPluginSettings
) {
  // 如果 settings.yamlKey 包含 settings.yamlKeyToDel，则返回
  if (settings.yamlKey.includes(settings.yamlKeyToDel)) {
    return;
  }
  const activeFile = app.workspace.getActiveFile();
  if (!activeFile) {
    return;
  }
  if (activeFile.path.includes(settings.excludedDelYamlFolder)) {
    return;
  }
  const content = await app.vault.read(activeFile);
  const { data, content: fileContent } = matter(content);

  if (settings.yamlKeyToDel in data) {
    delete data[settings.yamlKeyToDel];
    const newContent = matter.stringify(fileContent, data);
    await app.vault.modify(activeFile, newContent);
  }
}
