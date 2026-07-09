# Another Moment App

I’m exploring what happens when the success state of a split-bill app is not zero balance, but another moment together.

## Development

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Supabase

The app reads and writes transactions from Supabase. Add these values to
`.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Run the SQL in `supabase/transactions.sql` in your Supabase SQL editor to
create the shared transactions table and RLS policies.

Magic-link write access is controlled by `public.allowed_writers`. Add allowed
emails with SQL:

```sql
insert into public.allowed_writers (email, note)
values ('your-email@example.com', 'Palm')
on conflict (email) do update set note = excluded.note;
```

To add Tisa later:

```sql
insert into public.allowed_writers (email, note)
values ('tisa-email@example.com', 'Tisa')
on conflict (email) do update set note = excluded.note;
```

## Electron Wrapper

```bash
pnpm electron:dev
```
