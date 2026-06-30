import type { Transaction } from "@/lib/types";

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "mock-sushiro",
    payer: "Tisa",
    note: "Sushiro",
    amount: 5250,
    expression: "525 × 10",
    createdAt: "2026-06-20T12:00:00.000Z",
  },
  {
    id: "mock-starbucks",
    payer: "Palm",
    note: "Starbucks",
    amount: 250,
    expression: "250",
    createdAt: "2026-06-21T09:30:00.000Z",
  },
];
