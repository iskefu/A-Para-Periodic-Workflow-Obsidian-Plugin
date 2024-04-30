import { App, ItemView, WorkspaceLeaf } from "obsidian";
import { myEmitter } from "./EventEmitter";
import { MyPluginSettings } from "./settings";

export const VIEW = "view";

export class CreateView extends ItemView {
	setting;
	a: App;

	constructor(leaf: WorkspaceLeaf, app: App, settings: MyPluginSettings) {
		super(leaf);
		this.setting = settings;
		this.a = app;
	}
	icon = "target";
	getViewType() {
		return VIEW;
	}

	getDisplayText() {
		return "Create PARA";
	}

	async onOpen() {
		await this.buildUI();
	}

	async onClose() {
		// 清理资源的代码可以在这里添加
	}
	async buildUI() {
		const paraWorkflowViewui = await document.createElement("div");
		this.containerEl.appendChild(paraWorkflowViewui);

		// 创建按钮
		createButtons(paraWorkflowViewui);
		// 默认展示 PARA 面板视图
		const paraButton = paraWorkflowViewui.querySelector(
			"#paraButton"
		) as HTMLElement;
		paraButton.click();
	}
}
function createButtons(container: HTMLDivElement) {
	const buttonDiv = document.createElement("div");
	buttonDiv.style.display = "flex";
	buttonDiv.style.justifyContent = "center";
	buttonDiv.style.alignItems = "center";
	buttonDiv.style.position = "fixed"; // 使按钮固定在特定位置
	buttonDiv.style.top = "15px"; // 定义按钮距离底部的距离
	buttonDiv.style.width = "100%";
	buttonDiv.style.marginTop = "10px";
	buttonDiv.style.margin = "5px"; // 设置外边距

	const button1 = document.createElement("button");
	button1.style.padding = "2px 5px"; // 设置内边距，第一个值为垂直方向，第二个值为水平方向
	button1.style.margin = "5px"; // 设置外边距
	button1.innerText = "PARA";
	button1.id = "paraButton";
	button1.title = "点击打开PARA面板";
	button1.className = "animated-button";
	buttonDiv.appendChild(button1);

	const button2 = document.createElement("button");
	button2.style.padding = "5px 5px"; // 设置内边距，第一个值为垂直方向，第二个值为水平方向
	button2.style.margin = "5px"; // 设置外边距
	button2.innerText = "Init";
	button2.title = "点击打开Init界面";
	button2.className = "animated-button";
	buttonDiv.appendChild(button2);

	const button3 = document.createElement("button");
	button3.style.padding = "5px 5px"; // 设置内边距，第一个值为垂直方向，第二个值为水平方向
	button3.style.margin = "5px"; // 设置外边距
	button3.innerText = "插件翻译";
	button3.title = "点击打开插件翻译面板";
	button3.className = "animated-button";
	buttonDiv.appendChild(button3);

	const button4 = document.createElement("button");
	button4.style.padding = "5px 5px"; // 设置内边距，第一个值为垂直方向，第二个值为水平方向
	button4.style.margin = "5px"; // 设置外边距
	button4.innerText = "文章自动发布";
	button4.title = "点击打开文章自动发布面板";
	button4.className = "animated-button";
	buttonDiv.appendChild(button4);

	container.appendChild(buttonDiv);

	const viewContainer = document.createElement("div");
	container.appendChild(viewContainer);

	button1.addEventListener("click", () => {
		// 清空当前的 UI
		viewContainer.innerHTML = "";
		// 创建新的 UI 元素
		const div = document.createElement("div");
		div.style.display = "flex";
		div.style.flexDirection = "column";
		div.style.justifyContent = "center"; // 将内容垂直居中
		div.style.alignItems = "center"; // 将内容水平居中
		div.style.width = "100%";
		div.style.height = "100%";
		div.style.marginTop = "50px";

		div.innerHTML = `
    <form id="input-form" style="display: flex; flex-direction: column; justify-content: center; position : fixed;width: 80%;top:25%;">
          <h1 style="font-size: 20px; text-align: center;">PARA面板</h1>
          <div>
              <label for="project-name">项目:</label>
              <input class = "animated-button" type="text" id="project-name" name="project-name" style="width: 100%;" placeholder="请输入项目名称" title="在这里输入项目名称">
          </div>

          <div>
              <label for="domain-name">领域:</label>
              <input class = "animated-button" type="text" id="area-name" name="area-name" style="width: 100%;" placeholder="请输入领域名称" title="在这里输入领域名称">
          </div>

          <div>
              <label for="resource-name">资源:</label>
              <input class = "animated-button" type="text" id="resource-name" name="resource-name" style="width: 100%;" placeholder="请输入资源名称" title="在这里输入资源名称">
          </div>

          <div style="display: flex; justify-content: flex-end;">
              <button class = "animated-button" type="submit" style="width: 60px; height: 25px; margin-top: 10px;" title = "点击创建PARA文件">创建</button>
          </div>
      </form>
      `;
		// 将新的 UI 元素添加到容器中
		viewContainer.appendChild(div);

		// 当用户提交表单时，获取用户的输入并进行处理
		div.querySelector("#input-form")?.addEventListener("submit", (e) => {
			e.preventDefault();
			const project = (
				document.querySelector(`#project-name`) as HTMLInputElement
			).value;
			const area = (
				document.querySelector(`#area-name`) as HTMLInputElement
			).value;
			const resource = (
				document.querySelector(`#resource-name`) as HTMLInputElement
			).value;

			//console.log('Inputs:', area, project, resource);
			// 在这里，你可以用获取的输入做更多的事情，比如创建文件和文件夹，或者调用其他的函数
			// 创建一个新的自定义事件，并在事件的detail属性中包含用户的输入
			const event = {
				area: area,
				project: project,
				resource: resource,
			};
			// 使用 EventEmitter 触发事件
			myEmitter.emit("formSubmitted", event);
		});
	});

	button2.addEventListener("click", () => {
		viewContainer.innerHTML = "";
		const div = document.createElement("div");
		div.style.display = "flex";
		div.style.flexDirection = "column";
		div.style.justifyContent = "center";
		div.style.alignItems = "center";
		div.style.position = "fixed"; // 使按钮固定在特定位置
		div.style.top = "25%"; // 定义按钮距离底部的距离
		div.style.width = "100%";

		const title = document.createElement("h1");
		title.style.fontSize = "20px";
		title.style.textAlign = "center";
		title.textContent = "Init面板";
		div.appendChild(title);

		const button21 = document.createElement("button");
		button21.style.padding = "5px 5px";
		button21.style.margin = "5px";
		button21.innerText = "初始化PARA文件夹及模板";
		button21.title = "点击此按钮可以初始化PARA文件夹及模板";
		button21.id = "button21";
		button21.style.justifyContent = "center"; // 将内容垂直居中
		button21.style.alignItems = "center"; // 将内容水平居中
		button21.style.height = "100%"; // 设置高度为100%
		button21.style.width = "80%";
		button21.className = "animated-button";
		button21.addEventListener("click", (e) => {
			e.preventDefault(); // 阻止表单提交
			// 在这里添加点击按钮1时需要执行的操作
			myEmitter.emit("InitParaButtonClicked");
			//console.log(`clicked ${button21.innerText}`);
		});

		const button22 = document.createElement("button");
		button22.style.padding = "5px 5px";
		button22.style.margin = "5px";
		button22.innerText = "初始化Periodic Notes 文件夹及模板";
		button22.title = "点击此按钮可以初始化Periodic Notes 文件夹及模板"; // 添加鼠标悬浮提示
		button22.id = "button22";
		button22.style.justifyContent = "center"; // 将内容垂直居中
		button22.style.alignItems = "center"; // 将内容水平居中
		button22.style.height = "100%"; // 设置高度为100%
		button22.style.width = "80%";
		button22.className = "animated-button";
		button22.addEventListener("click", (e) => {
			e.preventDefault(); // 阻止表单提交
			// 在这里添加点击按钮2时需要执行的操作
			//console.log(`clicked ${button21.innerText}`)
			myEmitter.emit("InitPeriodicButtonClicked");
		});

		div.appendChild(button21);
		div.appendChild(button22);

		viewContainer.appendChild(div); // 使用prepend将div添加到viewContainer的开始位置
	});

	button3.addEventListener("click", () => {
		viewContainer.innerHTML = "";
		const div = document.createElement("div");
		div.style.display = "flex";
		div.style.flexDirection = "column";
		div.style.justifyContent = "center";
		div.style.alignItems = "center";
		div.style.position = "fixed"; // 使按钮固定在特定位置
		div.style.top = "25%"; // 定义按钮距离底部的距离
		div.style.left = "50%"; // 定义按钮距离左边的距离
		div.style.transform = "translateX(-50%)"; // 水平居中
		div.style.width = "100%";

		const title = document.createElement("h1");
		title.style.fontSize = "20px";
		title.style.textAlign = "center";
		title.textContent = "插件翻译面板";
		div.appendChild(title);

		// 创建备份插件按钮
		const backupPluginButton = createButton(
			"备份插件",
			"点击此按钮可以备份插件"
		);
		backupPluginButton.addEventListener("click", (e) => {
			e.preventDefault();
			//console.log(`clicked ${backupPluginButton.innerText}`);
			myEmitter.emit("BackupPluginButtonClicked");
		});

		// 创建提取翻译内容按钮
		const extractTranslationButton = createButton(
			"提取翻译内容",
			"点击此按钮可以提取翻译内容"
		);
		extractTranslationButton.addEventListener("click", (e) => {
			e.preventDefault();
			console.log(`clicked ${extractTranslationButton.innerText}`);
			myEmitter.emit("ExtractTranslationButtonClicked");
		});

		// 创建翻译插件按钮
		const translatePluginButton = createButton(
			"翻译插件",
			"点击此按钮可以翻译插件"
		);
		translatePluginButton.addEventListener("click", (e) => {
			e.preventDefault();
			//console.log(`clicked ${translatePluginButton.innerText}`);
			myEmitter.emit("TranslatePluginButtonClicked");
		});

		// 创建还原插件按钮
		const restorePluginButton = createButton(
			"还原插件",
			"点击此按钮可以还原插件"
		);
		restorePluginButton.addEventListener("click", (e) => {
			e.preventDefault();
			//console.log(`clicked ${restorePluginButton.innerText}`);
			myEmitter.emit("RestorePluginButtonClicked");
		});

		// 辅助函数，用于创建按钮
		function createButton(text: string, title: string) {
			const button = document.createElement("button");
			button.style.padding = "5px 5px";
			button.style.margin = "5px";
			button.innerText = text;
			button.title = title;
			button.style.justifyContent = "center";
			button.style.alignItems = "center";
			button.style.height = "40px"; // 设置高度
			button.style.width = "80%";
			button.className = "animated-button";
			return button;
		}

		// 将按钮添加到div中
		div.appendChild(backupPluginButton);
		div.appendChild(extractTranslationButton);
		div.appendChild(translatePluginButton);
		div.appendChild(restorePluginButton);

		// 将div添加到viewContainer中
		viewContainer.appendChild(div);
	});

	button4.addEventListener("click", () => {
		viewContainer.innerHTML = "";
		const div = document.createElement("div");
		div.style.display = "flex";
		div.style.flexDirection = "column";
		div.style.justifyContent = "center";
		div.style.alignItems = "center";
		div.style.position = "fixed"; // 使按钮固定在特定位置
		div.style.top = "25%"; // 定义按钮距离底部的距离
		div.style.left = "50%"; // 定义按钮距离左边的距离
		div.style.transform = "translateX(-50%)"; // 水平居中
		div.style.width = "100%";

		const title = document.createElement("h1");
		title.style.fontSize = "20px";
		title.style.textAlign = "center";
		title.textContent = "文章自动发布面板";
		div.appendChild(title);

		// 创建自动发布按钮的辅助函数
		function createAutoPublishButton(
			platformName: string,
			action: string | symbol
		) {
			const button = document.createElement("button");
			button.style.padding = "5px 5px";
			button.style.margin = "5px";
			button.innerText = `${platformName}自动发布`;
			button.title = `点击此按钮可以自动发布到${platformName}`;
			button.style.justifyContent = "center";
			button.style.alignItems = "center";
			button.style.height = "40px"; // 设置高度
			button.style.width = "80%";
			button.className = "animated-button";
			button.addEventListener("click", (e) => {
				e.preventDefault();
				// 触发自定义事件，具体逻辑根据实际需求实现
				myEmitter.emit(action);
			});
			return button;
		}

		// 创建微信公众号自动发布按钮
		const weChatButton = createAutoPublishButton(
			"微信公众号",
			"WeChatAutoPublishClicked"
		);

		// 创建csdn自动发布按钮
		const csdnButton = createAutoPublishButton(
			"csdn",
			"CSDNAutoPublishClicked"
		);

		// 创建知乎自动发布按钮
		const zhihuButton = createAutoPublishButton(
			"知乎",
			"ZhihuAutoPublishClicked"
		);

		// 创建简书自动发布按钮
		const jianshuButton = createAutoPublishButton(
			"简书",
			"JianshuAutoPublishClicked"
		);

		// 创建掘金自动发布按钮
		const juejinButton = createAutoPublishButton(
			"掘金",
			"JuejinAutoPublishClicked"
		);

		// 创建今日头条自动发布按钮
		const toutiaoButton = createAutoPublishButton(
			"今日头条",
			"ToutiaoAutoPublishClicked"
		);

		// 创建百家号自动发布按钮
		const baijiahaoButton = createAutoPublishButton(
			"百家号",
			"BaijiahaoAutoPublishClicked"
		);

		// 创建哔哩哔哩自动发布按钮
		const bilibiliButton = createAutoPublishButton(
			"哔哩哔哩",
			"BilibiliAutoPublishClicked"
		);

		// 将按钮添加到div中
		div.appendChild(weChatButton);
		div.appendChild(csdnButton);
		div.appendChild(zhihuButton);
		div.appendChild(jianshuButton);
		div.appendChild(juejinButton);
		div.appendChild(toutiaoButton);
		div.appendChild(baijiahaoButton);
		div.appendChild(bilibiliButton);

		// 将div添加到viewContainer中
		viewContainer.appendChild(div);
	});
}
