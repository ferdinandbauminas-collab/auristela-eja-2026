import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wkmjoeoankucnhhanbqj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbWpvZW9hbmt1Y25oaGFuYnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzA2OTMsImV4cCI6MjA4NjY0NjY5M30.lCcKfDP-Zv56VtXxXtdaNjspO8FidkqIryd0ssdQYsM';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function check() {
    const id = '39bb3cce-cd35-4d58-a126-0aca76aaa54d';
    const { data: teacher, error } = await supabase
        .from('ef_teachers')
        .select('*')
        .eq('id', id)
        .single();
        
    if (error) {
        console.log(`Erro ao buscar ID ${id}: ${error.message}`);
    } else {
        console.log(`Professor encontrado com ID ${id}:`, teacher);
        
        // Let's also see what classes are mapped to this ID
        const { data: classes } = await supabase
            .from('ef_classes')
            .select('*')
            .eq('teacher_id', id);
        console.log('Classes para ID:', classes);
    }
}

check();
