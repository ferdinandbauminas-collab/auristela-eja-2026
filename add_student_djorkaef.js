import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Read env variables
const envPath = '.env';
let env = {};
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    env = Object.fromEntries(
        envContent.split('\n')
            .filter(l => l.includes('='))
            .map(l => {
                const parts = l.split('=');
                return [parts[0].trim(), parts.slice(1).join('=').trim()];
            })
    );
}

const supabaseUrl = env['VITE_SUPABASE_URL'];
const supabaseKey = env['VITE_SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addStudent() {
    const studentName = 'DJORKAEF MOURA SILVA';
    const classId = 'MÓDULO ALTE IA';

    console.log(`Checking if student "${studentName}" exists in class "${classId}"...`);

    const { data: existing, error: errCheck } = await supabase
        .from('ef_students')
        .select('*')
        .eq('name', studentName)
        .eq('class_id', classId)
        .maybeSingle();

    if (errCheck) {
        console.error('Error checking student existence:', errCheck);
        process.exit(1);
    }

    if (existing) {
        console.log(`⚠️ Student "${studentName}" already exists in class "${classId}".`);
        process.exit(0);
    }

    console.log(`Inserting student "${studentName}" into class "${classId}"...`);
    const { data, error } = await supabase
        .from('ef_students')
        .insert([{
            name: studentName,
            class_id: classId
        }])
        .select();

    if (error) {
        console.error('❌ Failed to insert student:', error.message);
        process.exit(1);
    } else {
        console.log(`✅ Success! Student inserted:`, data);
        process.exit(0);
    }
}

addStudent();
