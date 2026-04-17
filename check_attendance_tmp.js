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

async function checkRecentAttendance() {
    console.log('--- ÚLTIMOS REGISTROS DE FREQUÊNCIA (ef_attendance) ---');
    const { data, error } = await supabase
        .from('ef_attendance')
        .select('*')
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(50);

    if (error) {
        console.error('❌ ERRO:', error.message);
        return;
    }

    if (!data || data.length === 0) {
        console.log('⚠️ Tabela ef_attendance está VAZIA.');
        return;
    }

    data.forEach(row => {
        console.log(`${row.date} | ${row.class_name.padEnd(12)} | ${row.discipline.padEnd(25)} | ${row.teacher_name}`);
    });
}

checkRecentAttendance();
