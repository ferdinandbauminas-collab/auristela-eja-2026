import { createClient } from '@supabase/supabase-js';

const getSupabaseConfig = () => {
    if (typeof window === 'undefined') return { url: '', key: '' };

    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const baseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

    // Se estiver em produção e não houver proxy, tenta direto se o proxy falhar
    const prodUrl = window.location.origin + '/supabase-proxy';

    return {
        url: isLocal ? baseUrl : prodUrl,
        key: key
    };
};

const config = getSupabaseConfig();
export const supabase = createClient(config.url, config.key);

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
