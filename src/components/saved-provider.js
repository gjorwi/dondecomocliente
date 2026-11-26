"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useSWRConfig } from "swr";
import { apiFetch } from "@/lib/api";
import { useClientAuth } from "@/components/auth-provider";

const SavedContext = createContext(null);

export function SavedProvider({ children }) {
  const { user, ready: authReady } = useClientAuth();
  const { mutate } = useSWRConfig();
  const [override, setOverride] = useState(null);

  const serverFavorites = Array.isArray(user?.favorites)
    ? user.favorites
    : [];
  const savedIds =
    override && override.userId === user?.id
      ? override.ids
      : serverFavorites;
  const ready = authReady;

  const toggleSaved = useCallback(
    async (id) => {
      if (!user) return { requiresAuth: true };

      const previous = savedIds;
      const next = previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id];

      setOverride({ userId: user.id, ids: next });
      try {
        await apiFetch("/auth/me/favorites", {
          method: "PUT",
          body: JSON.stringify({ favorites: next }),
        });
        await mutate("/auth/me");
        return { ok: true };
      } catch (error) {
        setOverride({ userId: user.id, ids: previous });
        throw error;
      }
    },
    [mutate, savedIds, user],
  );

  const value = useMemo(
    () => ({
      savedIds,
      ready,
      isSaved: (id) => savedIds.includes(id),
      toggleSaved,
    }),
    [ready, savedIds, toggleSaved],
  );

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}

export function useSaved() {
  const context = useContext(SavedContext);
  if (!context) {
    throw new Error("useSaved debe usarse dentro de SavedProvider");
  }
  return context;
}
