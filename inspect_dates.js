
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wkmjoeoankucnhhanbqj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbWpvZW9hbmt1Y25oaGFuYnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzA2OTMsImV4cCI6MjA4NjY0NjY5M30.lCcKfDP-Zv56VtXxXtdaNjspO8FidkqIryd0ssdQYsM';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkDates() {
    const { data: records, error } = await supabase
        .from('ef_attendance')
        .select('date, student_name, teacher_name, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

    if (error) {
        console.error(error);
        return;
    }

    console.log('Últimos 10 registros por ordem de CRIAÇÃO:');
    records.forEach(r => {
        console.log(`Data: ${r.date} | Criado em: ${r.created_at} | Professor: ${r.teacher_name}`);
    });
}

checkDates();
