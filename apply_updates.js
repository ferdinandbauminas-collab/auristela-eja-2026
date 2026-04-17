import { createClient } from '@supabase/supabase-js';

async function updateSchedule() {
    const supabase_url = "https://wkmjoeoankucnhhanbqj.supabase.co";
    const supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbWpvZW9hbmt1Y25oaGFuYnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzA2OTMsImV4cCI6MjA4NjY0NjY5M30.lCcKfDP-Zv56VtXxXtdaNjspO8FidkqIryd0ssdQYsM";
    const supabase = createClient(supabase_url, supabase_key);

    const updates = [
        // QUARTA
        { d: 'Quarta-feira', c: 'MOD I A ALT', s: 1, t: 'DANIEL MAGALHAES CHAVES', disc: 'FILOSOFIA' },
        { d: 'Quarta-feira', c: 'MOD I A ALT', s: 3, t: 'HELANNE BEATRIZ SILVA OLIVEIRA', disc: 'BIOLOGIA' },
        { d: 'Quarta-feira', c: 'MOD III B', s: 1, t: 'HELANNE BEATRIZ SILVA OLIVEIRA', disc: 'BIOLOGIA' },
        { d: 'Quarta-feira', c: 'MOD III B', s: 3, t: 'JOSE DE ASSUNCAO SOUSA BARBOSA', disc: 'GEOGRAFIA' },
        { d: 'Quarta-feira', c: 'MOD V A', s: 1, t: 'JOSE DE ASSUNCAO SOUSA BARBOSA', disc: 'GEOGRAFIA' },
        { d: 'Quarta-feira', c: 'MOD V A', s: 3, t: 'FRANCISCA DA SILVA SOUSA', disc: 'HISTÓRIA' },
        // QUINTA
        { d: 'Quinta-feira', c: 'MOD V B', s: 1, t: 'SEM PROFESSOR 5', disc: 'PROJETO DE DESENVOLVIMENTO DE SISTEMAS' },
        // SEXTA
        { d: 'Sexta-feira', c: 'MOD V A', s: 3, t: 'ELLYDA', disc: 'LE' },
        { d: 'Sexta-feira', c: 'MOD V B', s: 1, t: 'ELLYDA', disc: 'LE' },
        // INFO VD - Eletiva
        { d: 'Segunda-feira', c: 'MOD V D', s: 1, t: 'SEM PROFESSOR', disc: 'ELETIVA ORIENTADA' },
        { d: 'Terça-feira', c: 'MOD V D', s: 1, t: 'SEM PROFESSOR', disc: 'ELETIVA ORIENTADA' },
        { d: 'Quarta-feira', c: 'MOD V D', s: 1, t: 'SEM PROFESSOR', disc: 'ELETIVA ORIENTADA' },
        { d: 'Quinta-feira', c: 'MOD V D', s: 1, t: 'SEM PROFESSOR', disc: 'ELETIVA ORIENTADA' },
        { d: 'Sexta-feira', c: 'MOD V D', s: 1, t: 'SEM PROFESSOR', disc: 'ELETIVA ORIENTADA' }
    ];

    for (const u of updates) {
        console.log(`Atualizando: ${u.d} | ${u.c} | Slot ${u.s} -> ${u.t} (${u.disc})`);
        const { error } = await supabase
            .from('ef_schedule')
            .update({ teacher_name: u.t, discipline: u.disc })
            .eq('day_of_week', u.d)
            .eq('class_group', u.c)
            .eq('slot_number', u.s);

        if (error) console.error(`Erro ao atualizar ${u.c} na ${u.d}:`, error.message);
        else console.log(`Sucesso!`);
    }
}

updateSchedule();
