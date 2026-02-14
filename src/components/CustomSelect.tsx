import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, X, Check } from 'lucide-react';

interface Option {
    value: string;
    label: string;
    color?: string;
}

interface Props {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    externalOpen?: boolean;
    onClose?: () => void;
    hideTrigger?: boolean;
    title?: string;
    subtitle?: string;
    showSearch?: boolean;
    useGrid?: boolean;
}

const CustomSelect = ({
    options,
    value,
    onChange,
    placeholder = 'Selecione...',
    externalOpen,
    onClose,
    hideTrigger,
    title,
    subtitle,
    showSearch = true
}: Props) => {
    const [internalOpen, setInternalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
    const setIsOpen = (val: boolean) => {
        if (onClose && !val) onClose();
        setInternalOpen(val);
    };

    const selectedOption = options.find(o => o.value === value);

    const filteredOptions = options.filter(o =>
        o.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="custom-select-container" style={{ width: '100%' }}>
            {!hideTrigger && (
                <button
                    onClick={() => setIsOpen(true)}
                    style={{
                        width: '100%',
                        padding: '16px 20px',
                        borderRadius: '20px',
                        background: 'white',
                        border: '1px solid rgba(0,0,0,0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'between',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                        {selectedOption ? (
                            <>
                                <div style={{
                                    width: '32px', height: '32px', background: selectedOption.color || 'var(--primary)',
                                    borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'white', fontWeight: 800, fontSize: '0.9rem'
                                }}>
                                    {selectedOption.label.charAt(0)}
                                </div>
                                <span style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>{selectedOption.label}</span>
                            </>
                        ) : (
                            <span style={{ color: '#94a3b8', fontWeight: 600 }}>{placeholder}</span>
                        )}
                    </div>
                    <ChevronDown size={20} color="#94a3b8" />
                </button>
            )}

            <AnimatePresence>
                {isOpen && (
                    <div style={{ position: 'absolute', inset: 0, zIndex: 9998 }}>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            style={{
                                position: 'absolute', inset: 0, background: 'rgba(6, 78, 59, 0.4)',
                                backdropFilter: 'blur(8px)', zIndex: 1
                            }}
                        />

                        {/* Content */}
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: '10%' }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            style={{
                                position: 'absolute', bottom: 0, left: 0, right: 0, top: 0,
                                background: 'white', borderRadius: '32px 32px 0 0',
                                padding: '24px', zIndex: 2, display: 'flex', flexDirection: 'column',
                                boxShadow: '0 -10px 40px rgba(0,0,0,0.1)'
                            }}
                        >
                            <div style={{ width: '40px', height: '4px', background: '#e2e8f0', borderRadius: '2px', margin: '0 auto 20px' }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: (title || subtitle) ? '24px' : '0' }}>
                                {(title || subtitle) && (
                                    <div style={{ textAlign: 'left' }}>
                                        {title && <h3 style={{ fontWeight: 800, color: 'var(--primary-dark)', fontSize: '1.4rem' }}>{title}</h3>}
                                        {subtitle && <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600 }}>{subtitle}</p>}
                                    </div>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    style={{
                                        background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: '50%',
                                        padding: '10px', cursor: 'pointer', marginLeft: 'auto'
                                    }}
                                >
                                    <X size={20} color="#94a3b8" />
                                </button>
                            </div>

                            {showSearch && (
                                <div style={{ position: 'relative', marginBottom: '20px', marginTop: (!title && !subtitle) ? '10px' : '0' }}>
                                    <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#10b981' }} />
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Buscar..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{
                                            width: '100%', padding: '16px 16px 16px 48px', borderRadius: '20px',
                                            border: '1px solid #10b981', background: '#f0fdf4', outline: 'none',
                                            fontSize: '1rem', fontWeight: 600, color: 'var(--primary-dark)'
                                        }}
                                    />
                                </div>
                            )}

                            <div style={{
                                overflowY: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                                flex: 1,
                                paddingBottom: '20px',
                                marginTop: (!showSearch && !title && !subtitle) ? '10px' : '0'
                            }}>
                                {filteredOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => {
                                            onChange(opt.value);
                                            setIsOpen(false);
                                        }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '16px 20px',
                                            borderRadius: '24px',
                                            border: 'none',
                                            background: value === opt.value ? 'rgba(5, 150, 105, 0.15)' : '#f8fafc',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            textAlign: 'left',
                                            width: '100%',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                            <div style={{
                                                width: '52px', height: '52px', background: opt.color || 'var(--primary)',
                                                borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: 'white', fontWeight: 900, fontSize: '1.4rem',
                                                boxShadow: '0 6px 16px rgba(0,0,0,0.12)'
                                            }}>
                                                {opt.label.charAt(0)}
                                            </div>
                                            <span style={{
                                                fontWeight: 900, fontSize: '1.3rem',
                                                color: value === opt.value ? 'var(--primary)' : 'var(--primary-dark)',
                                                letterSpacing: '-0.3px'
                                            }}>{opt.label}</span>
                                        </div>
                                        {value === opt.value && <Check size={28} color="var(--primary)" strokeWidth={3.5} />}
                                    </button>
                                ))}
                                {filteredOptions.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
                                        Nenhuma opção encontrada
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomSelect;
