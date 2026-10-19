import { createContext, useState, ReactNode } from "react";
import { SaleTicket } from "../models/SaleTicket";
import { SaleItem } from "../models/SaleItem";

export interface SaleContextType {
  ticket: SaleTicket | null;
  setTicket: (ticket: SaleTicket) => void;
  history: SaleTicket[];
  addToHistory: (ticket: SaleTicket) => void;
  nextTicketId: number;
}

export const SaleContext = createContext<SaleContextType | undefined>(undefined);

interface SaleProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = "libreta-ventas";

function normalizeSaleItem(raw: unknown): SaleItem | null {
  if (typeof raw !== "object" || raw === null) {
    return null;
  }

  const item = raw as Partial<SaleItem>;

  if (typeof item.product !== "string") {
    return null;
  }

  return {
    id: typeof item.id === "number" ? item.id : 0,
    product: item.product,
    price:
      typeof item.price === "number" && isFinite(item.price) ? item.price : 0,
    quantity:
      typeof item.quantity === "number" && item.quantity >= 1
        ? Math.floor(item.quantity)
        : 1,
  };
}

function parseHistory(raw: string | null): SaleTicket[] {
  if (!raw) {
    return [];
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }

  if (typeof parsed !== "object" || parsed === null) {
    return [];
  }

  const sales = (parsed as { sales?: unknown }).sales;

  if (!Array.isArray(sales)) {
    return [];
  }

  const tickets: SaleTicket[] = [];

  sales.forEach((sale) => {
    if (typeof sale !== "object" || sale === null) {
      return;
    }

    const source = sale as Partial<SaleTicket>;

    if (!Array.isArray(source.items)) {
      return;
    }

    const items = source.items
      .map(normalizeSaleItem)
      .filter((item): item is SaleItem => item !== null);

    const date = new Date(source.date as string | number | Date);

    if (isNaN(date.getTime())) {
      return;
    }

    tickets.push({
      id: typeof source.id === "number" ? source.id : 0,
      date,
      items,
      total:
        typeof source.total === "number" && isFinite(source.total)
          ? source.total
          : items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    });
  });

  return tickets;
}

function loadHistory(): SaleTicket[] {
  try {
    return parseHistory(localStorage.getItem(STORAGE_KEY));
  } catch {
    return [];
  }
}

function persistHistory(sales: SaleTicket[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, sales }));
  } catch {
    return;
  }
}

export function SaleProvider({ children }: SaleProviderProps) {
  const [ticket, setTicket] = useState<SaleTicket | null>(null);
  const [history, setHistory] = useState<SaleTicket[]>(loadHistory);

  const addToHistory = (newTicket: SaleTicket) => {
    const next = [newTicket, ...history];

    setHistory(next);
    persistHistory(next);
  };

  const nextTicketId =
    history.reduce((max, sale) => (sale.id > max ? sale.id : max), 0) + 1;

  return (
    <SaleContext.Provider
      value={{
        ticket,
        setTicket,
        history,
        addToHistory,
        nextTicketId,
      }}
    >
      {children}
    </SaleContext.Provider>
  );
}