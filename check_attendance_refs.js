import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wkmjoeoankucnhhanbqj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbWpvZW9hbmt1Y25oaGFuYnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzA2OTMsImV4cCI6MjA4NjY0NjY5M30.lCcKfDP-Zv56VtXxXtdaNjspO8FidkqIryd0ssdQYsM';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function check() {
    const suspectIds = [
        '3245c7a3-f5fd-4179-bf1d-ba058ebaa5f7', // Eletiva IIIB (Denilson)
        '679cc750-1569-423a-aa82-3eeaf93a6cd9', // Programacao IIIA (Denilson)
        '4172c65b-02fe-47fb-a015-fad9175fb23b', // Redes IIIA (Denilson)
        'aef8e165-97f9-4de5-a735-1567bcbcb8b4', // Banco IA
        'ecda05f1-6ee1-471c-99de-bc3cbd89742d', // Programacao IA
        '16b4f6bb-685d-4a17-94b7-91140eb9e55d', // Redes IA
        '584b1ed2-4271-436c-8263-27f2852fca26', // InfoAplicada IIIA
        'a5c60933-0fab-4aa3-887c-12bcbd5577bc'  // InfoAplicada IIIB
    ];

    console.log('=== VERIFICANDO SE IDS ESTÃO SENDO USADOS EM ef_attendance ===');
    // Note: ef_attendance uses discipline and class_name and teacher_name as strings, not direct foreign keys. 
    // Let's verify the schema of ef_attendance to be sure it doesn't have class_id or teacher_id.
    const { data: attSample, error: attError } = await supabase.from('ef_attendance').select('*').limit(1);
    if (attError) {
        console.error(attError);
        return;
    }
    console.log('Campos de ef_attendance:', Object.keys(attSample[0]));
    
    // In our previous fetch, ef_attendance had: teacher_name, discipline, class_name, student_name, status, date
    // No direct ID foreign keys! Let's double check.
    console.log('Exemplo de registro de frequencia:', attSample[0]);
}

check();
