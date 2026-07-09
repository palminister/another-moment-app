"use client";

import { FormEvent, useState } from "react";

type AuthSheetProps = {
  email: string | null;
  error: string | null;
  isOpen: boolean;
  message: string | null;
  onClose: () => void;
  onSendMagicLink: (email: string) => Promise<void>;
  onSignOut: () => Promise<void>;
};

export function AuthSheet({
  email,
  error,
  isOpen,
  message,
  onClose,
  onSendMagicLink,
  onSignOut,
}: AuthSheetProps) {
  const [inputEmail, setInputEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    await onSendMagicLink(inputEmail);
    setIsSubmitting(false);
  }

  return (
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-40 bg-black/20 transition-opacity ${
        isOpen ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        className={`absolute inset-x-0 bottom-0 m-auto max-w-[354px] bg-white p-5 transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 id="auth-title" className="text-xl font-semibold">
            Sign in to update
          </h2>
          <button type="button" className="text-3xl" onClick={onClose}>
            ×
          </button>
        </div>

        {email ? (
          <div className="space-y-4">
            <p className="text-sm">Signed in as {email}</p>
            <button
              type="button"
              className="w-full border px-4 py-3"
              onClick={onSignOut}
            >
              Sign out
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Email</span>
              <input
                value={inputEmail}
                onChange={(event) => setInputEmail(event.target.value)}
                className="w-full border px-3 py-3"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
              />
            </label>
            <button
              type="submit"
              className="w-full border px-4 py-3"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send magic link"}
            </button>
          </form>
        )}

        {message ? <p className="mt-4 text-sm">{message}</p> : null}
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      </div>
    </div>
  );
}
