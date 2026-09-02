-- Execute uma vez no SQL Editor do Supabase antes de usar o registro da bedel.
create table if not exists public.ef_out_of_class_records (
  id uuid primary key default gen_random_uuid(),
  student_id text not null,
  student_name text not null,
  class_name text not null,
  location text not null,
  situation text not null,
  notes text,
  recorded_by text not null default 'COORDENAÇÃO',
  recorded_at timestamptz not null default now()
);

alter table public.ef_out_of_class_records enable row level security;

create policy "Registro pela equipe escolar"
on public.ef_out_of_class_records
for insert to anon
with check (true);

create policy "Leitura pela equipe escolar"
on public.ef_out_of_class_records
for select to anon
using (true);

