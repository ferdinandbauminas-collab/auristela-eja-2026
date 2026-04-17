import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectTeachersAndClasses() {
    console.log("Buscando professores com 'EUNICE' no nome...");
    const { data: teachers, error: tError } = await supabase
        .from('ef_teachers')
        .select('*')
        .ilike('name', '%EUNICE%');

    if (tError) {
        console.error("Erro ao buscar professores:", tError.message);
        return;
    }

    console.log(`Professores encontrados: ${teachers.length}`);
    console.log(JSON.stringify(teachers, null, 2));

    if (teachers.length > 0) {
        for (const teacher of teachers) {
            console.log(`\nBuscando classes para: ${teacher.name} (ID: ${teacher.id})`);
            const { data: classes, error: cError } = await supabase
                .from('ef_classes')
                .select('*')
                .eq('teacher_id', teacher.id);

            if (cError) {
                console.error(`Erro ao buscar classes para ${teacher.name}:`, cError.message);
            } else {
                console.log(`Classes (${classes.length}):`);
                console.log(JSON.stringify(classes.map(c => ({ id: c.id, name: c.name, grade: c.grade })), null, 2));
            }
        }
    }
}

inspectTeachersAndClasses();
