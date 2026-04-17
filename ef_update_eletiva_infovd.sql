-- 🔥 ATUALIZAÇÃO REQUISITADA: REMOVER PROFESSOR DE ELETIVA ORIENTADA (INFO VD)
BEGIN;

-- 1. Atualizar a tabela de classes (ef_classes)
-- Removemos a referência ao professor Gerson e deixamos como NULL.
-- O sistema de relatórios (audit) exibirá 'SEM PROFESSOR' automaticamente para campos NULL.
UPDATE ef_classes 
SET teacher_id = NULL 
WHERE name = 'ELETIVA ORIENTADA' 
AND grade = 'MÓDULO INFO VD';

-- 2. Atualizar a tabela de horário (ef_schedule)
-- Aqui usamos o nome textual 'SEM PROFESSOR' pois esta tabela não usa chaves estrangeiras.
-- Nota: Usamos LIKE para garantir que pegamos variações de 'INFO VD'.
UPDATE ef_schedule 
SET teacher_name = 'SEM PROFESSOR' 
WHERE (discipline = 'Eletiva Orientada' OR discipline = 'ELETIVA ORIENTADA')
AND (class_group = 'INFO VD' OR class_group = 'MÓDULO INFO VD' OR class_group = 'INFO V D');

COMMIT;
