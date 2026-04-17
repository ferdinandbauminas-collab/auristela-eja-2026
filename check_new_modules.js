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

async function checkNewModules() {
    const { data, error } = await supabase
        .from('ef_schedule')
        .select('*')
        .or('class_group.ilike.%II%,class_group.ilike.%IV%,class_group.ilike.%VII%');

    if (error) {
        console.error('❌ ERRO:', error.message);
        return;
    }

    if (!data || data.length === 0) {
        console.log('⚠️ Nenhum registro encontrado para Módulos II, IV ou VII na tabela ef_schedule.');
    } else {
        console.log(`✅ Encontrados ${data.length} registros para os novos módulos.`);
        data.forEach(row => {
            console.log(`${row.day_of_week} | ${row.slot_number}ª Aula | ${row.class_group} | ${row.discipline} | ${row.teacher_name}`);
        });
    }
}

checkNewModules();
