import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wkmjoeoankucnhhanbqj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbWpvZW9hbmt1Y25oaGFuYnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzA2OTMsImV4cCI6MjA4NjY0NjY5M30.lCcKfDP-Zv56VtXxXtdaNjspO8FidkqIryd0ssdQYsM';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function check() {
    console.log('=== VERIFICANDO DADOS DE FREQUÊNCIA NO BANCO ===');
    const { data: attendance, error } = await supabase
        .from('ef_attendance')
        .select('date, class_name')
        .limit(10);
        
    if (error) {
        console.error(error);
        return;
    }
    
    console.log('Alguns registros de frequência:', attendance);
    
    // Let's get the range of dates
    const { data: dates } = await supabase
        .from('ef_attendance')
        .select('date')
        .order('date', { ascending: true });
        
    if (dates && dates.length > 0) {
        console.log(`Total de registros de frequência: ${dates.length}`);
        console.log(`Menor data: ${dates[0].date}`);
        console.log(`Maior data: ${dates[dates.length - 1].date}`);
    }
}

check();
