import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

url = os.environ.get("VITE_SUPABASE_URL")
key = os.environ.get("VITE_SUPABASE_ANON_KEY")

supabase: Client = create_client(url, key)

try:
    # Tenta pegar um registro qualquer para ver as colunas
    response = supabase.table("ef_classes").select("*").limit(1).execute()
    print("Sucesso ao conectar!")
    if response.data:
        print("Colunas encontradas:", response.data[0].keys())
    else:
        print("Tabela vazia. Tentando obter estrutura via query...")
        # Se estiver vazia, não conseguimos ver as colunas via select *
        # Mas podemos tentar inserir um dado de teste com 'id' para ver se falha
except Exception as e:
    print("Erro ao acessar ef_classes:", e)
