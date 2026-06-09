import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wkmjoeoankucnhhanbqj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbWpvZW9hbmt1Y25oaGFuYnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzA2OTMsImV4cCI6MjA4NjY0NjY5M30.lCcKfDP-Zv56VtXxXtdaNjspO8FidkqIryd0ssdQYsM';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function check() {
    console.log('=== BUSCANDO PROFESSOR DENILSON ===');
    const { data: teachers, error: tError } = await supabase
        .from('ef_teachers')
        .select('*')
        .ilike('name', '%denilson%');
    
    if (tError) {
        console.error('Erro ao buscar professor:', tError);
        return;
    }
    
    console.log('Professores encontrados:', teachers);
    
    if (teachers && teachers.length > 0) {
        for (const teacher of teachers) {
            console.log(`\n=== DISCIPLINAS/TURMAS PARA O TEACHER_ID: ${teacher.id} (${teacher.name}) ===`);
            const { data: classes, error: cError } = await supabase
                .from('ef_classes')
                .select('*')
                .eq('teacher_id', teacher.id);
                
            if (cError) {
                console.error('Erro ao buscar turmas/disciplinas:', cError);
            } else {
                console.log(JSON.stringify(classes, null, 2));
            }
        }
    }
}

check();
