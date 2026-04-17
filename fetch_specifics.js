import { createClient } from '@supabase/supabase-js';

async function fetchSpecifics() {
    const supabase_url = "https://wkmjoeoankucnhhanbqj.supabase.co";
    const supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbWpvZW9hbmt1Y25oaGFuYnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzA2OTMsImV4cCI6MjA4NjY0NjY5M30.lCcKfDP-Zv56VtXxXtdaNjspO8FidkqIryd0ssdQYsM";
    const supabase = createClient(supabase_url, supabase_key);

    const targets = [
        { d: 'Quarta-feira', c: 'MOD I A ALT', s: 1 },
        { d: 'Quarta-feira', c: 'MOD I A ALT', s: 3 },
        { d: 'Quarta-feira', c: 'MOD III B', s: 1 },
        { d: 'Quarta-feira', c: 'MOD III B', s: 3 },
        { d: 'Quarta-feira', c: 'MOD V A', s: 1 },
        { d: 'Quarta-feira', c: 'MOD V A', s: 3 },
        { d: 'Quinta-feira', c: 'MOD V B', s: 1 },
        { d: 'Sexta-feira', c: 'MOD V A', s: 3 },
        { d: 'Sexta-feira', c: 'MOD V B', s: 1 }
    ];

    for (const t of targets) {
        const { data } = await supabase.from('ef_schedule').select('*').eq('day_of_week', t.d).eq('class_group', t.c).eq('slot_number', t.s);
        if (data && data.length > 0) {
            const d = data[0];
            console.log(`ID:${d.id} | ${d.day_of_week} | ${d.class_group} | Slot ${d.slot_number} -> ${d.teacher_name} (${d.discipline})`);
        }
    }
}

fetchSpecifics();
