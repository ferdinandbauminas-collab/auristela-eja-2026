import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wkmjoeoankucnhhanbqj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbWpvZW9hbmt1Y25oaGFuYnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzA2OTMsImV4cCI6MjA4NjY0NjY5M30.lCcKfDP-Zv56VtXxXtdaNjspO8FidkqIryd0ssdQYsM';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function update() {
    console.log('Tentando atualizar por ID: 691c895c-51f4-4083-8fe4-24f9a6638f53');
    const { data, error } = await supabase
        .from('ef_teachers')
        .update({ name: 'CARLOS AUGUSTO' })
        .eq('id', '691c895c-51f4-4083-8fe4-24f9a6638f53')
        .select();
    
    if (error) {
        console.error('Erro ao atualizar professor:', error);
    } else {
        console.log('Professor atualizado com sucesso:', JSON.stringify(data, null, 2));
    }
}

update();
