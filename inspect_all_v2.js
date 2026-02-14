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
            console.log("--- SCHEMA DUMP ---");
            for (const tableName in schema.definitions) {
                if (tableName.startsWith('ef_')) {
                    const props = schema.definitions[tableName].properties;
                    console.log(`Table: ${tableName}`);
                    for (const propName in props) {
                        console.log(`  - ${propName}: ${props[propName].type} ${props[propName].format || ''}`);
                    }
                }
            }
            console.log("--- END DUMP ---");
        } else {
            console.log("Erro ao acessar OpenAPI:", response.statusText);
        }
    } catch (e) {
        console.log("Erro:", e.message);
    }
}

inspectAll();
