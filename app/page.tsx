import { AppShell } from "@/components/AppShell";
import { fetchInitialTransactions } from "@/lib/serverTransactions";

export const dynamic = "force-dynamic";

export default async function Home() {
  const initialTransactions = await fetchInitialTransactions();

  return <AppShell initialTransactions={initialTransactions} />;
}
