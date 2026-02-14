import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectConstraints() {
    try {
        console.log("--- INSPEÇÃO DE CONSTRAINTS ---");
        // Consulta para listar chaves estrangeiras no PostgreSQL
        const sql = `
            SELECT
                conname AS constraint_name,
                conrelid::regclass AS table_name,
                a.attname AS column_name,
                confrelid::regclass AS foreign_table_name,
                af.attname AS foreign_column_name
            FROM
                pg_constraint AS c
                JOIN pg_attribute AS a ON a.attrelid = c.conrelid AND a.attnum = ANY(c.conkey)
                JOIN pg_attribute AS af ON af.attrelid = c.confrelid AND af.attnum = ANY(c.confkey)
            WHERE
                c.contype = 'f' AND conrelid::regclass::text LIKE 'ef_%';
        `;

        // Infelizmente o supabase-js não permite rodar SQL arbitrário facilmente sem uma RPC.
        // Vou tentar através do OpenAPI de novo se ele mostra as referências, 
        // ou sugerir um script SQL de "limpeza de constraints" para o usuário.

        console.log("Dica: Use o SQL EDITOR do Supabase para rodar:");
        console.log("ALTER TABLE ef_students DROP CONSTRAINT IF EXISTS ef_students_class_id_fkey;");
    } catch (e) {
        console.log("Erro:", e.message);
    }
}

inspectConstraints();
