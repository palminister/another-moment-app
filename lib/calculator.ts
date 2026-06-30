import type { CalculatorButton, CalculatorOperator } from "@/lib/types";

type NumberToken = {
  kind: "number";
  value: number;
  label: string;
};

type OperatorToken = {
  kind: "operator";
  operator: CalculatorOperator;
};

type ExpressionToken = NumberToken | OperatorToken;

export type CalculatorState = {
  display: string;
  semanticLine: string;
  expressionTokens: ExpressionToken[];
  currentLabel: string | null;
  inputStarted: boolean;
  justEvaluated: boolean;
  commitMode: boolean;
};

export const initialCalculatorState: CalculatorState = {
  display: "0",
  semanticLine: "",
  expressionTokens: [],
  currentLabel: null,
  inputStarted: false,
  justEvaluated: false,
  commitMode: false,
};

const operatorButtonMap = {
  add: "+",
  subtract: "-",
  multiply: "×",
  divide: "÷",
} satisfies Partial<Record<CalculatorButton, CalculatorOperator>>;

export function reduceCalculator(
  state: CalculatorState,
  button: CalculatorButton,
): CalculatorState {
  if (button === "commit") {
    return state;
  }

  const baseState = state.commitMode ? { ...state, commitMode: false } : state;

  if (isDigitButton(button)) {
    return inputDigit(baseState, button);
  }

  if (button in operatorButtonMap) {
    return inputOperator(
      baseState,
      operatorButtonMap[button as keyof typeof operatorButtonMap],
    );
  }

  switch (button) {
    case "backspace":
      return backspace(baseState);
    case "clear":
      return initialCalculatorState;
    case "percent":
      return inputPercent(baseState);
    case "sign":
      return toggleSign(baseState);
    case "decimal":
      return inputDecimal(baseState);
    case "equals":
      return evaluate(baseState);
    default:
      return baseState;
  }
}

export function currentAmount(state: CalculatorState): number {
  return parseDisplay(state.display);
}

export function getCalculatorDisplayLines(state: CalculatorState): {
  historyLine: string;
  primaryLine: string;
} {
  if (state.justEvaluated || state.commitMode) {
    return {
      historyLine: state.semanticLine,
      primaryLine: state.display,
    };
  }

  if (state.expressionTokens.length > 0) {
    return {
      historyLine: "",
      primaryLine: formatExpression(getDraftExpression(state)),
    };
  }

  return {
    historyLine: "",
    primaryLine: state.currentLabel ?? state.display,
  };
}

function inputDigit(
  state: CalculatorState,
  digit: `${number}`,
): CalculatorState {
  const shouldReplace =
    !state.inputStarted || state.justEvaluated || state.currentLabel !== null;
  const nextDisplay = shouldReplace
    ? digit
    : state.display === "0"
      ? digit
      : `${state.display}${digit}`;

  return {
    ...state,
    display: normalizeDisplay(nextDisplay),
    expressionTokens: state.justEvaluated ? [] : state.expressionTokens,
    currentLabel: null,
    inputStarted: true,
    justEvaluated: false,
    semanticLine: state.justEvaluated ? "" : state.semanticLine,
  };
}

function inputDecimal(state: CalculatorState): CalculatorState {
  if (
    state.justEvaluated ||
    !state.inputStarted ||
    state.currentLabel !== null
  ) {
    return {
      ...state,
      display: "0.",
      expressionTokens: state.justEvaluated ? [] : state.expressionTokens,
      currentLabel: null,
      inputStarted: true,
      justEvaluated: false,
      semanticLine: state.justEvaluated ? "" : state.semanticLine,
    };
  }

  if (state.display.includes(".")) {
    return state;
  }

  return {
    ...state,
    display: `${state.display}.`,
    inputStarted: true,
    justEvaluated: false,
  };
}

function inputOperator(
  state: CalculatorState,
  operator: CalculatorOperator,
): CalculatorState {
  if (state.justEvaluated) {
    return {
      ...state,
      expressionTokens: [
        createNumberToken(state),
        createOperatorToken(operator),
      ],
      currentLabel: null,
      inputStarted: false,
      justEvaluated: false,
      semanticLine: "",
    };
  }

  const tokens = [...state.expressionTokens];
  const lastToken = tokens[tokens.length - 1];

  if (lastToken?.kind === "operator" && !state.inputStarted) {
    tokens[tokens.length - 1] = createOperatorToken(operator);
    return {
      ...state,
      expressionTokens: tokens,
      currentLabel: null,
      inputStarted: false,
      justEvaluated: false,
    };
  }

  if (state.inputStarted || tokens.length === 0) {
    tokens.push(createNumberToken(state));
  }

  tokens.push(createOperatorToken(operator));

  return {
    ...state,
    expressionTokens: tokens,
    currentLabel: null,
    inputStarted: false,
    justEvaluated: false,
  };
}

