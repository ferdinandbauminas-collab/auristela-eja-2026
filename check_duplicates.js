import { createClient } from '@supabase/supabase-js';

async function checkDuplicates() {
    const supabase_url = "https://wkmjoeoankucnhhanbqj.supabase.co";
    const supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbWpvZW9hbmt1Y25oaGFuYnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzA2OTMsImV4cCI6MjA4NjY0NjY5M30.lCcKfDP-Zv56VtXxXtdaNjspO8FidkqIryd0ssdQYsM";
    const supabase = createClient(supabase_url, supabase_key);

    const { data } = await supabase.from('ef_schedule').select('id, day_of_week, class_group, slot_number, discipline, teacher_name');

    const seen = {};
    const dupes = [];

    data.forEach(d => {
        const key = `${d.day_of_week}|${d.class_group}|${d.slot_number}`;
        if (seen[key]) {
            dupes.push({
                key,
                original: seen[key],
                duplicate: d
            });
        } else {
            seen[key] = d;
        }
    });

    if (dupes.length > 0) {
        console.log("DUPLICATES FOUND:");
        console.log(JSON.stringify(dupes, null, 2));
    } else {
        console.log("No duplicates found.");
    }
}

checkDuplicates();
