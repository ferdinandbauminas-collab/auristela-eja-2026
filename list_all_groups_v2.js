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

async function listAllGroups() {
    const { data, error } = await supabase.from('ef_schedule').select('class_group');
    if (error) { console.error(error.message); return; }
    const groups = [...new Set(data.map(x => x.class_group))].sort();
    console.log('--- GRUPOS NO SUPABASE ---');
    groups.forEach(g => console.log(g));
}

listAllGroups();