function evaluate(state: CalculatorState): CalculatorState {
  const expression = normalizeExpression(getDraftExpression(state));
  const expressionLabel = formatExpression(expression);
  const result = evaluateExpression(expression);

  return {
    ...state,
    display: formatNumber(result),
    semanticLine: expressionLabel,
    expressionTokens: [],
    currentLabel: null,
    inputStarted: false,
    justEvaluated: true,
    commitMode: true,
  };
}

function inputPercent(state: CalculatorState): CalculatorState {
  const current = parseDisplay(state.display);

  const lastOperator = findLastOperator(state.expressionTokens);
  const previousNumber = findLastNumber(state.expressionTokens);
  const percentValue =
    previousNumber && (lastOperator === "+" || lastOperator === "-")
      ? previousNumber.value * (current / 100)
      : current / 100;

  return {
    ...state,
    display: formatNumber(percentValue),
    currentLabel: `${formatNumber(current)}%`,
    inputStarted: true,
    justEvaluated: false,
  };
}

function toggleSign(state: CalculatorState): CalculatorState {
  if (state.display === "0") {
    return state;
  }

  return {
    ...state,
    display: state.display.startsWith("-")
      ? state.display.slice(1)
      : `-${state.display}`,
    currentLabel: null,
    inputStarted: true,
    justEvaluated: false,
  };
}

function backspace(state: CalculatorState): CalculatorState {
  if (state.justEvaluated || !state.inputStarted) {
    return {
      ...state,
      display: "0",
      currentLabel: null,
      inputStarted: false,
      justEvaluated: false,
    };
  }

  if (state.currentLabel) {
    return { ...state, display: "0", currentLabel: null, inputStarted: false };
  }

  if (
    state.display.length <= 1 ||
    (state.display.length === 2 && state.display.startsWith("-"))
  ) {
    return { ...state, display: "0", inputStarted: false };
  }

  return { ...state, display: state.display.slice(0, -1) };
}

function calculate(
  left: number,
  right: number,
  operator: CalculatorOperator,
): number {
  switch (operator) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "×":
      return left * right;
    case "÷":
      return right === 0 ? Number.NaN : left / right;
  }
}

function createNumberToken(state: CalculatorState): NumberToken {
  return {
    kind: "number",
    value: parseDisplay(state.display),
    label: state.currentLabel ?? formatNumber(parseDisplay(state.display)),
  };
}

function createOperatorToken(operator: CalculatorOperator): OperatorToken {
  return {
    kind: "operator",
    operator,
  };
}

function getDraftExpression(state: CalculatorState): ExpressionToken[] {
  if (state.inputStarted || state.expressionTokens.length === 0) {
    return [...state.expressionTokens, createNumberToken(state)];
  }

  return state.expressionTokens;
}

function normalizeExpression(tokens: ExpressionToken[]): ExpressionToken[] {
  const normalized = [...tokens];

  while (normalized[normalized.length - 1]?.kind === "operator") {
    normalized.pop();
  }

  return normalized.length > 0
    ? normalized
    : [createNumberToken(initialCalculatorState)];
}

function evaluateExpression(tokens: ExpressionToken[]): number {
  const firstToken = tokens[0];

  if (!firstToken || firstToken.kind !== "number") {
    return 0;
  }

  let result = firstToken.value;

  for (let index = 1; index < tokens.length; index += 2) {
    const operatorToken = tokens[index];
    const rightToken = tokens[index + 1];

    if (operatorToken?.kind !== "operator" || rightToken?.kind !== "number") {
      break;
    }

    result = calculate(result, rightToken.value, operatorToken.operator);
  }

  return result;
}

function formatExpression(tokens: ExpressionToken[]): string {
  return tokens
    .map((token) => (token.kind === "number" ? token.label : token.operator))
    .join("");
}

function findLastOperator(
  tokens: ExpressionToken[],
): CalculatorOperator | null {
  for (let index = tokens.length - 1; index >= 0; index -= 1) {
    const token = tokens[index];

    if (token.kind === "operator") {
      return token.operator;
    }
  }

  return null;
}

function findLastNumber(tokens: ExpressionToken[]): NumberToken | null {
  for (let index = tokens.length - 1; index >= 0; index -= 1) {
    const token = tokens[index];

    if (token.kind === "number") {
      return token;
    }
  }

  return null;
}

function isDigitButton(button: CalculatorButton): button is `${number}` {
  return /^\d$/.test(button);
}

function parseDisplay(display: string): number {
  return Number(display.replace(/,/g, ""));
}

function normalizeDisplay(value: string): string {
  if (value === "") {
    return "0";
  }

  if (value.length > 1 && value.startsWith("0") && !value.startsWith("0.")) {
    return value.replace(/^0+/, "") || "0";
  }

  return value;
}

export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return "Error";
  }

  const rounded = Number(value.toPrecision(12));
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 10,
  }).format(rounded);
}
