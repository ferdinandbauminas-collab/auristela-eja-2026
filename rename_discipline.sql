-- SQL para renomear a disciplina "Lógica de Programação" para "PROGRAMAÇÃO PARA COMPUTADORES"
-- Execute estes comandos no SQL Editor do Supabase

-- Atualização na tabela de classes
UPDATE ef_classes 
SET name = 'PROGRAMAÇÃO PARA COMPUTADORES'
WHERE name ILIKE 'LÓGICA DE PROGRAMAÇÃO' OR name ILIKE 'LOGICA DE PROGRAMAÇÃO';

-- Atualização na tabela de horários
UPDATE ef_schedule
SET discipline = 'PROGRAMAÇÃO PARA COMPUTADORES'
WHERE discipline ILIKE 'LÓGICA DE PROGRAMAÇÃO' OR discipline ILIKE 'LOGICA DE PROGRAMAÇÃO';

-- Verificação (opcional)
SELECT * FROM ef_schedule WHERE discipline = 'PROGRAMAÇÃO PARA COMPUTADORES';
