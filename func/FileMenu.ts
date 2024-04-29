import path from "path";
import fs from "fs";
import { exec } from 'child_process';
import { App, Notice, TAbstractFile } from "obsidian";
import { MyPluginSettings } from "src/settings";

// 异步函数用于在 Visual Studio Code 中打开指定的文件
export async function OpenInVSCode(app: App, file: TAbstractFile ) {
    // 获取文件路径
    const vaultPath = app.vault.adapter.getBasePath();
    let full_path = path.join(vaultPath, file.path);
    
    // 如果指定路径为文件，则转换为该文件所在的文件夹路径
    if (fs.statSync(full_path).isFile()) {
        full_path = path.dirname(full_path);
    }

    let command;
    // 根据操作系统设置打开文件的命令
    if (process.platform === 'darwin') {
      command = `open -a "Visual Studio Code" ${full_path}`;
    } else if (process.platform === 'win32'|| process.platform === 'linux') {
      command = `code ${full_path}`;
    } else {
      console.error('Unsupported platform');
      return;
    }
  
    // 执行命令并处理可能的错误
    exec(command, (error) => {
      if (error) {
        console.error(`Error opening VSCode: ${error.message}`);
      }});
}

// 异步函数用于将文件移动到指定的存档目录
export async function moveToArchives(app:App, settings:MyPluginSettings,file: TAbstractFile) {
    const newPath = path.join(settings.archivePath, file.name);
    console.log(newPath);
    if (await app.vault.adapter.exists(newPath)) {
        new Notice(`File already exists in ${settings.archivePath}.`);
        return;
    }
    await app.vault.rename(file, newPath);

}
