import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wkmjoeoankucnhhanbqj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbWpvZW9hbmt1Y25oaGFuYnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzA2OTMsImV4cCI6MjA4NjY0NjY5M30.lCcKfDP-Zv56VtXxXtdaNjspO8FidkqIryd0ssdQYsM';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function check() {
    const idToUpdate = '3245c7a3-f5fd-4179-bf1d-ba058ebaa5f7'; // Eletiva IIIB Denilson duplicate
    const { data, error } = await supabase
        .from('ef_classes')
        .update({ teacher_id: null })
        .eq('id', idToUpdate)
        .select();
        
    if (error) {
        console.error(error);
    } else {
        console.log('Dados após update para null:', data);
    }
}

check();
