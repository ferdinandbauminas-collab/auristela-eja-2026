import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function renameFinal() {
    console.log('=== EXECUÇÃO FINAL DE RENOMEAÇÃO ===');

    const namesToFind = ['LÓGICA DE PROGRAMAÇÃO', 'LOGICA DE PROGRAMAÇÃO', 'Lógica de Programação'];

    // --- EF_CLASSES ---
    console.log('\n--- Verificando ef_classes ---');
    const { data: classes } = await supabase.from('ef_classes').select('*');
    const targetClasses = classes?.filter(c => namesToFind.some(n => c.name.toUpperCase() === n.toUpperCase())) || [];

    console.log(`Encontradas ${targetClasses.length} ocorrências em ef_classes.`);
    for (const c of targetClasses) {
        console.log(`Atualizando ID ${c.id}: "${c.name}" -> "PROGRAMAÇÃO PARA COMPUTADORES"`);
        const { error } = await supabase.from('ef_classes').update({ name: 'PROGRAMAÇÃO PARA COMPUTADORES' }).eq('id', c.id);
        if (error) console.error(`Erro no ID ${c.id}:`, error.message);
    }

    // --- EF_SCHEDULE ---
    console.log('\n--- Verificando ef_schedule ---');
    const { data: schedule } = await supabase.from('ef_schedule').select('*');
    const targetSchedule = schedule?.filter(s => s.discipline && namesToFind.some(n => s.discipline.toUpperCase() === n.toUpperCase())) || [];

    console.log(`Encontradas ${targetSchedule.length} ocorrências em ef_schedule.`);
    for (const s of targetSchedule) {
        console.log(`Atualizando ID ${s.id}: "${s.discipline}" [${s.class_group}] -> "PROGRAMAÇÃO PARA COMPUTADORES"`);
        const { error } = await supabase.from('ef_schedule').update({ discipline: 'PROGRAMAÇÃO PARA COMPUTADORES' }).eq('id', s.id);
        if (error) console.error(`Erro no ID ${s.id}:`, error.message);
    }

    console.log('\n=== CONCLUSÃO ===');
}

renameFinal();
