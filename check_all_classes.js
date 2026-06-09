import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wkmjoeoankucnhhanbqj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbWpvZW9hbmt1Y25oaGFuYnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzA2OTMsImV4cCI6MjA4NjY0NjY5M30.lCcKfDP-Zv56VtXxXtdaNjspO8FidkqIryd0ssdQYsM';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function check() {
    const { data: classes, error } = await supabase
        .from('ef_classes')
        .select('*');
        
    if (error) {
        console.error(error);
        return;
    }
    
    const { data: teachers } = await supabase
        .from('ef_teachers')
        .select('*');
        
    const teacherMap = {};
    teachers.forEach(t => {
        teacherMap[t.id] = t.name;
    });

    console.log('=== TODAS AS CLASSES NO BANCO ===');
    const sorted = classes.sort((a, b) => {
        if (a.grade !== b.grade) return a.grade.localeCompare(b.grade);
        return a.name.localeCompare(b.name);
    });
    
    sorted.forEach(c => {
        console.log(`[${c.grade}] - ${c.name} (Teacher: ${teacherMap[c.teacher_id] || 'NULL'}, ID: ${c.id})`);
    });
}

check();
