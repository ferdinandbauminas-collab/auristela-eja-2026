import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function analyze() {
    console.log('--- ANALISANDO NOMES DE DISCIPLINAS ---');

    const [{ data: classes }, { data: schedule }] = await Promise.all([
        supabase.from('ef_classes').select('name, grade'),
        supabase.from('ef_schedule').select('discipline, class_group')
    ]);

    const results = {};

    const check = (name, origin) => {
        if (!name) return;
        if (!results[name]) results[name] = new Set();
        results[name].add(origin);
    };

    if (classes) classes.forEach(d => check(d.name, `ef_classes (${d.grade})`));
    if (schedule) schedule.forEach(d => check(d.discipline, `ef_schedule (${d.class_group})`));

    const sortedNames = Object.keys(results).sort();

    console.log('\nDisciplinas encontradas (relacionadas a TI/Programação):');
    sortedNames.forEach(name => {
        const lower = name.toLowerCase();
        if (lower.includes('programação') || lower.includes('lógica') || lower.includes('computadores') || lower.includes('sistemas')) {
            console.log(`\n- ${name}`);
            console.log(`  Ocorrências: ${Array.from(results[name]).join(', ')}`);
        }
    });

    // Busca específica solicitada pelo usuário
    console.log('\n--- VERIFICAÇÃO ESPECÍFICA ---');
    const specificNames = ['PROGRAMAÇÃO PARA COMPUTADORES', 'ANÁLISE E LÓGICA DE PROGRAMAÇÃO'];
    specificNames.forEach(sName => {
        if (results[sName]) {
            console.log(`[OK] Encontrada: "${sName}" em ${Array.from(results[sName]).join(', ')}`);
        } else {
            console.log(`[X] NÃO ENCONTRADA: "${sName}"`);
        }
    });
}

analyze();
