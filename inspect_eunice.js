import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectEunice() {
    console.log("Inspecionando disciplinas da Professora Maria Eunice...");

    // Maria Eunice ID from migrate_2026.sql: 5b03a636-be5c-47c1-a4ca-9ff9610a3882
    const teacherId = '5b03a636-be5c-47c1-a4ca-9ff9610a3882';

    const { data, error } = await supabase
        .from('ef_classes')
        .select('*')
        .eq('teacher_id', teacherId);

    if (error) {
        console.error("Erro ao buscar classes:", error.message);
        return;
    }

    console.log(`\nEncontradas ${data.length} classes para Maria Eunice.`);
    console.table(data.map(c => ({
        id: c.id,
        name: c.name,
        grade: c.grade
    })));

    const teacherData = await supabase
        .from('ef_teachers')
        .select('*')
        .eq('id', teacherId)
        .single();

    console.log("\nDados do Professor:");
    console.log(JSON.stringify(teacherData.data, null, 2));
}

inspectEunice();
