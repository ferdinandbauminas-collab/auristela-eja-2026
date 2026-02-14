import pandas as pd
import os

file_path = r'C:\Users\ferdi\Downloads\DADOS EJA 2026.xlsx'

if os.path.exists(file_path):
    try:
        xl = pd.ExcelFile(file_path)
        print(f"Abas encontradas em {os.path.basename(file_path)}:")
        for sheet in xl.sheet_names:
            print(f"- {sheet}")
            df = xl.parse(sheet)
            print(f"  Colunas: {list(df.columns)}")
            print(f"  Amostra (3 linhas):\n{df.head(3)}\n")
    except Exception as e:
        print(f"Erro ao ler o arquivo Excel: {e}")
else:
    print(f"Arquivo não encontrado: {file_path}")
