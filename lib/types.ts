export type Payer = "Tisa" | "Palm";

export type CalculatorOperator = "+" | "-" | "×" | "÷";

export type CalculatorButton =
  | "backspace"
  | "clear"
  | "percent"
  | "divide"
  | "multiply"
  | "subtract"
  | "add"
  | "sign"
  | "decimal"
  | "equals"
  | "commit"
  | `${number}`;

export type Transaction = {
  id: string;
  payer: Payer;
  note: string;
  amount: number;
  expression: string;
  createdAt: string;
};
