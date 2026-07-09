import type { Database } from "@/lib/database.types";
import type { Transaction } from "@/lib/types";

type TransactionRow = Database["public"]["Tables"]["transactions"]["Row"];

const TRANSACTION_COLUMNS = "id,payer,note,amount,expression,created_at";

export async function fetchInitialTransactions(): Promise<Transaction[]> {
  const health = await checkInitialTransactionsHealth();

  if (!health.ok || !health.rows) {
    console.error("Initial Supabase transaction fetch failed", health);
    return [];
  }

  return health.rows.map(rowToTransaction);
}

export async function checkInitialTransactionsHealth(): Promise<
  | {
      ok: false;
      hasUrl: boolean;
      hasPublishableKey: boolean;
      status: null;
      rowCount: null;
      rows?: never;
      error: string;
    }
  | {
      ok: boolean;
      hasUrl: true;
      hasPublishableKey: true;
      status: number;
      rowCount: number | null;
      rows?: TransactionRow[];
      error: string | null;
    }
> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    return {
      ok: false,
      hasUrl: Boolean(supabaseUrl),
      hasPublishableKey: Boolean(supabasePublishableKey),
      status: null,
      rowCount: null,
      error: "Missing Supabase environment variables.",
    };
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
    return {
      ok: false,
      hasUrl: true,
      hasPublishableKey: true,
      status: response.status,
      rowCount: null,
      error: await response.text(),
    };
  }

  const rows = (await response.json()) as TransactionRow[];
  return {
    ok: true,
    hasUrl: true,
    hasPublishableKey: true,
    status: response.status,
    rowCount: rows.length,
    rows,
    error: null,
  };
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
