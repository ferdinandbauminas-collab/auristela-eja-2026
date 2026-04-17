import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function debugNames() {
    console.log('--- DEBUGGING EXACT NAMES ---');

    console.log('From ef_classes:');
    const { data: cData } = await supabase.from('ef_classes').select('name');
    if (cData) {
        cData.forEach(d => {
            if (d.name.toLowerCase().includes('logica')) {
                console.log(`|${d.name}| (Length: ${d.name.length})`);
            }
        });
    }

    console.log('\nFrom ef_schedule:');
    const { data: sData } = await supabase.from('ef_schedule').select('discipline');
    if (sData) {
        sData.forEach(d => {
            if (d.discipline && d.discipline.toLowerCase().includes('logica')) {
                console.log(`|${d.discipline}| (Length: ${d.discipline.length})`);
            }
        });
    }
}

debugNames();
