"use client";

import { useReducer, useState } from "react";
import { AuthSheet } from "@/components/AuthSheet";
import { BalanceSummary } from "@/components/BalanceSummary";
import { CalculatorDisplay } from "@/components/CalculatorDisplay";
import { CalculatorKeypad } from "@/components/CalculatorKeypad";
import { HistoryPanel } from "@/components/HistoryPanel";
import { PaymentSheet } from "@/components/PaymentSheet";
import { useServiceWorker } from "@/hooks/useServiceWorker";
import { useSupabaseTransactions } from "@/hooks/useSupabaseTransactions";
import { useWriterAuth } from "@/hooks/useWriterAuth";
import {
  currentAmount,
  getCalculatorDisplayLines,
  initialCalculatorState,
  reduceCalculator,
} from "@/lib/calculator";
import { createTransaction } from "@/lib/ledger";
import type { CalculatorButton, Transaction } from "@/lib/types";

type AppShellProps = {
  initialTransactions: Transaction[];
};

export function AppShell({ initialTransactions }: AppShellProps) {
  useServiceWorker();

  const [calculator, dispatchCalculator] = useReducer(
    reduceCalculator,
    initialCalculatorState,
  );
  const { transactions, balance, addTransaction, deleteTransaction, error } =
    useSupabaseTransactions(initialTransactions);
  const writerAuth = useWriterAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [suggestionOffset, setSuggestionOffset] = useState(0);

  const amount = currentAmount(calculator);
  const displayLines = getCalculatorDisplayLines(calculator);
  const canCommit =
    calculator.commitMode && Number.isFinite(amount) && amount > 0;

  function handlePress(button: CalculatorButton) {
    dispatchCalculator(button);
  }

  function handleCommitIntent() {
    if (!canCommit) {
      return;
    }

    setIsPaymentOpen(true);
  }

  function requireWriterAccess() {
    if (writerAuth.isSignedIn) {
      return true;
    }

    setIsAuthOpen(true);
    return false;
  }

  return (
    <main className="relative isolate mx-auto flex min-h-dvh w-full max-w-[402px] flex-col overflow-hidden bg-app-background px-4 py-6 justify-between">
      <div className="flex flex-col bg-app-screen border-8 border-app-gray rounded-t-[56px] rounded-b-[32px] flex-grow mb-4 justify-betwee overflow-hidden">
        <BalanceSummary
          balance={balance}
          transactions={transactions}
          suggestionOffset={suggestionOffset}
          onCycleSuggestion={() =>
            setSuggestionOffset((current) => current + 1)
          }
          onOpenHistory={() => setIsHistoryOpen(true)}
        />
        <CalculatorDisplay
          historyLine={displayLines.historyLine}
          primaryLine={displayLines.primaryLine}
        />
      </div>
      <CalculatorKeypad
        commitMode={calculator.commitMode}
        onPress={handlePress}
        onCommit={handleCommitIntent}
      />
      <PaymentSheet
        amount={amount}
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onConfirm={({ payer, note }) => {
          if (!requireWriterAccess()) {
            return;
          }

          void addTransaction(
            createTransaction({
              payer,
              note,
              amount,
              expression: calculator.semanticLine || calculator.display,
            }),
          );
          dispatchCalculator("clear");
        }}
      />

      <HistoryPanel
        isOpen={isHistoryOpen}
        transactions={transactions}
        onClose={() => setIsHistoryOpen(false)}
        onDelete={(id) => {
          if (!requireWriterAccess()) {
            return;
          }

          void deleteTransaction(id);
        }}
      />
      <AuthSheet
        email={writerAuth.email}
        error={writerAuth.error}
        isOpen={isAuthOpen}
        message={writerAuth.message}
        onClose={() => setIsAuthOpen(false)}
        onSendMagicLink={writerAuth.sendMagicLink}
        onSignOut={writerAuth.signOut}
      />
      {error ? (
        <p className="fixed bottom-2 left-2 right-2 z-50 bg-white p-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </main>
  );
}
