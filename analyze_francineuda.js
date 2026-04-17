import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wkmjoeoankucnhhanbqj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbWpvZW9hbmt1Y25oaGFuYnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzA2OTMsImV4cCI6MjA4NjY0NjY5M30.lCcKfDP-Zv56VtXxXtdaNjspO8FidkqIryd0ssdQYsM';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function normC(c) {
    if (!c) return '';
    return c.toUpperCase().replace(/\s+/g, '').replace('MODULO', 'MÓD.').replace('MOD.', 'MÓD.').trim();
}

function normD(d) {
    if (!d) return '';
    return d.toUpperCase().replace(/\\bI\\b/g, '').replace(/\\bII\\b/g, '').trim();
}

const dayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

async function analyzeFrancineuda() {
    const teacherName = 'FRANCINEUDA';
    console.log(`--- Análise: Professora ${teacherName} ---`);

    // 1. Buscar Horário Escolar (ef_schedule)
    const { data: schedule, error: schError } = await supabase
        .from('ef_schedule')
        .select('*')
        .ilike('teacher_name', `%${teacherName}%`);

    if (schError) {
        console.error("Erro ao buscar horário:", schError);
        return;
    }

    console.log(`\\n[1] Horário Escolar Previsto (${schedule.length} aulas/semana):`);
    const scheduleByDay = {};
    schedule.forEach(s => {
        if (!scheduleByDay[s.day_of_week]) scheduleByDay[s.day_of_week] = [];
        scheduleByDay[s.day_of_week].push(s);
    });

    for (const [day, classes] of Object.entries(scheduleByDay)) {
        console.log(`  📅 ${day}:`);
        classes.forEach(c => console.log(`     - ${c.class_group} | ${c.discipline} (${c.time_slot})`));
    }

    // 2. Buscar Lançamentos Reais (ef_attendance)
    const DATA_CORTE = '2026-03-02';
    const { data: attendance, error: attError } = await supabase
        .from('ef_attendance')
        .select('date, class_name, discipline, status')
        .ilike('teacher_name', `%${teacherName}%`)
        .gte('date', DATA_CORTE);

    if (attError) {
        console.error("Erro ao buscar frequências:", attError);
        return;
    }

    console.log(`\\n[2] Lançamentos Encontrados no Banco (Desde 02/03): ${attendance.length} registros individuais de alunos`);
    
    // Agrupar por data da aula lançada
    const recordsMap = new Set();
    attendance.forEach(a => {
        const dateStr = a.date.split('T')[0];
        recordsMap.add(`${dateStr}|${normC(a.class_name)}|${normD(a.discipline)}`);
    });

    console.log(`  👉 Isso equivale a ${recordsMap.size} aulas distintas (Turma/Disciplina) salvas.`);
    console.log("");
    console.log("Aulas Salvas por Data:");
    Array.from(recordsMap).sort().forEach(r => console.log(`  - ${r}`));

    // 3. Simular a Lógica do Dashboard para encontrar faltas
    console.log(`\\n[3] Simulação do Dashboard (Da data de corte até ontem):`);
    const startDate = new Date(DATA_CORTE + 'T12:00:00');
    // Força o fuso horário de Brasília para hoje
    const brTodayStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date());
    const brToday = new Date(brTodayStr + 'T12:00:00');
    let endDate = new Date(brToday);
    endDate.setDate(brToday.getDate() - 1); // Até ontem

    let totalFaltas = 0;
    let totalPendencias = 0;

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const dayName = dayNames[d.getDay()];
        
        if (dayName === 'Sábado' || dayName === 'Domingo') continue;

        const daySchedule = scheduleByDay[dayName] || [];
        if (daySchedule.length === 0) continue; // Não dá aula neste dia

        let recordsFound = 0;
        
        daySchedule.forEach(schClass => {
            const expectedStr = `${dateStr}|${normC(schClass.class_group)}|${normD(schClass.discipline)}`;
            let found = false;
            for (const r of recordsMap) {
                if (r === expectedStr || r.startsWith(`${dateStr}|${normC(schClass.class_group)}`)) {
                    found = true;
                    break;
                }
            }
            if (found) recordsFound++;
        });

        const dispDate = dateStr.split('-').reverse().join('/');
        
        if (recordsFound === 0) {
            console.log(`  ❌ Falta Integral em ${dispDate} (${dayName}): Deveria ter ${daySchedule.length} aulas, mas não lançou NENHUMA.`);
            totalFaltas++;
        } else if (recordsFound < daySchedule.length) {
            console.log(`  ⚠️ Lançamento Parcial em ${dispDate} (${dayName}): Deveria ter ${daySchedule.length} aulas, mas lançou apenas ${recordsFound}. Pendência de ${daySchedule.length - recordsFound}.`);
            totalPendencias += (daySchedule.length - recordsFound);
        } else {
            console.log(`  ✅ OK em ${dispDate} (${dayName}): Todas as ${daySchedule.length} aulas lançadas.`);
        }
    }
    
    console.log(`\\nRESUMO: Francineuda possui ${totalFaltas} dia(s) listado(s) como falta e ${totalPendencias} aula(s) listada(s) como pendente.`);
}

analyzeFrancineuda();
