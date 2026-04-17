import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envPath = 'C:\\Users\\ferdi\\.gemini\\antigravity\\scratch\\auristela-eja-2026\\.env';
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkEfClasses() {
    console.log('--- DADOS DA TABELA ef_classes ---');
    const { data, error } = await supabase
        .from('ef_classes')
        .select('*')
        .limit(100);

    if (error) {
        console.error('❌ ERRO:', error.message);
        return;
    }

    if (!data || data.length === 0) {
        console.log('⚠️ Tabela ef_classes está VAZIA.');
        return;
    }

    data.forEach(row => {
        console.log(JSON.stringify(row));
    });
}

checkEfClasses();
