import { useEffect, useState } from "react";
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
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useSale } from "../context/useSale";
import Ticket from "../components/Ticket";
import { catalog } from "../data/catalog";
import { products } from "../data/products";
import "./CustomerDisplay.css";

const formatAmount = (amount: number) =>
  new Intl.NumberFormat("es-UY", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

const clockFormatter = new Intl.DateTimeFormat("es-UY", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

const calendarFormatter = new Intl.DateTimeFormat("es-UY", {
  weekday: "long",
  day: "2-digit",
  month: "long",
});

const formatClockDate = (date: Date) => {
  const parts = calendarFormatter.formatToParts(date);
  const weekday = parts.find((part) => part.type === "weekday")?.value ?? "";
  const day = parts.find((part) => part.type === "day")?.value ?? "";
  const month = parts.find((part) => part.type === "month")?.value ?? "";

  return `${weekday} · ${day} ${month}`.toLocaleUpperCase("es-UY");
};

const normalizeName = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "")
    .replace(/(ml|cc|kg|g|l)$/, "");

const promotionalItems = catalog
  .flatMap((spread) => [spread.left, spread.right])
  .map((item) => {
    const product = products.find(
      (candidate) => normalizeName(candidate.name) === normalizeName(item.title),
    );

    return {
      ...item,
      price: product?.price,
      category: item.image.includes("/bebidas/") ? "Bebidas" : "Lácteos",
    };
  });

export default function CustomerDisplay() {
  const {
    customerSale,
    publishCustomerSale,
    notifyCustomerTicketOpened,
    notifyCustomerTicketClosed,
  } = useSale();
  const [promoIndex, setPromoIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const isCompleted = customerSale.status === "completed";
  const hasItems = customerSale.status === "shopping" && customerSale.items.length > 0;
  const showWelcome = !isCompleted && !hasItems;
  const activePromo = promotionalItems[promoIndex];

  useEffect(() => {
    if (isCompleted && customerSale.ticket) notifyCustomerTicketOpened();
  }, [isCompleted, customerSale.ticket, notifyCustomerTicketOpened]);

  useEffect(() => {
    const interval = window.setInterval(() => setCurrentTime(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!showWelcome || promotionalItems.length < 2) return;

    const interval = window.setInterval(() => {
      setPromoIndex((index) => (index + 1) % promotionalItems.length);
    }, 5500);

    return () => window.clearInterval(interval);
  }, [showWelcome]);

  const changePromo = (direction: number) => {
    setPromoIndex((index) =>
      (index + direction + promotionalItems.length) % promotionalItems.length,
    );
  };

  const closeTicket = () => {
    publishCustomerSale([], 0, "welcome");
    notifyCustomerTicketClosed();
  };

  return (
    <Box component="main" className="customer-display-page">
      <Box className="customer-display-frame">
        <Box className="customer-display-header">
          <Box className="customer-brand-mark" aria-hidden="true">
            <ShoppingBasketRoundedIcon />
          </Box>
          <Box>
            <Typography className="customer-brand-name">Almacén Lo de Inés</Typography>
            <Typography component="h1" className="customer-page-title">
              Su compra
            </Typography>
          </Box>
          <Box className="customer-clock" aria-label="Hora y fecha local">
            <Typography
              component="time"
              dateTime={currentTime.toISOString()}
              className="customer-clock-time"
              aria-live="off"
            >
              {clockFormatter.format(currentTime)}
            </Typography>
            <Typography className="customer-clock-date">
              {formatClockDate(currentTime)}
            </Typography>
          </Box>
        </Box>

        <Card className="customer-display-card" elevation={0}>
          <CardContent
            className={`customer-display-content${showWelcome ? " is-welcome" : ""}`}
          >
            {isCompleted ? (
              <Box
                className={`customer-completed-layout${customerSale.ticket ? " has-ticket" : ""}`}
              >
                <Box aria-live="assertive" className="customer-thank-you">
                  <Box className="customer-thank-you-icon">
                    <CheckCircleRoundedIcon />
                  </Box>
                  <Typography component="h2" className="customer-thank-you-title">
                    ¡Gracias por tu compra!
                  </Typography>
                  <Typography className="customer-thank-you-message">
                    ¡Te esperamos pronto!
                  </Typography>
                </Box>
                {customerSale.ticket && (
                  <Box
                    component="section"
                    aria-label="Ticket de compra"
                    className="customer-completed-ticket"
                  >
                    <Box className="customer-ticket-header">
                      <Box>
                        <Typography className="customer-section-eyebrow">Comprobante</Typography>
                        <Typography component="h2" className="customer-section-title">
                          Ticket de compra
                        </Typography>
                      </Box>
                      <IconButton
                        aria-label="Cerrar ticket"
                        onClick={closeTicket}
                        className="customer-close-ticket"
                      >
                        <CloseRoundedIcon />
                      </IconButton>
                    </Box>
                    <Box className="customer-ticket-scroll">
                      <Ticket ticket={customerSale.ticket} showActions={false} />
                    </Box>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<ShoppingBasketRoundedIcon />}
                      onClick={closeTicket}
                      className="customer-next-sale-button"
                    >
                      Nueva venta
                    </Button>
                  </Box>
                )}
              </Box>
            ) : hasItems ? (
              <Box
                aria-live="polite"
                aria-relevant="additions removals"
                className="customer-purchase-view"
              >
                <Box className="customer-purchase-heading">
                  <Box className="customer-purchase-heading-icon">
                    <ShoppingBasketRoundedIcon />
                  </Box>
                  <Box>
                    <Typography className="customer-section-eyebrow">En tu compra</Typography>
                    <Typography component="h2" className="customer-section-title">
                      Detalle de la compra
                    </Typography>
                  </Box>
                  <Box className="customer-item-count">
                    {customerSale.items.length} {customerSale.items.length === 1 ? "producto" : "productos"}
                  </Box>
                </Box>

                <Box className="customer-items-columns">
                  <Box>Producto</Box>
                  <Box className="customer-column-quantity">Cantidad</Box>
                  <Box className="customer-column-unit-price">Precio unitario</Box>
                  <Box className="customer-column-subtotal">Subtotal</Box>
                </Box>

                <Box className="customer-items-list">
                  {customerSale.items.map((item) => (
                    <Box key={item.id} className="customer-item-row">
                      <Typography className="customer-item-name">{item.product}</Typography>
                      <Typography className="customer-item-quantity">{item.quantity}</Typography>
                      <Typography className="customer-item-unit-price">
                        $ {formatAmount(item.price)}
                      </Typography>
                      <Typography className="customer-item-subtotal">
                        <span>Subtotal</span>$ {formatAmount(item.price * item.quantity)}
                      </Typography>
                      <Typography className="customer-item-mobile-detail">
                        Cantidad: {item.quantity} · Precio unitario: $ {formatAmount(item.price)}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Box className="customer-total-wrap">
                  <Divider className="customer-total-divider" />
                  <Box className="customer-total-panel">
                    <Box>
                      <Typography className="customer-total-caption">Total a pagar</Typography>
                      <Typography className="customer-total-note">Pesos uruguayos</Typography>
                    </Box>
                    <Typography
                      aria-label={`Total ${formatAmount(customerSale.total)} pesos`}
                      className="customer-total-amount"
                    >
                      $ {formatAmount(customerSale.total)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box component="section" aria-label="Productos destacados" className="customer-idle-view">
                <Box
                  component="img"
                  src="/catalogo/pantalla-inicio.png"
                  alt="Libreta Digital con el acceso visual a Ventas al Contado"
                  className="customer-idle-image"
                />
                {activePromo && (
                  <Box className="customer-promo-card" aria-label="Producto destacado">
                    <Box className="customer-promo-image-wrap">
                      <Box
                        component="img"
                        key={activePromo.image}
                        src={activePromo.image}
                        alt={activePromo.title}
                        className="customer-promo-image"
                      />
                    </Box>
                    <Box className="customer-promo-details" key={activePromo.title}>
                      <Typography className="customer-promo-label">Destacado · {activePromo.category}</Typography>
                      <Typography className="customer-promo-name">{activePromo.title}</Typography>
                      <Typography className="customer-promo-price">
                        {activePromo.price !== undefined
                          ? `$ ${formatAmount(activePromo.price)}`
                          : "Consultar en caja"}
                      </Typography>
                    </Box>
                    <Box className="customer-promo-controls">
                      <IconButton
                        aria-label="Producto anterior"
                        onClick={() => changePromo(-1)}
                        className="customer-promo-arrow"
                      >
                        <ChevronLeftRoundedIcon />
                      </IconButton>
                      <Typography className="customer-promo-position">
                        {String(promoIndex + 1).padStart(2, "0")} / {promotionalItems.length}
                      </Typography>
                      <IconButton
                        aria-label="Producto siguiente"
                        onClick={() => changePromo(1)}
                        className="customer-promo-arrow"
                      >
                        <ChevronRightRoundedIcon />
                      </IconButton>
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
