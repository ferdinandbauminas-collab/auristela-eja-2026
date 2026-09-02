import { useMemo, useState } from 'react';
import { ArrowLeft, MapPin, Search, UserRoundCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getAllOfficialStudents } from '../lib/officialStudents';
import type { Student } from '../lib/supabase';

interface Props { onLogout: () => void; }

const LOCATIONS = ['Corredor', 'Pátio', 'Banheiro', 'Portão', 'Quadra', 'Outro'];
const SITUATIONS = ['Fora da sala', 'Atraso', 'Aguardando atendimento', 'Saiu da aula com autorização', 'Outro'];

const BedelRegistry = ({ onLogout }: Props) => {
    const students = useMemo(() => getAllOfficialStudents(), []);
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState<Student | null>(null);
    const [location, setLocation] = useState(LOCATIONS[0]);
    const [situation, setSituation] = useState(SITUATIONS[0]);
    const [notes, setNotes] = useState('');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const filteredStudents = students.filter(student =>
        student.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(
            query.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        )
    );

    const register = async () => {
        if (!selected) return;
        setSaving(true);
        setMessage('');
        const { error } = await supabase.from('ef_out_of_class_records').insert({
            student_id: selected.id,
            student_name: selected.name,
            class_name: selected.class_id,
            location,
            situation,
            notes: notes.trim() || null,
            recorded_by: 'COORDENAÇÃO'
        });
        setSaving(false);
        if (error) {
            setMessage('Não foi possível salvar. Avise a coordenação.');
            return;
        }
        setMessage(`${selected.name} foi registrado(a) às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}.`);
        setSelected(null);
        setNotes('');
    };

    return (
        <main style={{ minHeight: '86vh', padding: '20px' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
                <button onClick={onLogout} aria-label="Sair" style={backButtonStyle}><ArrowLeft size={22} /></button>
                <div>
                    <p style={eyebrowStyle}>ACESSO DA COORDENAÇÃO</p>
                    <h1 style={{ fontSize: '1.35rem', color: '#064e3b', fontWeight: 900 }}>REGISTRO DE CIRCULAÇÃO</h1>
                </div>
            </header>

            {!selected ? <>
                <div style={{ position: 'relative', marginBottom: '16px' }}>
                    <Search size={19} color="#64748b" style={{ position: 'absolute', left: '15px', top: '15px' }} />
                    <input aria-label="Buscar aluno" value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar aluno pelo nome" style={{ ...inputStyle, paddingLeft: '46px' }} />
                </div>
                <p style={{ ...eyebrowStyle, marginBottom: '12px' }}>{filteredStudents.length} ALUNOS — ORDEM ALFABÉTICA</p>
                <div style={{ display: 'grid', gap: '9px' }}>
                    {filteredStudents.map(student => <button key={student.id} onClick={() => { setSelected(student); setMessage(''); }} style={studentButtonStyle}>
                        <span style={{ ...avatarStyle, background: '#dcfce7' }}><UserRoundCheck size={19} /></span>
                        <span style={{ textAlign: 'left' }}><strong style={{ display: 'block', color: '#064e3b', fontSize: '.86rem' }}>{student.name}</strong><small style={{ color: '#64748b' }}>{student.class_id}</small></span>
                    </button>)}
                </div>
            </> : <section className="glass-card" style={{ padding: '22px' }}>
                <button onClick={() => setSelected(null)} style={{ ...backButtonStyle, marginBottom: '18px' }}><ArrowLeft size={19} /> Voltar à lista</button>
                <p style={eyebrowStyle}>REGISTRAR OCORRÊNCIA</p>
                <h2 style={{ fontSize: '1.15rem', margin: '6px 0' }}>{selected.name}</h2>
                <p style={{ color: '#64748b', fontSize: '.82rem', marginBottom: '20px' }}>{selected.class_id}</p>
                <label style={labelStyle}>LOCAL</label>
                <select value={location} onChange={event => setLocation(event.target.value)} style={inputStyle}>{LOCATIONS.map(item => <option key={item}>{item}</option>)}</select>
                <label style={labelStyle}>SITUAÇÃO</label>
                <select value={situation} onChange={event => setSituation(event.target.value)} style={inputStyle}>{SITUATIONS.map(item => <option key={item}>{item}</option>)}</select>
                <label style={labelStyle}>OBSERVAÇÃO (OPCIONAL)</label>
                <textarea value={notes} onChange={event => setNotes(event.target.value)} rows={3} placeholder="Ex.: aguardando atendimento da coordenação" style={{ ...inputStyle, resize: 'vertical' }} />
                <button onClick={register} disabled={saving} className="btn-primary" style={{ width: '100%', marginTop: '20px', opacity: saving ? .7 : 1 }}><MapPin size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />{saving ? 'SALVANDO...' : 'REGISTRAR'}</button>
            </section>}
            {message && <p style={{ marginTop: '16px', padding: '13px', borderRadius: '12px', background: '#ecfdf5', color: '#047857', fontWeight: 700, fontSize: '.84rem' }}>{message}</p>}
        </main>
    );
};

const inputStyle = { width: '100%', padding: '14px', border: '1px solid #cbd5e1', borderRadius: '14px', color: '#064e3b', background: 'white', marginBottom: '16px', fontSize: '.9rem' } as const;
const labelStyle = { display: 'block', color: '#475569', fontSize: '.7rem', fontWeight: 900, letterSpacing: '1px', marginBottom: '7px' } as const;
const eyebrowStyle = { color: '#059669', fontSize: '.68rem', fontWeight: 900, letterSpacing: '1.2px' } as const;
const backButtonStyle = { border: 'none', borderRadius: '12px', padding: '10px', display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ecfdf5', color: '#047857', cursor: 'pointer', fontWeight: 800 } as const;
const studentButtonStyle = { border: '1px solid rgba(0,0,0,.06)', borderRadius: '16px', padding: '12px', background: 'white', display: 'flex', alignItems: 'center', gap: '11px', cursor: 'pointer', width: '100%' } as const;
const avatarStyle = { minWidth: '38px', height: '38px', borderRadius: '12px', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' } as const;

export default BedelRegistry;

