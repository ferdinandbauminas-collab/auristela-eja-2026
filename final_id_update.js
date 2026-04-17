import { createClient } from '@supabase/supabase-js';

async function finalUpdate() {
    const supabase_url = "https://wkmjoeoankucnhhanbqj.supabase.co";
    const supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbWpvZW9hbmt1Y25oaGFuYnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzA2OTMsImV4cCI6MjA4NjY0NjY5M30.lCcKfDP-Zv56VtXxXtdaNjspO8FidkqIryd0ssdQYsM";
    const supabase = createClient(supabase_url, supabase_key);

    const updates = [
        // Quarta
        { id: '3e63062a-244b-4e64-b344-b24b1a5711e1', t: 'DANIEL MAGALHAES CHAVES', d: 'FILOSOFIA' }, // Slot 1
        { id: 'b781f931-c2e1-41ce-b463-3c176cfb9044', t: 'HELANNE BEATRIZ SILVA OLIVEIRA', d: 'BIOLOGIA' },  // Slot 3
        { id: '24678c57-5f08-40ec-a83b-38da63efbf25', t: 'HELANNE BEATRIZ SILVA OLIVEIRA', d: 'BIOLOGIA' },  // Slot 1
        { id: '3162384d-1bf1-4e11-b0de-c2d5b470f7fb', t: 'JOSE DE ASSUNCAO SOUSA BARBOSA', d: 'GEOGRAFIA' }, // Slot 3
        { id: '5e523166-4b2c-4262-a3c7-86f72df99a2e', t: 'JOSE DE ASSUNCAO SOUSA BARBOSA', d: 'GEOGRAFIA' }, // Slot 1
        { id: '386e49f5-6aa0-4e9f-8251-3e1ff37a4c06', t: 'FRANCISCA DA SILVA SOUSA', d: 'HISTÓRIA' },       // Slot 3
        // Quinta
        { id: 'bc23bbe1-9b8a-45d3-9075-4c391fa93b73', t: 'SEM PROFESSOR 5', d: 'PROJETO DE DESENVOLVIMENTO DE SISTEMAS' }, // Slot 1
        // Sexta
        { id: 'b30cd6ea-639b-4720-89f5-d42434454670', t: 'ELLYDA', d: 'LE' }, // Slot 3
        { id: '29cfbe98-9b72-47e4-a421-a4d2b7703b75', t: 'ELLYDA', d: 'LE' }  // Slot 1
    ];

    for (const u of updates) {
        console.log(`Updating ${u.id} to ${u.t} (${u.d})`);
        const { error } = await supabase.from('ef_schedule').update({ teacher_name: u.t, discipline: u.d }).eq('id', u.id);
        if (error) console.error(`Error updating ${u.id}:`, error.message);
        else console.log(`Successful.`);
    }
}

finalUpdate();
