import { createContext, useCallback, useEffect, useRef, useState, ReactNode } from "react";
import { SaleTicket } from "../models/SaleTicket";
import { SaleItem } from "../models/SaleItem";

export interface SaleContextType {
  ticket: SaleTicket | null;
  setTicket: (ticket: SaleTicket) => void;
  history: SaleTicket[];
  addToHistory: (ticket: SaleTicket) => void;
  nextTicketId: number;
  customerSale: CustomerSaleSnapshot;
  publishCustomerSale: (
    items: SaleItem[],
    total: number,
    status: CustomerSaleSnapshot["status"],
    ticket?: SaleTicket | null,
  ) => void;
  customerTicketOpen: boolean;
  customerTicketClosed: boolean;
  notifyCustomerTicketOpened: () => void;
  notifyCustomerTicketClosed: () => void;
  resetCustomerTicketFlow: () => void;
}

export interface CustomerSaleSnapshot {
  items: SaleItem[];
  total: number;
  status: "welcome" | "shopping" | "completed";
  updatedAt: number;
  ticket: SaleTicket | null;
}

export const SaleContext = createContext<SaleContextType | undefined>(undefined);

interface SaleProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = "libreta-ventas";
const CUSTOMER_SALE_KEY = "libreta-pantalla-cliente";
const CUSTOMER_CHANNEL = "libreta-pantalla-cliente";

function normalizeCustomerSale(raw: unknown): CustomerSaleSnapshot | null {
  if (typeof raw !== "object" || raw === null) return null;

  const source = raw as {
    items?: unknown;
    total?: unknown;
    ticket?: unknown;
    status?: unknown;
    updatedAt?: unknown;
  };
  if (!Array.isArray(source.items)) return null;

  const items = source.items
    .map(normalizeSaleItem)
    .filter((item): item is SaleItem => item !== null);

  let ticket: SaleTicket | null = null;
  if (typeof source.ticket === "object" && source.ticket !== null) {
    const candidate = source.ticket as Partial<SaleTicket>;
    const ticketItems = Array.isArray(candidate.items)
      ? candidate.items.map(normalizeSaleItem).filter((item): item is SaleItem => item !== null)
      : [];
    const date = new Date(candidate.date as string | number | Date);
    if (ticketItems.length > 0 && !isNaN(date.getTime())) {
      ticket = {
        id: typeof candidate.id === "number" ? candidate.id : 0,
        date,
        items: ticketItems,
        total:
          typeof candidate.total === "number" && isFinite(candidate.total)
            ? candidate.total
            : ticketItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      };
    }
  }

  return {
    items,
    total:
      typeof source.total === "number" && isFinite(source.total)
        ? source.total
        : items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    status:
      source.status === "completed"
        ? "completed"
        : items.length > 0
          ? "shopping"
          : "welcome",
    updatedAt:
      typeof source.updatedAt === "number" ? source.updatedAt : Date.now(),
    ticket,
  };
}

function loadCustomerSale(): CustomerSaleSnapshot {
  try {
    return normalizeCustomerSale(
      JSON.parse(localStorage.getItem(CUSTOMER_SALE_KEY) ?? "null"),
    ) ?? { items: [], total: 0, status: "welcome", updatedAt: Date.now(), ticket: null };
  } catch {
    return { items: [], total: 0, status: "welcome", updatedAt: Date.now(), ticket: null };
  }
}

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
  const [customerSale, setCustomerSale] = useState<CustomerSaleSnapshot>(loadCustomerSale);
  const [customerTicketOpen, setCustomerTicketOpen] = useState(false);
  const [customerTicketClosed, setCustomerTicketClosed] = useState(false);
  const channelRef = useRef<BroadcastChannel | null>(null);

  const receiveCustomerSale = useCallback((value: unknown) => {
    const next = normalizeCustomerSale(value);
    if (next) setCustomerSale(next);
  }, []);

  useEffect(() => {
    if (typeof BroadcastChannel !== "undefined") {
      channelRef.current = new BroadcastChannel(CUSTOMER_CHANNEL);
      channelRef.current.onmessage = (event: MessageEvent<unknown>) => {
        if (typeof event.data === "object" && event.data !== null && "type" in event.data) {
          const message = event.data as { type?: unknown };
          if (message.type === "ticket-opened") setCustomerTicketOpen(true);
          if (message.type === "ticket-closed") {
            setCustomerTicketOpen(false);
            setCustomerTicketClosed(true);
          }
          return;
        }
        receiveCustomerSale(event.data);
      };
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== CUSTOMER_SALE_KEY || !event.newValue) return;
      try {
        receiveCustomerSale(JSON.parse(event.newValue));
      } catch {
        return;
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      channelRef.current?.close();
      channelRef.current = null;
    };
  }, [receiveCustomerSale]);

  const publishCustomerSale = useCallback((
    items: SaleItem[],
    total: number,
    status: CustomerSaleSnapshot["status"],
    ticket: SaleTicket | null = null,
  ) => {
    const next = {
      items: items.map((item) => ({ ...item })),
      total,
      status,
      updatedAt: Date.now(),
      ticket,
    };
    setCustomerSale(next);
    try {
      localStorage.setItem(CUSTOMER_SALE_KEY, JSON.stringify(next));
    } catch {
      // The BroadcastChannel still synchronizes open windows when storage is unavailable.
    }
    channelRef.current?.postMessage(next);
  }, []);

  const notifyCustomerTicketOpened = useCallback(() => {
    setCustomerTicketOpen(true);
    channelRef.current?.postMessage({ type: "ticket-opened" });
  }, []);

  const notifyCustomerTicketClosed = useCallback(() => {
    setCustomerTicketOpen(false);
    setCustomerTicketClosed(true);
    channelRef.current?.postMessage({ type: "ticket-closed" });
  }, []);

  const resetCustomerTicketFlow = useCallback(() => {
    setCustomerTicketOpen(false);
    setCustomerTicketClosed(false);
  }, []);

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
        customerSale,
        publishCustomerSale,
        customerTicketOpen,
        customerTicketClosed,
        notifyCustomerTicketOpened,
        notifyCustomerTicketClosed,
        resetCustomerTicketFlow,
      }}
    >
      {children}
    </SaleContext.Provider>
  );
}
