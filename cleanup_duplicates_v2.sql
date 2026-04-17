-- Script ATUALIZADO para remover as disciplinas duplicadas (com schema explícito)
-- Execute este script no SQL Editor do seu Dashboard do Supabase.

-- O erro anterior ocorreu porque o editor pode não estar buscando no schema 'public' por padrão.
-- Usando 'public.ef_classes' garantimos que o banco encontre a tabela.

DELETE FROM "public"."ef_classes" 
WHERE id IN (
    '89616363-31a2-4be7-9c9c-614958e30386', 
    '8ed2d8cb-c269-45f8-a374-a96597be6824'
);

-- Verificação após a exclusão
SELECT * FROM "public"."ef_classes" 
WHERE teacher_id = '39c4758a-eaef-4a41-8214-d37741ea57dd';
