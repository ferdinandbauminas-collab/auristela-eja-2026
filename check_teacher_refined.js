import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function findTeacher() {
    console.log('--- BUSCANDO PROFESSOR FRANCISCO JR ---');

    // 1. Buscar em ef_teachers (se existir)
    try {
        const { data, error } = await supabase
            .from('ef_teachers')
            .select('*')
            .ilike('name', '%Francisco%');

        if (!error && data && data.length > 0) {
            console.log('\nResultados em ef_teachers:');
            data.forEach(t => console.log(`ID: ${t.id} | Nome: ${t.name}`));
        }
    } catch (e) { }

    // 2. Buscar em ef_schedule
    try {
        const { data, error } = await supabase
            .from('ef_schedule')
            .select('teacher_name, discipline, class_group')
            .ilike('teacher_name', '%Francisco%');

        if (!error && data && data.length > 0) {
            console.log('\nResultados em ef_schedule:');
            const unique = new Set();
            data.forEach(row => {
                const line = `${row.teacher_name} -> ${row.discipline} (${row.class_group})`;
                if (!unique.has(line)) {
                    console.log(line);
                    unique.add(line);
                }
            });
        }
    } catch (e) { }

    // 3. Buscar em ef_attendance
    try {
        const { data, error } = await supabase
            .from('ef_attendance')
            .select('teacher_name, discipline, class_name')
            .ilike('teacher_name', '%Francisco%');

        if (!error && data && data.length > 0) {
            console.log('\nResultados em ef_attendance:');
            const unique = new Set();
            data.forEach(row => {
                const line = `${row.teacher_name} -> ${row.discipline} (${row.class_name})`;
                if (!unique.has(line)) {
                    console.log(line);
                    unique.add(line);
                }
            });
        }
    } catch (e) { }
}

findTeacher();
