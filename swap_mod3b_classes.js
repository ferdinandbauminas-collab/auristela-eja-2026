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

async function swapClasses() {
    console.log('--- INICIANDO INVERSÃO DE AULAS MOD III B ---');

    // 1. Atualizar Segunda-feira, Aula 4
    console.log('Atualizando Segunda 4ª aula...');
    const { error: error1 } = await supabase
        .from('ef_schedule')
        .update({
            discipline: 'LÍNGUA PORTUGUESA',
            teacher_name: 'FRANCINEUDA DA SILVA SOUSA'
        })
        .match({ day_of_week: 'Segunda-feira', slot_number: 4, class_group: 'MOD III B' });

    if (error1) {
        console.error('❌ ERRO Segunda:', error1.message);
    } else {
        console.log('✅ Sucesso na Segunda.');
    }

    // 2. Atualizar Terça-feira, Aula 2
    console.log('Atualizando Terça 2ª aula...');
    const { error: error2 } = await supabase
        .from('ef_schedule')
        .update({
            discipline: 'PROJETO DE APRENDIZAGEM INTERDISCIPLINAR',
            teacher_name: 'GERSON DOS SANTOS'
        })
        .match({ day_of_week: 'Terça-feira', slot_number: 2, class_group: 'MOD III B' });

    if (error2) {
        console.error('❌ ERRO Terça:', error2.message);
    } else {
        console.log('✅ Sucesso na Terça.');
    }
}

swapClasses();
