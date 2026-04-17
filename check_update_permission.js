import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUpdate() {
    console.log('--- TESTANDO UPDATE ---');

    const idToTest = 'e5f5ee42-63f4-4cf9-919b-23cc1429ea18'; // Um dos IDs de LOGICA DE PROGRAMAÇÃO

    console.log(`Tentando atualizar ID ${idToTest}...`);
    const { data, error, count, status, statusText } = await supabase
        .from('ef_schedule')
        .update({ discipline: 'PROGRAMAÇÃO PARA COMPUTADORES' }, { count: 'exact' })
        .eq('id', idToTest)
        .select();

    console.log('Status:', status, statusText);
    if (error) {
        console.error('Erro:', error);
    } else {
        console.log('Data retornada:', data);
        console.log('Linhas afetadas (count):', count);
    }
}

checkUpdate();
