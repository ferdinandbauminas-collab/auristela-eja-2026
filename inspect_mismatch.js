import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function inspectNames() {
    console.log("--- INSPEÇÃO DE NOMES DE TURMAS ---");

    const { data: classes } = await supabase.from('ef_classes').select('grade').limit(10);
    console.log("Turmas em ef_classes (grade):", [...new Set(classes?.map(c => c.grade))]);

    const { data: students } = await supabase.from('ef_students').select('class_id').limit(10);
    console.log("Turmas em ef_students (class_id):", [...new Set(students?.map(s => s.class_id))]);
}

inspectNames();
