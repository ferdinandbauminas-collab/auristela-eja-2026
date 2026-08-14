import { useState } from 'react';
import { ArrowLeft, BookOpenCheck } from 'lucide-react';
import type { Teacher } from '../lib/supabase';

interface Props { teacher: Teacher; onBack: () => void; }

const ActivityRegistry = ({ teacher, onBack }: Props) => {
    const [theme, setTheme] = useState('');

    return (
    <div style={{ minHeight: '86vh', display: 'flex', flexDirection: 'column', padding: '20px' }}>
        <button onClick={onBack} style={{ alignSelf: 'flex-start', border: 'none', background: 'white', color: '#064e3b', padding: '12px 16px', borderRadius: '16px', display: 'flex', gap: '8px', alignItems: 'center', fontWeight: 800, cursor: 'pointer' }}>
            <ArrowLeft size={20} /> VOLTAR
        </button>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '18px', width: '100%', maxWidth: '520px', margin: '0 auto' }}>
            <span style={{ width: '78px', height: '78px', borderRadius: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(59,130,246,.1)', color: '#2563eb' }}><BookOpenCheck size={38} /></span>
            <div><p style={{ color: '#94a3b8', fontWeight: 800 }}>{teacher.name}</p><h1 style={{ color: '#064e3b', marginTop: '8px' }}>Registrar atividades</h1></div>
            <label htmlFor="activity-theme" style={{ width: '100%', textAlign: 'left', color: '#064e3b', fontWeight: 900, fontSize: '0.85rem', textTransform: 'uppercase' }}>
                Tema da atividade
            </label>
            <textarea
                id="activity-theme"
                value={theme}
                onChange={(event) => setTheme(event.target.value)}
                placeholder="Ex.: Produção de identidade visual"
                rows={4}
                autoFocus
                style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical', border: '2px solid #3b82f6', borderRadius: '22px', padding: '18px', background: 'white', color: '#0f172a', fontSize: '1rem', fontFamily: 'inherit', outline: 'none', boxShadow: '0 12px 30px -10px rgba(59,130,246,.25)' }}
            />
            <p style={{ color: '#64748b', fontSize: '0.82rem' }}>Escreva o assunto ou o nome da atividade realizada com os alunos.</p>
        </div>
    </div>
    );
};

export default ActivityRegistry;
