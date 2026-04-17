import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function auditAbsences() {
    const dates = ['2026-03-02', '2026-03-03', '2026-03-04'];
    const dayNames = {
        '2026-03-02': 'Segunda-feira',
        '2026-03-03': 'Terça-feira',
        '2026-03-04': 'Quarta-feira'
    };

    console.log("--- Iniciando Auditoria de Faltas (Seg-Qua) ---");

    // 1. Dados
    const { data: sch } = await supabase.from('ef_schedule').select('*');
    const { data: att } = await supabase.from('ef_attendance').select('*').in('date', dates);
    const { data: sus } = await supabase.from('ef_suspensions').select('*').in('date', dates);

    const suspendedDates = sus.map(s => s.date);

    // Normalizações (igual ao dashboard)
    const normC = (name) => {
        if (!name) return "";
        let n = name.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        n = n.replace(/MODULO/g, "").replace(/MOD/g, "").replace(/TECNICO/g, "").replace(/\s+/g, "");
        n = n.replace(/ALTE/g, "ALT").replace(/INFO/g, "").replace(/III/g, "3").replace(/IV/g, "4").replace(/V/g, "5").replace(/I/g, "1");
        if (n.startsWith("ALT") && n.length > 3) n = n.substring(3) + "ALT";
        if (n.startsWith("MARK") && n.length > 4) n = n.substring(4) + "MARK";
        return n.trim();
    };
    const normD = (name) => (!name ? "" : name.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ORIENTADA/g, "").replace(/ELETIVAS/g, "ELETIVA").replace(/\s+/g, "").trim());
    const isSameT = (t1, t2) => {
        if (!t1 || !t2) return false;
        const n1 = t1.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
        const n2 = t2.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
        return n1.includes(n2) || n2.includes(n1);
    };

    const results = {};

    dates.forEach(date => {
        if (suspendedDates.includes(date)) {
            console.log(`[!] Data ${date} está suspensa. Pulando.`);
            return;
        }

        const dayName = dayNames[date];
        const daySchedule = sch.filter(s => s.day_of_week === dayName && s.teacher_name !== 'HORÁRIO VAGO');
        const dayAttendance = att.filter(a => a.date === date);

        const teacherStats = {};

        daySchedule.forEach(s => {
            if (!teacherStats[s.teacher_name]) {
                teacherStats[s.teacher_name] = { planned: [], launched: 0 };
            }
            teacherStats[s.teacher_name].planned.push(s);

            // Verificar se houve lançamento para esta aula específica
            const matches = dayAttendance.filter(a =>
                isSameT(a.teacher_name, s.teacher_name) &&
                normC(a.class_name) === normC(s.class_group) &&
                (normD(s.discipline) === normD(a.discipline) || s.discipline.toUpperCase().includes(normD(a.discipline)))
            );

            if (matches.length > 0) teacherStats[s.teacher_name].launched++;
        });

        results[date] = {
            day: dayName,
            faltas: [],
            pendencias: []
        };

        Object.entries(teacherStats).forEach(([tName, stats]) => {
            if (stats.launched === 0) {
                results[date].faltas.push(`${tName} (${stats.planned.length} aulas)`);
            } else if (stats.launched < stats.planned.length) {
                results[date].pendencias.push(`${tName} (${stats.planned.length - stats.launched} pendentes)`);
            }
        });
    });

    console.log(JSON.stringify(results, null, 2));
}

auditAbsences();
