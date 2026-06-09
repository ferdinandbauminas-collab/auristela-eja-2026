import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wkmjoeoankucnhhanbqj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbWpvZW9hbmt1Y25oaGFuYnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzA2OTMsImV4cCI6MjA4NjY0NjY5M30.lCcKfDP-Zv56VtXxXtdaNjspO8FidkqIryd0ssdQYsM';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function check() {
    console.log('=== BUSCANDO TODOS OS PROFESSORES QUE CONTÊM DENILSON ===');
    const { data: teachers, error: tError } = await supabase
        .from('ef_teachers')
        .select('*');
    
    if (tError) {
        console.error('Erro ao buscar professores:', tError);
        return;
    }
    
    const denilsons = teachers.filter(t => t.name.toUpperCase().includes('DENILSON'));
    console.log('Todos os "Denilson" no banco:', denilsons);
    
    for (const d of denilsons) {
        const { data: classes } = await supabase
            .from('ef_classes')
            .select('*')
            .eq('teacher_id', d.id);
        console.log(`\nTurmas para ID ${d.id} (${d.name}):`, classes.map(c => `${c.name} - ${c.grade}`));
    }
}

check();
