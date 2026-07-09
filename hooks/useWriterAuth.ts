"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

export function useWriterAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    let isMounted = true;

    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!isMounted) {
        return;
      }

      if (sessionError) {
        setError(sessionError.message);
      }

      setSession(data.session);
      setIsLoaded(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setIsLoaded(true);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const email = useMemo(() => session?.user.email ?? null, [session]);

  const sendMagicLink = useCallback(async (rawEmail: string) => {
    const email = rawEmail.trim().toLowerCase();

    if (!email) {
      setError("Enter an email address.");
      return;
    }

    const supabase = getSupabaseBrowserClient();
    setError(null);
    setMessage(null);

    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (signInError) {
      setError(signInError.message);
      return;
    }

    setMessage("Check your email for a sign-in link.");
  }, []);

  const signOut = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    setSession(null);
    setMessage(null);
  }, []);

  return {
    email,
    error,
    isLoaded,
    isSignedIn: Boolean(session),
    message,
    sendMagicLink,
    signOut,
  };
}
