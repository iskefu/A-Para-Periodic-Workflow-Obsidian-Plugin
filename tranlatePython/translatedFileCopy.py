import os
import shutil

def restore_translated_file(file):
    folders = [name for name in os.listdir('.') if os.path.isdir(name)]
    for folder in folders:
        translated_file_path = os.path.join(folder, f'{file}.translated')
        # print(translated_file_path)
        file_path=os.path.splitext(translated_file_path)[0]
        # print(file_path)
        if not os.path.isfile(translated_file_path):
            # print(f'{translated_file_path} not exist')
            continue

        if os.path.isfile(file_path):
            # print (f'{file_path} exist')
            # 删除旧的文件
            os.remove(file_path)
            shutil.copyfile(translated_file_path, file_path)
            print (f'{translated_file_path}-> remove and create {file_path}')
        else:
            # 创建新的文件
            shutil.copyfile(translated_file_path, file_path)
            print (f'{translated_file_path}-> remove and create {file_path}')

if __name__ == '__main__':
    file='manifest.json'
    restore_translated_file(file)
    # restore_translated_file('main.js')