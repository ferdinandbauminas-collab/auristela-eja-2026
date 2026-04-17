import { createClient } from '@supabase/supabase-js';

async function debugIds() {
    const supabase_url = "https://wkmjoeoankucnhhanbqj.supabase.co";
    const supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbWpvZW9hbmt1Y25oaGFuYnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzA2OTMsImV4cCI6MjA4NjY0NjY5M30.lCcKfDP-Zv56VtXxXtdaNjspO8FidkqIryd0ssdQYsM";
    const supabase = createClient(supabase_url, supabase_key);

    const { data } = await supabase.from('ef_schedule').select('*').in('day_of_week', ['Quarta-feira', 'Quinta-feira', 'Sexta-feira']);

    data.sort((a, b) => {
        if (a.day_of_week !== b.day_of_week) return a.day_of_week > b.day_of_week ? 1 : -1;
        if (a.class_group !== b.class_group) return a.class_group > b.class_group ? 1 : -1;
        return a.slot_number - b.slot_number;
    });

    data.forEach(d => {
        if (['MOD I A ALT', 'MOD III B', 'MOD V A', 'MOD V B'].includes(d.class_group)) {
            console.log(`${d.id} | ${d.day_of_week} | ${d.class_group} | Slot ${d.slot_number} -> ${d.teacher_name} (${d.discipline})`);
        }
    });
}

debugIds();
