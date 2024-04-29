import { App } from 'obsidian';
import path from 'path';
import { chromium } from 'playwright';

import fs from 'fs';

export async function WXGZHAutoPublish(app:App) {
    (async () => {
        const browser = await chromium.launch({ headless: false });

        const activatfile = app.workspace.getActiveFile();
        
        if (!activatfile) {
            return;
        }

        const ss_file = 'data/wechat_ss.json';
        console.log(process.cwd());
        if (fs.existsSync(ss_file)) {
            console.log('ss file exists');
            const context =await browser.newContext()

        } 
        else{
            const context = await browser.newContext()

        }

        
        //     const page = await browser.newPage();
        //     await page.goto('https://mp.weixin.qq.com/');
        //     await browser.close();
        })();
}
export async function CSDNAutoPublish() {
    
}
export async function ZhihuAutoPublish() {
    
}
export async function JianshuAutoPublish() {
    
}
export async function JuejinAutoPublish() {
    
}
export async function ToutiaoAutoPublish() {
    
}
export async function BaijiahaoAutoPublish() {
    
}
export async function BilibiliAutoPublish() {
    
}