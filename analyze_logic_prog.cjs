
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
    try {
        console.log('--- RESUMO DAS DISCIPLINAS ENVOLVIDAS ---');

        const { data: teachers } = await supabase.from('ef_teachers').select('*');
        const { data: schedule } = await supabase.from('ef_schedule').select('*');
        const { data: classes } = await supabase.from('ef_classes').select('*');

        const keywords = ['LÓGICA', 'LÓG', 'LOGICA', 'PROGRAMAÇÃO PARA COMPUTADORES', 'PROGRAMAÇÃO DE COMPUTADORES', 'ANALISE', 'ANAL.'];

        console.log('\n>> Em ef_schedule:');
        schedule.forEach(s => {
            const hasKeyword = keywords.some(k => s.discipline.toUpperCase().includes(k));
            if (hasKeyword && !s.discipline.toUpperCase().includes('DESENVOLVIMENTO')) { // skip PROJETO DE DESENVOLVIMENTO
                console.log(`- ${s.discipline} (${s.class_group}) [${s.day_of_week}, Slot ${s.slot_number}] -> ${s.teacher_name}`);
            }
        });

        console.log('\n>> Em ef_classes:');
        classes.forEach(c => {
            const hasKeyword = keywords.some(k => c.name.toUpperCase().includes(k));
            if (hasKeyword && !c.name.toUpperCase().includes('DESENVOLVIMENTO')) {
                const t = teachers.find(t => t.id === c.teacher_id);
                console.log(`- ${c.name} (${c.grade}) -> ${t ? t.name : 'N/A'}`);
            }
        });

    } catch (e) {
        console.error('Erro:', e.message);
    }
}

run();
