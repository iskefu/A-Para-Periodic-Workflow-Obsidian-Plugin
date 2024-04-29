# -*- coding: utf-8 -*-

import requests
import random
import json
from hashlib import md5

def Baidu_Text_transAPI(query, from_lang='auto', to_lang='zh'):
    # Set your own appid/appkey.
    appid = '20240316001995011'
    appkey = 'my1fkfszFehkCziDFtyw'

    endpoint = 'http://api.fanyi.baidu.com'
    path = '/api/trans/vip/translate'
    url = endpoint + path

    # Generate salt and sign
    def make_md5(s, encoding='utf-8'):
        return md5(s.encode(encoding)).hexdigest()

    salt = random.randint(32768, 65536)
    sign = make_md5(appid + query + str(salt) + appkey)

    # Build request
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    payload = {'appid': appid, 'q': query, 'from': from_lang, 'to': to_lang, 'salt': salt, 'sign': sign}

    # Send request
    r = requests.post(url, params=payload, headers=headers)
    result = r.json()

    return result['trans_result']

# 使用示例
if __name__ == '__main__':
    Baidu_Text_transAPI('Hello World!')
