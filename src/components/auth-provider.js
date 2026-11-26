"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import useSWR, { useSWRConfig } from "swr";
import {
  TOKEN_EVENT,
  apiFetch,
  getToken,
  setToken,
} from "@/lib/api";

const AuthContext = createContext(null);

function subscribe(callback) {
  window.addEventListener(TOKEN_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(TOKEN_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getServerToken() {
  return "";
}

export function ClientAuthProvider({ children }) {
  const token = useSyncExternalStore(subscribe, getToken, getServerToken);
  const { mutate } = useSWRConfig();
  const { data, error, isLoading } = useSWR(
    token ? "/auth/me" : null,
    apiFetch,
    { revalidateOnFocus: false },
  );

  const loginWithGoogle = useCallback(
    async (credential) => {
      const payload = await apiFetch("/auth/google", {
        method: "POST",
        body: JSON.stringify({ credential }),
      });
      setToken(payload.token);
      await mutate("/auth/me");
      return payload;
    },
    [mutate],
  );

  const logout = useCallback(() => {
    setToken("");
    mutate("/auth/me", null, { revalidate: false });
  }, [mutate]);

  const value = useMemo(
    () => ({
      token,
      user: data?.user || null,
      favorites: data?.user?.favorites || [],
      error,
      ready: !token || !isLoading,
      loginWithGoogle,
      logout,
    }),
    [data, error, isLoading, loginWithGoogle, logout, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useClientAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useClientAuth debe usarse dentro de ClientAuthProvider");
  }
  return context;
}
