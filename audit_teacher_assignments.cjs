const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function auditTeacherAssignments() {
    console.log('--- RELATÓRIO DE ATRIBUIÇÕES ATUAIS ---');

    // Buscar professores e suas classes
    const { data: assignments, error } = await supabase
        .from('ef_classes')
        .select(`
      id,
      name,
      grade,
      teacher_id,
      ef_teachers (
        name
      )
    `)
        .order('grade', { ascending: true });

    if (error) {
        console.error('Erro ao buscar dados:', error);
        return;
    }

    const report = {};

    assignments.forEach(item => {
        const teacherName = item.ef_teachers ? item.ef_teachers.name : 'SEM PROFESSOR';
        if (!report[teacherName]) report[teacherName] = [];
        report[teacherName].push(`${item.name} (${item.grade})`);
    });

    Object.keys(report).sort().forEach(teacher => {
        console.log(`\n👨‍🏫 PROFESSOR: ${teacher}`);
        report[teacher].sort().forEach(cls => {
            console.log(`   - ${cls}`);
        });
    });
}

auditTeacherAssignments();
