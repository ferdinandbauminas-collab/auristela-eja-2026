import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Teacher } from '../lib/supabase';
import { GraduationCap, UserCheck, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomSelect from './CustomSelect';

interface Props {
    onLogin: (teacher: Teacher) => void;
}

// --- DATABASE SYNC ---
// Removendo dados fictícios (Dummy Data) para forçar o uso dos dados reais de 2026

const Login = ({ onLogin }: Props) => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isSelectOpen, setIsSelectOpen] = useState(false);

    useEffect(() => {
        async function getTeachers() {
            try {
                setLoading(true);
                const { data, error } = await supabase.from('ef_teachers').select('*').order('name');
                if (error) throw error;
                if (data) {
                    setTeachers(data);
                    if (data.length === 0) setErrorMsg('Nenhum professor cadastrado no banco.');
                }
            } catch (err: any) {
                console.error('Erro ao buscar professores:', err);
                const url = import.meta.env.VITE_SUPABASE_URL;
                const urlHint = url ? `URL: OK` : 'URL: AUSENTE';
                const keyHint = import.meta.env.VITE_SUPABASE_ANON_KEY ? `KEY: OK` : 'KEY: AUSENTE';

                // Teste de conectividade bruta
                let supStatus = 'Testando...';
                let googleStatus = 'Testando...';

                try {
                    await fetch('https://www.google.com', { mode: 'no-cors' });
                    googleStatus = '✅ Google OK';
                } catch (e) {
                    googleStatus = '❌ Google OFF';
                }

                try {
                    await fetch(`${url}/rest/v1/`, { method: 'OPTIONS' });
                    supStatus = '✅ Supabase OK';
                } catch (fErr) {
                    supStatus = '❌ Supabase OFF';
                }

                setErrorMsg(`⚠️ FALHA DE CONEXÃO\n[${urlHint} | ${keyHint}]\n🌍 ${googleStatus} | ${supStatus}\n${err.message || ''}`);
            } finally {
                setLoading(false);
            }
        }
        getTeachers();
    }, []);

    const teacherOptions = teachers.map((t, idx) => ({
        value: t.id,
        label: t.name,
        color: ['#10b981', '#3b82f6', '#6366f1', '#14b8a6', '#f43f5e'][idx % 5]
    }));

    const handleTeacherSelect = (id: string) => {
        const teacher = teachers.find(t => t.id === id);
        if (teacher) {
            onLogin(teacher);
        }
    };

    return (
        <div className="login-screen" style={{ minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
            {/* Header / Offline Mode */}
            <div style={{ alignSelf: 'flex-end', marginBottom: '40px' }}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '6px 12px', border: '1px solid rgba(0,0,0,0.05)',
                    borderRadius: '20px', background: 'white', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700
                }}>
                    <WifiOff size={14} /> OFFLINE MODE
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ textAlign: 'center', width: '100%', maxWidth: '400px' }}
                >
                    {/* Graduation Cap Icon */}
                    <div style={{
                        width: '100px', height: '100px', background: '#059669',
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 40px',
                        boxShadow: '0 20px 40px -10px rgba(5, 150, 105, 0.3)'
                    }}>
                        <GraduationCap size={50} color="white" />
                    </div>

                    <h1 style={{ marginBottom: '10px' }}>CETI<br />AURISTELA<br />SOARES</h1>

                    <div style={{ height: '4px', width: '120px', background: '#059669', margin: '20px auto', borderRadius: '2px' }} />

                    <p style={{
                        letterSpacing: '0.4em', color: '#059669', fontSize: '0.8rem',
                        fontWeight: 900, textTransform: 'uppercase', marginBottom: '60px'
                    }}>
                        GESTÃO DE FREQUÊNCIA
                    </p>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsSelectOpen(true)}
                        disabled={loading}
                        style={{
                            width: '100%', padding: '40px 20px', borderRadius: '40px',
                            border: 'none', background: 'white', cursor: 'pointer',
                            boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)'
                        }}
                    >
                        <div style={{
                            width: '60px', height: '60px', background: 'rgba(5, 150, 105, 0.05)',
                            borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'
                        }}>
                            <UserCheck size={30} color="#059669" />
                        </div>
                        <h2 style={{ fontSize: '1.2rem', color: '#064e3b', fontWeight: 800, textTransform: 'uppercase', margin: '0 0 8px 0' }}>
                            {loading ? 'SINCRONIZANDO...' : errorMsg ? 'ERRO DE DADOS' : 'ACESSO DO PROFESSOR'}
                        </h2>
                        <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                            {errorMsg ? errorMsg : 'Clique aqui para se identificar e iniciar'}
                        </p>
                    </motion.button>
                </motion.div>

                <CustomSelect
                    options={teacherOptions}
                    value=""
                    onChange={handleTeacherSelect}
                    externalOpen={isSelectOpen}
                    onClose={() => setIsSelectOpen(false)}
                    hideTrigger={true}
                    title="IDENTIFICAÇÃO"
                    subtitle="Selecione seu nome da lista"
                    showSearch={true}
                />
            </AnimatePresence>

            {/* Versão para controle de cache */}
            <div style={{ position: 'fixed', bottom: '10px', right: '10px', fontSize: '0.6rem', color: '#cbd5e1', fontWeight: 600 }}>
                VERSÃO v3.0.1
            </div>
        </div>
    );
};

export default Login;
