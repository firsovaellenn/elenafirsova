"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface ManagementContextValue {
  isManagement: boolean;
  openPinDialog: () => void;
  closePinDialog: () => void;
  pinDialogOpen: boolean;
  onPinSuccess: () => void;
  lock: () => void;
}

const ManagementContext = createContext<ManagementContextValue | null>(null);

export function ManagementProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isManagement, setIsManagement] = useState(false);
  const [pinDialogOpen, setPinDialogOpen] = useState(false);

  const openPinDialog = useCallback(() => setPinDialogOpen(true), []);
  const closePinDialog = useCallback(() => setPinDialogOpen(false), []);
  const onPinSuccess = useCallback(() => {
    setIsManagement(true);
    setPinDialogOpen(false);
  }, []);
  const lock = useCallback(() => setIsManagement(false), []);

  return (
    <ManagementContext.Provider
      value={{
        isManagement,
        openPinDialog,
        closePinDialog,
        pinDialogOpen,
        onPinSuccess,
        lock,
      }}
    >
      {children}
    </ManagementContext.Provider>
  );
}

export function useManagement(): ManagementContextValue {
  const ctx = useContext(ManagementContext);
  if (!ctx) {
    throw new Error("useManagement must be used within a ManagementProvider");
  }
  return ctx;
}
