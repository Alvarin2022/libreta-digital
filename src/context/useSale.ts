import { useContext } from "react";
import { SaleContext } from "./SaleContext";

export function useSale() {
  const context = useContext(SaleContext);

  if (!context) {
    throw new Error("useSale debe utilizarse dentro de SaleProvider");
  }

  return context;
}