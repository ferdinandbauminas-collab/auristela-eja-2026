import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wkmjoeoankucnhhanbqj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbWpvZW9hbmt1Y25oaGFuYnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzA2OTMsImV4cCI6MjA4NjY0NjY5M30.lCcKfDP-Zv56VtXxXtdaNjspO8FidkqIryd0ssdQYsM';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function findLostRecords() {
    console.log("--- Procurando chamadas do dia 10/03 ---");

    // Vamos buscar TODOS os professores que registraram aula no dia 10/03
    const { data: attendance, error } = await supabase
        .from('ef_attendance')
        .select('teacher_name, class_name, discipline')
        .eq('date', '2026-03-10');

    if (error) {
        console.error("Erro na busca", error);
        return;
    }

    // Agrupar professores únicos que lançaram no dia 10
    const recordsMap = new Set();
    attendance.forEach(a => {
        recordsMap.add(`${a.teacher_name} | Turma: ${a.class_name} | Disc: ${a.discipline}`);
    });

    console.log(`Encontrados ${attendance.length} registros individuais de alunos no dia 10/03.\\n`);
    console.log("Aulas listadas por PROFESSOR | TURMA | DISCIPLINA nesse dia:");
    Array.from(recordsMap).sort().forEach(r => console.log(`- ${r}`));
    
    // Vamos fazer uma busca ampla só por precaução: tem algum lançamento na vida da Francineuda?
    const { data: anyFrancine, error: err2 } = await supabase
        .from('ef_attendance')
        .select('date, class_name, discipline')
        .ilike('teacher_name', '%FRANCI%');
        
    console.log(`\\n--- Buscando qualquer coisa com 'FRANCI' no nome em toda a base ---`);
    if(anyFrancine && anyFrancine.length > 0) {
        const anyMap = new Set();
        anyFrancine.forEach(a => anyMap.add(`Data: ${a.date} | Turma: ${a.class_name} | Disc: ${a.discipline}`));
        Array.from(anyMap).forEach(r => console.log(`- ${r}`));
    } else {
        console.log("Nenhum lançamento encontrado em toda a base de 2026 com um professor chamado 'FRANCI...'");
    }
}

findLostRecords();
