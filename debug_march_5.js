import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wkmjoeoankucnhhanbqj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbWpvZW9hbmt1Y25oaGFuYnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzA2OTMsImV4cCI6MjA4NjY0NjY5M30.lCcKfDP-Zv56VtXxXtdaNjspO8FidkqIryd0ssdQYsM';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function debugMarcos() {
    const DATA_CORTE = '2026-03-02';
    const targetDate = '2026-03-05';
    console.log(`--- Debugging with DATA_CORTE ${DATA_CORTE} ---`);

    // 1. Fetch exactly like the dashboard
    const { data: attendance, error: attError } = await supabase
        .from('ef_attendance')
        .select('*')
        .gte('date', DATA_CORTE)
        .order('date', { ascending: false });
    
    if (attError) console.error("Error fetching attendance:", attError);
    console.log(`Found ${attendance?.length || 0} attendance records total since ${DATA_CORTE}.`);

    const march5Records = attendance.filter(d => d.date.startsWith(targetDate));
    console.log(`Found ${march5Records.length} records for ${targetDate} in the result set.`);
    if (march5Records.length > 0) {
        console.log("Example March 5 record date string:", `|${march5Records[0].date}|`);
    }

    // 2. Check ef_suspensions
    const { data: suspensions, error: susError } = await supabase
        .from('ef_suspensions')
        .select('*')
        .eq('date', targetDate);

    if (susError) console.error("Error fetching suspensions:", susError);
    console.log(`Found ${suspensions?.length || 0} suspension records:`, suspensions);

    // 3. Check official holidays (simulating what the app does)
    try {
        const hResp = await fetch(`https://brasilapi.com.br/api/feriados/v1/2026`);
        const holidays = await hResp.json();
        const isHoliday = holidays.find(h => h.date === targetDate);
        console.log(`Is holiday? ${isHoliday ? 'Yes: ' + isHoliday.name : 'No'}`);
    } catch (e) {
        console.log("Could not fetch holidays from API.");
    }

    // 4. Check if records match schedule
    if (attendance?.length > 0) {
        console.log("Record count:", attendance.length);
        console.log("Sample full record dates:", attendance.map(a => `[${a.date}]`).slice(0, 5));
        
        const { data: sch, error: schError } = await supabase.from('ef_schedule').select('*');
        const dayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
        const recordDate = new Date(targetDate + 'T12:00:00');
        const recordDayName = dayNames[recordDate.getDay()];
        console.log(`Day of week detected: ${recordDayName}`);

        const normC = (name) => {
            if (!name) return "";
            let n = name.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            n = n.replace(/MODULO/g, "").replace(/MOD/g, "").replace(/TECNICO/g, "").replace(/\s+/g, "");
            n = n.replace(/ALTE/g, "ALT");
            if (n.startsWith("ALT") && n.length > 3) n = n.substring(3) + "ALT";
            if (n.startsWith("MARK") && n.length > 4) n = n.substring(4) + "MARK";
            if (n.startsWith("INFO") && n.length > 4) n = n.substring(4) + "INFO";
            n = n.replace(/INFO/g, "").replace(/III/g, "3").replace(/IV/g, "4").replace(/V/g, "5").replace(/I/g, "1");
            return n.trim();
        };
        const normD = (name) => (!name ? "" : name.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ORIENTADA/g, "").replace(/ELETIVAS/g, "ELETIVA").replace(/\s+/g, "").trim());
        const normalize = (name) => !name ? "" : name.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
        const isSameT = (sT, aT) => {
            if (!sT || !aT) return false;
            const s = normalize(sT);
            const a = normalize(aT);
            return s === a || s.includes(a) || a.includes(s);
        };

        const matching = attendance.filter(record => {
            const m = sch.some(s => 
                isSameT(s.teacher_name, record.teacher_name) && 
                normC(s.class_group) === normC(record.class_name) && 
                (normD(s.discipline) === normD(record.discipline) || s.discipline.toUpperCase().includes(normD(record.discipline))) && 
                s.day_of_week === recordDayName
            );
            return m;
        });

        console.log(`Matching schedule records: ${matching.length}`);
        
        if (attendance.length > 0) {
            const targetPrefix = targetDate;
            const startsWithMatch = attendance.filter(d => d.date.startsWith(targetPrefix));
            console.log(`Records starting with "${targetPrefix}": ${startsWithMatch.length}`);
        }
    }
}

debugMarcos();
