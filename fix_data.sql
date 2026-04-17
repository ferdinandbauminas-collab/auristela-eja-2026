-- ============================================================
-- SCRIPT DE ATUALIZAÇÃO DO CRONOGRAMA SEMANAL
-- ============================================================
-- Instruções: Copie este código e execute no SQL EDITOR do seu Supabase Dashboard.

-- 📅 QUARTA-FEIRA
-- MOD I A ALT (Slots 1 e 3)
UPDATE ef_schedule SET teacher_name = 'DANIEL MAGALHAES CHAVES', discipline = 'FILOSOFIA' WHERE id = '3e63062a-244b-4e64-b344-b24b1a5711e1';
UPDATE ef_schedule SET teacher_name = 'HELANNE BEATRIZ SILVA OLIVEIRA', discipline = 'BIOLOGIA' WHERE id = 'b781f931-c2e1-41ce-b463-3c176cfb9044';

-- MOD III B (Slots 1 e 3)
UPDATE ef_schedule SET teacher_name = 'HELANNE BEATRIZ SILVA OLIVEIRA', discipline = 'BIOLOGIA' WHERE id = '24678c57-5f08-40ec-a83b-38da63efbf25';
UPDATE ef_schedule SET teacher_name = 'JOSE DE ASSUNCAO SOUSA BARBOSA', discipline = 'GEOGRAFIA' WHERE id = '3162384d-1bf1-4e11-b0de-c2d5b470f7fb';

-- MOD V A (Slots 1 e 3)
UPDATE ef_schedule SET teacher_name = 'JOSE DE ASSUNCAO SOUSA BARBOSA', discipline = 'GEOGRAFIA' WHERE id = '5e523166-4b2c-4262-a3c7-86f72df99a2e';
UPDATE ef_schedule SET teacher_name = 'FRANCISCA DA SILVA SOUSA', discipline = 'HISTÓRIA' WHERE id = '386e49f5-6aa0-4e9f-8251-3e1ff37a4c06';


-- 📅 QUINTA-FEIRA
-- MOD V B (Slot 1)
UPDATE ef_schedule SET teacher_name = 'SEM PROFESSOR 5', discipline = 'PROJETO DE DESENVOLVIMENTO DE SISTEMAS' WHERE id = 'bc23bbe1-9b8a-45d3-9075-4c391fa93b73';


-- 📅 SEXTA-FEIRA
-- MOD V A (Slot 3) e MOD V B (Slot 1)
UPDATE ef_schedule SET teacher_name = 'ELLYDA', discipline = 'LE' WHERE id = 'b30cd6ea-639b-4720-89f5-d42434454670';
UPDATE ef_schedule SET teacher_name = 'ELLYDA', discipline = 'LE' WHERE id = '29cfbe98-9b72-47e4-a421-a4d2b7703b75';

-- ============================================================
-- SCRIPT FINALIZADO
-- ============================================================
