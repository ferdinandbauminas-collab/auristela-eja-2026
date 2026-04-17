import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log("Consultando informações sobre as tabelas...");

    // Tentativa 1: Listar tabelas via rpc se existir, ou apenas tentar um select simples em uma tabela conhecida
    const tables = ['ef_classes', 'ef_teachers', 'ef_attendance'];

    for (const table of tables) {
        const { data, error } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.error(`Tabela ${table}: ERRO - ${error.message}`);
        } else {
            console.log(`Tabela ${table}: EXISTE (Count: ${data?.length || 0})`);
        }
    }

    // Tentativa 2: Tentar descobrir o schema
    const { data: schemaData, error: schemaError } = await supabase.rpc('get_schema_version'); // Exemplo hipotético
    if (schemaError) {
        console.log("Não foi possível detectar schema via RPC (esperado).");
    }
}

checkSchema();
