import { describe, expect, it } from "vitest";
import {
  getCalculatorDisplayLines,
  initialCalculatorState,
  reduceCalculator,
} from "@/lib/calculator";
import type { CalculatorButton } from "@/lib/types";

function press(buttons: CalculatorButton[]) {
  return buttons.reduce(reduceCalculator, initialCalculatorState);
}

describe("calculator", () => {
  it("evaluates addition and enters commit mode", () => {
    const state = press(["5", "2", "5", "add", "1", "0", "equals"]);

    expect(state.display).toBe("535");
    expect(state.semanticLine).toBe("525+10");
    expect(state.commitMode).toBe(true);
  });

  it("keeps appending operators without evaluating before equals", () => {
    const state = press(["2", "add", "2", "subtract", "3", "multiply", "4"]);

    expect(state.display).toBe("4");
    expect(getCalculatorDisplayLines(state)).toEqual({
      historyLine: "",
      primaryLine: "2+2-3×4",
    });
    expect(state.commitMode).toBe(false);
  });

  it("evaluates a long expression only when equals is pressed", () => {
    const state = press(["2", "add", "2", "subtract", "3", "multiply", "4", "equals"]);

    expect(state.display).toBe("4");
    expect(getCalculatorDisplayLines(state)).toEqual({
      historyLine: "2+2-3×4",
      primaryLine: "4",
    });
  });

  it("shows the live expression on the primary line until equals", () => {
    const state = press(["5", "2", "5", "add", "1", "0"]);

    expect(getCalculatorDisplayLines(state)).toEqual({
      historyLine: "",
      primaryLine: "525+10",
    });
  });

  it("moves the expression to the history line after equals", () => {
    const state = press(["5", "2", "5", "add", "1", "0", "equals"]);

    expect(getCalculatorDisplayLines(state)).toEqual({
      historyLine: "525+10",
      primaryLine: "535",
    });
  });

  it("applies iOS-style percentage for plus", () => {
    const state = press(["5", "2", "5", "add", "1", "0", "percent", "equals"]);

    expect(state.display).toBe("577.5");
    expect(state.semanticLine).toBe("525+10%");
    expect(state.commitMode).toBe(true);
  });

  it("keeps percentage expressions live until equals", () => {
    const state = press(["5", "2", "5", "add", "1", "0", "percent"]);

    expect(getCalculatorDisplayLines(state)).toEqual({
      historyLine: "",
      primaryLine: "525+10%",
    });
    expect(state.commitMode).toBe(false);
  });

  it("applies iOS-style percentage for minus", () => {
    const state = press(["5", "2", "5", "subtract", "1", "0", "percent", "equals"]);

    expect(state.display).toBe("472.5");
    expect(state.semanticLine).toBe("525-10%");
  });

  it("applies percentage for multiplication and division", () => {
    expect(press(["5", "2", "5", "multiply", "1", "0", "percent", "equals"]).display).toBe("52.5");
    expect(press(["5", "2", "5", "divide", "1", "0", "percent", "equals"]).display).toBe("5,250");
  });

  it("turns commit mode off after any other calculator button", () => {
    const evaluated = press(["1", "add", "1", "equals"]);
    const next = reduceCalculator(evaluated, "2");

    expect(evaluated.commitMode).toBe(true);
    expect(next.commitMode).toBe(false);
    expect(next.display).toBe("2");
  });

  it("clears the current calculation", () => {
    const state = press(["1", "2", "3", "clear"]);

    expect(state).toEqual(initialCalculatorState);
  });
});
