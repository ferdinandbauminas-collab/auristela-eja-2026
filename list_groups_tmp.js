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

async function listGroups() {
    const { data, error } = await supabase
        .from('ef_schedule')
        .select('class_group');

    if (error) {
        console.error('❌ ERRO:', error.message);
        return;
    }

    const groups = [...new Set(data.map(item => item.class_group))];
    console.log('--- GRUPOS DE TURMAS NO BANCO ---');
    groups.sort().forEach(g => console.log(`- ${g}`));
}

listGroups();
