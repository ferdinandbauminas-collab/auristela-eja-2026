import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function findNewStudents() {
    // 1. Extrair do TXT
    const content = fs.readFileSync('RELATORIO_ALUNOS_2026.txt', 'utf8');
    const lines = content.split('\n');
    let currentTurma = '';
    const txtStudents = [];
    lines.forEach(line => {
        if (line.startsWith('TURMA:')) {
            currentTurma = line.replace('TURMA:', '').split('(')[0].trim();
        } else if (line.match(/^\d+\./)) {
            const name = line.replace(/^\d+\.\s*/, '').trim();
            txtStudents.push({ name, class_id: currentTurma });
        }
    });

    // 2. Buscar do Supabase
    let dbStudents = [];
    let from = 0;
    while (true) {
        const { data, error } = await supabase.from('ef_students').select('name, class_id').range(from, from + 999);
        if (error || !data || data.length === 0) break;
        dbStudents = dbStudents.concat(data);
        from += 1000;
    }

    // 3. Comparar
    const dbSet = new Set(dbStudents.map(s => `${s.name}|${s.class_id}`));
    const newStudents = txtStudents.filter(s => !dbSet.has(`${s.name}|${s.class_id}`));

    console.log("ALUNOS NOVOS ENCONTRADOS (No TXT mas não no DB):");
    console.log(JSON.stringify(newStudents, null, 2));
}

findNewStudents();
