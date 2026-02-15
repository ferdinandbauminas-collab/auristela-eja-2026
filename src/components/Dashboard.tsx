import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { AttendanceRecord } from '../lib/supabase';
import {
    BarChart3, Users, AlertTriangle, TrendingUp,
    ArrowLeft, Calendar, ShieldAlert
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
    onBack: () => void;
}

interface RedFlag {
    type: 'danger' | 'warning';
    title: string;
    reason: string;
    student: string;
    class: string;
}

interface StudentStats {
    name: string;
    className: string;
    absenceCount: number;
    totalClasses: number;
    history: { date: string; status: string }[];
    selectiveEvasionDays: number;
}

const Dashboard = ({ onBack }: Props) => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [redFlags, setRedFlags] = useState<RedFlag[]>([]);

    useEffect(() => {
        fetchAttendance();
    }, []);

    async function fetchAttendance() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('ef_attendance')
                .select('*')
                .order('date', { ascending: true });

            if (error) throw error;
            if (data) {
                processDashboardData(data as AttendanceRecord[]);
            }
        } catch (err) {
            console.error('Erro ao buscar dados do dashboard:', err);
        } finally {
            setLoading(false);
        }
    }

    const processDashboardData = (data: AttendanceRecord[]) => {
        const students: Record<string, StudentStats> = {};
        const classes: Record<string, { present: number; total: number }> = {};
        const dailyCompliance: Record<string, Set<string>> = {};

        data.forEach(entry => {
            const studentKey = `${entry.student_name}_${entry.class_name}`;
            const normalizedStatus = entry.status.toLowerCase();

            // Stats por Aluno
            if (!students[studentKey]) {
                students[studentKey] = {
                    name: entry.student_name,
                    className: entry.class_name,
                    absenceCount: 0,
                    totalClasses: 0,
                    history: [],
                    selectiveEvasionDays: 0
                };
            }
            students[studentKey].totalClasses++;
            students[studentKey].history.push({ date: entry.date, status: entry.status });

            // Fuga Seletiva (Set por dia/aluno)
            const dailyKey = `${entry.date}_${studentKey}`;
            if (!dailyCompliance[dailyKey]) dailyCompliance[dailyKey] = new Set();
            dailyCompliance[dailyKey].add(entry.status);

            if (normalizedStatus === 'absent' || normalizedStatus === 'faltou') {
                students[studentKey].absenceCount++;
            }

            // Stats por Turma
            if (!classes[entry.class_name]) {
                classes[entry.class_name] = { present: 0, total: 0 };
            }
            classes[entry.class_name].total++;
            if (normalizedStatus === 'present' || normalizedStatus === 'presente') {
                classes[entry.class_name].present++;
            }
        });

        // Pós-processamento: Fuga Seletiva e Flags
        const flags: RedFlag[] = [];
        Object.entries(dailyCompliance).forEach(([key, statuses]) => {
            if ((statuses.has('present') || statuses.has('presente')) &&
                (statuses.has('absent') || statuses.has('faltou'))) {
                const studentKey = key.split('_').slice(1).join('_');
                if (students[studentKey]) students[studentKey].selectiveEvasionDays++;
            }
        });

        Object.values(students).forEach(student => {
            // Flag: 3 Faltas Consecutivas
            let consecutive = 0;
            for (let i = student.history.length - 1; i >= 0; i--) {
                const status = student.history[i].status.toLowerCase();
                if (status === 'absent' || status === 'faltou') {
                    consecutive++;
                    if (consecutive >= 3) {
                        flags.push({
                            type: 'danger',
                            title: 'Risco de Abandono',
                            reason: 'Mais de 3 faltas seguidas.',
                            student: student.name,
                            class: student.className
                        });
                        break;
                    }
                } else {
                    consecutive = 0;
                }
            }

            // Flag: Fuga Seletiva
            if (student.selectiveEvasionDays > 0) {
                flags.push({
                    type: 'warning',
                    title: 'Fuga Seletiva',
                    reason: `Faltou a aulas isoladas em ${student.selectiveEvasionDays} dias.`,
                    student: student.name,
                    class: student.className
                });
            }
        });

        const totalPresences = data.filter(d => {
            const status = d.status.toLowerCase();
            return status === 'present' || status === 'presente';
        }).length;

        setRedFlags(flags);
        setStats({
            totalAttendance: data.length,
            overallFrequency: data.length > 0 ? ((totalPresences / data.length) * 100).toFixed(1) : 0,
            activeRisks: flags.length,
            topStudents: Object.values(students).sort((a, b) => b.absenceCount - a.absenceCount).slice(0, 5),
            classRanking: Object.entries(classes).map(([name, s]) => ({
                name,
                freq: ((s.present / s.total) * 100).toFixed(0)
            })).sort((a, b) => Number(b.freq) - Number(a.freq))
        });
    };

    if (loading) {
        return (
            <div style={{ padding: '80px 20px', textAlign: 'center', color: '#6366f1' }}>
                <TrendingUp size={48} className="animate-pulse" style={{ margin: '0 auto 20px' }} />
                <p style={{ fontWeight: 700 }}>GERANDO RELATÓRIOS...</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', color: '#1e293b', padding: '20px 0' }}
        >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
                <button
                    onClick={onBack}
                    style={{ border: 'none', background: 'white', padding: '12px 20px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 8px 16px rgba(0,0,0,0.05)', fontWeight: 800, color: '#6366f1', fontSize: '0.8rem' }}
                >
                    <ArrowLeft size={18} strokeWidth={3} /> VOLTAR AO INÍCIO
                </button>
                <div style={{ textAlign: 'right' }}>
                    <h1 style={{ margin: 0, fontSize: '1.4rem', color: '#064e3b', fontWeight: 900 }}>PAINEL DE GESTÃO</h1>
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>ETAPA EJA 2026</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '30px' }}>
                <div className="glass-card" style={{ padding: '24px', textAlign: 'center', background: 'white', border: '1px solid #f1f5f9' }}>
                    <div style={{ background: 'rgba(99, 102, 241, 0.1)', width: '44px', height: '44px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                        <TrendingUp size={22} color="#6366f1" />
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900, color: '#1e293b' }}>{stats?.overallFrequency}%</h3>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Frequência Média</p>
                </div>

                <div className="glass-card" style={{ padding: '24px', textAlign: 'center', background: 'white', border: '1px solid #f1f5f9' }}>
                    <div style={{ background: 'rgba(244, 63, 94, 0.1)', width: '44px', height: '44px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                        <ShieldAlert size={22} color="#f43f5e" />
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900, color: '#1e293b' }}>{stats?.activeRisks}</h3>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Alertas de Risco</p>
                </div>

                <div className="glass-card" style={{ padding: '24px', textAlign: 'center', background: 'white', border: '1px solid #f1f5f9' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', width: '44px', height: '44px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                        <Users size={22} color="#10b981" />
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900, color: '#1e293b' }}>{stats?.totalAttendance}</h3>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Total de Aulas</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
                {/* Bandeiras Vermelhas / Gatilhos */}
                <div className="glass-card" style={{ padding: '24px', background: 'white', border: '1px solid #f1f5f9' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', marginBottom: '24px', color: '#f43f5e', fontWeight: 900, textTransform: 'uppercase' }}>
                        <AlertTriangle size={20} /> Gatilhos para Intervenção
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {redFlags.length === 0 ? (
                            <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 20px', border: '2px dashed #f1f5f9', borderRadius: '20px' }}>
                                <p style={{ fontWeight: 700 }}>Nenhum risco detectado 🎉</p>
                                <p style={{ fontSize: '0.8rem', margin: 0 }}>O engajamento está positivo.</p>
                            </div>
                        ) : redFlags.slice(0, 6).map((flag, i) => (
                            <div key={i} style={{ padding: '14px', borderRadius: '16px', border: `1px solid ${flag.type === 'danger' ? '#fee2e2' : '#fef3c7'}`, background: flag.type === 'danger' ? '#fef2f2' : '#fffbeb' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                    <span style={{ fontWeight: 900, fontSize: '0.7rem', color: flag.type === 'danger' ? '#ef4444' : '#d97706', textTransform: 'uppercase' }}>{flag.title}</span>
                                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8' }}>{flag.class}</span>
                                </div>
                                <p style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: 800, color: '#1e293b' }}>{flag.student}</p>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>{flag.reason}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ranking de Turmas */}
                <div className="glass-card" style={{ padding: '24px', background: 'white', border: '1px solid #f1f5f9' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', marginBottom: '24px', color: '#6366f1', fontWeight: 900, textTransform: 'uppercase' }}>
                        <BarChart3 size={20} /> Frequência por Turma
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {stats?.classRanking.slice(0, 8).map((c: any, i: number) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                                    <span style={{ fontWeight: 800, color: '#475569' }}>{c.name}</span>
                                    <span style={{ fontWeight: 900, color: '#6366f1' }}>{c.freq}%</span>
                                </div>
                                <div style={{ width: '100%', height: '10px', background: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${c.freq}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        style={{ height: '100%', background: '#6366f1', borderRadius: '5px' }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Ranking de Alunos Faltosos */}
            <div className="glass-card" style={{ padding: '24px', background: 'white', marginTop: '20px', border: '1px solid #f1f5f9' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', marginBottom: '24px', color: '#1e293b', fontWeight: 900, textTransform: 'uppercase' }}>
                    <Calendar size={20} /> Top 5 - Alunos com Mais Faltas
                </h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                                <th style={{ padding: '12px', fontSize: '0.7rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Aluno</th>
                                <th style={{ padding: '12px', fontSize: '0.7rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Turma</th>
                                <th style={{ padding: '12px', fontSize: '0.7rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', textAlign: 'center' }}>Total Faltas</th>
                                <th style={{ padding: '12px', fontSize: '0.7rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', textAlign: 'right' }}>Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats?.topStudents.map((s: StudentStats, i: number) => (
                                <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                                    <td style={{ padding: '16px 12px', fontSize: '0.9rem', fontWeight: 800, color: '#1e293b' }}>{s.name}</td>
                                    <td style={{ padding: '16px 12px', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>{s.className}</td>
                                    <td style={{ padding: '16px 12px', fontSize: '1rem', color: '#f43f5e', fontWeight: 900, textAlign: 'center' }}>{s.absenceCount}</td>
                                    <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                                        <button style={{ border: 'none', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '8px 16px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s' }}>
                                            BUSCA ATIVA
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
