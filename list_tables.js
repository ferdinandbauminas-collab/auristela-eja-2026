import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

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
    // In Supabase/Postgres, we can query information_schema or just try to guess.
    // However, the best way for an agent is to use the RPC if available, 
    // but since I don't know the RPCs, I'll try to list common patterns or query information_schema.
    
    const { data, error } = await supabase.rpc('get_tables_info'); // Might not exist
    
    if (error) {
        // Fallback: Query information_schema via a trick if possible, 
        // but Supabase usually restricts direct access to information_schema via the JS client.
        // Let's try to query a common table and see if we can get metadata.
        console.log('Fallabck: Querying information_schema.tables if allowed...');
        
        // Actually, I'll just check for specific tables I suspect.
        const suspects = ['ef_schedule', 'ef_schedule_new', 'ef_schedule_2026', 'ef_schedule_view', 'ef_attendance', 'ef_daily_state'];
        for (const table of suspects) {
            const { count, error: err } = await supabase.from(table).select('*', { count: 'exact', head: true });
            if (!err) console.log(`Table: ${table} | Rows: ${count}`);
            else console.log(`Table: ${table} | Error: ${err.message}`);
        }
    } else {
        console.log('Tables:', data);
    }
}

listTables();
