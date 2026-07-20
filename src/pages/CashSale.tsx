import { useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { SaleItem } from "../models/SaleItem";

export default function CashSale() {
  const [product, setProduct] = useState("");
  const [price, setPrice] = useState("");

  const [items, setItems] = useState<SaleItem[]>([]);

  const productRef = useRef<HTMLInputElement>(null);

  const addItem = () => {
    const productName = product.trim();
    const productPrice = Number(price);

    if (productName === "") {
      productRef.current?.focus();
      return;
    }

    if (isNaN(productPrice) || productPrice <= 0) {
      return;
    }

    setItems((prevItems) => [
      ...prevItems,
      {
        id: Date.now(),
        product: productName,
        price: productPrice,
      },
    ]);

    setProduct("");
    setPrice("");

    setTimeout(() => {
      productRef.current?.focus();
    }, 0);
  };

  const removeItem = (id: number) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.id !== id)
    );
  };

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <Box
      sx={{
        maxWidth: 450,
        margin: "0 auto",
        padding: 3,
      }}
    >
      <Typography
  variant="h4"
  gutterBottom
  sx={{
    fontWeight: "bold",
  }}
>
  🛒 Venta al contado
</Typography>

      <TextField
        inputRef={productRef}
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
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            addItem();
          }
        }}
        sx={{ mb: 2 }}
      />

      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={addItem}
      >
        Agregar
      </Button>

      <Typography
        variant="h6"
        sx={{ mt: 4, mb: 2 }}
      >
        Detalle
      </Typography>

      {items.length === 0 ? (
        <Typography color="text.secondary">
          Todavía no agregaste productos.
        </Typography>
      ) : (
        items.map((item) => (
          <Card
            key={item.id}
            sx={{ mt: 1 }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {item.product}
                  </Typography>

                  <Typography color="text.secondary">
                    ${item.price}
                  </Typography>
                </Box>

                <IconButton
                  color="error"
                  onClick={() => removeItem(item.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))
      )}

      <Typography
        variant="h5"
        sx={{
          mt: 3,
          fontWeight: "bold",
        }}
      >
        Total: ${total}
      </Typography>
    </Box>
  );
}