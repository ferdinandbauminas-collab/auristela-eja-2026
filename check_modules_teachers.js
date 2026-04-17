import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkModules() {
    const { data, error } = await supabase
        .from('ef_schedule')
        .select('class_group, discipline, teacher_name')
        .or('class_group.ilike.%MOD%IV%,class_group.ilike.%MOD%II%');

    if (error) {
        console.error(error);
        return;
    }

    const summary = {};
    data.forEach(d => {
        const key = `${d.class_group} - ${d.discipline}`;
        if (!summary[key]) summary[key] = new Set();
        summary[key].add(d.teacher_name);
    });

    console.log('--- ATRIBUIÇÕES NOS MÓDULOS IV E II ---');
    for (const [k, v] of Object.entries(summary)) {
        console.log(`${k} -> ${Array.from(v).join(', ')}`);
    }
}

checkModules();
