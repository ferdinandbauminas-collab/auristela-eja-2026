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

async function listAll() {
    const { data, error } = await supabase
        .from('ef_schedule')
        .select('*')
        .order('day_of_week', { ascending: true })
        .order('slot_number', { ascending: true })
        .limit(200);

    if (error) {
        console.error('❌ ERRO:', error.message);
        return;
    }

    if (!data || data.length === 0) {
        console.log('⚠️ Tabela ef_schedule está VAZIA.');
        return;
    }

    console.log(`✅ Encontrados ${data.length} registros.`);
    
    // Group by day
    const days = {};
    data.forEach(row => {
        if (!days[row.day_of_week]) days[row.day_of_week] = [];
        days[row.day_of_week].push(row);
    });

    for (const day in days) {
        console.log(`\n📅 ${day.toUpperCase()}`);
        console.log(''.padEnd(100, '-'));
        days[day].forEach(row => {
            console.log(`${row.slot_number}ª Aula | ${row.class_group.padEnd(12)} | ${row.discipline.padEnd(25)} | ${row.teacher_name}`);
        });
    }
}

listAll();
