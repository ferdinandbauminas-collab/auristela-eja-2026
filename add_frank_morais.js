import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function addStudent() {
    console.log("Adicionando Frank Marques Morais à turma MÓDULO ALTE IA (sem RA)...");

    const { data, error } = await supabase
        .from('ef_students')
        .insert([
            {
                name: 'FRANK MARQUES MORAIS',
                class_id: 'MÓDULO ALTE IA'
            }
        ]);

    if (error) {
        console.error("Erro ao inserir aluno:", error.message);
        return;
    }

    console.log("Sucesso! Frank Marques Morais foi adicionado.");
}

addStudent();
