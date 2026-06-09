import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wkmjoeoankucnhhanbqj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbWpvZW9hbmt1Y25oaGFuYnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzA2OTMsImV4cCI6MjA4NjY0NjY5M30.lCcKfDP-Zv56VtXxXtdaNjspO8FidkqIryd0ssdQYsM';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function check() {
    const id = '9ab8a91e-28d8-4bab-8bc5-67821141f518'; // MARCOS AURÉLIO
    const { data: classes, error } = await supabase
        .from('ef_classes')
        .select('*')
        .eq('teacher_id', id);
        
    if (error) {
        console.error(error);
    } else {
        console.log('Classes para MARCOS AURÉLIO no Banco:', classes.map(c => `${c.name} (${c.grade})`));
    }
}

check();
