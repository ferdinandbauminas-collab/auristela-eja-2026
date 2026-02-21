---
description: Como cadastrar um novo professor no Supabase (projeto Auristela EJA 2026)
---

# Cadastrar Novo Professor no Supabase

## Estrutura das tabelas envolvidas

```
ef_teachers  →  dados do professor (login)
ef_classes   →  vínculo professor + disciplina + turma
ef_students  →  alunos por turma (só se for turma nova)
```

## Opção 1 — SQL Editor (recomendado, mais rápido)

1. No painel do Supabase, abra o **SQL Editor**
2. Cole o script abaixo substituindo os valores e clique em **Run**

```sql
-- 1. Cadastrar o professor
INSERT INTO ef_teachers (id, name, subject)
VALUES ('idcurto', 'NOME COMPLETO EM MAIÚSCULAS', 'DISCIPLINA PRINCIPAL');

-- 2. Vincular disciplinas e turmas (repetir para cada combinação)
INSERT INTO ef_classes (id, teacher_id, name, grade) VALUES
  ('idcurto_disciplina_turma1', 'idcurto', 'NOME DA DISCIPLINA', 'NOME DA TURMA'),
  ('idcurto_disciplina_turma2', 'idcurto', 'NOME DA DISCIPLINA', 'NOME DA TURMA');
```

### Regras para os IDs
- `id` em `ef_teachers`: nome curto, sem espaços, sem acento. Ex: `joanadard`, `franciscojr`
- `id` em `ef_classes`: combinação única. Ex: `joanadard_arte_infoiiia`
- `teacher_id` em `ef_classes`: **igual** ao `id` usado em `ef_teachers`

### Exemplo real (JOANA DARC)
```sql
INSERT INTO ef_teachers (id, name, subject)
VALUES ('joanadard', 'JOANA DARC', 'ARTE');

INSERT INTO ef_classes (id, teacher_id, name, grade) VALUES
  ('joanadard_arte_infoiiia', 'joanadard', 'ARTE', 'MÓDULO INFO IIIA'),
  ('joanadard_arte_alteia',   'joanadard', 'ARTE', 'MÓDULO ALTE IA');
```

---

## Opção 2 — Manual (Table Editor)

### Passo 1 — Tabela `ef_teachers`
1. Abra a tabela `ef_teachers` no **Table Editor**
2. Clique em **Insert** → **Insert row**
3. Preencha:
   - `id`: nome curto sem espaços (ex: `joanadard`)
   - `name`: nome completo em MAIÚSCULAS
   - `subject`: disciplina principal (ex: `ARTE`)
4. Clique em **Save**

### Passo 2 — Tabela `ef_classes`
1. Abra a tabela `ef_classes` no **Table Editor**
2. Clique em **Insert** → **Insert row**
3. Preencha para **cada disciplina + turma**:
   - `id`: combinação única (ex: `joanadard_arte_infoiiia`)
   - `teacher_id`: o mesmo `id` usado em `ef_teachers`
   - `name`: nome da disciplina
   - `grade`: nome da turma
4. Clique em **Save** e repita para cada turma

### Passo 3 — Tabela `ef_students` (só se for turma nova)
Só necessário se a turma não existir ainda no sistema.
Cada aluno precisa de uma linha com: `id`, `name`, `class_id`, `active: true`

---

## Resultado esperado
Após o cadastro, o professor já pode:
- Fazer **login** no app com o nome cadastrado
- Ver suas **disciplinas e turmas** na tela de chamada
- **Lançar frequência** normalmente

O dashboard se atualiza automaticamente a cada 60 segundos.

---

## Pedir ao assistente para gerar o script
Basta passar a lista no formato abaixo e o assistente gera o SQL completo:

```
NOME DO PROFESSOR | DISCIPLINA | TURMA
NOME DO PROFESSOR | DISCIPLINA | TURMA
```
