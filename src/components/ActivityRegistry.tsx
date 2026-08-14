import { ArrowLeft, BookOpenCheck } from 'lucide-react';
import type { Teacher } from '../lib/supabase';

interface Props { teacher: Teacher; onBack: () => void; }

const ActivityRegistry = ({ teacher, onBack }: Props) => (
    <div style={{ minHeight: '86vh', display: 'flex', flexDirection: 'column', padding: '20px' }}>
        <button onClick={onBack} style={{ alignSelf: 'flex-start', border: 'none', background: 'white', color: '#064e3b', padding: '12px 16px', borderRadius: '16px', display: 'flex', gap: '8px', alignItems: 'center', fontWeight: 800, cursor: 'pointer' }}>
            <ArrowLeft size={20} /> VOLTAR
        </button>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '18px' }}>
            <span style={{ width: '78px', height: '78px', borderRadius: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(59,130,246,.1)', color: '#2563eb' }}><BookOpenCheck size={38} /></span>
            <div><p style={{ color: '#94a3b8', fontWeight: 800 }}>{teacher.name}</p><h1 style={{ color: '#064e3b', marginTop: '8px' }}>Registrar atividades</h1></div>
            <p style={{ color: '#64748b', maxWidth: '360px' }}>Esta área está preparada. Na próxima etapa adicionaremos turma, disciplina, atividade e o acompanhamento individual dos alunos.</p>
        </div>
    </div>
);

export default ActivityRegistry;
