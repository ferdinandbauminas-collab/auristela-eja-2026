import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
    console.log("Inspecionando colunas de ef_classes...");

    // Tentativa 1: Query SQL via RPC (se existir um executor de SQL)
    // Tentativa 2: Select que falha propositalmente para ver o erro detalhado
    const { data, error } = await supabase
        .from('ef_classes')
        .select('non_existent_column_for_debug')
        .limit(1);

    if (error) {
        console.log("Erro capturado (esperado):", error.message);
        console.log("Dica do erro:", error.hint);
        console.log("Dados do erro:", JSON.stringify(error, null, 2));
    }

    // Tentativa 3: Se a tabela tiver ao menos UM registro, select * resolve
    const { data: rows } = await supabase.from('ef_classes').select('*').limit(1);
    if (rows && rows.length > 0) {
        console.log("Colunas reais:", Object.keys(rows[0]));
    } else {
        console.log("Tabela vazia, não foi possível inferir colunas via SELECT.");
    }
}

inspect();
