import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

async function getMondaySchedule() {
    const supabase_url = "https://wkmjoeoankucnhhanbqj.supabase.co";
    const supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbWpvZW9hbmt1Y25oaGFuYnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzA2OTMsImV4cCI6MjA4NjY0NjY5M30.lCcKfDP-Zv56VtXxXtdaNjspO8FidkqIryd0ssdQYsM";
    const supabase = createClient(supabase_url, supabase_key);

    const { data, error } = await supabase
        .from('ef_schedule')
        .select('slot_number, class_group, discipline, teacher_name')
        .eq('day_of_week', 'Segunda-feira')
        .order('class_group', { ascending: true })
        .order('slot_number', { ascending: true });

    if (error) {
        console.error(error);
        return;
    }

    fs.writeFileSync('monday_schedule.json', JSON.stringify(data, null, 2));
    console.log(`Saved ${data.length} records to monday_schedule.json`);
}

getMondaySchedule();
