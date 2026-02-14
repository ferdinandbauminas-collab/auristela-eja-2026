import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

async function inspectAll() {
    try {
        const response = await fetch(`${supabaseUrl}/rest/v1/?apikey=${supabaseKey}`);
        if (response.ok) {
            const schema = await response.json();
            console.log("SCHEMA_START");
            for (const tableName in schema.definitions) {
                if (tableName.startsWith('ef_')) {
                    const cols = Object.keys(schema.definitions[tableName].properties);
                    console.log(`TABLE:${tableName}|COLS:${cols.join(',')}`);
                }
            }
            console.log("SCHEMA_END");
        }
    } catch (e) {
        console.log("Erro:", e.message);
    }
}

inspectAll();
