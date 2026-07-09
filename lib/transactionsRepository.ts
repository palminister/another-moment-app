import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import type { Database } from "@/lib/database.types";
import type { Transaction } from "@/lib/types";

type TransactionRow = Database["public"]["Tables"]["transactions"]["Row"];
type TransactionInsert =
  Database["public"]["Tables"]["transactions"]["Insert"];

const TRANSACTION_COLUMNS =
  "id,payer,note,amount,expression,created_at" as const;

export async function fetchTransactions(): Promise<Transaction[]> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("transactions")
    .select(TRANSACTION_COLUMNS)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data.map(rowToTransaction);
}

export async function insertTransaction(
  transaction: Transaction,
): Promise<Transaction> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("transactions")
    .insert(transactionToInsert(transaction))
    .select(TRANSACTION_COLUMNS)
    .single();

  if (error) {
    throw error;
  }

  return rowToTransaction(data);
}

export async function removeTransaction(id: string): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.from("transactions").delete().eq("id", id);

  if (error) {
    throw error;
  }
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

function transactionToInsert(transaction: Transaction): TransactionInsert {
  return {
    id: transaction.id,
    payer: transaction.payer,
    note: transaction.note,
    amount: transaction.amount,
    expression: transaction.expression,
    created_at: transaction.createdAt,
  };
}
