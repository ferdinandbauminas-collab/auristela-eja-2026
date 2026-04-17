-- Tabela de Consolidação Diária para Alta Performance
CREATE TABLE IF NOT EXISTS ef_daily_consolidated (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    student_name TEXT NOT NULL,
    class_name TEXT NOT NULL,
    presence_count INTEGER DEFAULT 0,
    absence_count INTEGER DEFAULT 0,
    is_absent_integral BOOLEAN DEFAULT FALSE,
    gazeta_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(date, student_name, class_name)
);

-- Índices para busca rápida no dashboard
CREATE INDEX IF NOT EXISTS idx_consolidated_date ON ef_daily_consolidated(date);
CREATE INDEX IF NOT EXISTS idx_consolidated_student ON ef_daily_consolidated(student_name);
CREATE INDEX IF NOT EXISTS idx_consolidated_class ON ef_daily_consolidated(class_name);
