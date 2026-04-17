-- Tabela para armazenar dias sem aula (suspensões)
CREATE TABLE IF NOT EXISTS ef_suspensions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL UNIQUE,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ativar RLS
ALTER TABLE ef_suspensions ENABLE ROW LEVEL SECURITY;

-- Política de leitura pública (permitir que o dashboard veja os dias ignorados)
CREATE POLICY "Permitir leitura pública" ON ef_suspensions FOR SELECT USING (true);

-- Política de inserção pública (para o dashboard poder adicionar suspensões)
-- NOTA: Em produção, o ideal é autenticar, mas para este ambiente vamos permitir anon
CREATE POLICY "Permitir inserção anônima" ON ef_suspensions FOR INSERT WITH CHECK (true);

-- Política de deleção pública (para permitir remover uma suspensão se inserida errada)
CREATE POLICY "Permitir deleção anônima" ON ef_suspensions FOR DELETE USING (true);
