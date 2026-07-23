import { SaleItem } from "./SaleItem";

export interface SaleTicket {
  id: number;
  date: Date;
  items: SaleItem[];
  total: number;
}