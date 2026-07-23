import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import CashSale from "./pages/CashSale";
import SaleTicket from "./pages/SaleTicket";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route 
          path="/" 
          element={<Home />} 
        />

        <Route 
          path="/venta" 
          element={<CashSale />} 
        />
        <Route
          path="/ticket"
          element={<SaleTicket />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;