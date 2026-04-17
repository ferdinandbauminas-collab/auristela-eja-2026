import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function getDetailedTodayFrequency() {
    const today = '2026-03-03';
    console.log(`Buscando lista detalhada para ${today}...`);

    const { data, error } = await supabase
        .from('ef_attendance')
        .select('class_name, student_name, status')
        .eq('date', today)
        .order('class_name', { ascending: true })
        .order('student_name', { ascending: true });

    if (error) {
        console.error("Erro ao buscar dados:", error);
        return;
    }

    if (!data || data.length === 0) {
        console.log("Nenhum registro de frequência encontrado para hoje.");
        return;
    }

    const frequencyByClass = {};

    data.forEach(record => {
        if (!frequencyByClass[record.class_name]) {
            frequencyByClass[record.class_name] = [];
        }
        frequencyByClass[record.class_name].push({
            name: record.student_name,
            status: record.status.toLowerCase() === 'present' || record.status.toLowerCase() === 'presente' ? '🟢 Presente' : '🔴 Ausente'
        });
    });

    console.log("--- RESULTADOS OBTIDOS ---");
    console.log(JSON.stringify(frequencyByClass));
}

getDetailedTodayFrequency();
