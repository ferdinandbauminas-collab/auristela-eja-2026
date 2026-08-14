import { BookOpenCheck, ChevronRight, ClipboardCheck, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Teacher } from '../lib/supabase';

interface Props {
    teacher: Teacher;
    onAttendance: () => void;
    onActivities: () => void;
    onLogout: () => void;
}

const TeacherHome = ({ teacher, onAttendance, onActivities, onLogout }: Props) => (
    <div style={{ minHeight: '86vh', display: 'flex', flexDirection: 'column', padding: '20px' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <div>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 800, marginBottom: '6px' }}>PROFESSOR(A)</p>
                <h1 style={{ fontSize: '1.35rem', color: '#064e3b', fontWeight: 900, textTransform: 'uppercase' }}>{teacher.name}</h1>
            </div>
            <button onClick={onLogout} aria-label="Sair" style={{ border: 'none', background: 'rgba(239,68,68,.1)', color: '#ef4444', padding: '12px', borderRadius: '16px', cursor: 'pointer' }}>
                <LogOut size={22} />
            </button>
        </header>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '18px', maxWidth: '520px', width: '100%', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <p style={{ color: '#059669', fontSize: '0.8rem', fontWeight: 900, letterSpacing: '2px' }}>MENU DO PROFESSOR</p>
                <h2 style={{ color: '#064e3b', fontSize: '1.7rem', marginTop: '8px' }}>O que deseja registrar?</h2>
            </div>

            <motion.button whileTap={{ scale: 0.98 }} onClick={onAttendance} style={cardStyle}>
                <span style={{ ...iconStyle, background: 'rgba(16,185,129,.1)', color: '#059669' }}><ClipboardCheck size={31} /></span>
                <span style={{ flex: 1, textAlign: 'left' }}>
                    <strong style={titleStyle}>Registrar frequência</strong>
                    <small style={descriptionStyle}>Marcar presenças e faltas dos alunos</small>
                </span>
                <ChevronRight color="#94a3b8" />
            </motion.button>

            <motion.button whileTap={{ scale: 0.98 }} onClick={onActivities} style={cardStyle}>
                <span style={{ ...iconStyle, background: 'rgba(59,130,246,.1)', color: '#2563eb' }}><BookOpenCheck size={31} /></span>
                <span style={{ flex: 1, textAlign: 'left' }}>
                    <strong style={titleStyle}>Registrar atividades</strong>
                    <small style={descriptionStyle}>Acompanhar as atividades de cada aluno</small>
                </span>
                <ChevronRight color="#94a3b8" />
            </motion.button>
        </div>
    </div>
);

const cardStyle = {
    width: '100%', padding: '22px', borderRadius: '28px', border: '1px solid rgba(0,0,0,.05)',
    background: 'white', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer',
    boxShadow: '0 12px 30px -8px rgba(0,0,0,.1)'
} as const;

const iconStyle = { width: '58px', height: '58px', borderRadius: '19px', display: 'flex', alignItems: 'center', justifyContent: 'center' } as const;
const titleStyle = { display: 'block', color: '#064e3b', fontSize: '1.05rem', textTransform: 'uppercase' } as const;
const descriptionStyle = { display: 'block', color: '#94a3b8', fontSize: '0.78rem', marginTop: '6px', lineHeight: 1.35 } as const;

export default TeacherHome;
