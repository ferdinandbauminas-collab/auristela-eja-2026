import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectAll() {
    console.log("Listando todos os professores...");
    const { data: teachers, error: tError } = await supabase.from('ef_teachers').select('*');
    if (tError) console.error("Erro teachers:", tError.message);
    else {
        console.log(`Professores (${teachers.length}):`);
        console.table(teachers);
    }

    console.log("\nListando todas as classes...");
    const { data: classes, error: cError } = await supabase.from('ef_classes').select('*');
    if (cError) console.error("Erro classes:", cError.message);
    else {
        console.log(`Classes (${classes.length}):`);
        console.table(classes.map(c => ({ id: c.id, name: c.name, grade: c.grade, teacher_id: c.teacher_id })));
    }
}

inspectAll();
