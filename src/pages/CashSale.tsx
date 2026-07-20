import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";

import { SaleItem } from "../models/SaleItem";


export default function CashSale() {

  const [product, setProduct] = useState("");
  const [price, setPrice] = useState("");

  const [items, setItems] = useState<SaleItem[]>([]);


  const addItem = () => {

    if (!product || !price) return;

    setItems([
      ...items,
      {
        product,
        price: Number(price),
      },
    ]);

    setProduct("");
    setPrice("");
  };


  const total = items.reduce(
    (sum, item) => sum + item.price,
    0
  );


  return (
    <Box
      sx={{
        padding: 2,
        maxWidth: 420,
        margin: "0 auto",
      }}
    >

      <Typography variant="h4" sx={{ mb: 3 }}>
        🛒 Venta al contado
      </Typography>


      <TextField
        fullWidth
        label="Producto"
        value={product}
        onChange={(e) => setProduct(e.target.value)}
        sx={{ mb: 2 }}
      />


      <TextField
        fullWidth
        label="Precio ($)"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        sx={{ mb: 2 }}
      />


      <Button
        fullWidth
        variant="contained"
        onClick={addItem}
      >
        Agregar producto
      </Button>


      <Typography variant="h6" sx={{ mt: 4 }}>
        Detalle
      </Typography>


      {items.map((item, index) => (
        <Card key={index} sx={{ mt: 1 }}>
          <CardContent>
            {item.product}
            <br />
            ${item.price}
          </CardContent>
        </Card>
      ))}


      <Typography
        variant="h5"
        sx={{ mt: 3, fontWeight:700 }}
      >
        Total: ${total}
      </Typography>


    </Box>
  );
}