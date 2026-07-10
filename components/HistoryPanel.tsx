"use client";

import { formatCurrency } from "@/lib/ledger";
import type { Transaction } from "@/lib/types";

type HistoryPanelProps = {
  isOpen: boolean;
  transactions: Transaction[];
  onClose: () => void;
  onDelete: (id: string) => void;
};

export function HistoryPanel({
  isOpen,
  transactions,
  onClose,
  onDelete,
}: HistoryPanelProps) {
  return (
    <aside
      aria-hidden={!isOpen}
      className={`fixed font-palm inset-y-0 right-0 z-30 w-full max-w-md border-l bg-white p-8 transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="mb-5 mt-14 flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">History</h2>
        <button
          type="button"
          className="rounded border px-3 py-2"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      {transactions.length === 0 ? (
        <p className="text-sm text-neutral-500">No transactions yet.</p>
      ) : (
        <ul className="space-y-3 overflow-y-scroll h-full">
          {transactions.map((transaction) => (
            <li key={transaction.id} className="rounded border p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold divide-y-4">
                    {transaction.payer}
                    <span className="text-xs font-mono font-light text-gray-400">
                      {" "}
                      ·{" "}
                      {new Intl.DateTimeFormat("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                        timeZone: "Asia/Bangkok",
                      }).format(new Date(transaction.createdAt))}
                    </span>
                  </p>
                  <p className="truncate w-[200px] mt-2 text-sm">
                    {transaction.note || "No note"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    <span className="font-mono">฿</span>
                    {formatCurrency(transaction.amount)}
                  </p>
                  <button
                    type="button"
                    className="mt-2 text-sm underline"
                    onClick={() => onDelete(transaction.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
