"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

const STORAGE_KEY = "dondecomo:saved";
const listeners = new Set();
const SavedContext = createContext(null);

function subscribe(callback) {
  listeners.add(callback);
  const onStorage = (event) => {
    if (event.key === STORAGE_KEY) callback();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) || "[]";
  } catch {
    return "[]";
  }
}

function getServerSnapshot() {
  return "[]";
}

function notify() {
  listeners.forEach((listener) => listener());
}

export function SavedProvider({ children }) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const savedIds = useMemo(() => {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [raw]);

  const value = useMemo(
    () => ({
      savedIds,
      ready: true,
      isSaved: (id) => savedIds.includes(id),
      toggleSaved: (id) => {
        try {
          const raw = window.localStorage.getItem(STORAGE_KEY) || "[]";
          const parsed = JSON.parse(raw);
          const current = Array.isArray(parsed) ? parsed : [];
          const next = current.includes(id)
            ? current.filter((item) => item !== id)
            : [...current, id];
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          return;
        }
        notify();
      },
    }),
    [savedIds],
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
