"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import successAnimation from "@/app/animations/success.json";
import { AutoPlayLottie } from "@/components/AutoPlayLottie";
import type { Payer } from "@/lib/types";

type PaymentSheetProps = {
  amount: number;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (input: { payer: Payer; note: string }) => void;
};

export function PaymentSheet({
  amount,
  isOpen,
  onClose,
  onConfirm,
}: PaymentSheetProps) {
  const [payer, setPayer] = useState<Payer>("Tisa");
  const [note, setNote] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const noteRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setPayer("Tisa");
      setNote("");
      setIsConfirmed(false);
    }
  }, [isOpen]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsConfirmed(true);
    onConfirm({ payer, note });
  }

  const handleSuccessComplete = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <div
      aria-hidden={!isOpen}
      className={`fixed font-palm inset-0 z-20 bg-black/20 transition-opacity ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-title"
        className={`absolute max-w-[354px] m-auto inset-x-0 bottom-0 bg-app-gray p-5 transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="absolute -top-2 left-0">
          <svg
            width="354"
            height="11"
            viewBox="0 0 354 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M354 11V0H350.895C350.895 2.89292 346.724 5.2381 341.579 5.2381C336.434 5.2381 332.263 2.89292 332.263 0H328.951C328.951 2.89292 324.78 5.2381 319.635 5.2381C314.49 5.23804 310.319 2.89288 310.319 0H307.007C307.007 2.89292 302.836 5.2381 297.691 5.2381C292.546 5.23798 288.375 2.89285 288.375 0H285.064C285.064 2.89284 280.893 5.23796 275.748 5.2381C270.603 5.2381 266.432 2.89292 266.432 0H263.12C263.12 2.89288 258.949 5.23803 253.804 5.2381C248.659 5.2381 244.488 2.89292 244.488 0H241.175C241.175 2.89292 237.005 5.23809 231.86 5.2381C226.715 5.2381 222.544 2.89292 222.544 0H219.231C219.231 2.89292 215.061 5.2381 209.916 5.2381C204.771 5.23804 200.6 2.89288 200.6 0H197.287C197.287 2.89292 193.117 5.2381 187.972 5.2381C182.827 5.23798 178.656 2.89285 178.656 0H175.344C175.344 2.89284 171.173 5.23797 166.028 5.2381C160.883 5.2381 156.713 2.89292 156.713 0H153.4C153.4 2.89288 149.229 5.23803 144.084 5.2381C138.939 5.2381 134.769 2.89292 134.769 0H131.456C131.456 2.89292 127.285 5.2381 122.14 5.2381C116.995 5.2381 112.825 2.89292 112.825 0H109.512C109.512 2.89292 105.341 5.2381 100.196 5.2381C95.0514 5.23803 90.8805 2.89288 90.8805 0H87.568C87.568 2.89292 83.3972 5.2381 78.2522 5.2381C73.1074 5.23797 68.9364 2.89284 68.9364 0H65.625C65.625 2.89284 61.454 5.23797 56.3092 5.2381C51.1642 5.2381 46.9934 2.89292 46.9934 0H43.6809C43.6809 2.89288 39.51 5.23803 34.3651 5.2381C29.2201 5.2381 25.0493 2.89292 25.0493 0H21.7368C21.7368 2.89292 17.566 5.2381 12.4211 5.2381C7.27608 5.2381 3.10526 2.89292 3.10526 0H0V11H354Z"
              fill="#EEEEEE"
            />
          </svg>
        </div>
        {isConfirmed ? (
          <div
            className="flex min-h-[373px] items-center justify-center text-6xl"
            aria-label="Confirmed"
          >
            <AutoPlayLottie
              animationData={successAnimation}
              className="h-40 w-40"
              ariaLabel="Payment confirmed animation"
              onComplete={handleSuccessComplete}
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex relative items-center justify-center gap-4">
              <h2 id="payment-title" className="text-2xl font-extrabold">
                WHO PAID?
              </h2>

              <button
                type="button"
                className="absolute text-5xl text-gray-400 right-0 -top-4"
                onClick={onClose}
              >
                ×
              </button>
            </div>

            <p className="tracking-widest font-extrabold">
              --------------------------------------------
            </p>

            <fieldset className="grid grid-cols-2 gap-2 font-bold text-xl">
              <legend className="sr-only">Payer</legend>
              {(["Tisa", "Palm"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`border-black border-dashed border-[2.5px] px-4 py-3 ${payer === option ? "border-gray-200 text-app-gray bg-app-accent border-dashed border-[2.5px]" : ""}`}
                  onClick={() => setPayer(option)}
                >
                  {option.toUpperCase()}
                </button>
              ))}
            </fieldset>

            <label className="block">
              <span className="mb-2 block text-md font-semibold">NOTE</span>
              <input
                ref={noteRef}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                onFocus={() =>
                  noteRef.current?.scrollIntoView({ block: "center" })
                }
                className="w-full border-black border-b-2 px-3 py-3 outline-black bg-app-gray"
                inputMode="text"
                placeholder="Dinner, Starbucks, movie..."
              />
            </label>

            <button
              type="submit"
              className="w-full text-lg border px-4 py-3 font-semibold bg-app-screen text-app-gray"
            >
              Confirm
              <span className="text-sm font-mono"> ฿</span>
              {amount}
            </button>

            <p className="tracking-widest font-extrabold">
              --------------------------------------------
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
