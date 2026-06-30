type CalculatorDisplayProps = {
  historyLine: string;
  primaryLine: string;
};

export function CalculatorDisplay({
  historyLine,
  primaryLine,
}: CalculatorDisplayProps) {
  return (
    <section
      aria-label="Calculator display"
      className="flex flex-col justify-end items-end mb-4 min-h-32 mr-4 text-right max-w-[324px] m-auto font-biorhyme"
    >
      <p className="min-h-6 text-3xl text-[#4E494B]">
        <MathLine value={historyLine} type="history" />
      </p>
      <output className="flex justify-end whitespace-nowrap overflow-hidden text-6xl font-semibold tabular-nums text-white">
        <MathLine value={primaryLine} type="primary" />
      </output>
    </section>
  );
}

function MathLine({ value, type }: { value: string; type: string }) {
  return value.split("").map((character, index) => {
    if (character === "÷") {
      return (
        <span
          key={`${character}-${index}`}
          className={`inline-block scale-75 align-[0.05em] translate-y-3 ${type === "primary" ? "!translate-y-5" : ""}`}
        >
          {character}
        </span>
      );
    }

    return character;
  });
}
