import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read .env from the project directory
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

async function listSchedule() {
    console.log('--- HORÁRIO SEGUNDA E TERÇA (SUPABASE) ---');
    
    const { data, error } = await supabase
        .from('ef_schedule')
        .select('*')
        .or('day_of_week.ilike.Segunda%,day_of_week.ilike.Terça%')
        .order('day_of_week', { ascending: true })
        .order('class_group', { ascending: true })
        .order('slot_number', { ascending: true });

    if (error) {
        console.error('❌ ERRO:', error.message);
        return;
    }

    if (!data || data.length === 0) {
        console.log('⚠️ Nenhum horário encontrado para segunda ou terça.');
        return;
    }

    let currentDay = '';
    data.forEach(row => {
        if (row.day_of_week !== currentDay) {
            currentDay = row.day_of_week;
            console.log(`\n📅 ${currentDay.toUpperCase()}`);
            console.log(''.padEnd(60, '-'));
        }
        const slot = `${row.slot_number}ª Aula`.padEnd(10);
        const turma = row.class_group.padEnd(15);
        const disc = row.discipline.padEnd(30);
        console.log(`${slot} | ${turma} | ${disc} | ${row.teacher_name}`);
    });
}

listSchedule();
