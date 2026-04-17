import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAttendance() {
    const classIds = [
        'bf4d5e79-a419-4e54-a00e-da52accb799d', // LINGUA ALTE
        'a6c1a7f9-ecb6-4f17-9d38-b139edf71b8c', // LINGUA MARK
        '89616363-31a2-4be7-9c9c-614958e30386', // LÍNGUA ALTE
        '8ed2d8cb-c269-45f8-a374-a96597be6824'  // LÍNGUA MARK
    ];

    console.log("Verificando frequência por classe...");
    for (const id of classIds) {
        // Attendance records link via discipline and teacher name, or class_id?
        // Let's check ef_attendance columns.
        const { data: attendance, count, error } = await supabase
            .from('ef_attendance')
            .select('*', { count: 'exact', head: true })
            .eq('class_id', id); // If class_id exists in ef_attendance

        if (error) {
            console.error(`Erro no ID ${id}:`, error.message);
        } else {
            console.log(`Classe ${id}: ${count} registros de frequência`);
        }
    }
}

async function checkAttendanceByDetails() {
    // Some tables might link by teacher_name and discipline name
    console.log("\nVerificando frequência por nome da disciplina...");
    const { data: counts, error } = await supabase
        .from('ef_attendance')
        .select('discipline, teacher_name')
        .ilike('discipline', '%Lingua Portuguesa%')
        .eq('teacher_name', 'MARIA EUNICE');

    if (error) {
        console.error("Erro ao buscar detalhes de frequência:", error.message);
        return;
    }

    const summary = counts.reduce((acc, c) => {
        acc[c.discipline] = (acc[c.discipline] || 0) + 1;
        return acc;
    }, {});

    console.log("Frequência de Maria Eunice por nome de disciplina:");
    console.log(JSON.stringify(summary, null, 2));
}

async function run() {
    await checkAttendance();
    await checkAttendanceByDetails();
}

run();
