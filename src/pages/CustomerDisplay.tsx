import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import ShoppingBasketRoundedIcon from "@mui/icons-material/ShoppingBasketRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useSale } from "../context/useSale";
import Ticket from "../components/Ticket";

const formatAmount = (amount: number) =>
  new Intl.NumberFormat("es-UY", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

export default function CustomerDisplay() {
  const {
    customerSale,
    publishCustomerSale,
    notifyCustomerTicketOpened,
    notifyCustomerTicketClosed,
  } = useSale();
  const [ticketOpen, setTicketOpen] = useState(false);
  const isCompleted = customerSale.status === "completed";
  const hasItems = customerSale.status === "shopping" && customerSale.items.length > 0;
  const showWelcome = !isCompleted && !hasItems;

  const openTicket = () => {
    setTicketOpen(true);
    notifyCustomerTicketOpened();
  };

  const closeTicket = () => {
    setTicketOpen(false);
    publishCustomerSale([], 0, "welcome");
    notifyCustomerTicketClosed();
  };

  return (
    <>
      <Box
        component="main"
        sx={{
          height: "100dvh",
          minHeight: 0,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          px: { xs: 1.5, sm: 3, md: 5 },
          py: { xs: 1.5, sm: 2.5 },
          background:
            "radial-gradient(ellipse at 50% 0%, #fff 0%, transparent 55%), linear-gradient(145deg, #e8f4fb 0%, #dcecf7 55%, #d1e4f1 100%)",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 1100, mx: "auto", flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: { xs: 1.25, sm: 2 }, flexShrink: 0 }}>
            <Box sx={{ width: 46, height: 46, display: "grid", placeItems: "center", flexShrink: 0, borderRadius: 3, color: "#fff", background: "linear-gradient(145deg, #2785c8, #1265aa)", boxShadow: "0 8px 20px rgba(18, 101, 170, 0.2)" }}>
              <ShoppingBasketRoundedIcon />
            </Box>
            <Box>
              <Typography sx={{ color: "#527992", fontSize: 12, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase" }}>
                Lo de Inés
              </Typography>
              <Typography component="h1" sx={{ color: "#164b7b", fontSize: { xs: 23, sm: 28 }, fontWeight: 700, lineHeight: 1.2 }}>
                Su compra
              </Typography>
            </Box>
          </Box>

          <Card elevation={0} sx={{ overflow: "hidden", flex: 1, minHeight: 0, display: "flex", flexDirection: "column", border: "1px solid rgba(255,255,255,0.9)", borderRadius: { xs: 3, sm: 4 }, backgroundColor: "rgba(255,255,255,0.95)", boxShadow: "0 24px 64px rgba(29, 82, 120, 0.12)" }}>
            <CardContent sx={{ p: showWelcome ? 0 : { xs: 1.5, sm: 2.5, md: 3 }, flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden", "&:last-child": { pb: showWelcome ? 0 : { xs: 1.5, sm: 2.5, md: 3 } } }}>
              {ticketOpen && customerSale.ticket ? (
                <Box component="section" aria-label="Ticket de compra" sx={{ flex: 1, minHeight: 0, overflowY: "auto", overscrollBehavior: "contain" }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                    <Typography component="h2" sx={{ color: "#164b7b", fontSize: { xs: 18, sm: 22 }, fontWeight: 700 }}>
                      Ticket de compra
                    </Typography>
                    <IconButton aria-label="Cerrar ticket" onClick={closeTicket} sx={{ color: "#164b7b" }}>
                      <CloseRoundedIcon />
                    </IconButton>
                  </Box>
                  <Ticket ticket={customerSale.ticket} showActions={false} />
                </Box>
              ) : isCompleted ? (
                <Box aria-live="assertive" sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", px: 1, textAlign: "center" }}>
                  <CheckCircleRoundedIcon sx={{ mb: 2, color: "#2785c8", fontSize: { xs: 64, sm: 80 } }} />
                  <Typography component="h2" sx={{ color: "#164b7b", fontSize: { xs: 24, sm: 34 }, fontWeight: 750 }}>
                    ¡Gracias por tu compra!
                  </Typography>
                  <Typography sx={{ mt: 1, color: "#607f94", fontSize: { xs: 16, sm: 20 } }}>
                    ¡Te esperamos pronto!
                  </Typography>
                  <Button variant="contained" onClick={openTicket} disabled={!customerSale.ticket} sx={{ mt: 3, px: 4, py: 1.25, borderRadius: 3, background: "linear-gradient(110deg, #2785c8 0%, #1265aa 100%)", fontWeight: 700 }}>
                    Ver ticket
                  </Button>
                </Box>
              ) : hasItems ? (
                <Box aria-live="polite" aria-relevant="additions removals" sx={{ minHeight: 0, flex: 1, display: "flex", flexDirection: "column" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, flexShrink: 0 }}>
                    <ShoppingBasketRoundedIcon sx={{ color: "#267fb5" }} />
                    <Typography component="h2" sx={{ color: "#244f6b", fontSize: { xs: 17, sm: 20 }, fontWeight: 700 }}>Detalle de la compra</Typography>
                  </Box>
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr) auto", sm: "minmax(0, 1fr) 90px 150px 150px" }, gap: { xs: 0.5, sm: 1.25 }, px: { xs: 1, sm: 2 }, py: 0.75, color: "#527992", fontSize: { xs: 10, sm: 12 }, fontWeight: 700, textTransform: "uppercase", flexShrink: 0 }}>
                    <Box>Producto</Box>
                    <Box sx={{ display: { xs: "none", sm: "block" }, textAlign: "center" }}>Cantidad</Box>
                    <Box sx={{ display: { xs: "none", sm: "block" }, textAlign: "right" }}>Precio unitario</Box>
                    <Box sx={{ textAlign: "right" }}>Subtotal</Box>
                  </Box>
                  <Box sx={{ display: "grid", alignContent: "start", gap: { xs: 0.75, sm: 1 }, flex: 1, minHeight: 0, overflowY: "auto", overscrollBehavior: "contain", pr: 0.5 }}>
                    {customerSale.items.map((item) => (
                      <Box key={item.id} sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr) auto", sm: "minmax(0, 1fr) 90px 150px 150px" }, alignItems: "center", columnGap: { xs: 1, sm: 1.5 }, rowGap: 0.25, p: { xs: 1.25, sm: 1.5 }, border: "1px solid #e1edf5", borderRadius: 2.5, backgroundColor: "#f7fbfe" }}>
                        <Typography sx={{ minWidth: 0, color: "#163a52", fontSize: { xs: 14, sm: 17 }, fontWeight: 650, overflowWrap: "anywhere" }}>{item.product}</Typography>
                        <Typography sx={{ display: { xs: "none", sm: "block" }, color: "#5f7686", fontSize: 14, textAlign: "center" }}>{item.quantity}</Typography>
                        <Typography sx={{ display: { xs: "none", sm: "block" }, color: "#5f7686", fontSize: 14, textAlign: "right", whiteSpace: "nowrap" }}>$ {formatAmount(item.price)}</Typography>
                        <Typography sx={{ gridColumn: { xs: "2", sm: "auto" }, gridRow: { xs: "1 / span 2", sm: "auto" }, color: "#126aa5", fontSize: { xs: 14, sm: 17 }, fontWeight: 700, textAlign: "right", whiteSpace: "nowrap" }}>
                          <Box component="span" sx={{ display: { xs: "block", sm: "none" }, color: "#71899a", fontSize: 10, fontWeight: 600 }}>Subtotal</Box>
                          $ {formatAmount(item.price * item.quantity)}
                        </Typography>
                        <Typography sx={{ display: { xs: "block", sm: "none" }, gridColumn: "1", gridRow: "2", color: "#5f7686", fontSize: 11 }}>Cantidad: {item.quantity} · Precio unitario: $ {formatAmount(item.price)}</Typography>
                      </Box>
                    ))}
                  </Box>
                  <Divider sx={{ my: { xs: 1, sm: 1.5 }, flexShrink: 0 }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, p: { xs: 1.5, sm: 2 }, flexShrink: 0, borderRadius: 2.5, color: "#fff", background: "linear-gradient(110deg, #2785c8 0%, #1265aa 100%)", boxShadow: "0 10px 24px rgba(18, 101, 170, 0.18)" }}>
                    <Typography sx={{ fontSize: { xs: 16, sm: 20 }, fontWeight: 700 }}>Total</Typography>
                    <Typography aria-label={`Total ${formatAmount(customerSale.total)} pesos`} sx={{ fontSize: { xs: 23, sm: 30 }, fontWeight: 800, whiteSpace: "nowrap" }}>$ {formatAmount(customerSale.total)}</Typography>
                  </Box>
                </Box>
              ) : (
                <Box role="img" aria-label="Pantalla inicial de Libreta Digital" sx={{ flex: 1, minHeight: 0, minWidth: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", backgroundColor: "#e8f4fb" }}>
                  <Box component="img" src="/catalogo/pantalla-inicio.png" alt="Libreta Digital con el acceso visual a Ventas al Contado" sx={{ display: "block", width: "100%", height: "100%", minWidth: 0, minHeight: 0, objectFit: "contain", objectPosition: "center" }} />
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </>
  );
}
