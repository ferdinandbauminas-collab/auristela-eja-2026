-- 🛡️ CADASTRO DO PROFESSOR MATEUS LOPES PERES (SUPABASE)
-- Execute este script no SQL Editor do Supabase para concluir o cadastro.

-- 1. Cadastrar o professor na tabela ef_teachers
INSERT INTO ef_teachers (id, name, subject)
VALUES ('mateus', 'MATEUS LOPES PERES', 'INFORMÁTICA')
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, subject = EXCLUDED.subject;

-- 2. Atualizar a classe existente para o nome correto de ANÁLISE E LÓGICA DE PROGRAMAÇÃO no Módulo IA
UPDATE ef_classes 
SET teacher_id = 'mateus', name = 'ANÁLISE E LÓGICA DE PROGRAMAÇÃO' 
WHERE id = 'ecda05f1-6ee1-471c-99de-bc3cbd89742d';

-- 3. Inserir as novas classes de Projeto de Desenvolvimento de Sistemas para MOD V B e MOD V C
INSERT INTO ef_classes (id, teacher_id, name, grade) VALUES
  ('mateus_pds_infovb', 'mateus', 'PROJETO DE DESENVOLVIMENTO DE SISTEMAS', 'MÓDULO INFO VB'),
  ('mateus_pds_infovc', 'mateus', 'PROJETO DE DESENVOLVIMENTO DE SISTEMAS', 'MÓDULO INFO VC')
ON CONFLICT (id) DO UPDATE 
SET teacher_id = EXCLUDED.teacher_id, name = EXCLUDED.name, grade = EXCLUDED.grade;
