import { createClient } from '@supabase/supabase-js';

async function verify() {
    const supabase_url = "https://wkmjoeoankucnhhanbqj.supabase.co";
    const supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbWpvZW9hbmt1Y25oaGFuYnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzA2OTMsImV4cCI6MjA4NjY0NjY5M30.lCcKfDP-Zv56VtXxXtdaNjspO8FidkqIryd0ssdQYsM";
    const supabase = createClient(supabase_url, supabase_key);

    const checks = [
        { day: 'Quarta-feira', class: 'MOD I A ALT', slot: 1 },
        { day: 'Quarta-feira', class: 'MOD I A ALT', slot: 3 },
        { day: 'Quarta-feira', class: 'MOD III B', slot: 1 },
        { day: 'Quarta-feira', class: 'MOD III B', slot: 3 },
        { day: 'Quarta-feira', class: 'MOD V A', slot: 1 },
        { day: 'Quarta-feira', class: 'MOD V A', slot: 3 },
        { day: 'Quinta-feira', class: 'MOD V B', slot: 1 },
        { day: 'Sexta-feira', class: 'MOD V A', slot: 3 },
        { day: 'Sexta-feira', class: 'MOD V B', slot: 1 }
    ];

    for (const c of checks) {
        const { data } = await supabase.from('ef_schedule').select('*').eq('day_of_week', c.day).eq('class_group', c.class).eq('slot_number', c.slot);
        if (data && data.length > 0) {
            console.log(`${data[0].day_of_week} | ${data[0].class_group} | Slot ${data[0].slot_number} -> ${data[0].teacher_name} (${data[0].discipline})`);
        } else {
            console.log(`MISSING: ${c.day} | ${c.class} | Slot ${c.slot}`);
        }
    }
}

verify();
