const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://yglwswpgrqfldvpbqxcl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnbHdzd3BncnFmbGR2cGJxeGNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2Mjg0MDQsImV4cCI6MjAzMTIwNDQwNH0.5N_u6Y-0iG2s1s024s2yNCe-iZ0rnF3xKq6H3kTl3rU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
    console.log('--- VERIFICANDO PROFESSORES ---');
    const { data: teachers, error: tError } = await supabase.from('teachers').select('id, name').limit(5);
    if (tError) console.error('Erro professores:', tError);
    else console.log('Professores encontrados:', teachers);

    console.log('\n--- VERIFICANDO DISCIPLINAS ---');
    const { data: disciplines, error: dError } = await supabase.from('disciplines').select('discipline_name, classes').limit(3);
    if (dError) console.error('Erro disciplinas:', dError);
    else console.log('Disciplinas encontradas:', disciplines);
}

verify();
