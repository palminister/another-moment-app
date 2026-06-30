"use client";

import { useState } from "react";
import catAnimation from "@/app/animations/cat_squeeze_bounce_loop.json";
import { ClickPlayLottie } from "@/components/ClickPlayLottie";
import { getBalanceSummary, getSuggestedMomentParts } from "@/lib/ledger";
import type { Transaction } from "@/lib/types";

type BalanceSummaryProps = {
  balance: number;
  transactions: Transaction[];
  suggestionOffset: number;
  onCycleSuggestion: () => void;
  onOpenHistory: () => void;
};

export function BalanceSummary({
  balance,
  transactions,
  suggestionOffset,
  onCycleSuggestion,
  onOpenHistory,
}: BalanceSummaryProps) {
  const balanceSummary = getBalanceSummary(balance);
  const [animationPlayCount, setAnimationPlayCount] = useState(0);
  const suggestion = getSuggestedMomentParts(
    transactions,
    balance,
    suggestionOffset,
  );
  const catAnimationSpeed = 3;
  const catAnimationScale = 1.5;

  return (
    <section className="flex relative max-w-[300px] w-full mx-auto mt-10 items-start justify-between font-palm">
      <div>
        <p className="text-2xl">
          {balanceSummary.status === "even" ? (
            <span className="text-white font-medium">
              {balanceSummary.text}
            </span>
          ) : (
            <>
              <span className="text-white font-medium">
                {balanceSummary.label}
              </span>{" "}
              <span className="text-app-accent font-bold !text-xl !font-mono">
                ฿
              </span>
              <span className="text-app-accent font-bold">
                {balanceSummary.amount}
              </span>
            </>
          )}
        </p>
        <button
          type="button"
          className="flex w-full mt-5 text-left text-sm md:text-md font-medium transform transition-all active:scale-95"
          onClick={() => {
            setAnimationPlayCount((current) => current + 1);
            onCycleSuggestion();
          }}
        >
          <div className="flex flex-shrink-0 w-[140px] overflow-visible h-[100px]">
            <ClickPlayLottie
              animationData={catAnimation}
              playSignal={animationPlayCount}
              speed={catAnimationSpeed}
              scale={catAnimationScale}
              className="h-[300px] w-[300px] -translate-y-[85px] -translate-x-4 scale-[var(--lottie-scale)]"
              ariaLabel="Cat squeeze bounce animation"
            />
          </div>
          <div className="flex-wrap m-auto w-[160px]">
            {suggestion.status === "empty" ? (
              suggestion.text
            ) : (
              <>
                {suggestion.prefix}
                <span className="text-app-accent !font-bold">
                  {suggestion.note}
                </span>
                {suggestion.suffix}
              </>
            )}
            <div className="absolute top-[13px] -right-[16px] -z-[5]">
              <svg
                width="205"
                height="77"
                viewBox="0 0 205 77"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M26.5 1.5H178.5C184.299 1.50017 189 6.20112 189 12V64.5C189 70.2989 184.299 74.9998 178.5 75H26.5C20.701 75 16 70.299 16 64.5V51C16 48.5149 13.9851 46.5002 11.5 46.5H3.00588C1.6196 46.4999 0.975545 44.7802 2.02053 43.8691L14.457 33.0273C15.4371 32.1728 15.9999 30.936 16 29.6357V12C16 6.20102 20.701 1.5 26.5 1.5Z"
                  fill="#F8F8F8"
                  stroke="#CCCCCC"
                  strokeWidth="3"
                />
              </svg>
            </div>
          </div>
        </button>
      </div>
      <button
        type="button"
        aria-label="Open transaction history"
        className=" absolute right-0 shrink-0 rounded-full px-3 py-3 bg-app-darkgray text-sm active:scale-95 active:opacity-95"
        onClick={onOpenHistory}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.25 12.25H10.25C10.8023 12.25 11.25 11.8023 11.25 11.25V4.75M10.75 0.75C16.2728 0.75 20.75 5.22715 20.75 10.75C20.75 16.2728 16.2728 20.75 10.75 20.75C5.22715 20.75 0.75 16.2728 0.75 10.75C0.75 5.22715 5.22715 0.75 10.75 0.75Z"
            stroke="#F1F1F1"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </section>
  );
}
