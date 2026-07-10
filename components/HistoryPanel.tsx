"use client";

import { formatCurrency } from "@/lib/ledger";
import type { Transaction } from "@/lib/types";
import { useEffect, useState } from "react";

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
  const [activeTransactionId, setActiveTransactionId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!isOpen) {
      setActiveTransactionId(null);
    }
  }, [isOpen]);

  const toggleDeleteAction = (transactionId: string) => {
    setActiveTransactionId((currentId) =>
      currentId === transactionId ? null : transactionId,
    );
  };

  const handleDelete = (transactionId: string) => {
    setActiveTransactionId(null);
    onDelete(transactionId);
  };

  return (
    <aside
      aria-hidden={!isOpen}
      className={`fixed font-palm inset-y-0 right-0 z-30 w-full max-w-md border-l bg-[#F8F8F8] p-8 transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="mb-5 mt-[3.2rem] flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">History</h2>
        <button
          type="button"
          className="rounded bg-app-screen text-app-gray px-3 py-2 font-bold"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      {transactions.length === 0 ? (
        <p className="text-sm text-neutral-500">No transactions yet.</p>
      ) : (
        <ul className="space-y-3 overflow-y-scroll h-full">
          {transactions.map((transaction) => {
            const isDeleteVisible = activeTransactionId === transaction.id;

            return (
              <li
                key={transaction.id}
                className="relative overflow-hidden border-l-8 border-white border-dashed shadow-sm"
              >
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 w-[88px] bg-app-background px-4 text-sm font-semibold text-white"
                  aria-label={`Delete ${transaction.note || transaction.payer} transaction`}
                  tabIndex={isDeleteVisible ? 0 : -1}
                  onClick={() => handleDelete(transaction.id)}
                >
                  Delete
                </button>

                <button
                  type="button"
                  className={`relative z-10 block w-full bg-white p-3 text-left transition-transform duration-200 ease-out ${
                    isDeleteVisible ? "-translate-x-[88px]" : "translate-x-0"
                  }`}
                  aria-expanded={isDeleteVisible}
                  onClick={() => toggleDeleteAction(transaction.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold divide-y-4">
                        {transaction.payer}
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
                      <p className="mt-2 text-xs font-mono font-light">
                        {new Intl.DateTimeFormat("en-GB", {
                          dateStyle: "short",
                          timeZone: "Asia/Bangkok",
                        }).format(new Date(transaction.createdAt))}
                      </p>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}
