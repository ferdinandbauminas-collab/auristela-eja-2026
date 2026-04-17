
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
    try {
        console.log('--- BUSCANDO A DISCIPLINA PROGRAMAÇÃO DE COMPUTADORES ---');
        
        // Buscar em ef_classes
        const { data: classes, error: cErr } = await supabase
            .from('ef_classes')
            .select('name, grade, teacher_id')
            .ilike('name', '%Programação de Computadores%');
        
        if (cErr) throw cErr;
        
        if (classes && classes.length > 0) {
            console.log('Encontrada em ef_classes:');
            for (const c of classes) {
                const { data: teacher } = await supabase
                    .from('ef_teachers')
                    .select('name')
                    .eq('id', c.teacher_id)
                    .single();
                console.log(`- ${c.name} (${c.grade}) -> Professor: ${teacher ? teacher.name : 'N/A'}`);
            }
        } else {
            console.log('Não encontrada em ef_classes.');
        }

        // Buscar em ef_schedule
        const { data: schedule, error: sErr } = await supabase
            .from('ef_schedule')
            .select('discipline, class_group, teacher_name')
            .ilike('discipline', '%Programação de Computadores%');
        
        if (sErr) throw sErr;
        
        if (schedule && schedule.length > 0) {
            console.log('\nEncontrada no ef_schedule:');
            for (const s of schedule) {
                console.log(`- ${s.discipline} (${s.class_group}) -> Professor: ${s.teacher_name}`);
            }
        } else {
            console.log('\nNão encontrada no ef_schedule.');
        }

        // Listar todas as disciplinas que contêm "PROGRAMAÇÃO" para ver as variantes
        console.log('\n--- VARIANTES DE PROGRAMAÇÃO NO BANCO ---');
        const { data: allDiscs } = await supabase.from('ef_classes').select('name');
        const progs = [...new Set(allDiscs.map(d => d.name))].filter(n => n.includes('PROGRAMAÇÃO'));
        console.log('Variantes encontradas:', progs);

    } catch (e) {
        console.error('Erro:', e.message);
    }
}

run();
