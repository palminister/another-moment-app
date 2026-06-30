import type { CalculatorButton } from "@/lib/types";

type CalculatorKey = {
  label: string;
  value: CalculatorButton;
  bgColor: string;
  border: string;
  color: string;
};

const keys: CalculatorKey[] = [
  {
    label: "⌫",
    value: "backspace",
    bgColor: "bg-app-accent",
    border: "border-app-accentborder",
    color: "text-white",
  },
  {
    label: "C",
    value: "clear",
    bgColor: "bg-app-accent",
    border: "border-app-accentborder",
    color: "text-white",
  },
  {
    label: "%",
    value: "percent",
    bgColor: "bg-app-darkgray",
    border: "border-app-darkgrayborder",
    color: "text-white",
  },
  {
    label: "÷",
    value: "divide",
    bgColor: "bg-app-muted",
    border: "border-app-mutedborder",
    color: "text-white",
  },
  {
    label: "7",
    value: "7",
    bgColor: "bg-app-gray",
    border: "border-app-gray",
    color: "text-app-screen",
  },
  {
    label: "8",
    value: "8",
    bgColor: "bg-app-gray",
    border: "border-app-gray",
    color: "text-app-screen",
  },
  {
    label: "9",
    value: "9",
    bgColor: "bg-app-gray",
    border: "border-app-gray",
    color: "text-app-screen",
  },
  {
    label: "×",
    value: "multiply",
    bgColor: "bg-app-muted",
    border: "border-app-mutedborder",
    color: "text-white",
  },
  {
    label: "4",
    value: "4",
    bgColor: "bg-app-gray",
    border: "border-app-gray",
    color: "text-app-screen",
  },
  {
    label: "5",
    value: "5",
    bgColor: "bg-app-gray",
    border: "border-app-gray",
    color: "text-app-screen",
  },
  {
    label: "6",
    value: "6",
    bgColor: "bg-app-gray",
    border: "border-app-gray",
    color: "text-app-screen",
  },
  {
    label: "-",
    value: "subtract",
    bgColor: "bg-app-muted",
    border: "border-app-mutedborder",
    color: "text-white",
  },
  {
    label: "1",
    value: "1",
    bgColor: "bg-app-gray",
    border: "border-app-gray",
    color: "text-app-screen",
  },
  {
    label: "2",
    value: "2",
    bgColor: "bg-app-gray",
    border: "border-app-gray",
    color: "text-app-screen",
  },
  {
    label: "3",
    value: "3",
    bgColor: "bg-app-gray",
    border: "border-app-gray",
    color: "text-app-screen",
  },
  {
    label: "+",
    value: "add",
    bgColor: "bg-app-muted",
    border: "border-app-mutedborder",
    color: "text-white",
  },
  {
    label: "+/-",
    value: "sign",
    bgColor: "bg-app-darkgray",
    border: "border-app-darkgrayborder",
    color: "text-white",
  },
  {
    label: "0",
    value: "0",
    bgColor: "bg-app-gray",
    border: "border-app-gray",
    color: "text-app-screen",
  },
  {
    label: ".",
    value: "decimal",
    bgColor: "bg-app-darkgray",
    border: "border-app-darkgrayborder",
    color: "text-white",
  },
  {
    label: "=",
    value: "equals",
    bgColor: "bg-app-darkblue",
    border: "border-app-darkblueborder",
    color: "text-white",
  },
];

type CalculatorKeypadProps = {
  commitMode: boolean;
  onPress: (button: CalculatorButton) => void;
  onCommit: () => void;
};

export function CalculatorKeypad({
  commitMode,
  onPress,
  onCommit,
}: CalculatorKeypadProps) {
  return (
    <section
      aria-label="Calculator keypad"
      className="grid grid-cols-4 gap-[6px] font-biorhyme max-w-[324px] m-auto"
    >
      {keys.map((key) => {
        const isEquals = key.value === "equals";
        const label = isEquals && commitMode ? "→" : key.label;

        return (
          <button
            key={key.value}
            type="button"
            className={`h-[77px] w-[77px] text-3xl shadow-black/25 shadow-xl border-[3px]
                        transform transition-all duration-100 active:scale-95 active:opacity-95 ${key.color}
                        ${key.label === "÷" ? " leading-[90px]" : null}
                        ${isEquals && commitMode ? "bg-app-yellow border-app-yellowborder" : `${key.bgColor} ${key.border}`}
                        `}
            onClick={() => {
              if (isEquals && commitMode) {
                onCommit();
                return;
              }

              onPress(key.value);
            }}
          >
            {label === "→" ? (
              <svg
                width="70"
                height="32"
                viewBox="0 0 24 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.06055 12.4382L11.4177 2.08105L22.6034 12.4382M11.4177 2.49534V31.0811"
                  stroke="#211E24"
                  strokeWidth="3"
                />
              </svg>
            ) : (
              label
            )}
          </button>
        );
      })}
    </section>
  );
}
