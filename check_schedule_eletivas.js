import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wkmjoeoankucnhhanbqj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbWpvZW9hbmt1Y25oaGFuYnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzA2OTMsImV4cCI6MjA4NjY0NjY5M30.lCcKfDP-Zv56VtXxXtdaNjspO8FidkqIryd0ssdQYsM';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function check() {
    console.log('=== VERIFICANDO ELETIVA E OUTRAS DISCIPLINAS NO CRONOGRAMA SEMANAL (ef_schedule) ===');
    const { data: schedule, error } = await supabase
        .from('ef_schedule')
        .select('*');
        
    if (error) {
        console.error(error);
        return;
    }
    
    // Find all schedule entries for ELETIVA
    const eletivas = schedule.filter(s => s.discipline.toUpperCase().includes('ELETIV'));
    console.log('\n--- Todas as Eletivas no Cronograma Semanal ---');
    eletivas.forEach(s => {
        console.log(`- [${s.day_of_week}] Slot ${s.slot_number} - Turma: ${s.class_group} - Disciplina: ${s.discipline} -> Professor no Cronograma: ${s.teacher_name}`);
    });
}

check();
