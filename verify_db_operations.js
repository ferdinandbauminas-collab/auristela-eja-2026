import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wkmjoeoankucnhhanbqj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbWpvZW9hbmt1Y25oaGFuYnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzA2OTMsImV4cCI6MjA4NjY0NjY5M30.lCcKfDP-Zv56VtXxXtdaNjspO8FidkqIryd0ssdQYsM';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function check() {
    console.log('=== VERIFICANDO ELETIVA IIIA ===');
    const { data: cData, error: cErr } = await supabase
        .from('ef_classes')
        .select('*')
        .eq('id', '1a498f48-27db-42d6-8334-ff2519f7ca9d')
        .single();
        
    if (cErr) {
        console.error('Erro ao ler Eletiva IIIA:', cErr);
    } else {
        console.log('Eletiva IIIA atual no banco:', cData);
    }

    console.log('\n=== TENTANDO EXECUTAR DELETE DIRETAMENTE COM RETORNO ===');
    const idToDelete = '3245c7a3-f5fd-4179-bf1d-ba058ebaa5f7'; // Eletiva IIIB Denilson duplicate
    const { data: delData, error: delErr } = await supabase
        .from('ef_classes')
        .delete()
        .eq('id', idToDelete)
        .select(); // Retorna as linhas deletadas
        
    if (delErr) {
        console.error('Erro ao deletar:', delErr);
    } else {
        console.log('Dados retornados do delete:', delData);
    }
}

check();
