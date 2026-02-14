import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
    console.log("Tentando inserção mínima em ef_classes...");

    // Tenta inserir sem a coluna 'classes'
    const { data, error } = await supabase
        .from('ef_classes')
        .insert({
            id: '00000000-0000-0000-0000-000000000000',
            name: 'TESTE',
            teacher_id: '56043d65-2f59-409e-821a-68843838bc79' // ID do primeiro professor do migrate_2026.sql
        })
        .select();

    if (error) {
        console.log("Falha na inserção mínima:", error.message);
    } else {
        console.log("Sucesso! Inserção mínima funcionou. Colunas retornadas:", Object.keys(data[0]));
    }
}

testInsert();
