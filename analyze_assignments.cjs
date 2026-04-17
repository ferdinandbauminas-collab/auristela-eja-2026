
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
    try {
        console.log('--- BUSCANDO DISCIPLINAS ESPECÍFICAS ---');

        const { data: classes, error: cErr } = await supabase.from('ef_classes').select('name, teacher_id');
        if (cErr) throw cErr;

        const uniqueClasses = [...new Set(classes.map(d => d.name))];
        console.log('Disciplinas em ef_classes:', uniqueClasses.filter(n => n.includes('LÓGICA') || n.includes('PROGRAMAÇÃO')));

        const { data: schedule, error: sErr } = await supabase.from('ef_schedule').select('discipline, teacher_name');
        if (sErr) throw sErr;

        const uniqueSched = [...new Set(schedule.map(s => s.discipline))];
        console.log('\nDisciplinas em ef_schedule:', uniqueSched.filter(n => n.includes('LÓGICA') || n.includes('PROGRAMAÇÃO') || n.includes('ANAL.')));

        console.log('\n--- DETALHES DO MARCOS ---');
        const { data: marcos } = await supabase.from('ef_teachers').select('id, name').ilike('name', '%MARCOS%').single();
        if (marcos) {
            const marcosClasses = classes.filter(c => c.teacher_id === marcos.id);
            console.log('Classes do Marcos:', marcosClasses.map(c => c.name));
        }

        console.log('\n--- QUEM TEM PROGRAMAÇÃO PARA COMPUTADORES? ---');
        const progComp = classes.filter(c => c.name === 'PROGRAMAÇÃO PARA COMPUTADORES');
        for (const c of progComp) {
            const { data: t } = await supabase.from('ef_teachers').select('name').eq('id', c.teacher_id).single();
            console.log(`- ${c.name} -> Professor: ${t ? t.name : 'N/A'}`);
        }

    } catch (e) {
        console.error('Erro:', e.message);
    }
}

run();
