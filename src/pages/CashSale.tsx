import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { SaleItem } from "../models/SaleItem";
import { useSale } from "../context/useSale";
import { SaleTicket } from "../models/SaleTicket";
import TicketDrawer from "../components/TicketDrawer";
import { products } from "../data/products";

export default function CashSale() {
  const [product, setProduct] = useState("");
  const [price, setPrice] = useState("");

  const [items, setItems] = useState<SaleItem[]>([]);

  const [completed, setCompleted] = useState(false);
  const [showTicket, setShowTicket] = useState(false);

  const [productError, setProductError] = useState("");
  const [priceError, setPriceError] = useState("");

  const productRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { ticket, setTicket } = useSale();

  const addItem = () => {
    setProductError("");
    setPriceError("");

    const productName = product.trim();
    const productPrice = Number(price);

    if (productName === "") {
      setProductError("Debe ingresar un producto.");
      productRef.current?.focus();
      return;
    }

    if (price.trim() === "") {
      setPriceError("Debe ingresar un precio.");
      return;
    }

    if (isNaN(productPrice) || productPrice <= 0) {
      setPriceError("El precio debe ser mayor a $0.");
      return;
    }

    setItems((prevItems) => [
      ...prevItems,
      {
        id: Date.now(),
        product: productName,
        price: productPrice,
        quantity: 1,
      },
    ]);

    setProduct("");
    setPrice("");

    setTimeout(() => {
      productRef.current?.focus();
    }, 0);
  };

  const removeItem = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) {
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const finishSale = () => {
    if (items.length === 0) {
      return;
    }

    const ticket: SaleTicket = {
      id: Date.now(),
      date: new Date(),
      items: items,
      total: total,
    };

    setTicket(ticket);

    setCompleted(true);
  };

  const newSale = () => {
    setItems([]);

    setCompleted(false);

    setProduct("");
    setPrice("");

    setTimeout(() => {
      productRef.current?.focus();
    }, 0);
  };

  const canAddProduct =
    product.trim() !== "" && price.trim() !== "" && Number(price) > 0;

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (completed) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",

          display: "flex",
          justifyContent: "center",
          alignItems: "center",

          padding: 4,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 900,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              mb: 3,
            }}
          >
            ✅
          </Typography>

          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              mb: 3,
            }}
          >
            Venta realizada
          </Typography>

          <Typography
            variant="h5"
            sx={{
              mb: 3,
            }}
          >
            Total: ${total}
          </Typography>

          <Typography
            variant="h6"
            sx={{
              mb: 1,
            }}
          >
            Muchas gracias por su preferencia.
          </Typography>

          <Typography variant="h6">¡Los esperamos nuevamente!</Typography>

          <Typography
            variant="h6"
            sx={{
              mt: 2,
              fontWeight: "bold",
            }}
          >
            🏪 Almacén Lo de Inés
          </Typography>

          {ticket && (
            <TicketDrawer
              open={showTicket}
              ticket={ticket}
              onClose={() => setShowTicket(false)}
            />
          )}

          <Button
            variant="contained"
            size="large"
            sx={{
              mt: 2,
              backgroundColor: "#2e7d32",
              color: "#fff",
              fontWeight: "bold",

              animation: "pulseTicket 1.8s infinite",

              "@keyframes pulseTicket": {
                "0%": {
                  backgroundColor: "#2e7d32",
                },
                "50%": {
                  backgroundColor: "#66bb6a",
                },
                "100%": {
                  backgroundColor: "#2e7d32",
                },
              },

              "&:hover": {
                backgroundColor: "#1b5e20",
              },
            }}
            onClick={() => setShowTicket(true)}
          >
            🧾 Ver ticket
          </Button>

          <Button
            variant="contained"
            size="large"
            sx={{
              mt: 2,
            }}
            onClick={newSale}
          >
            🛒 Nueva venta
          </Button>

          <Button
            variant="outlined"
            size="large"
            sx={{
              mt: 2,
            }}
            onClick={() => navigate("/")}
          >
            🏠 Volver al inicio
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: 3,
      }}
    >
      <Button
        variant="text"
        onClick={() => navigate("/")}
        sx={{
          mb: 2,
        }}
      >
        ← Volver al inicio
      </Button>

      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: "bold",
          mb: 4,
        }}
      >
        🛒 Venta al contado
      </Typography>

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",
            lg: "320px 1fr",
          },

          gap: 4,

          alignItems: "start",

          width: "100%",
        }}
      >
        <Card
          sx={{
            minHeight: "70vh",
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                mb: 2,
              }}
            >
              Nuevo producto
            </Typography>

            <Autocomplete
              freeSolo
              sx={{
                mb: 2,
              }}
              options={products.filter((p) => p.active)}
              getOptionLabel={(option) =>
                typeof option === "string" ? option : option.name
              }
              value={products.find((p) => p.name === product) ?? product}
              onInputChange={(_, value) => {
                setProduct(value);

                if (productError) {
                  setProductError("");
                }
              }}
              onChange={(_, selected) => {
                if (!selected) {
                  return;
                }

                if (typeof selected === "string") {
                  setProduct(selected);

                  setTimeout(() => {
                    priceRef.current?.focus();
                  }, 0);

                  return;
                }

                setProduct(selected.name);
                setPrice(selected.price.toString());

                setTimeout(() => {
                  priceRef.current?.focus();
                }, 0);

                if (productError) {
                  setProductError("");
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  inputRef={productRef}
                  label="Producto"
                  error={productError !== ""}
                  helperText={productError}
                  onKeyDown={(e) => {
                    if (e.key === "Tab") {
                      const value = (e.target as HTMLInputElement).value;

                      setProduct(value);

                      setTimeout(() => {
                        priceRef.current?.focus();
                      }, 0);
                    }
                  }}
                />
              )}
            />

            <TextField
              inputRef={priceRef}
              fullWidth
              label="Precio ($)"
              type="number"
              value={price}
              error={priceError !== ""}
              helperText={priceError}
              onChange={(e) => {
                setPrice(e.target.value);

                if (priceError) {
                  setPriceError("");
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addItem();
                }
              }}
              sx={{
                mb: 2,
              }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              disabled={!canAddProduct}
              onClick={addItem}
            >
              Agregar producto
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                mb: 2,
              }}
            >
              Detalle de compra
            </Typography>

            {items.length === 0 ? (
              <Typography color="text.secondary">
                Todavía no agregaste productos.
              </Typography>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    lg: "repeat(3, 1fr)",
                  },
                  gap: 2,
                }}
              >
                {items.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      backgroundColor: "#eeeeee",
                      borderRadius: 2,
                      padding: 1.5,
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      boxShadow: "0 2px 5px rgba(0,0,0,0.12)",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        {item.product}
                      </Typography>

                      <IconButton
                        size="small"
                        sx={{
                          padding: 0.5,
                          color: "#d32f2f",
                          "&:hover": {
                            backgroundColor: "rgba(211,47,47,0.08)",
                          },
                        }}
                        onClick={() => removeItem(item.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>

                        <Typography
                          sx={{
                            fontWeight: 700,
                            minWidth: 24,
                            textAlign: "center",
                          }}
                        >
                          {item.quantity}
                        </Typography>

                        <IconButton
                          size="small"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>

                        <Typography
                          sx={{
                            color: "#757575",
                            fontSize: "0.85rem",
                          }}
                        >
                          × ${item.price}
                        </Typography>
                      </Box>

                      <Typography
                        sx={{
                          fontSize: "1.2rem",
                          fontWeight: 700,
                          color: "#2e7d32",
                        }}
                      >
                        ${item.price * item.quantity}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}

            <Divider
              sx={{
                my: 2,
              }}
            />

            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                textAlign: "right",
              }}
            >
              Total: ${total}
            </Typography>

            <Button
              fullWidth
              variant="contained"
              color="success"
              size="large"
              disabled={items.length === 0}
              sx={{
                mt: 3,
              }}
              onClick={finishSale}
            >
              Finalizar venta
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
