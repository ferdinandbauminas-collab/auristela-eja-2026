import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, BookOpenCheck, CalendarDays, Check, ChevronRight, FileText, LoaderCircle, Printer, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Activity, ActivityResult, Teacher } from '../lib/supabase';
import { getOfficialDisciplines } from '../lib/officialSchedule';
import { getOfficialStudents } from '../lib/officialStudents';

interface Props { teacher: Teacher; onBack: () => void; }

const today = () => new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit'
}).format(new Date());

const ActivityRegistry = ({ teacher, onBack }: Props) => {
    const disciplines = useMemo(() => getOfficialDisciplines(teacher), [teacher]);
    const disciplineNames = useMemo(() => Array.from(new Set(disciplines.map(item => item.name))), [disciplines]);
    const teacherClasses = useMemo(() => Array.from(new Set(disciplines.map(item => item.grade))), [disciplines]);
    const [discipline, setDiscipline] = useState(disciplineNames.length === 1 ? disciplineNames[0] : '');
    const availableClasses = useMemo(() => Array.from(new Set(disciplines.filter(item => item.name === discipline).map(item => item.grade))), [disciplines, discipline]);
    const [className, setClassName] = useState('');
    const [theme, setTheme] = useState('');
    const [activityDate, setActivityDate] = useState(today());
    const [activities, setActivities] = useState<Activity[]>([]);
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const [results, setResults] = useState<ActivityResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savingResults, setSavingResults] = useState(false);
    const [resultsChanged, setResultsChanged] = useState(false);
    const [reportMode, setReportMode] = useState(false);
    const [reportClass, setReportClass] = useState('');
    const [reportStudent, setReportStudent] = useState('');
    const [reportResults, setReportResults] = useState<ActivityResult[]>([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (availableClasses.length === 1) setClassName(availableClasses[0]);
        else if (!availableClasses.includes(className)) setClassName('');
    }, [availableClasses, className]);

    const loadActivities = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('ef_activities').select('*').eq('teacher_id', teacher.id)
            .order('activity_date', { ascending: false }).order('created_at', { ascending: false });
        if (error) setMessage(`Não foi possível carregar as atividades: ${error.message}`);
        else setActivities(data || []);
        setLoading(false);
    }, [teacher.id]);

    useEffect(() => { loadActivities(); }, [loadActivities]);

    const createActivity = async () => {
        if (!theme.trim() || !discipline || !className) {
            setMessage('Preencha o tema, a disciplina e a turma.');
            return;
        }
        setSaving(true); setMessage('');
        const { data, error } = await supabase.from('ef_activities').insert({
            teacher_id: teacher.id, teacher_name: teacher.name, discipline,
            class_name: className, theme: theme.trim(), activity_date: activityDate
        }).select().single();
        if (error || !data) {
            setMessage(`Não foi possível salvar: ${error?.message || 'erro desconhecido'}`);
            setSaving(false); return;
        }
        const studentResults = getOfficialStudents(className).map(student => ({
            activity_id: data.id, student_name: student.name, status: 'pendente'
        }));
        const { error: resultError } = await supabase.from('ef_activity_results').insert(studentResults);
        if (resultError) {
            await supabase.from('ef_activities').delete().eq('id', data.id);
            setMessage(`A atividade não foi concluída: ${resultError.message}`);
        } else {
            setTheme('');
            setMessage('Atividade salva com sucesso.');
            await loadActivities();
        }
        setSaving(false);
    };

    const openActivity = async (activity: Activity) => {
        setSelectedActivity(activity); setLoading(true); setMessage(''); setResultsChanged(false);
        const { data, error } = await supabase.from('ef_activity_results').select('*')
            .eq('activity_id', activity.id).order('student_name');
        if (error) setMessage(`Não foi possível abrir a atividade: ${error.message}`);
        else setResults(data || []);
        setLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const updateStatus = (result: ActivityResult, status: ActivityResult['status']) => {
        setResults(current => current.map(item => item.id === result.id ? {
            ...item, status, completed_at: status === 'realizou' ? today() : null
        } : item));
        setResultsChanged(true);
        setMessage('');
    };

    const allStudentsSelected = results.length > 0 && results.every(result => result.status !== 'pendente');

    const saveResults = async () => {
        if (!allStudentsSelected) return;
        setSavingResults(true); setMessage('');
        const updatedAt = new Date().toISOString();
        const { error } = await supabase.from('ef_activity_results').upsert(
            results.map(result => ({ ...result, updated_at: updatedAt }))
        );
        if (error) setMessage(`Não foi possível salvar os resultados: ${error.message}`);
        else {
            setResults(current => current.map(result => ({ ...result, updated_at: updatedAt })));
            setResultsChanged(false);
            setMessage('Resultados da atividade salvos com sucesso.');
        }
        setSavingResults(false);
    };

    const loadReport = async () => {
        if (!reportStudent) return;
        const activityIds = activities.filter(activity => activity.class_name === reportClass).map(activity => activity.id);
        if (activityIds.length === 0) { setReportResults([]); return; }
        setLoading(true); setMessage('');
        const { data, error } = await supabase.from('ef_activity_results').select('*')
            .in('activity_id', activityIds).eq('student_name', reportStudent);
        if (error) setMessage(`Não foi possível gerar o relatório: ${error.message}`);
        else setReportResults(data || []);
        setLoading(false);
    };

    if (reportMode) {
        const reportActivities = reportResults.map(result => ({
            result, activity: activities.find(activity => activity.id === result.activity_id)
        })).filter(item => item.activity).sort((a, b) => (b.activity?.activity_date || '').localeCompare(a.activity?.activity_date || ''));
        return (
            <div style={pageStyle} className="activity-report-page">
                <button onClick={() => { setReportMode(false); setReportResults([]); setReportStudent(''); setMessage(''); }} style={backStyle} className="report-hide-print"><ArrowLeft size={20} /> VOLTAR ÀS ATIVIDADES</button>
                <main style={{ maxWidth: '720px', width: '100%', margin: '22px auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '22px' }}>
                        <span style={mainIconStyle} className="report-hide-print"><FileText size={34} /></span>
                        <p style={eyebrowStyle}>{teacher.name}</p>
                        <h1 style={headingStyle}>Relatório individual de atividades</h1>
                    </div>
                    <section style={cardStyle} className="report-hide-print">
                        <label style={labelStyle}>Turma
                            <select value={reportClass} onChange={event => { setReportClass(event.target.value); setReportStudent(''); setReportResults([]); }} style={inputStyle}>
                                <option value="">Selecione a turma</option>
                                {teacherClasses.map(name => <option key={name} value={name}>{name}</option>)}
                            </select>
                        </label>
                        <label style={labelStyle}>Aluno
                            <select value={reportStudent} onChange={event => { setReportStudent(event.target.value); setReportResults([]); }} disabled={!reportClass} style={inputStyle}>
                                <option value="">Selecione o aluno</option>
                                {getOfficialStudents(reportClass).map(student => <option key={student.id} value={student.name}>{student.name}</option>)}
                            </select>
                        </label>
                        <button onClick={loadReport} disabled={!reportStudent} style={{ ...saveStyle, opacity: reportStudent ? 1 : 0.6 }}><FileText size={20} /> GERAR RELATÓRIO</button>
                    </section>
                    {message && <p style={messageStyle}>{message}</p>}
                    {loading ? <Loading /> : reportStudent && reportResults.length === 0 ? (
                        <div style={{ ...emptyStyle, marginTop: '20px' }}>Nenhuma atividade encontrada para este aluno.</div>
                    ) : reportResults.length > 0 && (
                        <section style={{ marginTop: '24px' }}>
                            <div style={{ marginBottom: '18px' }}><h2 style={{ color: '#064e3b' }}>{reportStudent}</h2><p style={{ color: '#64748b', marginTop: '5px' }}>{reportClass} · Professor(a): {teacher.name}</p></div>
                            <div style={{ display: 'grid', gap: '10px' }}>
                                {reportActivities.map(({ result, activity }) => (
                                    <div key={result.id} style={studentStyle}>
                                        <div><strong style={{ color: '#064e3b' }}>{activity?.theme}</strong><p style={{ color: '#64748b', fontSize: '0.82rem', marginTop: '5px' }}>{activity?.discipline} · {new Date(`${activity?.activity_date}T12:00:00`).toLocaleDateString('pt-BR')}</p></div>
                                        <span style={{ color: result.status === 'realizou' ? '#047857' : '#92400e', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.78rem' }}>{statusLabel(result.status)}</span>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => window.print()} style={{ ...saveStyle, marginTop: '18px' }} className="report-hide-print"><Printer size={20} /> IMPRIMIR OU SALVAR EM PDF</button>
                        </section>
                    )}
                </main>
            </div>
        );
    }

    if (selectedActivity) return (
        <div style={pageStyle}>
            <button onClick={() => { setSelectedActivity(null); setResults([]); setMessage(''); setResultsChanged(false); }} style={backStyle}><ArrowLeft size={20} /> VOLTAR ÀS ATIVIDADES</button>
            <div style={{ maxWidth: '620px', width: '100%', margin: '24px auto' }}>
                <p style={eyebrowStyle}>{selectedActivity.discipline} · {selectedActivity.class_name}</p>
                <h1 style={headingStyle}>{selectedActivity.theme}</h1>
                <p style={{ color: '#64748b', margin: '8px 0 22px' }}>Clique no resultado de cada aluno para atualizar. Um aluno que entregou depois pode ser marcado como “Realizou”.</p>
                {message && <p style={messageStyle}>{message}</p>}
                {loading ? <Loading /> : (
                    <div style={{ display: 'grid', gap: '10px' }}>
                        {results.map(result => (
                            <div key={result.id} style={studentStyle}>
                                <strong style={{ color: '#0f172a', lineHeight: 1.3 }}>{result.student_name}</strong>
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                    <StatusButton active={result.status === 'realizou'} onClick={() => updateStatus(result, 'realizou')} label="Realizou" />
                                    <StatusButton active={result.status === 'parcial'} onClick={() => updateStatus(result, 'parcial')} label="Parcial" />
                                    <StatusButton active={result.status === 'nao_realizou'} onClick={() => updateStatus(result, 'nao_realizou')} label="Não fez" />
                                </div>
                            </div>
                        ))}
                        {allStudentsSelected && (
                            <button onClick={saveResults} disabled={savingResults || !resultsChanged} style={{ ...saveStyle, marginTop: '12px', opacity: !resultsChanged ? 0.65 : 1 }}>
                                {savingResults ? <LoaderCircle size={20} /> : <Save size={20} />}
                                {savingResults ? 'SALVANDO...' : resultsChanged ? 'SALVAR RESULTADOS DA ATIVIDADE' : 'RESULTADOS SALVOS'}
                            </button>
                        )}
                        {!allStudentsSelected && (
                            <p style={{ color: '#64748b', textAlign: 'center', padding: '10px', fontSize: '0.85rem' }}>
                                Selecione o resultado de todos os alunos para liberar o botão de salvar.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div style={pageStyle}>
            <button onClick={onBack} style={backStyle}><ArrowLeft size={20} /> VOLTAR</button>
            <main style={{ maxWidth: '620px', width: '100%', margin: '20px auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <span style={mainIconStyle}><BookOpenCheck size={34} /></span>
                    <p style={eyebrowStyle}>{teacher.name}</p>
                    <h1 style={headingStyle}>Registrar atividade</h1>
                </div>

                <section style={cardStyle}>
                    <label style={labelStyle}>Tema da atividade
                        <textarea value={theme} onChange={event => setTheme(event.target.value)} placeholder="Ex.: Produção de identidade visual" rows={3} style={inputStyle} />
                    </label>
                    <label style={labelStyle}>Disciplina
                        <select value={discipline} onChange={event => { setDiscipline(event.target.value); setClassName(''); }} style={inputStyle}>
                            <option value="">Selecione a disciplina</option>
                            {disciplineNames.map(name => <option key={name} value={name}>{name}</option>)}
                        </select>
                    </label>
                    <label style={labelStyle}>Turma
                        <select value={className} onChange={event => setClassName(event.target.value)} disabled={!discipline} style={inputStyle}>
                            <option value="">Selecione a turma</option>
                            {availableClasses.map(name => <option key={name} value={name}>{name}</option>)}
                        </select>
                    </label>
                    <label style={labelStyle}>Data
                        <input type="date" value={activityDate} onChange={event => setActivityDate(event.target.value)} style={inputStyle} />
                    </label>
                    <button onClick={createActivity} disabled={saving} style={saveStyle}>
                        {saving ? <LoaderCircle size={20} /> : <Save size={20} />} {saving ? 'SALVANDO...' : 'SALVAR ATIVIDADE'}
                    </button>
                    {message && <p style={messageStyle}>{message}</p>}
                </section>

                <section style={{ marginTop: '30px' }}>
                    <h2 style={{ color: '#064e3b', fontSize: '1.25rem', marginBottom: '6px' }}>Atividades já realizadas</h2>
                    <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '16px' }}>Clique para consultar ou atualizar os alunos.</p>
                    {loading ? <Loading /> : activities.length === 0 ? (
                        <div style={emptyStyle}>Nenhuma atividade registrada ainda.</div>
                    ) : (
                        <div style={{ display: 'grid', gap: '12px' }}>
                            {activities.map(activity => (
                                <button key={activity.id} onClick={() => openActivity(activity)} style={activityStyle}>
                                    <span style={{ color: '#2563eb' }}><CalendarDays size={23} /></span>
                                    <span style={{ flex: 1, textAlign: 'left' }}>
                                        <strong style={{ display: 'block', color: '#064e3b', fontSize: '1rem' }}>{activity.theme}</strong>
                                        <small style={{ display: 'block', color: '#64748b', marginTop: '5px', lineHeight: 1.35 }}>{activity.discipline} · {activity.class_name}<br />{new Date(`${activity.activity_date}T12:00:00`).toLocaleDateString('pt-BR')}</small>
                                    </span>
                                    <ChevronRight color="#94a3b8" />
                                </button>
                            ))}
                        </div>
                    )}
                    <button onClick={() => { setReportMode(true); setMessage(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ ...saveStyle, marginTop: '22px', background: '#1d4ed8' }}>
                        <FileText size={20} /> GERAR RELATÓRIO
                    </button>
                </section>
            </main>
        </div>
    );
};

const Loading = () => <div style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}><LoaderCircle size={26} /> Carregando...</div>;
const statusLabel = (status: ActivityResult['status']) => ({ pendente: 'Pendente', realizou: 'Realizou', parcial: 'Parcial', nao_realizou: 'Não fez', faltou: 'Faltou' }[status]);
const StatusButton = ({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) => (
    <button onClick={onClick} style={{ border: active ? 'none' : '1px solid #cbd5e1', background: active ? '#059669' : 'white', color: active ? 'white' : '#475569', padding: '8px 10px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}>{active && <Check size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />}{label}</button>
);

const pageStyle = { minHeight: '86vh', display: 'flex', flexDirection: 'column', padding: '20px' } as const;
const backStyle = { alignSelf: 'flex-start', border: 'none', background: 'white', color: '#064e3b', padding: '12px 16px', borderRadius: '16px', display: 'flex', gap: '8px', alignItems: 'center', fontWeight: 800, cursor: 'pointer' } as const;
const eyebrowStyle = { color: '#059669', fontSize: '0.78rem', fontWeight: 900, letterSpacing: '1px', textTransform: 'uppercase' } as const;
const headingStyle = { color: '#064e3b', marginTop: '7px', fontSize: '1.7rem', lineHeight: 1.2 } as const;
const mainIconStyle = { width: '68px', height: '68px', margin: '0 auto 16px', borderRadius: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(59,130,246,.1)', color: '#2563eb' } as const;
const cardStyle = { background: 'white', padding: '22px', borderRadius: '28px', boxShadow: '0 12px 30px -10px rgba(0,0,0,.12)', display: 'grid', gap: '16px' } as const;
const labelStyle = { display: 'grid', gap: '7px', color: '#064e3b', fontWeight: 900, fontSize: '0.82rem', textTransform: 'uppercase' } as const;
const inputStyle = { width: '100%', boxSizing: 'border-box', border: '1px solid #cbd5e1', borderRadius: '15px', padding: '14px', background: 'white', color: '#0f172a', fontSize: '0.95rem', fontFamily: 'inherit' } as const;
const saveStyle = { width: '100%', border: 'none', borderRadius: '17px', padding: '16px', background: '#059669', color: 'white', fontWeight: 900, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' } as const;
const messageStyle = { padding: '12px', borderRadius: '14px', background: 'rgba(59,130,246,.08)', color: '#1e40af', fontWeight: 700, fontSize: '0.85rem' } as const;
const emptyStyle = { background: 'white', padding: '25px', borderRadius: '20px', color: '#64748b', textAlign: 'center' } as const;
const activityStyle = { width: '100%', border: '1px solid rgba(0,0,0,.05)', background: 'white', padding: '17px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '13px', cursor: 'pointer', boxShadow: '0 8px 20px -10px rgba(0,0,0,.12)' } as const;
const studentStyle = { background: 'white', padding: '15px', borderRadius: '17px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', boxShadow: '0 6px 18px -12px rgba(0,0,0,.2)' } as const;

export default ActivityRegistry;
