import { addYamlAttributes, deleteYamlAttributes } from "func/YAMLAddAndDel";
import { addTaskWithDate } from "func/addTaskWithDate";
import { createPARA } from "func/createPARA";
import { delEmptyLine } from "func/delEmptyLine";
import { initParaFolder } from "func/init-para-folder";
import { InitPeriodicFolderAndTemplate } from "func/initPeriodicFolderAndTemplate";
import { getMessage } from "i18n/i18n";
import { Editor } from "obsidian";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function addCommand(ts: any){
    ts.addCommand({//init-para-folder、初始化PARA文件夹及模板 Init PARA Folders And Template Files
        id: 'init-para-folder',
        name: 
        await getMessage('InitializePARAFoldersAndTemplate'),
        callback: () => {initParaFolder(ts.app, ts.settings);},
    });

    ts.addCommand({//create-para，创建PARA
        id: "create-para",
        name: await getMessage('CreatePARAWork'),
        callback: () => {createPARA(ts.app, ts.settings);},
    });
    
    ts.addCommand({//init-periodic-folder-and-template，初始化Periodic Notes 文件夹及模板
        id: "init-periodic-folder-and-template",
        name:await getMessage('InitializePeriodicNotesFoldersAndTemplate') ,
        callback: () => {InitPeriodicFolderAndTemplate(ts.app, ts.settings);},
    });



    ts.addCommand({
        id: 'add-yaml',
        name: await getMessage('AddYAMLAttributes'),
        callback: ()=> {addYamlAttributes(ts.app,ts.settings);},
      });
    ts.addCommand({
        id:'del-yaml',
        name:await getMessage('DeleteYAMLAttributes'),
        callback: ()=> {deleteYamlAttributes(ts.app,ts.settings);},

    });
    ts.addCommand({
        id:'add-task',
        name:await getMessage('AddTask'),
        editorCallback: (editor: Editor) => {
            addTaskWithDate(editor,ts.settings);
        },
    });
    ts.addCommand({
        id:'del-empty-line',
        name:await getMessage('DeleteEmptyLine'),
        editorCallback: (editor:Editor)=> {
            delEmptyLine(editor);
        },

    });

}