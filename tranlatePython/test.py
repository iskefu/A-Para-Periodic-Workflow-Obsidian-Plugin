

import os


def test():
    print("Hello, World!")
    pwd = os.getcwd()
    print(pwd)
    with open('newfile.txt', 'w') as f:
        f.write("Hello, World!")

    
if __name__ == "__main__":
    test()