import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function listTables() {
    console.log("Tentando ler o schema público via consulta direta...");

    // Como não temos acesso direto ao information_schema via biblioteca padrão do Supabase sem RPC,
    // vamos tentar inferir se as tabelas estão no schema public.
    const { data, error } = await supabase.from('ef_classes').select('id').limit(1);

    if (error) {
        console.error("Erro ao acessar ef_classes:", error.message);
    } else {
        console.log("Sucesso ao acessar ef_classes (schema public padrão).");
    }
}

listTables();
