import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://wkmjoeoankucnhhanbqj.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbWpvZW9hbmt1Y25oaGFuYnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzA2OTMsImV4cCI6MjA4NjY0NjY5M30.lCcKfDP-Zv56VtXxXtdaNjspO8FidkqIryd0ssdQYsM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectRecords() {
    console.log("Listando registros de 16/02/2026...");
    
    const { data, error } = await supabase
        .from('ef_attendance')
        .select('*')
        .eq('date', '2026-02-16')
        .order('created_at', { ascending: true });

    if (error) {
        console.error("Erro ao buscar dados:", error.message);
        return;
    }

    console.log(`\nEncontrados ${data.length} registros para hoje.`);
    
    const summary = data.reduce((acc, d) => {
        const key = `${d.teacher_name} - ${d.discipline}`;
        if (!acc[key]) acc[key] = 0;
        acc[key]++;
        return acc;
    }, {});

    console.log("\nResumo por Professor e Disciplina:");
    console.log(JSON.stringify(summary, null, 2));

    console.log("\nPrimeiros 5 registros detalhados:");
    console.log(JSON.stringify(data.slice(0, 5).map(d => ({
        id: d.id,
        prof: d.teacher_name,
        disc: d.discipline,
        aluno: d.student_name,
        criado_em: d.created_at
    })), null, 2));
}

inspectRecords();
