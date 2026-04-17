import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function audit() {
    console.log("--- Auditoria de Alunos por Turma ---");

    // 1. Buscar todas as turmas
    const { data: classes, error: classesError } = await supabase
        .from('ef_classes')
        .select('id, name');

    if (classesError) {
        console.error("Erro ao buscar turmas:", classesError.message);
        return;
    }

    console.log(`Encontradas ${classes.length} turmas.\n`);

    // 2. Para cada turma, contar alunos e listar nomes
    for (const turma of classes) {
        const { data: students, error: studentsError, count } = await supabase
            .from('ef_students')
            .select('id, name', { count: 'exact' })
            .eq('class_id', turma.id);

        if (studentsError) {
            console.error(`Erro ao buscar alunos da turma ${turma.name}:`, studentsError.message);
            continue;
        }

        console.log(`Turma: ${turma.name} (ID: ${turma.id})`);
        console.log(`Total de alunos: ${count}`);
        if (students && students.length > 0) {
            // Mostrar os primeiros 5 para conferência rápida
            students.slice(0, 5).forEach(s => console.log(`  - ${s.name}`));
            if (students.length > 5) console.log(`  ... e mais ${students.length - 5} alunos.`);
        } else {
            console.log("  (Nenhum aluno vinculado)");
        }
        console.log("-----------------------------------");
    }

    // 3. Verificar alunos sem turma vinculada
    const { data: orphans, count: orphanCount } = await supabase
        .from('ef_students')
        .select('name', { count: 'exact' })
        .is('class_id', null);

    if (orphanCount > 0) {
        console.log(`AVISO: Encontrados ${orphanCount} alunos SEM TURMA vinculada!`);
        orphans.forEach(o => console.log(`  - ${o.name}`));
    } else {
        console.log("Excelente: Todos os alunos possuem uma turma vinculada.");
    }
}

audit();
