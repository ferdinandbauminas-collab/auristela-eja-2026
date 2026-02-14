const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Ler .env manualmente para pegar as mesmas chaves do App
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
        env[parts[0].trim()] = parts.slice(1).join('=').trim();
    }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

console.log('--- DIAGNÓSTICO SUPABASE ---');
console.log('URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    // 1. Verificar Professores
    const { data: teachers, error: tError } = await supabase.from('teachers').select('id, name').limit(3);
    if (tError) {
        console.log('❌ ERRO PROFESSORES:', tError.message);
    } else {
        console.log('✅ PROFESSORES ENCONTRADOS:', teachers.map(p => p.name).join(', '));
    }

    // 2. Verificar Alunos
    const { count, error: sError } = await supabase.from('students').select('*', { count: 'exact', head: true });
    if (sError) {
        console.log('❌ ERRO ALUNOS:', sError.message);
    } else {
        console.log('✅ TOTAL DE ALUNOS NO BANCO:', count);
    }
}

check();
