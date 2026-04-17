import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function findAllDuplicates() {
    console.log("Buscando duplicatas em ef_classes...");
    const { data: classes, error } = await supabase
        .from('ef_classes')
        .select('*, ef_teachers(name)')
        .order('teacher_id, grade, name');

    if (error) {
        console.error("Erro:", error.message);
        return;
    }

    const seen = new Map();
    const duplicates = [];

    for (const c of classes) {
        // Normalize name: lowercase and no accents if possible, but let's just use lowercase/trim
        const normalizedName = c.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
        const key = `${c.teacher_id}_${c.grade}_${normalizedName}`;

        if (seen.has(key)) {
            duplicates.push({
                teacher: c.ef_teachers?.name || c.teacher_id,
                grade: c.grade,
                original_name: c.name,
                duplicate_of: seen.get(key).name,
                id: c.id
            });
        } else {
            seen.set(key, c);
        }
    }

    if (duplicates.length > 0) {
        console.log(`Encontradas ${duplicates.length} duplicatas:`);
        console.table(duplicates);
    } else {
        console.log("Nenhuma duplicata encontrada.");
    }
}

findAllDuplicates();
