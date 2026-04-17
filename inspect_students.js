import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectStudents() {
    console.log("Inspecionando os primeiros 10 alunos...");
    const { data: students, error } = await supabase
        .from('ef_students')
        .select('*')
        .limit(10);

    if (error) {
        console.error("Erro ao buscar alunos:", error.message);
        return;
    }

    console.log(`Alunos encontrados: ${students.length}`);
    console.log(JSON.stringify(students, null, 2));
}

inspectStudents();
