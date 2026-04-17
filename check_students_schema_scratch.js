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

async function checkSchema() {
    console.log("Checking ef_students schema...");
    const { data, error } = await supabase
        .from('ef_students')
        .select('*')
        .limit(1);

    if (error) {
        console.error("Error fetching from ef_students:", error.message);
    } else {
        console.log("Sample record:", JSON.stringify(data[0], null, 2));
    }

    console.log("\nChecking unique classes in ef_students...");
    const { data: classes, error: err2 } = await supabase
        .from('ef_students')
        .select('class_name')
        .order('class_name');
    
    if (err2) {
        console.error("Error fetching classes:", err2.message);
    } else {
        const uniqueClasses = [...new Set(classes.map(c => c.class_name))];
        console.log("Existing classes in ef_students:", uniqueClasses);
    }
}

checkSchema();
