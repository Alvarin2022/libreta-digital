import { createContext, useState, ReactNode } from "react";
import { SaleTicket } from "../models/SaleTicket";

export interface SaleContextType {
  ticket: SaleTicket | null;
  setTicket: (ticket: SaleTicket) => void;
}

export const SaleContext = createContext<SaleContextType | undefined>(undefined);

interface SaleProviderProps {
  children: ReactNode;
}

export function SaleProvider({ children }: SaleProviderProps) {
  const [ticket, setTicket] = useState<SaleTicket | null>(null);

  return (
    <SaleContext.Provider
      value={{
        ticket,
        setTicket,
      }}
    >
      {children}
    </SaleContext.Provider>
  );
}