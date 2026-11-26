"use client";

import { createContext, useContext, useMemo } from "react";

const GoogleConfigContext = createContext({ clientId: "" });

export function GoogleConfigProvider({ clientId = "", children }) {
  const value = useMemo(() => ({ clientId }), [clientId]);
  return (
    <GoogleConfigContext.Provider value={value}>
      {children}
    </GoogleConfigContext.Provider>
  );
}

export function useGoogleConfig() {
  return useContext(GoogleConfigContext);
}
