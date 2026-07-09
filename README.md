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

## Electron Wrapper

```bash
pnpm electron:dev
```
