import re
import os

# Mapeamento consolidado de professores (Nome Curto -> Nome Completo)
TEACHERS_MAP = {
    "ASSUNÇÃO": "JOSE DE ASSUNCAO SOUSA BARBOSA",
    "CARMEM": "CARMEN SILVIA NUNES DE MOURA SANTOS",
    "DANIEL": "DANIEL MAGALHAES CHAVES",
    "DENILSON": "DENILSON DAVID DA SILVA SANTOS",
    "EUNICE": "MARIA EUNICE LIRA TEIXEIRA ANDRADE",
    "FRANCINEUDA": "FRANCINEUDA DA SILVA SOUSA",
    "FRANCISCA": "FRANCISCA DA SILVA SOUSA",
    "HELANE": "HELANNE BEATRIZ SILVA OLIVEIRA",
    "HELANNE": "HELANNE BEATRIZ SILVA OLIVEIRA",
    "JANDIRA": "CARMEM JANDIRA SILVA DE OLIVEIRA",
    "JOANILSON": "JOANILSON OLIVEIRA DE QUEIROZ",
    "JORGE": "JORGE LUÍS SÁ BEZERRA",
    "WILSILENE": "WILSILENE DOS SANTOS OLIVEIRA BRANDÃO",
    "LENINHA": "WILSILENE DOS SANTOS OLIVEIRA BRANDÃO",
    "LINDELVANIA": "LINDELVÂNIA DE SOUSA ALMEIDA",
    "LUCIANO": "LUCIANO DE OLIVEIRA CHAVES",
    "MARCOS": "MARCOS AURELIO MATOS DOS SANTOS",
    "MIZAEL": "MIZAEL CARLOS GONCALVES DE SOUSA",
    "PAULO": "PAULO PEREIRA GOUDINHO",
    "WESLEY": "WESLEY BEZERRA PORTELA FREITAS",
    "WILSON": "WILSON BENTO GUILHERME MAGALHAES",
    "EDNARDO": "EDNARDO FERREIRA DE SOUSA", # Adicionado com base no contexto
    "GERSON": "GERSON DOS SANTOS",
    "JOANA DARC": "JOANA DARC",
    "ALESSANDRA": "ALEXSANDRA MARIA LINARD PAES LANDIM",
    "ALEXSANDRA": "ALEXSANDRA MARIA LINARD PAES LANDIM",
    "Eunice": "MARIA EUNICE LIRA TEIXEIRA ANDRADE",
    "Francisca": "FRANCISCA DA SILVA SOUSA",
    "Helanne": "HELANNE BEATRIZ SILVA OLIVEIRA"
}

DISCIPLINES_MAP = {
    "LINGUA PORT": "LÍNGUA PORTUGUESA",
    "MATEM": "MATEMÁTICA",
    "GEOG": "GEOGRAFIA",
    "HISTÓRIA": "HISTÓRIA",
    "BIOL": "BIOLOGIA",
    "FÍSICA": "FÍSICA",
    "QUÍMICA": "QUÍMICA",
    "FILOSOFI A": "FILOSOFIA",
    "SOCIOLO GIA": "SOCIOLOGIA",
    "LING. INGL": "LÍNGUA INGLESA",
    "INGLÊS INST": "INGLÊS INSTRUMENTAL",
    "REDE COMP": "REDES DE COMPUTADORES",
    "BANCO DE DADOS S": "BANCO DE DADOS",
    "PROJ. APREND.": "PROJETO DE APRENDIZAGEM INTERDISCIPLINAR",
    "PDDDS": "PROGRAMAÇÃO DE SISTEMAS",
    "EPT": "EMPREENDEDORISMO PARA TI",
    "REDE DE COMPUTADORES": "REDES DE COMPUTADORES",
    "PROGRA MAÇÃO": "LOGICA DE PROGRAMAÇÃO"
}

def get_full_name(short_name):
    upper_name = short_name.upper()
    return TEACHERS_MAP.get(upper_name, short_name)

def get_full_discipline(short_disc):
    return DISCIPLINES_MAP.get(short_disc, short_disc)

def process_schedule():
    md_path = r'C:\Users\ferdi\.gemini\antigravity\brain\6baaaea8-5a4b-4bce-aca0-38845a4f470c\analise_horario_eja2026.md'
    if not os.path.exists(md_path):
        print("Erro: Arquivo Markdown não encontrado.")
        return

    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex para capturar os blocos de dias
    days_blocks = re.findall(r'### 📅 (.*?)\n\n(.*?)(?=\n---|\Z)', content, re.DOTALL)
    
    sql_inserts = ["BEGIN;"]
    sql_inserts.append("TRUNCATE ef_schedule;") # Limpa para evitar duplicidade

    for day, table_content in days_blocks:
        # Regex para cada linha da tabela
        rows = re.findall(r'\| \*\*(.*?)\*\* \| (.*?) \| (.*?) \| (.*?) \| (.*?) \|', table_content)
        for row in rows:
            class_group = row[0]
            for slot_idx in range(1, 5):
                slot_content = row[slot_idx]
                # Extrair professor e disciplina das tags HTML
                match = re.search(r'<span class="prof">(.*?)</span><span class="disc">(.*?)</span>', slot_content)
                if match:
                    prof_short = match.group(1).strip()
                    disc_short = match.group(2).strip()
                    
                    full_prof = get_full_name(prof_short)
                    if "SEM PROFESSOR" in full_prof.upper():
                        full_prof = "HORÁRIO VAGO"
                    
                    full_disc = get_full_discipline(disc_short)
                    
                    sql = f"INSERT INTO ef_schedule (day_of_week, slot_number, class_group, discipline, teacher_name) VALUES ('{day}', {slot_idx}, '{class_group}', '{full_disc}', '{full_prof}');"
                    sql_inserts.append(sql)

    sql_inserts.append("COMMIT;")

    output_path = r'C:\Users\ferdi\.gemini\antigravity\scratch\auristela-eja-2026\populate_schedule.sql'
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(sql_inserts))
    
    print(f"Sucesso: SQL de populacao gerado em: {output_path}")

if __name__ == "__main__":
    process_schedule()
