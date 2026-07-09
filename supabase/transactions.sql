create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  payer text not null check (payer in ('Tisa', 'Palm')),
  note text not null default '',
  amount numeric(12, 2) not null check (amount > 0),
  expression text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.allowed_writers (
  email text primary key,
  note text,
  created_at timestamptz not null default now()
);

alter table public.transactions enable row level security;
alter table public.allowed_writers enable row level security;

grant select on public.transactions to anon, authenticated;
grant insert, delete on public.transactions to authenticated;
revoke insert, delete on public.transactions from anon;

grant select on public.allowed_writers to authenticated;

drop policy if exists "Anyone can read shared transactions" on public.transactions;
drop policy if exists "Anyone can add shared transactions" on public.transactions;
drop policy if exists "Anyone can delete shared transactions" on public.transactions;
drop policy if exists "Allowed writers can read themselves" on public.allowed_writers;

create policy "Anyone can read shared transactions"
  on public.transactions
  for select
  to anon, authenticated
  using (true);

create policy "Anyone can add shared transactions"
  on public.transactions
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.allowed_writers
      where lower(allowed_writers.email) = lower(auth.jwt() ->> 'email')
    )
  );

create policy "Anyone can delete shared transactions"
  on public.transactions
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.allowed_writers
      where lower(allowed_writers.email) = lower(auth.jwt() ->> 'email')
    )
  );

create policy "Allowed writers can read themselves"
  on public.allowed_writers
  for select
  to authenticated
  using (lower(email) = lower(auth.jwt() ->> 'email'));

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'transactions'
  ) then
    alter publication supabase_realtime add table public.transactions;
  end if;
end $$;
