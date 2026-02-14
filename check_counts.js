import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCounts() {
    console.log("--- AUDITORIA DE DADOS SUPABASE ---");
    const tables = ['ef_teachers', 'ef_classes', 'ef_students', 'ef_attendance'];

    for (const table of tables) {
        const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
        if (error) {
            console.log(`❌ ${table}: Erro - ${error.message}`);
        } else {
            console.log(`✅ ${table}: ${count} registros encontrados.`);
        }
    }
}

checkCounts();
