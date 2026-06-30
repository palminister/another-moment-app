import { describe, expect, it } from "vitest";
import {
  calculateBalance,
  getBalanceSummary,
  getBalanceText,
  getSuggestedMoment,
  getSuggestedMomentParts,
} from "@/lib/ledger";
import type { Transaction } from "@/lib/types";

const transactions: Transaction[] = [
  {
    id: "1",
    payer: "Tisa",
    note: "Dinner",
    amount: 100,
    expression: "100",
    createdAt: "2026-06-20T00:00:00.000Z",
  },
  {
    id: "2",
    payer: "Palm",
    note: "Starbucks",
    amount: 250,
    expression: "250",
    createdAt: "2026-06-21T00:00:00.000Z",
  },
];

describe("ledger", () => {
  it("calculates who is ahead", () => {
    expect(calculateBalance(transactions)).toBe(-150);
    expect(getBalanceText(-150)).toBe("Palm is ahead ฿150");
    expect(getBalanceText(0)).toBe("You're both even out");
    expect(getBalanceSummary(-150)).toEqual({
      status: "ahead",
      label: "Palm is ahead",
      amount: "150",
    });
  });

  it("suggests the closest noted moment by balance amount", () => {
    expect(getSuggestedMoment(transactions, -150, 0)).toBe("Cover for the next Dinner?");
    expect(getSuggestedMoment(transactions, -150, 1)).toBe("Go for Starbucks?");
    expect(getSuggestedMomentParts(transactions, -150, 0)).toEqual({
      status: "suggestion",
      prefix: "Cover for the next ",
      note: "Dinner",
      suffix: "?",
    });
  });
});
