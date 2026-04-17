import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkConsistency() {
    console.log("Buscando todas as classes de 'Lingua Portuguesa'...");
    const { data: classes, error } = await supabase
        .from('ef_classes')
        .select('name')
        .ilike('name', '%Lingua Portuguesa%');

    if (error) {
        console.error("Erro:", error.message);
        return;
    }

    const counts = classes.reduce((acc, c) => {
        acc[c.name] = (acc[c.name] || 0) + 1;
        return acc;
    }, {});

    console.log("Frequência de nomes:");
    console.log(JSON.stringify(counts, null, 2));
}

checkConsistency();
