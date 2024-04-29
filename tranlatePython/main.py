# -*- coding: utf-8 -*-
import os  # 导入os模块，用于操作文件和目录
import json  # 导入json模块，用于读写JSON文件
import re  # 导入re模块，用于正则表达式操作
import time  # 导入time模块，虽然脚本中未使用，但可能用于记录时间
import shutil  # 导入shutil模块，用于文件操作，如复制文件
import requests
import random
from hashlib import md5
def make_md5(s, encoding='utf-8'):
    # Generate salt and sign
    return md5(s.encode(encoding)).hexdigest()
  
def Baidu_Text_transAPI(query, from_lang='auto', to_lang='zh'):
    # Set your own appid/appkey.
    appid = '20240316001995011'
    appkey = 'my1fkfszFehkCziDFtyw'
 
    endpoint = 'http://api.fanyi.baidu.com'
    path = '/api/trans/vip/translate'
    url = endpoint + path

    salt = random.randint(32768, 65536)
    sign = make_md5(appid + query + str(salt) + appkey)

    # Build request
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    payload = {'appid': appid, 'q': query, 'from': from_lang, 'to': to_lang, 'salt': salt, 'sign': sign}

    # Send request
    r = requests.post(url, params=payload, headers=headers)
    result = r.json()
    
    if result['error_code']:
        print( result)
        return 
    else:
        # 初始化一个空字典来保存结果
        translation_dict = {}
        # 遍历trans_result列表中的每个字典
        for item in result.get("trans_result", []):
            # 使用src作为键，dst作为值，添加到translation_dict字典中
            translation_dict[item["src"]] = item["dst"]
        return translation_dict
    
def process_path(path):# chuli folder
    return os.path.normpath(path)    

def restore_bak_file(folder):
    mnfst_file = folder + '/' + 'manifest.json'  # 构建manifest.json文件的路径
    main_file = folder + '/' + 'main.js' 
    bak_folder = folder_path+'/' + 'translateData'
    bak_folder_plugins=os.path.join(bak_folder,os.path.basename(folder))
    mnfst_bak_file=os.path.join(bak_folder_plugins,'manifest.json')
    main_bak_file=os.path.join(bak_folder_plugins,'main.js')
    need_tran_json_file=os.path.join(bak_folder_plugins,'need_tran.json')# 将原文件需要改的内容保存到need_tran
    traned_json_file = os.path.join(bak_folder_plugins,'traned.json')

    if not os.path.exists(bak_folder):
        print("no translateData folder")
        return
    if not os.path.exists(os.path.join(bak_folder,bak_folder_plugins)):
        print("no translateData/"+ bak_folder_plugins)
        return
    if not os.path.exists(main_bak_file):
        print("no main.js bakfile")
        return
    if os.path.exists(main_file):
        os.remove(main_file)
    shutil.copyfile(main_bak_file,main_file)
    print("restore file:",bak_folder_plugins,'/',main_file)
def del_data(folder):
        del_file_path = os.path.join(bak_folder, folder)
        if os.path.exists(del_file_path):
            shutil.rmtree(del_file_path)
        os.remove(del_file_path)

def create_folder(folder):
    if not os.path.exists(folder):
        os.mkdir(folder)
        print("create folder:",folder)
def bakupck_file(from_file_path,to_file_path):
    if os.path.exists(from_file_path) and not os.path.exists(to_file_path):  
        shutil.copyfile(from_file_path, to_file_path)  # 创建备份文件
        print(f'backup file :{to_file_path}')
def read_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        print(f'read file :{file_path}')
        return f.read()
def regexp_data(data,regexp_list):
    reg_dict={}
    for r in regexp_list: # 匹配要改的内容字符串
        matches = re.findall(r, data)
        # print(matches)
        for match in matches:
            reg_dict[match[1]] =   match[1] 
    return reg_dict
def save_file_json(file_path,data):
    if os.path.exists(file_path):return
    with open(file_path, 'w', encoding='utf-8') as f:
        print(f'save file :{file_path}')
        json.dump(data, f, ensure_ascii=False, indent=4)
def update_file_json(file_path,data):
    if not os.path.exists(file_path):
        old_data = {}
    with open(file_path, 'r', encoding='utf-8') as f:
        old_data = json.load(f)
        old_data.update(data)
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(old_data, f, ensure_ascii=False, indent=4)
        print(f'update json file :{file_path}')
