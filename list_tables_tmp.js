import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Read .env from the project directory
const envPath = 'C:\\Users\\ferdi\\.gemini\\antigravity\\scratch\\auristela-eja-2026\\.env';
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function listTables() {
    console.log('--- TABELAS NO SUPABASE ---');
    // We can't list tables directly with the client easily without RPC, 
    // but we can try common names or check 'teachers'/'students' which we know exist.
    // Let's try to fetch a single row from several potential table names.
    const tables = ['ef_schedule', 'schedule', 'horarios', 'atribuicao', 'teachers', 'students'];
    for (const table of tables) {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error) {
            console.log(`❌ ${table.padEnd(15)}: Erro ou não existe (${error.message})`);
        } else {
            console.log(`✅ ${table.padEnd(15)}: Existe`);
        }
    }
}

listTables();
