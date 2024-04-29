import { getMessage } from "i18n/i18n";
import { App, Modal, Setting } from "obsidian";
import { processFolder } from "./processInputFolder";
//弹出模态对话框，获取用户输入
export class InputModal extends Modal {
    result: { area: string; project: string; resource: string; };
    onSubmit: (result: { area: string; project: string; resource: string; }) => void;

    constructor(app: App, onSubmit: (result: { area: string; project: string; resource: string; }) => void) {
        super(app);
        this.onSubmit = onSubmit;
        this.result = { area: '', project: '', resource: '' };
    }

    async onOpen() {
        const { contentEl } = this;

        contentEl.createEl("h2", { text: await getMessage('WhichAreaWhatSProjectAnyResource')
    });

        new Setting(contentEl)
            .setName(await getMessage('AreaName'))
            .addText(  (text) =>
                text.setPlaceholder("Area | None ")
                    .onChange(async (value) => {
                        value=await processFolder(value);
                        this.result.area = value;
                    }));

        new Setting(contentEl)
            .setName(await getMessage('ProjectName'))
            .addText((text) =>
                text.setPlaceholder('Project | None')
                    .onChange(async (value) => {
                        value=await processFolder(value);
                        this.result.project = value;
                    }));

        new Setting(contentEl)
            .setName(await getMessage('ResourceName'))
            .addText((text) =>
                text.setPlaceholder('Resource | None')
                    .onChange(async (value) => {
                        value=await processFolder(value);
                        this.result.resource = value;

                        }));

        new Setting(contentEl)
            .addButton((btn) =>
                btn
                    .setButtonText('Submit')
                    .setCta()
                    .onClick(() => {
                        this.close();
                        this.onSubmit(this.result);
                    }));
        // 添加键盘事件监听
        this.modalEl.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
              this.close();
              this.onSubmit(this.result);
          }
      });
  }

    onClose() {
        // eslint-disable-next-line prefer-const
        let { contentEl } = this;
        contentEl.empty();
    }
}