def translate_main(folder): 
    mnfst_file = folder + '/' + 'manifest.json'  # 构建manifest.json文件的路径
    main_file = folder + '/' + 'main.js' 
    bak_folder = folder_path+'/' + 'translateData'
    bak_folder_plugins=os.path.join(bak_folder,os.path.basename(folder))
    mnfst_bak_file=os.path.join(bak_folder_plugins,'manifest.json')
    main_bak_file=os.path.join(bak_folder_plugins,'main.js')
    need_tran_json_file=os.path.join(bak_folder_plugins,'need_tran.json')# 将原文件需要改的内容保存到need_tran
    traned_json_file = os.path.join(bak_folder_plugins,'traned.json')

    create_folder(bak_folder)  
    create_folder(bak_folder_plugins)    
    # 备份manifest.json
    bakupck_file(mnfst_file,mnfst_bak_file)
    # 备份main.js
    bakupck_file(main_file,main_bak_file)
    # 读取main.js
    main_cont=read_file(main_file)
    # 匹配需要翻译的文本
    need_tran=regexp_data(main_cont,regexps)
    # 数据过滤
    need_tran={k: v for k, v in need_tran.items() if (len(k)>3)}
    # 保存要翻译的文本到json文件
    save_file_json(need_tran_json_file,need_tran)
    tran_str = '\n'.join(need_tran.values()) # 拼接成字符串 传给百度翻译api
    if not need_tran:
        print(f'no need to translate for {folder}')
        return 
    traned_str = Baidu_Text_transAPI(tran_str)  # 调用翻译函数

    need_tran = { # 数据清洗
    key: value for key, value in need_tran.items()
    if key not in traned_str
    }
    # 将没翻译的字典写入文件
    with open(need_tran_json_file, 'w', encoding='utf-8') as f:
        json.dump(need_tran, f, ensure_ascii=False,indent=4)
    print(f'need to translate saved in need_tran_json_file {need_tran_json_file}')
    
    update_file_json(traned_json_file,traned_str)
   
    # 替换原文为译文
    for key, value in traned_str.items():  # 遍历翻译后的字典
        main_cont = main_cont.replace(key, value)  
    with open(main_file, 'w', encoding='utf-8') as f:  # 写入更新后的文件内容
        f.write(main_cont)
    print(f'tranlated {folder}')   

def tranlate_all(folder_path):

    folder_path = process_path(folder_path)
    
    for folder in os.listdir(folder_path):
        folder_full_path = os.path.join(folder_path, folder)
        # print(f'folder_full_path:{folder_full_path}')
        if not os.path.isdir(folder_full_path):# filter not folder
            continue
        if not os.path.exists(os.path.join(folder_full_path,'manifest.json') or os.path.exists(os.path.join(folder_full_path,'main.js'))):# ensure manifest.json or main.js exist
            continue    
        print(f'translating plugin:    {folder}\n')
        translate_main(folder_full_path)
        # time.sleep(1)
def restore_all(folder_path):
    
    folder_path = process_path(folder_path)
    
    for folder in os.listdir(folder_path):
        folder_full_path = os.path.join(folder_path, folder)
        # print(f'folder_full_path:{folder_full_path}')
        if not os.path.isdir(folder_full_path):# filter not folder
            continue
        if not (os.path.exists(os.path.join(folder_full_path,'manifest.json') or  os.path.exists(os.path.join(folder_full_path,'main.js')))):# ensure manifest.json or main.js exist
            continue    
        print(f'restore plugin:    {folder}\n')
        restore_bak_file(folder_full_path)
        # time.sleep(1)
    

if __name__ == '__main__':

    # 定义插件文件夹所在目录 .../.obsidian/plugins
    folder_path='/run/media/kf/data/obsidian/.obsidian/plugins'
    regexps = [
        r'createEl\(([\'"`]).+?\1.+?\1(.+?)\1',
        r'Notice\(\s*([\'"`])(.+?)\1\s*\)',
        r'.setText\(\s*([\'"`])(.+?)\1\s*\)',
        r'.setButtonText\(\s*([\'"`])(.+?)\1\s*\)',
        r'.setName\(\s*([\'"`])(.+?)\1\s*\)',
        r'.setDesc\(\s*([\'"`])(.+?)\1\s*\)',
        r'.setPlaceholder\(\s*([\'"`])(.+?)\1\s*\)',
        r'.setTooltip\(\s*([\'"`])(.+?)\1\s*\)',
        r'.appendText\(\s*([\'"`])(.+?)\1\s*\)',
        r'.innerText\s*=\s*([\'"`])(.+?)\1'
    ]
    # translate_main(folder)  # 注释掉的函数调用，原本用于处理manifest.json文件
    # tranlate_all(folder_path)
    # restore_bak_file(folder)
    restore_all(folder_path)
    # del_data(folder)
    
    # Baidu_Text_transAPI("holle")