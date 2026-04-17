import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function renameDiscipline() {
    console.log('--- INICIANDO RENOMEAÇÃO DE DISCIPLINA ---');
    console.log('Alvo: "Lógica de Programação" -> "PROGRAMAÇÃO PARA COMPUTADORES"');

    // 1. Atualizar ef_classes
    console.log('\nAtualizando ef_classes...');
    const { data: classesUpdate, error: classesError } = await supabase
        .from('ef_classes')
        .update({ name: 'PROGRAMAÇÃO PARA COMPUTADORES' })
        .or('name.ilike.LÓGICA DE PROGRAMAÇÃO,name.ilike.LOGICA DE PROGRAMAÇÃO')
        .select();

    if (classesError) {
        console.error('Erro ao atualizar ef_classes:', classesError.message);
    } else {
        console.log(`Sucesso: ${classesUpdate.length} registros atualizados em ef_classes.`);
        if (classesUpdate.length > 0) {
            classesUpdate.forEach(c => console.log(`  - [${c.grade}] ${c.name}`));
        }
    }

    // 2. Atualizar ef_schedule
    console.log('\nAtualizando ef_schedule...');
    const { data: scheduleUpdate, error: scheduleError } = await supabase
        .from('ef_schedule')
        .update({ discipline: 'PROGRAMAÇÃO PARA COMPUTADORES' })
        .or('discipline.ilike.LÓGICA DE PROGRAMAÇÃO,discipline.ilike.LOGICA DE PROGRAMAÇÃO')
        .select();

    if (scheduleError) {
        console.error('Erro ao atualizar ef_schedule:', scheduleError.message);
    } else {
        console.log(`Sucesso: ${scheduleUpdate.length} registros atualizados em ef_schedule.`);
        if (scheduleUpdate.length > 0) {
            scheduleUpdate.forEach(s => console.log(`  - [${s.class_group}] ${s.discipline}`));
        }
    }

    console.log('\n--- VERIFICAÇÃO FINAL ---');
    const { data: finalCheck } = await supabase
        .from('ef_schedule')
        .select('discipline')
        .or('discipline.ilike.LÓGICA DE PROGRAMAÇÃO,discipline.ilike.LOGICA DE PROGRAMAÇÃO');

    if (finalCheck && finalCheck.length === 0) {
        console.log('Nenhuma ocorrência de "Lógica de Programação" encontrada. Operação concluída com sucesso.');
    } else {
        console.log(`AVISO: Ainda existem ${finalCheck?.length} registros com o nome antigo.`);
    }
}

renameDiscipline();
