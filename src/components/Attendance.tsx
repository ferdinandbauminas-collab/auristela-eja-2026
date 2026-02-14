import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Teacher, Student, Discipline, AttendanceRecord } from '../lib/supabase';
import { Check, X, Send, LogOut, Users, BookOpen, Calendar as CalendarIcon, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomSelect from './CustomSelect';

interface Props {
    teacher: Teacher;
    onLogout: () => void;
}

// --- DATABASE SYNC ---
// Removendo atribuições fictícias para garantir uso dos dados de 2026

const Attendance = ({ teacher, onLogout }: Props) => {
    const [disciplines, setDisciplines] = useState<Discipline[]>([]);
    const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline | null>(null);
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [students, setStudents] = useState<Student[]>([]);
    const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent'>>({});
    const [saving, setSaving] = useState(false);
    const [today] = useState(new Date().toLocaleDateString('pt-BR'));

    // Wizard & Modal states
    const [isWizardMode, setIsWizardMode] = useState(false);
    const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
    const [isDisciplineModalOpen, setIsDisciplineModalOpen] = useState(false);
    const [isClassModalOpen, setIsClassModalOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        async function loadData() {
            try {
                const { data, error } = await supabase.from('ef_classes').select('*').eq('teacher_id', teacher.id);
                if (error) throw error;
                if (data && data.length > 0) {
                    setDisciplines(data as Discipline[]);
                }
            } catch (err) {
                console.error('Erro ao buscar disciplinas:', err);
            }
        }
        loadData();
    }, [teacher]);

    useEffect(() => {
        if (selectedClass) {
            async function loadStudents() {
                const { data, error } = await supabase.from('ef_students').select('*').eq('class_id', selectedClass).order('name');
                if (!error && data) {
                    setStudents(data);
                    const initial: Record<string, 'present' | 'absent'> = {};
                    data.forEach(s => initial[s.id] = 'present');
                    setAttendance(initial);
                }
            }
            loadStudents();
        }
    }, [selectedClass]);

    const handleSave = async () => {
        if (!selectedDiscipline || !selectedClass) return;
        setSaving(true);

        const records: AttendanceRecord[] = students.map(s => ({
            teacher_name: teacher.name,
            discipline: selectedDiscipline.name,
            class_name: selectedClass,
            student_name: s.name,
            status: attendance[s.id],
            date: new Date().toISOString().split('T')[0]
        }));

        const { error } = await supabase.from('ef_attendance').insert(records);
        setSaving(false);

        if (!error) {
            setIsSuccess(true);
            setIsWizardMode(false);
            setCurrentStudentIndex(0);
        } else {
            alert('Falha ao salvar: ' + error.message);
        }
    };

    const handleMark = (status: 'present' | 'absent') => {
        const student = students[currentStudentIndex];
        setAttendance(prev => ({ ...prev, [student.id]: status }));

        if (currentStudentIndex < students.length - 1) {
            setCurrentStudentIndex(prev => prev + 1);
        }
    };

    const disciplineOptions = Array.from(new Set(disciplines.map(d => d.name))).map((name, idx) => ({
        value: name,
        label: name,
        color: ['#10b981', '#3b82f6', '#6366f1', '#14b8a6', '#f43f5e'][idx % 5]
    }));

    const classOptions = disciplines
        .filter(d => d.name === selectedDiscipline?.name)
        .map((d, idx) => ({
            value: d.grade,
            label: d.grade,
            color: ['#059669', '#0d9488', '#0891b2', '#0284c7', '#2563eb'][idx % 5]
        }));

    const handleDisciplineChange = (name: string) => {
        const disc = disciplines.find(d => d.name === name);
        setSelectedDiscipline(disc || null);
        setSelectedClass('');
        setIsDisciplineModalOpen(false);
        setIsWizardMode(false);
    };

    const handleClassChange = (className: string) => {
        setSelectedClass(className);
        setIsClassModalOpen(false);
        setIsWizardMode(false);
        setCurrentStudentIndex(0);
    };

    const currentStudent = students[currentStudentIndex];
    const isLastStudent = currentStudentIndex === students.length - 1;

    return (
        <div style={{ minHeight: '82vh', display: 'flex', flexDirection: 'column', padding: '0 20px 40px 20px' }}>
            {!isWizardMode && !isSuccess && (
                <header style={{ textAlign: 'center', marginBottom: '20px', paddingTop: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#94a3b8', marginBottom: '8px' }}>
                        <CalendarIcon size={16} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{today}</span>
                    </div>
                    <h1 style={{ fontSize: '1.5rem', color: '#064e3b', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>{teacher.name}</h1>
                </header>
            )}

            {!isWizardMode && !isSuccess && <div style={{ flex: 1 }} />}

            <AnimatePresence mode="wait">
                {isSuccess ? (
                    <motion.div
                        key="success-step"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flex: 1,
                            gap: '24px',
                            textAlign: 'center',
                            padding: '24px'
                        }}
                    >
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '40px',
                            background: '#10b981',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)'
                        }}>
                            <Check size={40} strokeWidth={3} />
                        </div>

                        <div>
                            <h2 style={{ fontSize: '1.5rem', color: '#064e3b', fontWeight: 800, marginBottom: '8px' }}>
                                Frequência Enviada!
                            </h2>
                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                                Os dados foram salvos com sucesso no banco de dados.
                            </p>
                        </div>

                        <div style={{
                            width: '100%',
                            background: 'white',
                            borderRadius: '24px',
                            padding: '20px',
                            border: '1px solid #f1f5f9',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600 }}>DATA</span>
                                <span style={{ color: '#1e293b', fontWeight: 700 }}>{today}</span>
                            </div>
                            <div style={{ height: '1px', background: '#f1f5f9' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600 }}>TURMA</span>
                                <span style={{ color: '#1e293b', fontWeight: 700 }}>{selectedClass}</span>
                            </div>
                            <div style={{ height: '1px', background: '#f1f5f9' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600 }}>DISCIPLINA</span>
                                <span style={{ color: '#1e293b', fontWeight: 700 }}>{selectedDiscipline?.name}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setIsSuccess(false);
                                setSelectedClass('');
                                setSelectedDiscipline(null);
                            }}
                            style={{
                                width: '100%',
                                padding: '16px',
                                borderRadius: '18px',
                                border: 'none',
                                background: '#1e293b',
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '1rem',
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                                marginTop: '10px'
                            }}
                            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            Fazer Nova Chamada
                        </button>
                    </motion.div>
                ) : !isWizardMode ? (
                    <motion.div
                        key="selection-step"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            flex: 1,
                            gap: '12px',
                            paddingBottom: '60px' // Compensação visual para não ficar colado no fundo
                        }}
                    >
                        {/* SELECTION CARDS */}
                        <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsDisciplineModalOpen(true)}
                                style={{
                                    width: '100%', padding: '24px 24px', borderRadius: '32px', border: 'none',
                                    background: 'white', cursor: 'pointer', textAlign: 'left',
                                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
                                    display: 'flex', alignItems: 'center', gap: '20px'
                                }}
                            >
                                <div style={{
                                    width: '56px', height: '56px', background: 'rgba(16, 185, 129, 0.05)',
                                    borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <BookOpen size={28} color="#10b981" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.5px' }}>Disciplina</p>
                                    <h2 style={{ fontSize: '1.25rem', color: '#064e3b', fontWeight: 900, lineHeight: 1.2 }}>
                                        {selectedDiscipline ? selectedDiscipline.name : 'QUAL A DISCIPLINA?'}
                                    </h2>
                                </div>
                                <ChevronRight size={22} color="#cbd5e1" />
                            </motion.button>

                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => selectedDiscipline && setIsClassModalOpen(true)}
                                style={{
                                    width: '100%', padding: '24px 24px', borderRadius: '32px', border: 'none',
                                    background: selectedDiscipline ? 'white' : 'rgba(0,0,0,0.02)',
                                    cursor: selectedDiscipline ? 'pointer' : 'not-allowed',
                                    textAlign: 'left',
                                    boxShadow: selectedDiscipline ? '0 10px 25px -5px rgba(0,0,0,0.05)' : 'none',
                                    display: 'flex', alignItems: 'center', gap: '20px',
                                    opacity: selectedDiscipline ? 1 : 0.5
                                }}
                            >
                                <div style={{
                                    width: '56px', height: '56px', background: 'rgba(59, 130, 246, 0.05)',
                                    borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Users size={28} color="#3b82f6" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.5px' }}>Turma (Módulo)</p>
                                    <h2 style={{ fontSize: '1.25rem', color: '#064e3b', fontWeight: 900, lineHeight: 1.2 }}>
                                        {selectedClass ? selectedClass : 'PARA QUAL TURMA?'}
                                    </h2>
                                </div>
                                <ChevronRight size={22} color="#cbd5e1" />
                            </motion.button>
                        </div>

                        {selectedClass && (
                            <motion.button
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsWizardMode(true)}
                                className="btn-primary"
                                style={{
                                    width: '100%', padding: '24px', borderRadius: '28px',
                                    fontSize: '1.2rem', fontWeight: 900,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                                    boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)'
                                }}
                            >
                                <Users size={24} /> INICIAR FREQUÊNCIA
                            </motion.button>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="wizard-step"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                    >
                        <div className="glass-card" style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '20px',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            position: 'relative',
                            minHeight: 'calc(100vh - 120px)' // Garante que o card ocupe o máximo de altura
                        }}>
                            {/* Student Info Container - Centered in the middle space */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStudent?.id}
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 1.1, y: -10 }}
                                    style={{
                                        textAlign: 'center',
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        width: '100%',
                                        paddingBottom: '20px'
                                    }}
                                >
                                    {/* Barra de Progresso no Topo */}
                                    <div style={{
                                        width: '100%',
                                        height: '6px',
                                        background: 'rgba(16, 185, 129, 0.1)',
                                        borderRadius: '3px',
                                        marginBottom: '30px',
                                        overflow: 'hidden',
                                        position: 'relative'
                                    }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${((currentStudentIndex + 1) / students.length) * 100}%` }}
                                            style={{
                                                height: '100%',
                                                background: '#10b981',
                                                borderRadius: '3px',
                                                boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)'
                                            }}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            right: 0,
                                            top: '-20px',
                                            fontSize: '0.7rem',
                                            fontWeight: 900,
                                            color: '#10b981'
                                        }}>
                                            {currentStudentIndex + 1} / {students.length}
                                        </div>
                                    </div>

                                    <div style={{
                                        width: '130px',
                                        height: '130px',
                                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))',
                                        borderRadius: '44px',
                                        margin: '0 auto 20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '3.5rem',
                                        fontWeight: 900,
                                        color: 'var(--primary)',
                                        border: '2px solid rgba(16, 185, 129, 0.1)',
                                        boxShadow: '0 8px 16px -4px rgba(16, 185, 129, 0.1)'
                                    }}>
                                        {currentStudent?.name.charAt(0)}
                                    </div>

                                    <div style={{ width: '100%', padding: '0 10px' }}>
                                        <p style={{ color: '#94a3b8', fontWeight: 800, fontSize: '0.85rem', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            {selectedClass}
                                        </p>
                                        <h2 style={{
                                            fontSize: '1.8rem', // Ajustado para garantir as 2 linhas
                                            color: '#000000',
                                            fontWeight: 900,
                                            lineHeight: 1.1,
                                            margin: 0,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            maxHeight: '4rem' // Limita a altura para 2 linhas
                                        }}>
                                            {currentStudent?.name}
                                        </h2>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Action Buttons Container - Positioned for comfortable thumb access */}
                            <div style={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                                marginTop: 'auto',
                                paddingBottom: '40px'
                            }}>
                                <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                                    <motion.button
                                        whileTap={{ scale: 0.96 }}
                                        onClick={() => handleMark('present')}
                                        style={{
                                            flex: 1,
                                            padding: '24px 10px',
                                            borderRadius: '24px',
                                            border: 'none',
                                            background: '#10b981',
                                            color: 'white',
                                            fontWeight: 900,
                                            fontSize: '1.2rem',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '6px',
                                            boxShadow: '0 8px 24px -4px rgba(16, 185, 129, 0.4)'
                                        }}
                                    >
                                        <Check size={32} strokeWidth={3} /> PRESENTE
                                    </motion.button>

                                    <motion.button
                                        whileTap={{ scale: 0.96 }}
                                        onClick={() => handleMark('absent')}
                                        style={{
                                            flex: 1,
                                            padding: '24px 10px',
                                            borderRadius: '24px',
                                            border: 'none',
                                            background: '#ef4444',
                                            color: 'white',
                                            fontWeight: 900,
                                            fontSize: '1.2rem',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '6px',
                                            boxShadow: '0 8px 24px -4px rgba(239, 68, 68, 0.4)'
                                        }}
                                    >
                                        <X size={32} strokeWidth={3} /> FALTOU
                                    </motion.button>
                                </div>

                                {/* Final Save Action - Integrated into the bottom flow */}
                                {isLastStudent && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        style={{ width: '100%', marginTop: '4px' }}
                                    >
                                        <motion.button
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleSave}
                                            disabled={saving}
                                            style={{
                                                width: '100%',
                                                padding: '18px',
                                                borderRadius: '20px',
                                                border: 'none',
                                                background: '#064e3b',
                                                color: 'white',
                                                fontWeight: 800,
                                                fontSize: '1.1rem',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px',
                                                boxShadow: '0 8px 20px -4px rgba(6, 78, 59, 0.3)'
                                            }}
                                        >
                                            {saving ? 'Salvando...' : <><Send size={20} /> FINALIZAR E SALVAR</>}
                                        </motion.button>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modais */}
            <CustomSelect
                options={disciplineOptions}
                value={selectedDiscipline?.name || ''}
                onChange={handleDisciplineChange}
                externalOpen={isDisciplineModalOpen}
                onClose={() => setIsDisciplineModalOpen(false)}
                hideTrigger={true}
                showSearch={false}
            />

            <CustomSelect
                options={classOptions}
                value={selectedClass}
                onChange={handleClassChange}
                externalOpen={isClassModalOpen}
                onClose={() => setIsClassModalOpen(false)}
                hideTrigger={true}
                showSearch={false}
            />

            {/* Botão de Logout fixo no topo direito */}
            {!isWizardMode && !isSuccess && (
                <button
                    onClick={onLogout}
                    style={{
                        position: 'fixed', top: '20px', right: '20px',
                        border: 'none', background: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444', padding: '12px', borderRadius: '16px',
                        cursor: 'pointer', zIndex: 10
                    }}
                >
                    <LogOut size={22} />
                </button>
            )}
        </div>
    );
};

export default Attendance;
