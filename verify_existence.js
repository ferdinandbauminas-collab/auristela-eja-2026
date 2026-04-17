import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyExist() {
    const ids = [
        '89616363-31a2-4be7-9c9c-614958e30386',
        '8ed2d8cb-c269-45f8-a374-a96597be6824'
    ];

    console.log("Verificando se os IDs ainda existem...");
    const { data, error } = await supabase
        .from('ef_classes')
        .select('*')
        .in('id', ids);

    if (error) {
        console.error("Erro:", error.message);
    } else {
        console.log(`Encontrados ${data.length} registros:`);
        console.log(JSON.stringify(data, null, 2));
    }
}

verifyExist();
