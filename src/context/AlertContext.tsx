"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

interface AlertContextType {
  showAlert: (message: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const showAlert = (message: string) => {
    toast(message);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <Toaster />
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
}
