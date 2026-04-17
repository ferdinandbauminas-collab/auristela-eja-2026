import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function debugSchemaDetailed() {
    console.log("Investigação detalhada de tabelas...");

    // Tenta listar tabelas do esquema atual via SQL através de uma gambiarra (se habilitado)
    // Mas como não temos rpc direto para isso, vamos tentar apenas ler uma tabela e ver o que o erro diz se forçar erro
    const { data: errorData, error: forceError } = await supabase
        .from('non_existent_table_random_123')
        .select('*');

    if (forceError) {
        console.log("Erro ao forçar tabela inexistente (apenas para ver detalhes):", forceError.message);
    }

    // Tenta ler ef_classes e ver se conseguimos pegar metadados
    const { data, error } = await supabase
        .from('ef_classes')
        .select('*')
        .limit(1);

    if (error) {
        console.error("Erro ao ler ef_classes:", error.message);
    } else {
        console.log("Sucesso ao ler ef_classes via API Client.");
        console.log("Amostra de dados:", JSON.stringify(data, null, 2));
    }
}

debugSchemaDetailed();
