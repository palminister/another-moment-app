create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  payer text not null check (payer in ('Tisa', 'Palm')),
  note text not null default '',
  amount numeric(12, 2) not null check (amount > 0),
  expression text not null,
  created_at timestamptz not null default now()
);

alter table public.transactions enable row level security;

grant select, insert, delete on public.transactions to anon, authenticated;

drop policy if exists "Anyone can read shared transactions" on public.transactions;
drop policy if exists "Anyone can add shared transactions" on public.transactions;
drop policy if exists "Anyone can delete shared transactions" on public.transactions;

create policy "Anyone can read shared transactions"
  on public.transactions
  for select
  to anon, authenticated
  using (true);

create policy "Anyone can add shared transactions"
  on public.transactions
  for insert
  to anon, authenticated
  with check (true);

create policy "Anyone can delete shared transactions"
  on public.transactions
  for delete
  to anon, authenticated
  using (true);
