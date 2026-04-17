import { createClient } from '@supabase/supabase-js';

async function analyze() {
    const supabase_url = "https://wkmjoeoankucnhhanbqj.supabase.co";
    const supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbWpvZW9hbmt1Y25oaGFuYnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzA2OTMsImV4cCI6MjA4NjY0NjY5M30.lCcKfDP-Zv56VtXxXtdaNjspO8FidkqIryd0ssdQYsM";
    const supabase = createClient(supabase_url, supabase_key);

    console.log("--- HORÁRIO SEMANAL ---");
    const { data: sch } = await supabase.from('ef_schedule').select('*').order('day_of_week', { ascending: true });

    const daysOrder = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

    const scheduleByDay = {};
    daysOrder.forEach(d => scheduleByDay[d] = []);

    sch.forEach(s => {
        if (scheduleByDay[s.day_of_week]) {
            scheduleByDay[s.day_of_week].push(s);
        }
    });

    console.log("DATA_SCHEDULE_START");
    console.log(JSON.stringify(scheduleByDay, null, 2));
    console.log("DATA_SCHEDULE_END");

    console.log("\n--- ANALISANDO MARCOS E FRANCINEUDA ---");
    const targetTeachers = ['MARCOS AURELIO MATOS DOS SANTOS', 'FRANCINEUDA DA SILVA SOUSA'];

    for (const t of targetTeachers) {
        console.log(`\nProfessor: ${t}`);
        const { data: tSch } = await supabase.from('ef_schedule').select('*').ilike('teacher_name', `%${t.split(' ')[0]}%`);
        console.log(`Cronograma (Aulas Totais): ${tSch.length}`);
        tSch.forEach(s => console.log(` - ${s.day_of_week}: ${s.discipline} (${s.class_group})`));

        const { data: tAtt } = await supabase.from('ef_attendance').select('*').ilike('teacher_name', `%${t.split(' ')[0]}%`).gte('date', '2026-03-02');
        console.log(`Lançamentos (Desde 02/03): ${tAtt.length}`);

        const launchesByDate = {};
        tAtt.forEach(a => {
            const d = a.date.split('T')[0];
            if (!launchesByDate[d]) launchesByDate[d] = 0;
            launchesByDate[d]++;
        });

        Object.entries(launchesByDate).forEach(([d, count]) => console.log(` - Data ${d}: ${count} registros`));
    }
}

analyze();
