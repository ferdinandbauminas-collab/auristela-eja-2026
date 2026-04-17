import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Teacher } from '../lib/supabase';
import {
    ArrowLeft, UserPlus, Pencil, Trash2, Search,
    Users, Loader2, Check, X, AlertCircle, GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    onBack: () => void;
}

const TeacherManagement = ({ onBack }: Props) => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
    const [formName, setFormName] = useState('');
    const [formAvatar, setFormAvatar] = useState('');
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        fetchTeachers();
    }, []);

    useEffect(() => {
        if (feedback) {
            const timer = setTimeout(() => setFeedback(null), 3500);
            return () => clearTimeout(timer);
        }
    }, [feedback]);

    async function fetchTeachers() {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('ef_teachers')
                .select('*')
                .order('name', { ascending: true });
            if (error) throw error;
            setTeachers((data as Teacher[]) || []);
        } catch (err: any) {
            setFeedback({ type: 'error', message: 'Erro ao carregar professores: ' + err.message });
        } finally {
            setLoading(false);
        }
    }

    const openNewForm = () => {
        setEditingTeacher(null);
        setFormName('');
        setFormAvatar('');
        setShowForm(true);
    };

    const openEditForm = (t: Teacher) => {
        setEditingTeacher(t);
        setFormName(t.name);
        setFormAvatar(t.avatar || '');
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingTeacher(null);
        setFormName('');
        setFormAvatar('');
    };

    const handleSave = async () => {
        if (!formName.trim()) {
            setFeedback({ type: 'error', message: 'O nome do professor é obrigatório.' });
            return;
        }
        setSaving(true);
        try {
            if (editingTeacher) {
                const { error } = await supabase
                    .from('ef_teachers')
                    .update({ name: formName.trim(), avatar: formAvatar.trim() || null })
                    .eq('id', editingTeacher.id);
                if (error) throw error;
                setFeedback({ type: 'success', message: 'Professor atualizado com sucesso!' });
            } else {
                const { error } = await supabase
                    .from('ef_teachers')
                    .insert({ name: formName.trim(), avatar: formAvatar.trim() || null });
                if (error) throw error;
                setFeedback({ type: 'success', message: 'Professor cadastrado com sucesso!' });
            }
            closeForm();
            await fetchTeachers();
        } catch (err: any) {
            setFeedback({ type: 'error', message: 'Erro ao salvar: ' + err.message });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (t: Teacher) => {
        if (!confirm(`Tem certeza que deseja excluir "${t.name}"? Esta ação não pode ser desfeita.`)) return;
        setDeletingId(t.id);
        try {
            const { error } = await supabase.from('ef_teachers').delete().eq('id', t.id);
            if (error) throw error;
            setFeedback({ type: 'success', message: 'Professor excluído com sucesso.' });
            await fetchTeachers();
        } catch (err: any) {
            setFeedback({ type: 'error', message: 'Erro ao excluir: ' + err.message });
        } finally {
            setDeletingId(null);
        }
    };

    const filtered = teachers.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase())
    );

    const getInitials = (name: string) =>
        name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();

    const avatarColors = [
        '#10b981', '#6366f1', '#f43f5e', '#f59e0b',
        '#3b82f6', '#8b5cf6', '#14b8a6', '#ef4444'
    ];
    const getColor = (name: string) =>
        avatarColors[name.charCodeAt(0) % avatarColors.length];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ width: '100%', maxWidth: '900px', margin: '0 auto', color: '#1e293b', padding: '20px 0' }}
        >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '16px' }}>
                <button
                    onClick={onBack}
                    style={{ border: 'none', background: 'white', padding: '12px 20px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 8px 16px rgba(0,0,0,0.05)', fontWeight: 800, color: '#6366f1', fontSize: '0.8rem' }}
                >
                    <ArrowLeft size={18} strokeWidth={3} /> VOLTAR
                </button>
                <div style={{ textAlign: 'right' }}>
                    <h1 style={{ margin: 0, fontSize: '1.4rem', color: '#064e3b', fontWeight: 900 }}>GERENCIAMENTO DE PROFESSORES</h1>
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>ETAPA EJA 2026</p>
                </div>
            </div>

            {/* Feedback Toast */}
            <AnimatePresence>
                {feedback && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            padding: '14px 20px', borderRadius: '16px', marginBottom: '20px',
                            background: feedback.type === 'success' ? '#ecfdf5' : '#fef2f2',
                            border: `1px solid ${feedback.type === 'success' ? '#d1fae5' : '#fee2e2'}`,
                            color: feedback.type === 'success' ? '#059669' : '#ef4444',
                            fontWeight: 700, fontSize: '0.9rem'
                        }}
                    >
                        {feedback.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
                        {feedback.message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Summary + Actions Bar */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                {/* Counter Card */}
                <div className="glass-card" style={{ padding: '20px 28px', background: 'white', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '16px', flex: '0 0 auto' }}>
                    <div style={{ background: 'rgba(99, 102, 241, 0.1)', width: '44px', height: '44px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <GraduationCap size={22} color="#6366f1" />
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900, color: '#1e293b', lineHeight: 1 }}>{teachers.length}</h3>
                        <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Professores</p>
                    </div>
                </div>

                {/* Search */}
                <div style={{ flex: 1, position: 'relative', minWidth: '200px' }}>
                    <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        type="text"
                        placeholder="Buscar professor..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            width: '100%', height: '100%', minHeight: '56px',
                            paddingLeft: '48px', paddingRight: '16px',
                            border: '1px solid #f1f5f9', borderRadius: '16px',
                            background: 'white', fontSize: '0.9rem', fontWeight: 600,
                            color: '#1e293b', outline: 'none', boxSizing: 'border-box',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                        }}
                    />
                </div>

                {/* Add Button */}
                <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={openNewForm}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '0 24px', height: '56px', border: 'none',
                        borderRadius: '16px', background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white', fontWeight: 900, fontSize: '0.85rem',
                        cursor: 'pointer', whiteSpace: 'nowrap',
                        boxShadow: '0 8px 20px -4px rgba(16, 185, 129, 0.4)'
                    }}
                >
                    <UserPlus size={18} /> NOVO PROFESSOR
                </motion.button>
            </div>

            {/* Teacher List */}
            {loading ? (
                <div style={{ padding: '80px 20px', textAlign: 'center', color: '#6366f1' }}>
                    <Loader2 size={48} style={{ margin: '0 auto 20px', display: 'block' }} className="animate-spin" />
                    <p style={{ fontWeight: 700 }}>CARREGANDO PROFESSORES...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="glass-card" style={{ padding: '60px 20px', textAlign: 'center', background: 'white', border: '1px solid #f1f5f9' }}>
                    <Users size={48} color="#cbd5e1" style={{ margin: '0 auto 16px', display: 'block' }} />
                    <p style={{ fontWeight: 800, color: '#64748b', fontSize: '1rem' }}>
                        {search ? 'Nenhum professor encontrado' : 'Nenhum professor cadastrado'}
                    </p>
                    <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                        {search ? 'Tente outro termo de busca.' : 'Clique em "NOVO PROFESSOR" para começar.'}
                    </p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '12px' }}>
                    <AnimatePresence>
                        {filtered.map((t, i) => (
                            <motion.div
                                key={t.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ delay: i * 0.03 }}
                                className="glass-card"
                                style={{
                                    padding: '16px 20px', background: 'white',
                                    border: '1px solid #f1f5f9', display: 'flex',
                                    alignItems: 'center', gap: '16px'
                                }}
                            >
                                {/* Avatar */}
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '16px',
                                    background: getColor(t.name) + '20',
                                    border: `2px solid ${getColor(t.name)}30`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1.1rem', fontWeight: 900, color: getColor(t.name),
                                    flexShrink: 0
                                }}>
                                    {t.avatar ? (
                                        <img src={t.avatar} alt={t.name} style={{ width: '100%', height: '100%', borderRadius: '14px', objectFit: 'cover' }} />
                                    ) : (
                                        getInitials(t.name)
                                    )}
                                </div>

                                {/* Info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ margin: 0, fontWeight: 900, color: '#1e293b', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {t.name}
                                    </p>
                                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>
                                        ID: {t.id}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => openEditForm(t)}
                                        title="Editar professor"
                                        style={{
                                            border: 'none', background: 'rgba(99, 102, 241, 0.08)',
                                            color: '#6366f1', width: '40px', height: '40px',
                                            borderRadius: '12px', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <Pencil size={16} />
                                    </motion.button>
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleDelete(t)}
                                        disabled={deletingId === t.id}
                                        title="Excluir professor"
                                        style={{
                                            border: 'none', background: 'rgba(239, 68, 68, 0.08)',
                                            color: '#ef4444', width: '40px', height: '40px',
                                            borderRadius: '12px', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {deletingId === t.id
                                            ? <Loader2 size={16} className="animate-spin" />
                                            : <Trash2 size={16} />
                                        }
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(6px)', zIndex: 100,
                            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                            padding: '20px'
                        }}
                        onClick={e => { if (e.target === e.currentTarget) closeForm(); }}
                    >
                        <motion.div
                            initial={{ y: 60, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 60, opacity: 0 }}
                            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
                            style={{
                                background: 'white', borderRadius: '28px',
                                padding: '32px', width: '100%', maxWidth: '480px',
                                boxShadow: '0 40px 80px rgba(0,0,0,0.2)'
                            }}
                        >
                            {/* Form Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                                <div>
                                    <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#064e3b' }}>
                                        {editingTeacher ? 'EDITAR PROFESSOR' : 'NOVO PROFESSOR'}
                                    </h2>
                                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>
                                        {editingTeacher ? 'Atualize os dados abaixo' : 'Preencha os dados para cadastrar'}
                                    </p>
                                </div>
                                <button
                                    onClick={closeForm}
                                    style={{ border: 'none', background: 'rgba(0,0,0,0.05)', width: '36px', height: '36px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <X size={18} color="#64748b" />
                                </button>
                            </div>

                            {/* Name Field */}
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                                    Nome Completo *
                                </label>
                                <input
                                    type="text"
                                    value={formName}
                                    onChange={e => setFormName(e.target.value)}
                                    placeholder="Ex: MARIA DA SILVA SANTOS"
                                    autoFocus
                                    style={{
                                        width: '100%', padding: '14px 16px', borderRadius: '14px',
                                        border: '2px solid #f1f5f9', fontSize: '0.95rem',
                                        fontWeight: 700, color: '#1e293b', outline: 'none',
                                        boxSizing: 'border-box', transition: 'border-color 0.2s'
                                    }}
                                    onFocus={e => e.target.style.borderColor = '#6366f1'}
                                    onBlur={e => e.target.style.borderColor = '#f1f5f9'}
                                />
                            </div>

                            {/* Avatar URL Field (optional) */}
                            <div style={{ marginBottom: '28px' }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                                    URL do Avatar (opcional)
                                </label>
                                <input
                                    type="url"
                                    value={formAvatar}
                                    onChange={e => setFormAvatar(e.target.value)}
                                    placeholder="https://..."
                                    style={{
                                        width: '100%', padding: '14px 16px', borderRadius: '14px',
                                        border: '2px solid #f1f5f9', fontSize: '0.9rem',
                                        fontWeight: 600, color: '#1e293b', outline: 'none',
                                        boxSizing: 'border-box', transition: 'border-color 0.2s'
                                    }}
                                    onFocus={e => e.target.style.borderColor = '#6366f1'}
                                    onBlur={e => e.target.style.borderColor = '#f1f5f9'}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={closeForm}
                                    style={{
                                        flex: 1, padding: '14px', borderRadius: '16px',
                                        border: '2px solid #f1f5f9', background: 'white',
                                        color: '#64748b', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer'
                                    }}
                                >
                                    CANCELAR
                                </button>
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    onClick={handleSave}
                                    disabled={saving}
                                    style={{
                                        flex: 2, padding: '14px', borderRadius: '16px',
                                        border: 'none', background: saving ? '#94a3b8' : 'linear-gradient(135deg, #10b981, #059669)',
                                        color: 'white', fontWeight: 900, fontSize: '0.9rem',
                                        cursor: saving ? 'not-allowed' : 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                        boxShadow: saving ? 'none' : '0 8px 20px -4px rgba(16, 185, 129, 0.35)'
                                    }}
                                >
                                    {saving
                                        ? <><Loader2 size={18} className="animate-spin" /> SALVANDO...</>
                                        : <><Check size={18} /> {editingTeacher ? 'ATUALIZAR' : 'CADASTRAR'}</>
                                    }
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default TeacherManagement;
