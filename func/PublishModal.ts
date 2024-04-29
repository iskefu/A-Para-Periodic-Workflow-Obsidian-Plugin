import { App, SuggestModal, TAbstractFile } from "obsidian";
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
interface Platform {
    name: string;
  }
  const ALL_PLATFORMS = [
    {
      name: "Publish To :    知乎",
    },
    {
      name: "Publish To :    CSDN",
    },
    {
      name: "Publish To :    百家号",
    },
    {
      name: "Publish To :    今日头条",
    },
    {
      name: "Publish To :    哔哩哔哩",
    },
    {
      name: "Publish To :    微信公众号",
    },
    {
      name: "Publish To :    掘金",
    },
    {
      name: "Publish To :    简书",
    },
  ];
  export class PublishModal extends SuggestModal<Platform> {
      private file: TAbstractFile; // 添加一个成员变量来存储文件信息
      constructor(app: App, file: TAbstractFile) {
        super(app);
        this.file = file;
      }
    getSuggestions(query: string): Platform[] {
      return ALL_PLATFORMS.filter((platform) =>
        platform.name.toLowerCase().includes(query.toLowerCase())
      );
    }
  
    // Renders each suggestion item.
    renderSuggestion(platform: Platform, el: HTMLElement) {
      el.createEl("div", { text: platform.name });
    }
  
    // Perform action on the selected suggestion.
    onChooseSuggestion(platform: Platform, evt: MouseEvent | KeyboardEvent) {
      publishToPlatform(this.app,platform.name,this.file);
    }
  }
