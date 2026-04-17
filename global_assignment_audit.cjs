const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

// Mapeamento de nomes de turmas curtas (schedule) para longas (classes)
const CLASS_MAPPING = {
    'MOD I A': 'MÓDULO INFO IA',
    'MOD I A ALT': 'MÓDULO ALTE IA',
    'MOD I A MARK': 'MÓDULO MARK IA',
    'MOD III A': 'MÓDULO INFO IIIA',
    'MOD III B': 'MÓDULO INFO IIIB',
    'MOD V A': 'MÓDULO INFO VA',
    'MOD V B': 'MÓDULO INFO VB',
    'MOD V C': 'MÓDULO INFO VC',
    'MOD V D': 'MÓDULO INFO VD'
};

async function syncAudit() {
    console.log('--- AUDITORIA DE SINCRONIZAÇÃO: HORÁRIO vs SISTEMA ---\n');

    // 1. Obter todas as aulas do cronograma (agrupadas por professor, disciplina e turma)
    const { data: schedule, error: sErr } = await supabase
        .from('ef_schedule')
        .select('teacher_name, discipline, class_group');

    if (sErr) throw sErr;

    const officialAssignments = new Set();
    schedule.forEach(row => {
        // Normalizar nome do professor (primeiro nome para busca aproximada se necessário)
        // Mas vamos usar o nome exato do schedule primeiro
        const fullClassName = CLASS_MAPPING[row.class_group] || row.class_group;
        officialAssignments.add(`${row.teacher_name}|${row.discipline}|${fullClassName}`);
    });

    // 2. Obter todos os vínculos atuais no sistema
    const { data: classes, error: cErr } = await supabase
        .from('ef_classes')
        .select('name, grade, ef_teachers(name)');

    if (cErr) throw cErr;

    const currentAssignments = new Set();
    classes.forEach(cls => {
        const teacherName = cls.ef_teachers ? cls.ef_teachers.name : 'SEM PROFESSOR';
        currentAssignments.add(`${teacherName}|${cls.name}|${cls.grade}`);
    });

    // 3. Comparar
    console.log('🔎 ANALISANDO DISCREPÂNCIAS...\n');

    const missingInSystem = [];

    // Para cada aula oficial, verificar se existe o vínculo
    for (const official of officialAssignments) {
        const [teacher, discipline, grade] = official.split('|');

        // Tentar encontrar uma correspondência
        let found = false;
        for (const current of currentAssignments) {
            const [cTeacher, cDiscipline, cGrade] = current.split('|');

            // Comparação flexível: o nome no schedule pode ser parte do nome no classes
            const teacherMatches = cTeacher.includes(teacher) || teacher.includes(cTeacher);
            const disciplineMatches = cDiscipline.toUpperCase() === discipline.toUpperCase();
            const gradeMatches = cGrade === grade;

            if (teacherMatches && disciplineMatches && gradeMatches) {
                found = true;
                break;
            }
        }

        if (!found) {
            missingInSystem.push({ teacher, discipline, grade });
        }
    }

    if (missingInSystem.length === 0) {
        console.log('✅ Tudo sincronizado! Não encontrei turmas faltantes no sistema.');
    } else {
        console.log(`⚠️  Encontrei ${missingInSystem.length} vínculos FALTANTES no sistema:\n`);
        missingInSystem.forEach(m => {
            console.log(`❌ PROFESSOR: ${m.teacher}`);
            console.log(`   VÍNCULO FALTANTE: ${m.discipline} - ${m.grade}`);
            console.log('   ---');
        });
    }
}

syncAudit().catch(console.error);
