import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wkmjoeoankucnhhanbqj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbWpvZW9hbmt1Y25oaGFuYnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzA2OTMsImV4cCI6MjA4NjY0NjY5M30.lCcKfDP-Zv56VtXxXtdaNjspO8FidkqIryd0ssdQYsM';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function check() {
    console.log('=== VERIFICANDO O CRONOGRAMA SEMANAL (ef_schedule) ===');
    const { data: schedule, error } = await supabase
        .from('ef_schedule')
        .select('*')
        .ilike('teacher_name', '%denilson%');
        
    if (error) {
        console.error(error);
        return;
    }
    
    console.log(`Encontrados ${schedule.length} registros para Denilson no cronograma semanal.`);
    // Sort by day_of_week and slot_number
    const dayMap = { 'Segunda-feira': 1, 'Terça-feira': 2, 'Quarta-feira': 3, 'Quinta-feira': 4, 'Sexta-feira': 5, 'Sábado': 6 };
    const sorted = schedule.sort((a,b) => {
        if (a.day_of_week !== b.day_of_week) return (dayMap[a.day_of_week] || 9) - (dayMap[b.day_of_week] || 9);
        return a.slot_number - b.slot_number;
    });
    sorted.forEach(s => {
        console.log(`- [${s.day_of_week}] Horário/Slot ${s.slot_number} - Turma: ${s.class_group} - Disciplina: ${s.discipline}`);
    });
}

check();