function publishToPlatform(app: App,platformName: string,file: TAbstractFile) {
    // 根据平台名称执行不同的发布逻辑
    switch (platformName) {
      case 'Publish To :    知乎':
        ZhihuAutoPublish(app,file);
        break;
      case 'Publish To :    CSDN':
        CSDNAutoPublish(app,file);
        break;
      case 'Publish To :    百家号':
        BaijiahaoAutoPublish(app,file);
        break;
      case 'Publish To :    今日头条':
        ToutiaoAutoPublish(app,file);
        break;
      case 'Publish To :    哔哩哔哩':
        BilibiliAutoPublish(app,file);
        break;
      case 'Publish To :    微信公众号':
        WXGZHAutoPublish(app,file);
        break;
      case 'Publish To :    掘金':
        JuejinAutoPublish(app,file);
        break;
      case 'Publish To :    简书':
        JianshuAutoPublish(app,file);
        break;
      default:
        break;
    }
}
export async function WXGZHAutoPublish(app:App,file: TAbstractFile) {
  //get pwd 
  const valuePath = app.vault.adapter.getBasePath()
  const plugins =  Object.values(this.app.plugins.manifests);
  const myPluginID ='a-para-periodic-workflow'
  const myPluginDir = plugins.filter(plugin => plugin.id === myPluginID)[0].dir;
  const currentFullPath = path.join(valuePath,myPluginDir);

  // console.log(file.path);
  const browser = await chromium.launch({ headless: false });
  const context=await browser.newContext();

  //load auth file
  const authFile =currentFullPath+'/playwright/.auth/wechat-mp-auth.json';
  if (fs.existsSync(authFile)){
    const cookies = JSON.parse(fs.readFileSync(authFile, 'utf8')).cookies;
    await context.addCookies(cookies);
  }  

  const page = await context.newPage();

  const xpathFile=currentFullPath+'/playwright/xpath/'+'publish-to-weixin-mp.json';
  let xpath
  if (fs.existsSync(xpathFile)){
   xpath = JSON.parse(fs.readFileSync(xpathFile, 'utf8'));
  }

  await page.goto(xpath.url);
  
  await page.waitForLoadState('load')

  //wait for login
  const logined_element = '.weui-desktop-account__img'
  const isLoginIn=await page.isVisible(logined_element)
  if (!isLoginIn){
    try{
      await page.waitForSelector(logined_element, {timeout: 120*1000})
    }catch(e){
      console.log('login timeout')
      await browser.close()
      return
    }
  }
  context.storageState({path:authFile})
  await page.locator(".new-creation__menu-content").first().click();
  page.on("popup", async (page1) => {
    await page1.waitForLoadState('load')

    const {name}= path.parse(file.path)
    await page1.getByPlaceholder("请在这里输入标题").fill(name)

    const author="kefu1252"
    await page1.getByPlaceholder("请输入作者").fill(author)

    const fileFullPath = path.join(valuePath,file.path)
    const     cont = fs.readFileSync(fileFullPath, 'utf8')
    await page1.frameLocator('#ueditor_0').locator('body').fill(cont)

    //upload cover
    await page1.locator(".select-cover__btn").hover()
    await page1.getByRole('link', { name: '从图片库选择' }).click();
    await page1.getByRole('img', { name: '图片描述' }).first().click();
    await page1.getByRole('button', { name: '下一步' }).click();
    await page1.waitForTimeout(1000)
    await page1.getByRole('button', { name: '完成' }).click();

    //原创声明
    await page1.locator('.weui-desktop-switch__box').first().click();
    await page1.locator('label').filter({ hasText: '我已阅读并同意遵守《微信公众平台原创声明及相关功能使用协议》' }).locator('i').click();
    await page1.getByRole('button', { name: '下一步' }).click();
    await page1.getByText('请选择文章类别').click();
    await page1.getByText('科技').first().click();
    await page1.getByText('互联网+').first().click();
    await page1.getByRole('button', { name: '确定' }).click();
    
    //赞赏
    await page1.locator("#js_reward_setting_area > .setting-group__content > .setting-group__switch > .weui-desktop-switch > .weui-desktop-switch__box").click()
    await page1.locator(".reward-reply-switch__wrp > .weui-desktop-switch > .weui-desktop-switch__box").click()
    await page1.waitForTimeout(1000)
    await page1.getByRole("button", {name: "确定"}).click()

    await page1.getByRole('button', { name: '发表' }).click();

    await page1.waitForTimeout(1000)
    await page1.getByRole("button", {name:"发表"}).click()
    
    await page1.locator("#vue_app").getByRole("button", {name:"发表"}).click()
    await page1.getByRole("button", {name:"继续发表"}).click()

    //wait for scan qrcode to publish
    await page1.waitForSelector(logined_element,{timeout: 120*1000})
    await page1.close()
    await browser.close()
  })

  
}
export async function CSDNAutoPublish(app:App,file: TAbstractFile) {
  //get pwd 
  const valuePath = app.vault.adapter.getBasePath()
  const plugins =  Object.values(this.app.plugins.manifests);
  const myPluginDir = plugins.filter(plugin => plugin.id === 'a-para-periodic-workflow')[0].dir;
  const currentFullPath = path.join(valuePath,myPluginDir);

  // console.log(file.path);
  const browser = await chromium.launch({ headless: false });
  const context=await browser.newContext();

  //load auth file
  const authFile =currentFullPath+'/playwright/.auth/csdn-mp-auth.json';
  if (fs.existsSync(authFile)){
    const cookies = JSON.parse(fs.readFileSync(authFile, 'utf8')).cookies;
    await context.addCookies(cookies);
  }  

  const page = await context.newPage();

  // const xpathFile=currentFullPath+'/playwright/xpath/'+'publish-to-weixin-mp.json';
  // let xpath
  // if (fs.existsSync(xpathFile)){
  //  xpath = JSON.parse(fs.readFileSync(xpathFile, 'utf8'));
  // }
  const url= 'https://www.csdn.net'
  await page.goto(url);
  await page.waitForLoadState('load')
  //wait for login
  const logined_element = 'a.hasAvatar'
  const isLoginIn=await page.isVisible(logined_element)
  if (!isLoginIn){
    try{
      await page.getByText('登录', { exact: true }).click();
      await page.waitForSelector(logined_element, {timeout: 120*1000})
    }catch(e){
      console.log('login timeout')
      await browser.close()
      return
    }
  }
  context.storageState({path:authFile})
  await page.getByRole('link', { name: '发布', exact: true }).click();
  await page.waitForLoadState('load')
  await page.getByLabel('使用 MD 编辑器').click();

  page.on("popup", async (page2) => {
    await page2.waitForLoadState('load')
    const fileFullPath = path.join(valuePath,file.path)
    await page2.locator('#import-markdown-file-input').setInputFiles(fileFullPath)
    await page2.getByRole('button', { name: '发布文章' }).click();
    await page2.getByRole('button', { name: '添加文章标签' }).hover();
    await page2.waitForTimeout(1000)
    await page2.locator('.el-tag.el-tag--light').first().click();
    await page2.getByLabel('关闭').nth(2).click();
    await page2.getByLabel('Insert publishArticle').getByRole('button', { name: '发布文章' }).click();
      //wait for scan qrcode to publish
    await page2.waitForSelector(logined_element,{timeout: 120*1000})
    await page2.close()
    await browser.close()
  });


    
}
export async function ZhihuAutoPublish(app:App,file: TAbstractFile) {
    
}
export async function JianshuAutoPublish(app:App,file: TAbstractFile) {
    
}
export async function JuejinAutoPublish(app:App,file: TAbstractFile) {
    
}
export async function ToutiaoAutoPublish(app:App,file: TAbstractFile) {
    
}
export async function BaijiahaoAutoPublish(app:App,file: TAbstractFile) {
    
}
export async function BilibiliAutoPublish(app:App,file: TAbstractFile) {
    
} 