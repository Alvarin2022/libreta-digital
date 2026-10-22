import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Box } from "@mui/material";

import Home from "./pages/Home";
import CashSale from "./pages/CashSale";
import CustomerDisplay from "./pages/CustomerDisplay";

import BookCatalog from "./components/BookCatalog/BookCatalog";
import useInactivity from "./hooks/useInactivity";
import { useSale } from "./context/useSale";

function AppContent() {
  const { inactive, returnToApp } = useInactivity(120000);
  const { pathname } = useLocation();
  const { customerSale } = useSale();

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/venta" element={<CashSale />} />
        <Route path="/cliente" element={<CustomerDisplay />} />
      </Routes>

      {inactive && pathname === "/cliente" && customerSale.status === "welcome" && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "#f2f8fc",
          }}
        >
          <BookCatalog onExit={returnToApp} />
        </Box>
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
