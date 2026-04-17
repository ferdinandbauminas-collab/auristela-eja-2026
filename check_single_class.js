import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSingleClass() {
    console.log('--- BUSCANDO TURMA ÚNICA DE FRANCISCO JR ---');

    // Busca todas as ocorrências de Francisco no cronograma
    const { data: scheduleData, error: scheduleError } = await supabase
        .from('ef_schedule')
        .select('teacher_name, discipline, class_group, day_of_week')
        .ilike('teacher_name', '%Francisco%');

    if (scheduleError) {
        console.error('Erro no cronograma:', scheduleError);
    } else {
        console.log('\nRegistros no Cronograma (ef_schedule):');
        scheduleData.forEach(row => {
            console.log(`- ${row.teacher_name} | ${row.discipline} | Turma: ${row.class_group} | Dia: ${row.day_of_week}`);
        });
    }

    // Busca na frequência para ver se há lançamentos em outras turmas
    const { data: attendanceData, error: attendanceError } = await supabase
        .from('ef_attendance')
        .select('teacher_name, discipline, class_name, date')
        .ilike('teacher_name', '%Francisco%');

    if (attendanceError) {
        console.error('Erro na frequência:', attendanceError);
    } else {
        console.log('\nÚltimos lançamentos na Frequência (ef_attendance):');
        const groups = {};
        attendanceData.forEach(row => {
            const key = `${row.class_name}`;
            if (!groups[key]) groups[key] = 0;
            groups[key]++;
        });

        for (const [group, count] of Object.entries(groups)) {
            console.log(`- Turma: ${group} | Lançamentos: ${count}`);
        }
    }
}

checkSingleClass();
