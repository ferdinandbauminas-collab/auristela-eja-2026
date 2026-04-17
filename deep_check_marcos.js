import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function deepCheckMarcos() {
    console.log('--- BUSCANDO PROFESSOR MARCOS EM ef_teachers ---');
    const { data: teachers, error: tErr } = await supabase
        .from('ef_teachers')
        .select('*')
        .ilike('name', '%MARCOS%');

    if (tErr) {
        console.error('Erro ao buscar professores:', tErr);
        return;
    }

    console.log('Professores encontrados:', teachers);

    if (teachers.length === 0) {
        console.log('Nenhum professor MARCOS encontrado.');
        return;
    }

    for (const teacher of teachers) {
        console.log(`\n--- ATRIBUIÇÕES PARA ${teacher.name} (${teacher.id}) ---`);

        console.log('Buscando em ef_classes...');
        const { data: classes, error: cErr } = await supabase
            .from('ef_classes')
            .select('*')
            .eq('teacher_id', teacher.id);

        if (cErr) console.error('Erro em ef_classes:', cErr);
        else console.log('Classes:', classes);

        console.log('Buscando em ef_schedule...');
        const { data: schedule, error: sErr } = await supabase
            .from('ef_schedule')
            .select('*')
            .ilike('teacher_name', `%${teacher.name}%`); // Buscando por nome também para garantir

        if (sErr) console.error('Erro em ef_schedule:', sErr);
        else console.log('Schedule:', schedule.length, 'registros');

        if (schedule) {
            const summary = {};
            schedule.forEach(s => {
                const key = `${s.class_group} - ${s.discipline}`;
                summary[key] = (summary[key] || 0) + 1;
            });
            console.log('Sumário Schedule:', summary);
        }
    }
}

deepCheckMarcos();
