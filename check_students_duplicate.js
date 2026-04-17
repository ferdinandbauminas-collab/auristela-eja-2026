import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStudents() {
    const classIds = [
        'bf4d5e79-a419-4e54-a00e-da52accb799d', // LINGUA ALTE
        'a6c1a7f9-ecb6-4f17-9d38-b139edf71b8c', // LINGUA MARK
        '89616363-31a2-4be7-9c9c-614958e30386', // LÍNGUA ALTE
        '8ed2d8cb-c269-45f8-a374-a96597be6824'  // LÍNGUA MARK
    ];

    console.log("Verificando alunos por classe...");
    for (const id of classIds) {
        const { data, count, error } = await supabase
            .from('ef_students')
            .select('*', { count: 'exact', head: true })
            .eq('class_id', id);

        if (error) {
            console.error(`Erro no ID ${id}:`, error.message);
        } else {
            console.log(`Classe ${id}: ${count} alunos`);
        }
    }
}

checkStudents();
