import type { Discipline, Teacher } from './supabase';

export const CLASS_STORAGE_MAP: Record<string, string> = {
    'EMEJAALTE – Módulo II – N-A': 'MÓDULO ALTE IA',
    'EMTEJAMARK-DIG – Módulo II – N-A': 'MÓDULO MARK IA',
    'EMTEJAINFO – Módulo II – N-A': 'MÓDULO INFO IA',
    'EMTEJAINFO – Módulo IV – N-A': 'MÓDULO INFO IIIA',
    'EMTEJAINFO – Módulo IV – N-B': 'MÓDULO INFO IIIB'
};

const allGrades = Object.keys(CLASS_STORAGE_MAP);
const assignments: Record<string, Record<string, string[]>> = {
    'CARLOS AUGUSTO': { 'EDUCAÇÃO FÍSICA': [allGrades[0], allGrades[1], allGrades[2]] },
    'CARMEN SILVIA': { 'LÍNGUA INGLESA': [allGrades[1], allGrades[2]] },
    'DANIEL MAGALHÃES': { 'FILOSOFIA': [allGrades[0], allGrades[1], allGrades[2], allGrades[3]], 'SOCIOLOGIA': [allGrades[3], allGrades[4]] },
    'DENILSON': {
        'SISTEMAS OPERACIONAIS': [allGrades[2]], 'REDES DE COMPUTADORES': [allGrades[4]],
        'BANCO DE DADOS': [allGrades[3], allGrades[4]], 'PROGRAMAÇÃO PARA COMPUTADORES': [allGrades[4]],
        'PROGRAMAÇÃO PARA WEB': [allGrades[4]]
    },
    'ELLYDA FERNANDA': { 'LÍNGUA ESPANHOLA': [allGrades[0], allGrades[3], allGrades[4]] },
    'FRANCINELDA': { 'LÍNGUA PORTUGUESA': [allGrades[2], allGrades[3], allGrades[4]] },
    'FRANCISCA DA SILVA': { 'HISTÓRIA': allGrades },
    'GEANDERSON': { 'ARTE': [allGrades[0], allGrades[3], allGrades[4]] },
    'GEMILSON': { 'MATEMÁTICA': [allGrades[0], allGrades[1], allGrades[2]] },
    'GERSON DOS SANTOS': {
        'SEO': [allGrades[1]], 'PAI': [allGrades[1], allGrades[3], allGrades[4]],
        'FUNDAMENTOS DE DESIGN DIGITAL': [allGrades[1]], 'MARKETING EM MÍDIAS E REDES SOCIAIS': [allGrades[1]],
        'GOOGLE ANALYTICS': [allGrades[1]]
    },
    'HELANNE': { 'BIOLOGIA': allGrades },
    'JORGE': { 'FÍSICA': allGrades },
    'ASSUNÇÃO': { 'GEOGRAFIA': allGrades },
    'MARCOS AURÉLIO': {
        'ELETIVA ORIENTADA': [allGrades[1], allGrades[3], allGrades[4]], 'REDES DE COMPUTADORES': [allGrades[3]],
        'PAI': [allGrades[2]], 'PROGRAMAÇÃO PARA COMPUTADORES': [allGrades[3]],
        'ARQUITETURA E MANUTENÇÃO DE COMPUTADORES': [allGrades[2]], 'ESTRUTURA DE DADOS': [allGrades[2]],
        'PROGRAMAÇÃO PARA WEB': [allGrades[3]]
    },
    'MARIA EUNICE': { 'LÍNGUA PORTUGUESA': [allGrades[0], allGrades[1]], 'PROJETO DE VIDA': [allGrades[0]] },
    'WESLEY': { 'MATEMÁTICA': [allGrades[3], allGrades[4]] },
    'WILSILENE': { 'QUÍMICA': allGrades }
};

export const adaptTeacherForOfficialSchedule = (teacher: Teacher): Teacher =>
    teacher.name.toUpperCase() === 'JOANA DARC' ? { ...teacher, name: 'GEANDERSON' } : teacher;

export const isOfficialTeacher = (teacher: Teacher): boolean =>
    Object.prototype.hasOwnProperty.call(assignments, teacher.name.toUpperCase());

export const getOfficialDisciplines = (teacher: Teacher): Discipline[] => {
    const teacherAssignments = assignments[teacher.name.toUpperCase()] || {};
    return Object.entries(teacherAssignments).flatMap(([name, grades]) => grades.map((grade, index) => ({
        id: `official-${teacher.id}-${name}-${index}`,
        name,
        teacher_id: teacher.id,
        grade
    })));
};
