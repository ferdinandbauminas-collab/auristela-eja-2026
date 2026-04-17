-- 🛠️ CORREÇÃO DE DATA DE LANÇAMENTO (ERRO UTC)
-- Registros de frequência que foram lançados na Segunda-feira à noite (Brasília)
-- mas foram salvos como Terça-feira (10/03) por causa do fuso horário UTC.

BEGIN;

-- 1. Identificar e atualizar os 161 registros
UPDATE ef_attendance
SET date = '2026-03-09'
WHERE date = '2026-03-10'
AND created_at >= '2026-03-10T00:00:00Z'
AND created_at <= '2026-03-10T01:00:00Z';

COMMIT;
