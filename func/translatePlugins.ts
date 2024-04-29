import fs from 'fs';
import { App } from 'obsidian';
import path from 'path';
import fse from 'fs-extra';

export async function BackupPlugins(app:App){
    //
    const valuePath =  app.vault.adapter.getBasePath();
    // console.log("valuePath: ",valuePath);
    const pluginsDir =  ".obsidian/plugins";
    
    const backupPath =pluginsDir+"/translatePlugins_backup";
    if (!await app.vault.adapter.exists(backupPath)){
        await app.vault.createFolder(backupPath);
        console.log("Backup folder created");
    }
    const pluginsFullPath=valuePath+"/"+pluginsDir
    const pluginsList = fs.readdirSync(pluginsFullPath);
    // console.log("Plugins to backup: ",pluginsList);
    for (const plugin  of pluginsList){
        // console.log("Backup plugin: ",plugin);
        const pluginPath = pluginsDir+"/"+plugin;
        //过滤文件夹
        if (!fs.lstatSync(pluginsFullPath+"/"+plugin).isDirectory()) {
            continue;
        }

        const backupPluginPath = backupPath+"/"+plugin;
        if (!await app.vault.adapter.exists(backupPluginPath)){
            await app.vault.createFolder(backupPluginPath);
        }

        const  mainFile = pluginPath+"/main.js";
        if (await app.vault.adapter.exists(mainFile)){ 
            const backupMainFile = backupPluginPath+"/main.js";
            if (!await app.vault.adapter.exists(backupMainFile)){
                const originalFile = path.join(valuePath, mainFile);
                const targetFile = path.join(valuePath, backupMainFile);
                fs.copyFileSync(originalFile, targetFile);
            } 
        }
        const manifestFile = pluginPath+"/manifest.json";
        if (await app.vault.adapter.exists(manifestFile)){
            const backupManifestFile = backupPluginPath+"/manifest.json";
            if (!await app.vault.adapter.exists(backupManifestFile)){
                const originalFile = path.join(valuePath, manifestFile);
                const targetFile = path.join(valuePath, backupManifestFile);
                fs.copyFileSync(originalFile, targetFile);
            }
        }

        const stylesFile = pluginPath+"/styles.css";
        if (await app.vault.adapter.exists(stylesFile)){
            const backupStylesFile = backupPluginPath+"/styles.css";
            if (!await app.vault.adapter.exists(backupStylesFile)){
                const originalFile = path.join(valuePath, stylesFile);
                const targetFile = path.join(valuePath, backupStylesFile);
                fs.copyFileSync(originalFile, targetFile);
            }
        }

    }
}
export async function ExtractTranslationJson(app:App) {
    //
    const valuePath =  app.vault.adapter.getBasePath();
    // console.log("valuePath: ",valuePath);
    const pluginsDir =  ".obsidian/plugins";
    const waitToTranslatePath = pluginsDir+"/translatePlugins_waitToTranslate";
    if (!await app.vault.adapter.exists(waitToTranslatePath)){
        await app.vault.createFolder(waitToTranslatePath);
        console.log("waitToTranslate folder created");
    }
    const pluginsFullPath=valuePath+"/"+pluginsDir
    const pluginsList = fs.readdirSync(pluginsFullPath);
    // console.log("Plugins to backup: ",pluginsList);
    for (const plugin  of pluginsList){
        const pluginPath = pluginsDir+"/"+plugin;
        //过滤文件夹
        if (!fs.lstatSync(pluginsFullPath+"/"+plugin).isDirectory()) {
            continue;
        }
        const mainFile = pluginPath+"/main.js";
        if (!await app.vault.adapter.exists(mainFile)){
            continue;
        }
       
        const mainFullPath = path.join(valuePath, mainFile);
        const content = fs.readFileSync(mainFullPath, 'utf-8');
        // console.log(content)


        const regexps = [
            /createEl\(([\\'"`]).+?\1.+?\1(.+?)\1/g,
            /Notice\(\s*([\\'"`])(.+?)\1\s*\)/g,
            /setText\(\s*([\\'"`])(.+?)\1\s*\)/g,
            /setButtonText\(\s*([\\'"`])(.+?)\1\s*\)/g,
            /setName\(\s*([\\'"`])(.+?)\1\s*\)/g,
            /setDesc\(\s*([\\'"`])(.+?)\1\s*\)/g,
            /setPlaceholder\(\s*([\\'"`])(.+?)\1\s*\)/g,
            /setTooltip\(\s*([\\'"`])(.+?)\1\s*\)/g,
            /appendText\(\s*([\\'"`])(.+?)\1\s*\)/g,
            /innerText\s*=\s*([\\'"`])(.+?)\1/g
        ]
        const needTranslate = {};
        let match;
        for (const regexp of regexps) {
            while ((match = regexp.exec(content)) !== null) {
                needTranslate[match[2]] = match[2];
            }       
         }

        const waitToTranslateMainFile = waitToTranslatePath+"/"+plugin+".json";
        if (!await app.vault.adapter.exists(waitToTranslateMainFile)){
            const waitToTranslateMainFileFullPath = path.join(valuePath, waitToTranslateMainFile);
            fs.writeFileSync(waitToTranslateMainFileFullPath, JSON.stringify(needTranslate, null, 4), 'utf-8');
        }
    }

}
   
export async function tranlatePlugins(app:App){

}


export async function RestorePlugins(app:App){
    const valuePath =  app.vault.adapter.getBasePath();
    // console.log("valuePath: ",valuePath);
    const pluginsDir =  ".obsidian/plugins";
    const backupPath =pluginsDir+"/translatePlugins_backup";

    const sourceFolder = valuePath+"/"+backupPath;  // 替换为你的源文件夹路径
    const targetFolder = valuePath+"/"+pluginsDir;  // 替换为你的目标文件夹路径

    // 使用 fs-extra 的 copySync 函数来复制文件夹
    fse.copySync(sourceFolder, targetFolder, {
        overwrite: true,  // 覆盖目标文件夹中的同名文件或文件夹 
    });
}