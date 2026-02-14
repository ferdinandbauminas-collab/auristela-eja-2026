import string
import os

def extract_strings(file_path, min_len=4):
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return

    with open(file_path, 'rb') as f:
        content = f.read()
    
    result = ""
    for char in content:
        c = chr(char)
        if c in string.printable:
            result += c
        else:
            if len(result) >= min_len:
                if "ALFA" in result.upper() or "ALUN" in result.upper():
                    print(result)
            result = ""

file_path = r'C:\Users\ferdi\Downloads\19GRE.xls'
extract_strings(file_path)
