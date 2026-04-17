import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

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

const newStudents = [
    // MODULO INFO VB
    { name: "FRANCISCA JEOVANA MORAES FIALHO", class_group: "MÓDULO INFO VB", class_id: "153930df-3c70-44a1-993a-f5b0732de712" },
    { name: "FRANCISCO EDER MARQUES DE SOUSA", class_group: "MÓDULO INFO VB", class_id: "153930df-3c70-44a1-993a-f5b0732de712" },
    { name: "FRANCISCO MARQUES MORAES", class_group: "MÓDULO INFO VB", class_id: "153930df-3c70-44a1-993a-f5b0732de712" },
    { name: "LAILSON SOUSA RODRIGUES", class_group: "MÓDULO INFO VB", class_id: "153930df-3c70-44a1-993a-f5b0732de712" },
    { name: "MARIA APARECIDA DA SILVA SOUSA", class_group: "MÓDULO INFO VB", class_id: "153930df-3c70-44a1-993a-f5b0732de712" },
    { name: "MARINA VIANA DE SOUSA", class_group: "MÓDULO INFO VB", class_id: "153930df-3c70-44a1-993a-f5b0732de712" },
    { name: "WESLLEY DE MELO SOUSA", class_group: "MÓDULO INFO VB", class_id: "153930df-3c70-44a1-993a-f5b0732de712" },

    // MODULO INFO VC
    { name: "ANDERSON VIANA FILHO", class_group: "MÓDULO INFO VC", class_id: "4509798e-3a05-457b-8dff-c996ae638f73" },
    { name: "RAIMUNDA NONATA RODRIGUES DA SILVA", class_group: "MÓDULO INFO VC", class_id: "4509798e-3a05-457b-8dff-c996ae638f73" },
    { name: "VALDERI MARQUES TEIXEIRA", class_group: "MÓDULO INFO VC", class_id: "4509798e-3a05-457b-8dff-c996ae638f73" },

    // MODULO INFO VD
    { name: "ELIABE DA COSTA OLIVEIRA", class_group: "MÓDULO INFO VD", class_id: "6fb8d927-7241-43ea-97ec-4ace69af65b9" },
    { name: "ERNALDO OLIVEIRA AGUIAR", class_group: "MÓDULO INFO VD", class_id: "6fb8d927-7241-43ea-97ec-4ace69af65b9" }
];

async function insertStudents() {
    let insertedInfo = [];
    let skippedInfo = [];

    for (const student of newStudents) {
        // Check if student already exists
        const { data: existing, error: errCheck } = await supabase
            .from('ef_students')
            .select('id')
            .eq('name', student.name)
            .eq('class_id', student.class_id)
            .maybeSingle();

        if (errCheck) {
            console.error(`Error checking existence of ${student.name}:`, errCheck);
            continue;
        }

        if (existing) {
            console.log(`⚠️ Skipped: ${student.name} (already exists in ${student.class_group})`);
            skippedInfo.push(student.name);
            continue;
        }

        // Insert
        const { data, error } = await supabase
            .from('ef_students')
            .insert([{
                name: student.name,
                class_id: student.class_id
            }])
            .select();

        if (error) {
            // Because of Row-Level Security, an anonymous insert may fail.
            // If it fails with RLS violation, we might need a trusted script or auth.
            console.error(`❌ Failed to insert ${student.name}:`, error.message);
        } else {
            console.log(`✅ Inserted: ${student.name} into ${student.class_group}`);
            insertedInfo.push(student.name);
        }
    }

    console.log(`\n--- Summary ---`);
    console.log(`Inserted: ${insertedInfo.length}`);
    console.log(`Skipped: ${skippedInfo.length}`);
}

insertStudents();
