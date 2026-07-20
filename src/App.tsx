import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import CashSale from "./pages/CashSale";

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

      </Routes>
    </BrowserRouter>
  );
}

export default App;