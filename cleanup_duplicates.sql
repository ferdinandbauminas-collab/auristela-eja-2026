-- Script para remover as disciplinas duplicadas da Professora Maria Eunice
-- Execute este script no SQL Editor do seu Dashboard do Supabase.

-- IDs identificados:
-- 89616363-31a2-4be7-9c9c-614958e30386 (LÍNGUA PORTUGUESA - ALTE IA)
-- 8ed2d8cb-c269-45f8-a374-a96597be6824 (LÍNGUA PORTUGUESA - MARK IA)

DELETE FROM ef_classes 
WHERE id IN (
    '89616363-31a2-4be7-9c9c-614958e30386', 
    '8ed2d8cb-c269-45f8-a374-a96597be6824'
);

-- Verificação após a exclusão
SELECT * FROM ef_classes 
WHERE teacher_id = '39c4758a-eaef-4a41-8214-d37741ea57dd';
