import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function getTodayFrequency() {
    const today = '2026-03-03';
    console.log(`Buscando frequência para ${today}...`);

    const { data, error } = await supabase
        .from('ef_attendance')
        .select('class_name, status')
        .eq('date', today);

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
            frequencyByClass[record.class_name] = { present: 0, total: 0 };
        }
        frequencyByClass[record.class_name].total++;
        if (record.status.toLowerCase() === 'present' || record.status.toLowerCase() === 'presente') {
            frequencyByClass[record.class_name].present++;
        }
    });

    console.log("\n--- FREQUÊNCIA POR TURMA (HOJE) ---");
    for (const [className, stats] of Object.entries(frequencyByClass)) {
        const percentage = ((stats.present / stats.total) * 100).toFixed(2);
        console.log(`${className}: ${stats.present}/${stats.total} (${percentage}%)`);
    }
}

getTodayFrequency();
