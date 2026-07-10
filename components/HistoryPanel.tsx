"use client";

import { useState } from "react";
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
  const [openTransactionId, setOpenTransactionId] = useState<string | null>(
    null,
  );
  const [swipeStartX, setSwipeStartX] = useState<number | null>(null);
  const revealDistance = 88;
  const swipeThreshold = 36;

  function handlePointerDown(clientX: number) {
    setSwipeStartX(clientX);
  }

  function handlePointerUp(transactionId: string, clientX: number) {
    if (swipeStartX === null) {
      return;
    }

    const swipeDistance = clientX - swipeStartX;

    if (swipeDistance <= -swipeThreshold) {
      setOpenTransactionId(transactionId);
    }

    if (swipeDistance >= swipeThreshold) {
      setOpenTransactionId(null);
    }

    setSwipeStartX(null);
  }

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
            <li
              key={transaction.id}
              className="relative overflow-hidden rounded border bg-white"
            >
              <button
                type="button"
                className="absolute inset-y-0 right-0 w-[88px] bg-app-background px-4 text-sm font-semibold text-white transition-opacity duration-200"
                onClick={() => {
                  onDelete(transaction.id);
                  setOpenTransactionId(null);
                }}
              >
                Delete
              </button>
              <div
                className="relative bg-white p-3 transition-transform duration-300 ease-out touch-pan-y"
                style={{
                  transform:
                    openTransactionId === transaction.id
                      ? `translateX(-${revealDistance}px)`
                      : "translateX(0)",
                }}
                onPointerDown={(event) => handlePointerDown(event.clientX)}
                onPointerUp={(event) =>
                  handlePointerUp(transaction.id, event.clientX)
                }
                onPointerCancel={() => setSwipeStartX(null)}
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
                    <p className="mt-2 text-xs  font-mono font-light text-gray-400">
                      {new Intl.DateTimeFormat("en-GB", {
                        dateStyle: "short",
                        timeZone: "Asia/Bangkok",
                      }).format(new Date(transaction.createdAt))}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
