import { App, SuggestModal, TAbstractFile } from "obsidian";

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
    (async () => {
        console.log(file.path);
        // const browser = await chromium.launch({ headless: false });
        // const authFile = 'playwright/.auth/user.json';

        // const ss_file = 'data/wechat_ss.json';
        // console.log(process.cwd());
        // if (fs.existsSync(ss_file)) {
        //     console.log('ss file exists');
        //     const context =await browser.newContext()

        // } 
        // else{
        //     const context = await browser.newContext()

        // }

        
        //     const page = await browser.newPage();
        //     await page.goto('https://mp.weixin.qq.com/');
        //     await browser.close();
        })();
}
export async function CSDNAutoPublish(app:App,file: TAbstractFile) {
    
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