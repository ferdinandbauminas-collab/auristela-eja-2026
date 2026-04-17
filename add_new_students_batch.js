import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function addNewStudents() {
    const studentsToAdd = [
        { name: 'ANNA VITÓRIA CHANTAL', class_id: 'MÓDULO INFO IA' },
        { name: 'DHENNYFER EMILIA DA SILVA SOUSA', class_id: 'MÓDULO INFO IA' }
    ];

    console.log("Iniciando inserção de novos alunos no Supabase...");

    const { data, error } = await supabase
        .from('ef_students')
        .insert(studentsToAdd)
        .select();

    if (error) {
        console.error("Erro ao inserir alunos:", error.message);
        return;
    }

    console.log("Sucesso! Alunos adicionados:");
    console.log(JSON.stringify(data, null, 2));
}

addNewStudents();
