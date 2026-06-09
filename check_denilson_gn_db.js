import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yglwswpgrqfldvpbqxcl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnbHdzd3BncnFmbGR2cGJxeGNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3..."'; // Let's use the full key from supabase.js

// Wait, the key in supabase.js is:
const fullKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnbHdzd3BncnFmbGR2cGJxeGNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2Mjg0MDQsImV4cCI6MjAzMTIwNDQwNH0.5N_u6Y-0iG2s1s024s2yNCe-iZ0rnF3xKq6H3kTl3rU';

const supabase = createClient(SUPABASE_URL, fullKey);

async function check() {
    console.log('=== BUSCANDO NO BANCO DE GESTAO_NOTAS ===');
    // Let's see what tables exist by trying to query some common ones or querying information_schema
    const tables = ['ef_teachers', 'ef_classes', 'ef_students', 'teachers', 'classes', 'allocations'];
    for (const t of tables) {
        try {
            const { data, error } = await supabase.from(t).select('*').limit(2);
            if (error) {
                console.log(`Tabela ${t}: erro ${error.message}`);
            } else {
                console.log(`Tabela ${t}: existe! Exemplo:`, data);
            }
        } catch (e) {
            console.log(`Tabela ${t}: falhou`, e.message);
        }
    }
}

check();
