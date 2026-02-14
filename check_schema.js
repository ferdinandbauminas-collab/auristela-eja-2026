import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log("Conectando ao Supabase...");
    const { data, error } = await supabase.from('ef_classes').select('*').limit(1);

    if (error) {
        console.error("Erro ao ler ef_classes:", error.message);
        const { error: error2 } = await supabase.from('ef_teachers').select('*').limit(1);
        if (error2) console.error("Erro ao ler ef_teachers:", error2.message);
        else console.log("Conexão com ef_teachers OK.");
    } else {
        console.log("Sucesso! Colunas em ef_classes:", data.length > 0 ? Object.keys(data[0]) : "Tabela vazia (mas conexão OK)");
        // Se estiver vazia, vamos tentar pegar o esquema de outra forma:
        if (data.length === 0) {
            const { data: cols, error: errCols } = await supabase.rpc('get_table_columns', { table_name: 'ef_classes' });
            // Provavelmente RPC não existe, mas vamos ver os erros
        }
    }
}

check();
