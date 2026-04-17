import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function findTeacher() {
    console.log('--- BUSCANDO PROFESSOR FRANCISCO OU JR ---');

    // Busca no cronograma
    const { data: scheduleData, error: scheduleError } = await supabase
        .from('ef_schedule')
        .select('teacher_name, discipline, class_group')
        .or('teacher_name.ilike.%Francisco%,teacher_name.ilike.%Jr%');

    if (scheduleError) {
        console.error('Erro no cronograma:', scheduleError);
    } else {
        console.log('\nResultados no Cronograma (ef_schedule):');
        if (scheduleData && scheduleData.length > 0) {
            scheduleData.forEach(row => {
                console.log(`Professor: ${row.teacher_name} | Disciplina: ${row.discipline} | Turma: ${row.class_group}`);
            });
        } else {
            console.log('Nenhum resultado encontrado.');
        }
    }

    // Busca na frequência
    const { data: attendanceData, error: attendanceError } = await supabase
        .from('ef_attendance')
        .select('teacher_name, discipline, class_group')
        .or('teacher_name.ilike.%Francisco%,teacher_name.ilike.%Jr%');

    if (attendanceError) {
        console.error('Erro na frequência:', attendanceError);
    } else {
        console.log('\nResultados na Frequência (ef_attendance):');
        if (attendanceData && attendanceData.length > 0) {
            const unique = new Set();
            attendanceData.forEach(row => {
                const line = `Professor: ${row.teacher_name} | Disciplina: ${row.discipline} | Turma: ${row.class_group}`;
                if (!unique.has(line)) {
                    console.log(line);
                    unique.add(line);
                }
            });
        } else {
            console.log('Nenhum resultado encontrado.');
        }
    }
}

findTeacher();
