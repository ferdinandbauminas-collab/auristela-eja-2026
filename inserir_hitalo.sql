-- 📝 SQL PARA ADICIONAR O ALUNO HÍTALO IVANILDO SANTOS VIEIRA NA TURMA MÓDULO ALTE IA
-- Como a chave do Supabase possui restrições de segurança (RLS), 
-- por favor, copie e cole este código no SQL EDITOR do seu painel Supabase.

INSERT INTO ef_students (id, name, class_id) VALUES 
(gen_random_uuid(), 'HÍTALO IVANILDO SANTOS VIEIRA', 'MÓDULO ALTE IA');

-- Verificação:
-- SELECT * FROM ef_students WHERE name = 'HÍTALO IVANILDO SANTOS VIEIRA';
