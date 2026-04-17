
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
    console.log('--- VERIFICANDO QUEM LECIONA PROGRAMAÇÃO PARA COMPUTADORES ---');
    const { data: classes } = await supabase.from('ef_classes').select('name, grade, teacher_id').ilike('name', 'PROGRAMAÇÃO PARA COMPUTADORES');
    if (!classes || classes.length === 0) {
        console.log('Nenhuma classe encontrada com esse nome.');
        return;
    }
    for (const c of classes) {
        const { data: teacher } = await supabase.from('ef_teachers').select('name').eq('id', c.teacher_id).single();
        console.log(`- ${c.name} (${c.grade}) -> Professor: ${teacher ? teacher.name : "N/A"}`);
    }
}
run();
