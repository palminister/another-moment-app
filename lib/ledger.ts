import type { Payer, Transaction } from "@/lib/types";

export const STORAGE_KEY = "another-moment.transactions.v1";

export function createTransaction(input: {
  payer: Payer;
  note: string;
  amount: number;
  expression: string;
}): Transaction {
  return {
    id: crypto.randomUUID(),
    payer: input.payer,
    note: input.note.trim(),
    amount: roundCurrency(input.amount),
    expression: input.expression,
    createdAt: new Date().toISOString(),
  };
}

export function calculateBalance(transactions: Transaction[]): number {
  return roundCurrency(
    transactions.reduce((total, transaction) => {
      return (
        total +
        (transaction.payer === "Tisa"
          ? transaction.amount
          : -transaction.amount)
      );
    }, 0),
  );
}

export function getBalanceText(balance: number): string {
  const summary = getBalanceSummary(balance);

  if (summary.status === "even") {
    return summary.text;
  }

  return `${summary.label} ฿${summary.amount}`;
}

export function getBalanceSummary(
  balance: number,
):
  | { status: "even"; text: string }
  | { status: "ahead"; label: string; amount: string } {
  if (balance === 0) {
    return { status: "even", text: "You're both even out" };
  }

  const name = balance > 0 ? "Tisa" : "Palm";
  return {
    status: "ahead",
    label: `${name} is ahead`,
    amount: formatCurrency(Math.abs(balance)),
  };
}

export function getSuggestedMoment(
  transactions: Transaction[],
  balance: number,
  offset: number,
): string {
  const suggestion = getSuggestedMomentParts(transactions, balance, offset);

  if (suggestion.status === "empty") {
    return suggestion.text;
  }

  return `${suggestion.prefix}${suggestion.note}${suggestion.suffix}`;
}

export function getSuggestedMomentParts(
  transactions: Transaction[],
  balance: number,
  offset: number,
):
  | { status: "empty"; text: string }
  | { status: "suggestion"; prefix: string; note: string; suffix: string } {
  const notes = transactions
    .filter((transaction) => transaction.note.trim().length > 0)
    .map((transaction) => ({
      note: transaction.note.trim(),
      distance: Math.abs(Math.abs(balance) - transaction.amount),
    }))
    .sort((a, b) => a.distance - b.distance);

  if (notes.length === 0 || balance === 0) {
    return { status: "empty", text: "Add a note to suggest the next moment" };
  }

  const uniqueNotes = [
    ...new Map(
      notes.map((item) => [item.note.toLowerCase(), item.note]),
    ).values(),
  ];
  const note = uniqueNotes[offset % uniqueNotes.length];
  const templates = [
    { prefix: "Cover for the next ", suffix: "?" },
    { prefix: "Go for ", suffix: "?" },
    { prefix: "Make it ", suffix: " next?" },
  ];
  const template = templates[offset % templates.length];

  return {
    status: "suggestion",
    prefix: template.prefix,
    note,
    suffix: template.suffix,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(roundCurrency(value));
}

function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
