-- 🚀 SCRIPT: CRIAÇÃO DA TABELA DE HORÁRIOS (ef_schedule)
-- Este script define a estrutura para armazenar o cronograma semanal de aulas.

BEGIN;

-- 1. Criar a tabela ef_schedule
CREATE TABLE IF NOT EXISTS ef_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_of_week TEXT NOT NULL, -- 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'
    slot_number INTEGER NOT NULL, -- 1, 2, 3, 4 (Número da aula no dia)
    class_group TEXT NOT NULL, -- ex: 'MOD III A', 'MOD V B'
    discipline TEXT NOT NULL, -- ex: 'LÍNGUA PORTUGUESA', 'MATEMÁTICA'
    teacher_name TEXT NOT NULL, -- Nome completo do professor
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Habilitar Segurança (RLS)
ALTER TABLE ef_schedule ENABLE ROW LEVEL SECURITY;

-- 3. Criar Políticas de Acesso (Público para leitura, restrito para inserção se necessário)
DROP POLICY IF EXISTS "Acesso público aos horários" ON ef_schedule;
CREATE POLICY "Acesso público aos horários" ON ef_schedule FOR SELECT USING (true);

DROP POLICY IF EXISTS "Inserção de horários permitida" ON ef_schedule;
CREATE POLICY "Inserção de horários permitida" ON ef_schedule FOR INSERT WITH CHECK (true);

-- 4. Dar permissões de acesso
GRANT ALL ON ef_schedule TO anon, authenticated, service_role;

COMMIT;

-- ✅ Tabela ef_schedule criada com sucesso!
