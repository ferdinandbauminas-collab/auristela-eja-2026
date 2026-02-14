-- 🛡️ SCRIPT DE PERMISSÕES (RLS) PARA TABELAS EJA 2026
-- Rode este script no Editor SQL do Supabase para liberar o acesso ao App

-- 1. Habilitar RLS (garantir que está ativo)
ALTER TABLE ef_teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ef_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ef_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE ef_attendance ENABLE ROW LEVEL SECURITY;

-- 2. Criar políticas de LEITURA PÚBLICA (Anônima)
-- Professores
DROP POLICY IF EXISTS "Permitir leitura pública de professores" ON ef_teachers;
CREATE POLICY "Permitir leitura pública de professores" ON ef_teachers FOR SELECT USING (true);

-- Disciplinas/Turmas
DROP POLICY IF EXISTS "Permitir leitura pública de turmas" ON ef_classes;
CREATE POLICY "Permitir leitura pública de turmas" ON ef_classes FOR SELECT USING (true);

-- Alunos
DROP POLICY IF EXISTS "Permitir leitura pública de alunos" ON ef_students;
CREATE POLICY "Permitir leitura pública de alunos" ON ef_students FOR SELECT USING (true);

-- Frequência (Leitura)
DROP POLICY IF EXISTS "Permitir leitura pública de frequência" ON ef_attendance;
CREATE POLICY "Permitir leitura pública de frequência" ON ef_attendance FOR SELECT USING (true);

-- 3. Criar política de INSERÇÃO para Frequência (para salvar as chamadas)
DROP POLICY IF EXISTS "Permitir inserção pública de frequência" ON ef_attendance;
CREATE POLICY "Permitir inserção pública de frequência" ON ef_attendance FOR INSERT WITH CHECK (true);

-- 4. Opcional: Se as tabelas estiverem vazias, o app não mostrará nada.
-- Certifique-se de ter rodado o arquivo migrate_2026.sql antes deste.

GRANT ALL ON ef_teachers TO anon, authenticated, service_role;
GRANT ALL ON ef_classes TO anon, authenticated, service_role;
GRANT ALL ON ef_students TO anon, authenticated, service_role;
GRANT ALL ON ef_attendance TO anon, authenticated, service_role;
