import { App, Notice, TAbstractFile } from "obsidian";
import path from "path";
import fs from "fs";
import { getMessage } from "i18n/i18n";
import { PublishModal } from "./PublishModal";




export async function Publish(app: App,file: TAbstractFile) {
    // 获取文件路径
    const vaultPath = app.vault.adapter.getBasePath();
    const full_path = path.join(vaultPath, file.path);

    // 如果指定路径为文件，则转换为该文件所在的文件夹路径
    if (!fs.statSync(full_path).isFile()) {
        new Notice(await getMessage("publish_folder_not_supported"));
        return;
    }
    const modal = new PublishModal(app,file);
    modal.open();  
}
