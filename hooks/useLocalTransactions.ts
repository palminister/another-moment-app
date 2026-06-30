"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { calculateBalance, STORAGE_KEY } from "@/lib/ledger";
import type { Transaction } from "@/lib/types";

export function useLocalTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);

    if (storedValue) {
      setTransactions(JSON.parse(storedValue) as Transaction[]);
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [isLoaded, transactions]);

  const addTransaction = useCallback((transaction: Transaction) => {
    setTransactions((current) => [transaction, ...current]);
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((current) => current.filter((transaction) => transaction.id !== id));
  }, []);

  const balance = useMemo(() => calculateBalance(transactions), [transactions]);

  return {
    transactions,
    balance,
    addTransaction,
    deleteTransaction,
    isLoaded,
  };
}
