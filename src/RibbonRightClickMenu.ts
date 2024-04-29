import { getMessage } from "i18n/i18n";
import { App, Menu } from "obsidian";
import { MyPluginSettings } from "./settings";
import { addYamlAttributes, deleteYamlAttributes } from "func/YAMLAddAndDel";
import { createPARA } from "func/createPARA";
import { initParaFolder } from "func/init-para-folder";
import { InitPeriodicFolderAndTemplate } from "func/initPeriodicFolderAndTemplate";

export async function RibbonRightClickMenu(app: App, settings: MyPluginSettings, iconclass: string) {
    const observer = new MutationObserver((mutationsList, observer) => {    //等待图标元素加载

        const iconElement = document.querySelector(iconclass);        //获取图标元素

        if (iconElement) {
            iconElement.addEventListener('contextmenu', async (e: MouseEvent) => {            //为图标元素添加右键点击事件监听器
                e.preventDefault();                //阻止默认的右键菜单
                const menu = new Menu();
                menu.addItem(async (item) => item.setTitle(await getMessage('CreatePARAWork')).onClick(() => {
                    createPARA(app, settings);
                }));
                menu.addItem(async (item) => item.setTitle(await getMessage('InitializePARAFoldersAndTemplate')).onClick(() => {
                    initParaFolder(app, settings);
                }));
                menu.addItem(async (item) => item.setTitle(await getMessage('InitializePeriodicNotesFoldersAndTemplate')).onClick(() => {
                    InitPeriodicFolderAndTemplate(app, settings);
                }));

                menu.addItem(async (item) => item.setTitle(await getMessage('AddYAMLAttributes')).onClick(() => {
                    addYamlAttributes(app, settings);
                }));
                menu.addItem(async (item) => item.setTitle(await getMessage('DeleteYAMLAttributes')).onClick(() => {
                    deleteYamlAttributes(app, settings);
                }));
                menu.addItem(async (item) => item.setTitle(await getMessage('TranlatePlugins')).onClick(() => {
                }));
                menu.showAtPosition({ x: e.pageX, y: e.pageY });
            });
            observer.disconnect();
        }
    });
    observer.observe(document, { childList: true, subtree: true });


}
