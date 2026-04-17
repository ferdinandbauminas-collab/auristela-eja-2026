import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function finalCheckWesley() {
    const today = '2026-03-03';
    const teacherName = 'WESLEY';

    console.log('--- BUSCANDO HORÁRIO ---');
    const { data: schedule, error: sError } = await supabase
        .from('ef_schedule')
        .select('*')
        .ilike('teacher_name', `%${teacherName}%`)
        .eq('day_of_week', 'Terça-feira');

    if (sError) console.error('Erro Horário:', sError);
    else console.log('Aulas de Hoje:', JSON.stringify(schedule, null, 2));

    console.log('\n--- BUSCANDO QUALQUER FREQUÊNCIA DE WESLEY HOJE ---');
    const { data: attendance, error: aError } = await supabase
        .from('ef_attendance')
        .select('teacher_name, class_name, discipline, date')
        .ilike('teacher_name', `%${teacherName}%`)
        .eq('date', today);

    if (aError) console.error('Erro Frequência:', aError);
    else if (attendance.length === 0) console.log('Nenhuma frequência encontrada para o nome WESLEY hoje.');
    else console.log('Frequências encontradas:', JSON.stringify(attendance, null, 2));

    console.log('\n--- VERIFICANDO SE ALGUM OUTRO PROFESSOR LANÇOU A DISCIPLINA MATEMÁTICA HOJE ---');
    const { data: mathAttendance, error: mError } = await supabase
        .from('ef_attendance')
        .select('teacher_name, class_name, discipline')
        .eq('discipline', 'MATEMÁTICA')
        .eq('date', today);

    if (mError) console.error('Erro Matemática:', mError);
    else if (mathAttendance.length === 0) console.log('Ninguém lançou MATEMÁTICA hoje.');
    else console.log('Lançamentos de MATEMÁTICA:', JSON.stringify(mathAttendance, null, 2));
}

finalCheckWesley();
