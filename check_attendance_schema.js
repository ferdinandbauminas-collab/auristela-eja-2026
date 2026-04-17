import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAttendanceSchema() {
    console.log("Inspecionando ef_attendance...");
    const { data, error } = await supabase
        .from('ef_attendance')
        .select('*')
        .limit(1);

    if (error) {
        console.error("Erro:", error);
    } else {
        console.log("Colunas encontradas:", Object.keys(data[0] || {}));
    }
}

checkAttendanceSchema();
