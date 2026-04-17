-- 📝 SQL PARA ADICIONAR AS NOVAS ALUNAS NA TURMA MÓDULO INFO IA
-- Como a chave atual do Supabase possui restrições de segurança (RLS), 
-- por favor, copie e cole este código no SQL EDITOR do seu painel Supabase.

INSERT INTO ef_students (id, name, class_id) VALUES 
(gen_random_uuid(), 'ANNA VITÓRIA CHANTAL', 'MÓDULO INFO IA'),
(gen_random_uuid(), 'DHENNYFER EMILIA DA SILVA SOUSA', 'MÓDULO INFO IA');

-- Verificação:
-- SELECT * FROM ef_students WHERE name IN ('ANNA VITÓRIA CHANTAL', 'DHENNYFER EMILIA DA SILVA SOUSA');
