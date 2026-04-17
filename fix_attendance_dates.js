
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wkmjoeoankucnhhanbqj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbWpvZW9hbmt1Y25oaGFuYnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzA2OTMsImV4cCI6MjA4NjY0NjY5M30.lCcKfDP-Zv56VtXxXtdaNjspO8FidkqIryd0ssdQYsM';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fixAttendanceDates() {
    console.log('Iniciando correção de datas...');

    // Alvos: Data = 2026-03-04 e Criado antes das 03:00 UTC (Meia-noite BRT)
    // 2026-03-04T03:00:00Z é 00:00:00 em Brasília.
    const { data, error } = await supabase
        .from('ef_attendance')
        .update({ date: '2026-03-03' })
        .eq('date', '2026-03-04')
        .lt('created_at', '2026-03-04T03:00:00Z');

    if (error) {
        console.error('Erro ao atualizar:', error);
    } else {
        console.log('Sucesso: Registros de ontem (03/03) que estavam marcados como hoje (04/03) foram corrigidos.');
    }
}

fixAttendanceDates();
