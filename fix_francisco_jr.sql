-- 🛠️ SCRIPT DE ATUALIZAÇÃO PROFESSOR FRANCISCO JR
-- Este script corrige as permissões e adiciona a nova disciplina

BEGIN;

-- 1. Garantir permissões de inserção/atualização para as tabelas necessárias
DROP POLICY IF EXISTS "Permitir inserção pública de turmas" ON ef_classes;
CREATE POLICY "Permitir inserção pública de turmas" ON ef_classes FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir atualização pública de turmas" ON ef_classes;
CREATE POLICY "Permitir atualização pública de turmas" ON ef_classes FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Permitir tudo no cronograma" ON ef_schedule;
CREATE POLICY "Permitir tudo no cronograma" ON ef_schedule FOR ALL USING (true);

-- 2. Limpar registros duplicados/genéricos em ef_schedule
-- Remove o "SEM PROFESSOR 6" da Terça-feira no 4º horário
DELETE FROM ef_schedule 
WHERE class_group = 'MOD I A ALT' 
  AND discipline = 'PROJETO DE VIDA' 
  AND teacher_name = 'SEM PROFESSOR 6';

-- 3. Inserir/Atualizar Francisco Jr no cronograma (PROJETO DE VIDA)
INSERT INTO ef_schedule (day_of_week, slot_number, class_group, discipline, teacher_name)
VALUES ('Terça-feira', 4, 'MOD I A ALT', 'PROJETO DE VIDA', 'FRANCISCO JR')
ON CONFLICT DO NOTHING;

-- 4. Habilitar no Aplicativo (ef_classes)
-- Nota: 'MÓDULO ALTE IA' é o nome técnico usado no App para MOD IA ALT
DELETE FROM ef_classes WHERE name = 'PROJETO DE VIDA' AND grade = 'MÓDULO ALTE IA' AND teacher_id = 'franciscojr';
INSERT INTO ef_classes (name, grade, teacher_id)
VALUES ('PROJETO DE VIDA', 'MÓDULO ALTE IA', 'franciscojr');

COMMIT;
