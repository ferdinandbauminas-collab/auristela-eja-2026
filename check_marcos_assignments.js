import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMarcos() {
    const teacherName = 'MARCOS';

    console.log('--- BUSCANDO ATRIBUIÇÕES DO PROFESSOR MARCOS ---');
    const { data, error } = await supabase
        .from('ef_schedule')
        .select('class_group, discipline, day_of_week')
        .ilike('teacher_name', `%${teacherName}%`);

    if (error) {
        console.error('Erro:', error);
        return;
    }

    if (data.length === 0) {
        console.log('Nenhuma atribuição encontrada para MARCOS no banco de dados.');
        return;
    }

    const assignments = {};
    data.forEach(d => {
        const key = `${d.class_group} - ${d.discipline}`;
        if (!assignments[key]) {
            assignments[key] = new Set();
        }
        assignments[key].add(d.day_of_week);
    });

    for (const [assignment, days] of Object.entries(assignments)) {
        console.log(`${assignment} | Dias: ${Array.from(days).join(', ')}`);
    }
}

checkMarcos();
