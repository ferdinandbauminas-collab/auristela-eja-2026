-- 📝 SQL PARA ADICIONAR O ALUNO WELLINGTON JESUS DE SOUSA MAGALHÃES NA TURMA MÓDULO INFO IA
-- Como a tabela possui RLS habilitado para inserção pela chave anônima,
-- execute este script no SQL Editor do painel do seu Supabase.

INSERT INTO ef_students (id, name, class_id) VALUES 
(gen_random_uuid(), 'WELLINGTON JESUS DE SOUSA MAGALHÃES', 'MÓDULO INFO IA');

-- Verificação:
-- SELECT * FROM ef_students WHERE name = 'WELLINGTON JESUS DE SOUSA MAGALHÃES';
