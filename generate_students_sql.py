import os
import csv

downloads_path = r'C:\Users\ferdi\Downloads'
student_files = [
    ('DADOS EJA 2026 - ALUNOS MÓDULO IA INFO.csv', 'MÓDULO IA INFO'),
    ('DADOS EJA 2026 - ALUNOS MÓDULO IIIA INFO.csv', 'MÓDULO IIIA INFO'),
    ('DADOS EJA 2026 - ALUNOS MÓDULO IIIB INFO.csv', 'MÓDULO IIIB INFO'),
    ('DADOS EJA 2026 - ALUNOS MÓDULO VA INFO.csv', 'MÓDULO VA INFO'),
    ('DADOS EJA 2026 - ALUNOS MÓDULO VB INFO.csv', 'MÓDULO VB INFO'),
    ('DADOS EJA 2026 - ALUNOS MÓDULO VC INFO.csv', 'MÓDULO VC INFO'),
    ('DADOS EJA 2026 - ALUNOS MÓDULO VD INFO.csv', 'MÓDULO VD INFO'),
    ('DADOS EJA 2026 - ALUNOS MÓDULO IA MARK.csv', 'MÓDULO IA MARK'),
    ('DADOS EJA 2026 - ALUNOS MÓDULO IA ALTE.csv', 'MÓDULO IA ALTE'),
]

sql_output = []
sql_output.append("-- 👥 CADASTRO DE ALUNOS")
sql_output.append("INSERT INTO students (id, name, class, active) VALUES")

entries = []
for file_name, class_name in student_files:
    file_path = os.path.join(downloads_path, file_name)
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            for i, name in enumerate(lines):
                clean_name = name.strip().strip('"').strip("'")
                if not clean_name or clean_name.upper() == "NOME":
                    continue
                # Generate a simple unique ID
                student_id = f"{class_name.replace(' ', '_').lower()}_{i}"
                entries.append(f"('{student_id}', '{clean_name}', '{class_name}', true)")

sql_output.append(",\n".join(entries) + ";")

print("\n".join(sql_output))
