import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wkmjoeoankucnhhanbqj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbWpvZW9hbmt1Y25oaGFuYnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzA2OTMsImV4cCI6MjA4NjY0NjY5M30.lCcKfDP-Zv56VtXxXtdaNjspO8FidkqIryd0ssdQYsM';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function replace() {
    const adeliaId = '691c895c-51f4-4083-8fe4-24f9a6638f53';
    
    console.log('Tentando remover Adélia...');
    const { error: delError } = await supabase.from('ef_teachers').delete().eq('id', adeliaId);
    if (delError) console.error('Erro ao deletar:', delError.message);
    else console.log('Adélia removida (ou já não existia).');

    console.log('Tentando inserir Carlos Augusto...');
    const { data: insData, error: insError } = await supabase.from('ef_teachers').insert([
        { id: adeliaId, name: 'CARLOS AUGUSTO', subject: 'EDUCAÇÃO FÍSICA' }
    ]).select();

    if (insError) {
        console.error('Erro ao inserir:', insError.message);
    } else {
        console.log('Carlos Augusto inserido com sucesso:', JSON.stringify(insData, null, 2));
    }
}

replace();
