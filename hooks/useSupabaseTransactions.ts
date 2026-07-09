"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { calculateBalance } from "@/lib/ledger";
import {
  fetchTransactions,
  insertTransaction,
  removeTransaction,
} from "@/lib/transactionsRepository";
import type { Transaction } from "@/lib/types";

export function useSupabaseTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadTransactions() {
      try {
        const storedTransactions = await fetchTransactions();

        if (isMounted) {
          setTransactions(storedTransactions);
          setError(null);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(getErrorMessage(loadError));
        }
      } finally {
        if (isMounted) {
          setIsLoaded(true);
        }
      }
    }

    void loadTransactions();

    return () => {
      isMounted = false;
    };
  }, []);

  const addTransaction = useCallback(async (transaction: Transaction) => {
    setTransactions((current) => [transaction, ...current]);
    setError(null);

    try {
      const savedTransaction = await insertTransaction(transaction);
      setTransactions((current) =>
        current.map((item) =>
          item.id === transaction.id ? savedTransaction : item,
        ),
      );
    } catch (insertError) {
      setTransactions((current) =>
        current.filter((item) => item.id !== transaction.id),
      );
      setError(getErrorMessage(insertError));
    }
  }, []);

  const deleteTransaction = useCallback(async (id: string) => {
    let deletedTransaction: Transaction | undefined;

    setTransactions((current) => {
      deletedTransaction = current.find((transaction) => transaction.id === id);
      return current.filter((transaction) => transaction.id !== id);
    });
    setError(null);

    try {
      await removeTransaction(id);
    } catch (deleteError) {
      if (deletedTransaction) {
        const transactionToRestore = deletedTransaction;

        setTransactions((current) =>
          [transactionToRestore, ...current].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime(),
          ),
        );
      }

      setError(getErrorMessage(deleteError));
    }
  }, []);

  const balance = useMemo(() => calculateBalance(transactions), [transactions]);

  return {
    transactions,
    balance,
    addTransaction,
    deleteTransaction,
    isLoaded,
    error,
  };
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to sync transactions with Supabase.";
}
