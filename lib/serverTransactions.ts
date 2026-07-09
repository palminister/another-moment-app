import type { Database } from "@/lib/database.types";
import type { Transaction } from "@/lib/types";

type TransactionRow = Database["public"]["Tables"]["transactions"]["Row"];

const TRANSACTION_COLUMNS = "id,payer,note,amount,expression,created_at";

export async function fetchInitialTransactions(): Promise<Transaction[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    return [];
  }

  const requestUrl = new URL("/rest/v1/transactions", supabaseUrl);
  requestUrl.searchParams.set("select", TRANSACTION_COLUMNS);
  requestUrl.searchParams.set("order", "created_at.desc");

  const response = await fetch(requestUrl, {
    headers: {
      apikey: supabasePublishableKey,
      Authorization: `Bearer ${supabasePublishableKey}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  const rows = (await response.json()) as TransactionRow[];
  return rows.map(rowToTransaction);
}

function rowToTransaction(row: TransactionRow): Transaction {
  return {
    id: row.id,
    payer: row.payer,
    note: row.note,
    amount: Number(row.amount),
    expression: row.expression,
    createdAt: row.created_at,
  };
}
