import path from "path";
import fs from "fs";
import { exec } from "child_process";
import { App, Notice, TAbstractFile } from "obsidian";
import { MyPluginSettings } from "src/settings";

/**
 * 使用默认的文本编辑器打开指定文件
 * @param app 应用程序实例
 * @param file 要打开的文件
 */
export async function OpenInVSCode(app: App, file: TAbstractFile) {
	// 获取vault路径
	const vaultPath = app.vault.adapter.getBasePath();
	// 拼接完整路径
	let full_path = path.join(vaultPath, file.path);
	// 如果是文件，则获取其所在目录路径
	if (fs.statSync(full_path).isFile()) {
		full_path = path.dirname(full_path);
	}
	let command;
	// 根据操作系统设置对应的打开命令
	if (process.platform === "darwin") {
		command = `open -a "Visual Studio Code" ${full_path}`;
	} else if (process.platform === "win32" || process.platform === "linux") {
		command = `code ${full_path}`;
	} else {
		console.error("Unsupported platform");
		return;
	}
	// 执行打开命令
	exec(command, (error) => {
		if (error) {
			console.error(`Error opening VSCode: ${error.message}`);
		}
	});
}
// 定义一个异步函数，用于将文件移动到归档目录
export async function moveToArchives(
	app: App, // 应用程序实例
	settings: MyPluginSettings, // 插件设置
	file: TAbstractFile // 要移动的文件
) {
	// 生成新的文件路径
	const newPath = path.join(settings.archivePath, file.name);
	// 检查新路径是否已存在同名文件
	if (await app.vault.adapter.exists(newPath)) {
		new Notice(`File already exists in ${settings.archivePath}.`); // 若存在同名文件，则显示提示信息并返回
		return;
	}
	await app.vault.rename(file, newPath); // 将文件重命名为新路径
}
