import csv
import uuid
import os

downloads_path = r'C:\Users\ferdi\Downloads'
teachers_csv = os.path.join(downloads_path, 'LISTA DE PROFESSORES POR DISCIPLINA E TURMA EJA 2026.csv')
students_csv = os.path.join(downloads_path, 'LISTA DE ALUNOS POR TURMA EJA 2026.csv')
classes_csv = os.path.join(downloads_path, 'DADOS EJA 2026 - TURMAS.csv')

def normalize_grade(g):
    g = g.upper().strip()
    # Ordem decrescente de tamanho para evitar que 'IA INFO' estrague 'IIIA INFO'
    replacements = [
        ("IIIA INFO", "INFO IIIA"),
        ("IIIB INFO", "INFO IIIB"),
        ("IA INFO", "INFO IA"),
        ("VA INFO", "INFO VA"),
        ("VB INFO", "INFO VB"),
        ("VC INFO", "INFO VC"),
        ("VD INFO", "INFO VD"),
        ("IA ALTE", "ALTE IA"),
        ("IA MARK", "MARK IA")
    ]
    for old, new in replacements:
        if old in g:
            g = g.replace(old, new)
    return g

sql_output = []
sql_output.append("-- 🚀 SCRIPT DE MIGRAÇÃO EJA 2026 (VERSÃO V3 - CORREÇÃO DE CHAVE ESTRANGEIRA)")
sql_output.append("BEGIN;")

# 0. Remover constraint que impede a importação (chave estrangeira rígida)
sql_output.append("ALTER TABLE ef_students DROP CONSTRAINT IF EXISTS ef_students_class_id_fkey;")

# Limpeza total
sql_output.append("TRUNCATE ef_attendance, ef_students, ef_classes, ef_teachers CASCADE;")

# 1. Mapear Professores (ef_teachers: id, name, subject, avatar)
teachers_map = {} # name -> id
if os.path.exists(teachers_csv):
    with open(teachers_csv, 'r', encoding='utf-8') as f:
        reader = csv.reader(f, delimiter=';')
        next(reader) # header
        for row in reader:
            if not row or not row[0].strip(): continue
            p_name = row[0].strip()
            if p_name not in teachers_map:
                p_id = str(uuid.uuid4())
                teachers_map[p_name] = p_id
                p_subject = row[1].strip().split(',')[0].strip()
                sql_output.append(f"INSERT INTO ef_teachers (id, name, subject) VALUES ('{p_id}', '{p_name}', '{p_subject}');")

# 2. Mapear Disciplinas/Turmas (ef_classes: id, name, grade, teacher_id)
if os.path.exists(teachers_csv):
    with open(teachers_csv, 'r', encoding='utf-8') as f:
        reader = csv.reader(f, delimiter=';')
        next(reader) 
        for row in reader:
            if not row or not row[0].strip(): continue
            p_name = row[0].strip()
            p_id = teachers_map.get(p_name)
            # Normalizar disciplinas e turmas
            p_discs = [d.strip() for d in row[1].strip().replace(' e ', ', ').replace(' e', ',').split(',')]
            p_grades = [c.strip() for c in row[2].strip().split(',')]
            
            for d in p_discs:
                if not d: continue
                for g in p_grades:
                    if not g: continue
                    g_norm = normalize_grade(g)
                    cl_id = str(uuid.uuid4())
                    sql_output.append(f"INSERT INTO ef_classes (id, name, grade, teacher_id) VALUES ('{cl_id}', '{d}', '{g_norm}', '{p_id}');")

# 3. Mapear Alunos (ef_students: id, name, class_id)
if os.path.exists(students_csv):
    with open(students_csv, 'r', encoding='utf-8') as f:
        reader = csv.reader(f, delimiter=';')
        rows = list(reader)
        if rows:
            first_row = rows[0]
            col_classes = {}
            for i in range(1, len(first_row), 3):
                if first_row[i].strip():
                    col_classes[i] = first_row[i].strip()
            
            for row in rows:
                for i in range(0, len(row), 3):
                    class_idx = i + 1
                    if class_idx in col_classes:
                        s_name = row[i].strip().strip('\ufeff')
                        s_grade = normalize_grade(col_classes[class_idx])
                        if s_name and s_name.upper() != "NOME" and "MÓDULO" not in s_name.upper():
                            s_id = str(uuid.uuid4())
                            s_name_sql = s_name.replace("'", "''")
                            sql_output.append(f"INSERT INTO ef_students (id, name, class_id) VALUES ('{s_id}', '{s_name_sql}', '{s_grade}');")

sql_output.append("COMMIT;")

with open('migrate_2026.sql', 'w', encoding='utf-8') as f:
    f.write("\n".join(sql_output))

print(f"✅ SQL v3 gerado com sucesso!")
