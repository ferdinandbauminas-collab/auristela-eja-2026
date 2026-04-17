import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function listAllNames() {
    const { data: sch } = await supabase.from('ef_schedule').select('teacher_name');
    const { data: att } = await supabase.from('ef_attendance').select('teacher_name');

    const scheduleSet = new Set(sch.map(s => s.teacher_name.trim().toUpperCase()));
    const attendanceSet = new Set(att.map(a => a.teacher_name.trim().toUpperCase()));

    console.log("=== NOMES NO CRONOGRAMA (SCHEDULE) ===");
    Array.from(scheduleSet).sort().forEach(n => console.log(n));

    console.log("\n=== NOMES NA FREQUENCIA (ATTENDANCE) ===");
    Array.from(attendanceSet).sort().forEach(n => console.log(n));
}

listAllNames();
