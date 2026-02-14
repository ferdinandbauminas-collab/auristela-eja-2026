import { createClient } from '@supabase/supabase-js';

const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const supabaseUrl = isLocal ? import.meta.env.VITE_SUPABASE_URL : (window.location.origin + '/supabase-proxy');
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.group('❌ CONFIGURAÇÃO SUPABASE AUSENTE');
    console.error('As variáveis VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não foram encontradas.');
    console.groupEnd();
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');

export interface Teacher {
    id: string;
    name: string;
    avatar?: string;
}

export interface Discipline {
    id: string;
    name: string;
    teacher_id: string;
    grade: string;
}

export interface Student {
    id: string;
    name: string;
    class_id: string;
    active: boolean;
}

export interface AttendanceRecord {
    teacher_name: string;
    discipline: string;
    class_name: string;
    student_name: string;
    status: 'present' | 'absent';
    date: string;
}
