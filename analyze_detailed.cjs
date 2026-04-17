
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
    let retries = 3;
    while (retries > 0) {
        try {
            console.log(`--- ANALISANDO ATRIBUIÇÕES (Tentativa ${4 - retries}) ---`);

            const { data: teachers } = await supabase.from('ef_teachers').select('*');
            const marcos = teachers.find(t => t.name.includes('MARCOS'));
            const denilson = teachers.find(t => t.name.includes('DENILSON'));

            console.log('ID Marcos:', marcos?.id);
            console.log('ID Denilson:', denilson?.id);

            const { data: classes } = await supabase.from('ef_classes').select('*');

            console.log('\n--- ATRIBUIÇÕES EM ef_classes ---');
            classes.forEach(c => {
                const tName = teachers.find(t => t.id === c.teacher_id)?.name || 'N/A';
                if (c.name.includes('LÓGICA') || c.name.includes('PROGRAMAÇÃO') || c.name.includes('ANAL.')) {
                    console.log(`- ${c.name} (${c.grade}) -> ${tName}`);
                }
            });

            console.log('\n--- ATRIBUIÇÕES EM ef_schedule ---');
            const { data: schedule } = await supabase.from('ef_schedule').select('*');
            schedule.forEach(s => {
                if (s.discipline.includes('LÓGICA') || s.discipline.includes('PROGRAMAÇÃO') || s.discipline.includes('ANAL.')) {
                    if (s.teacher_name.includes('MARCOS') || s.teacher_name.includes('DENILSON') || s.teacher_name.includes('VAGO')) {
                        console.log(`- ${s.discipline} (${s.class_group}) [${s.day_of_week}, Slot ${s.slot_number}] -> ${s.teacher_name}`);
                    }
                }
            });

            return;
        } catch (e) {
            console.error('Erro na tentativa:', e.message);
            retries--;
            if (retries > 0) await new Promise(r => setTimeout(r, 2000));
        }
    }
    console.error('Falha após todas as tentativas.');
}

run();
