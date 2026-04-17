import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wkmjoeoankucnhhanbqj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbWpvZW9hbmt1Y25oaGFuYnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzA2OTMsImV4cCI6MjA4NjY0NjY5M30.lCcKfDP-Zv56VtXxXtdaNjspO8FidkqIryd0ssdQYsM';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function inspectRecords() {
    const { data, error } = await supabase
        .from('ef_attendance')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
        
    console.log("Registros com DATE e CREATED_AT:");
    data.forEach(d => {
        console.log(`Teacher: ${d.teacher_name} | Date: ${d.date} | Created At: ${d.created_at}`);
    });
}
inspectRecords();
