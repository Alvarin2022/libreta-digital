import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";

import Home from "./pages/Home";
import CashSale from "./pages/CashSale";

import BookCatalog from "./components/BookCatalog/BookCatalog";
import useInactivity from "./hooks/useInactivity";

function App() {
  const inactive = useInactivity(120000);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/venta" element={<CashSale />} />
        </Routes>
      </BrowserRouter>

      {inactive && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "#ffffff",
          }}
        >
          <BookCatalog />
        </Box>
      )}
    </>
  );
}

export default App;