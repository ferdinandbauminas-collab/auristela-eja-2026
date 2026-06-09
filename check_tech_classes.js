import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wkmjoeoankucnhhanbqj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbWpvZW9hbmt1Y25oaGFuYnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzA2OTMsImV4cCI6MjA4NjY0NjY5M30.lCcKfDP-Zv56VtXxXtdaNjspO8FidkqIryd0ssdQYsM';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function check() {
    const { data: classes, error: cErr } = await supabase.from('ef_classes').select('*');
    const { data: teachers, error: tErr } = await supabase.from('ef_teachers').select('*');
    
    if (cErr || tErr) {
        console.error(cErr || tErr);
        return;
    }
    
    const teacherMap = {};
    teachers.forEach(t => {
        teacherMap[t.id] = t.name;
    });

    const targetGrades = ['MÓDULO INFO IA', 'MÓDULO INFO IIIA', 'MÓDULO INFO IIIB', 'MÓDULO INFO VD'];
    const filtered = classes.filter(c => targetGrades.includes(c.grade));
    
    console.log('=== CLASSES DE TI / INFO NO BANCO ===');
    filtered.sort((a,b) => a.grade.localeCompare(b.grade) || a.name.localeCompare(b.name)).forEach(c => {
        console.log(`[${c.grade}] - ${c.name} -> Professor: ${teacherMap[c.teacher_id] || 'NULL'} (ID: ${c.teacher_id})`);
    });
}

check();
