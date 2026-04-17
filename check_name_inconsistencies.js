import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkNameInconsistencies() {
    console.log("--- Analisando Inconsistências de Nomes ---");

    // 1. Buscar nomes únicos do Schedule
    const { data: scheduleData } = await supabase.from('ef_schedule').select('teacher_name');
    const scheduleNames = [...new Set(scheduleData.map(s => s.teacher_name.trim().toUpperCase()))].sort();

    // 2. Buscar nomes únicos do Attendance
    const { data: attendanceData } = await supabase.from('ef_attendance').select('teacher_name');
    const attendanceNames = [...new Set(attendanceData.map(a => a.teacher_name.trim().toUpperCase()))].sort();

    console.log("\n[1] Nomes no CRONOGRAMA (ef_schedule):", scheduleNames.length);
    console.log("[2] Nomes na FREQUÊNCIA (ef_attendance):", attendanceNames.length);

    console.log("\n--- NOMES NA FREQUÊNCIA QUE NÃO ESTÃO NO CRONOGRAMA ---");
    const notInSchedule = attendanceNames.filter(a => !scheduleNames.some(s => s.includes(a) || a.includes(s)));
    if (notInSchedule.length === 0) {
        console.log("Nenhuma divergência óbvia encontrada (usando match parcial).");
    } else {
        notInSchedule.forEach(name => console.log(`- ${name}`));
    }

    console.log("\n--- NOMES NO CRONOGRAMA QUE NÃO TÊM NENHUM LANÇAMENTO ---");
    const noAttendance = scheduleNames.filter(s => !attendanceNames.some(a => a.includes(s) || s.includes(a)));
    noAttendance.forEach(name => console.log(`- ${name}`));

    console.log("\n--- POSSÍVEIS MATCHES (EXATOS E PARCIAIS) ---");
    scheduleNames.forEach(s => {
        const matches = attendanceNames.filter(a => a.includes(s) || s.includes(a));
        if (matches.length > 0 && (matches.length > 1 || matches[0] !== s)) {
            console.log(`Schedule: "${s}" -> Encontrado na Frequência como: ${JSON.stringify(matches)}`);
        }
    });
}

checkNameInconsistencies();
