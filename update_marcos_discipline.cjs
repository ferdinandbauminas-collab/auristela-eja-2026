
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
// Precisamos usar as chaves corretas. Como vamos atualizar, talvez a anon_key (com RLS disable) funcione. 
// A conta anon do supabase geralmente permite insert/update se RLS estiver desativado. 
// Para garantir, vamos checar.
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    try {
        console.log('--- ATUALIZANDO DISCIPLINA DO PROFESSOR MARCOS ---');

        const { data: marcos, error: tErr } = await supabase.from('ef_teachers').select('id, name').ilike('name', '%MARCOS%').single();
        if (tErr) throw tErr;
        console.log(`Professor encontrado: ${marcos.name} (${marcos.id})`);

        // 1. Atualizar ef_classes
        const { data: classUpdate, error: cErr } = await supabase
            .from('ef_classes')
            .update({ name: 'PROGRAMAÇÃO PARA COMPUTADORES' })
            .eq('teacher_id', marcos.id)
            .ilike('name', '%LÓGICA DE PROGRAMAÇÃO%')
            .select();

        if (cErr) {
            console.error('Erro ao atualizar ef_classes:', cErr.message);
        } else {
            console.log(`Atualizado em ef_classes: ${classUpdate.length} registro(s).`);
            classUpdate.forEach(c => console.log(`  -> ${c.name} (${c.grade})`));
        }

        // 2. Atualizar ef_schedule
        const { data: scheduleUpdate, error: sErr } = await supabase
            .from('ef_schedule')
            .update({ discipline: 'PROGRAMAÇÃO PARA COMPUTADORES' })
            .ilike('teacher_name', '%MARCOS%')
            .ilike('discipline', '%LOGICA DE PROGRAMAÇÃO%')
            .select();

        if (sErr) {
            console.error('Erro ao atualizar ef_schedule:', sErr.message);
        } else {
            console.log(`Atualizado em ef_schedule: ${scheduleUpdate.length} registro(s).`);
            scheduleUpdate.forEach(s => console.log(`  -> ${s.discipline} (${s.class_group}) [${s.day_of_week}, Slot ${s.slot_number}]`));
        }

    } catch (e) {
        console.error('Erro geral:', e.message);
    }
}

run();
