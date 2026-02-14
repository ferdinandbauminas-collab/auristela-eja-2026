const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env manually
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

console.log('--- DIAGNÓSTICO SUPABASE ---');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? 'PRESENTE' : 'AUSENTE');

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log('\n--- TESTANDO TABELA TEACHERS ---');
    const { data, error } = await supabase.from('teachers').select('*');
    if (error) {
        console.error('❌ ERRO AO BUSCAR PROFESSORES:', error.message);
        console.error('Dica: Verifique se as tabelas existem e se o RLS está desativado.');
    } else {
        console.log('✅ SUCESSO! Professores encontrados:', data.length);
        if (data.length > 0) {
            console.log('Primeiro da lista:', data[0].name);
        } else {
            console.log('⚠️ A tabela está VAZIA.');
        }
    }

    console.log('\n--- TESTANDO TABELA STUDENTS ---');
    const { count, error: studentError } = await supabase.from('students').select('*', { count: 'exact', head: true });
    if (studentError) {
        console.error('❌ ERRO AO BUSCAR ALUNOS:', studentError.message);
    } else {
        console.log('✅ SUCESSO! Total de alunos no banco:', count);
    }
}

check();
