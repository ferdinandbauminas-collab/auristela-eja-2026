-- 📝 SQL PARA ADICIONAR O ALUNO DJORKAEF MOURA SILVA NA TURMA MÓDULO ALTE IA
-- Como a chave pública do Supabase possui restrições de escrita (RLS), 
-- por favor, copie e execute este código no SQL EDITOR do seu painel do Supabase.

INSERT INTO ef_students (id, name, class_id) VALUES 
(gen_random_uuid(), 'DJORKAEF MOURA SILVA', 'MÓDULO ALTE IA');

-- Verificação após a execução:
-- SELECT * FROM ef_students WHERE name = 'DJORKAEF MOURA SILVA';
