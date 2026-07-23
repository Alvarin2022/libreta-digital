import { Box, Typography } from "@mui/material";
import { SaleTicket } from "../models/SaleTicket";

interface TicketProps {
  ticket: SaleTicket;
}

export default function Ticket({ ticket }: TicketProps) {
  return (
    <Box
      sx={{
        maxWidth: 360,

        margin: "0 auto",

        padding: 4,

        backgroundColor: "#fffef7",

        border: "1px solid #d7d7d7",

        borderRadius: 3,

        boxShadow: "0 10px 25px rgba(0,0,0,.18)",
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          mb: 2,
        }}
      >
        <Typography variant="h3">🏪</Typography>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "#37474f",
          }}
        >
          Almacén Lo de Inés
        </Typography>
        <Typography
          sx={{
            color: "#9e9e9e",
            fontSize: "0.8rem",
            mt: 0.5,
          }}
        >
          Fraile Muerto - Cerro Largo - Uruguay
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "#757575",
            letterSpacing: 1,
          }}
        >
          TICKET DE VENTA
        </Typography>
      </Box>

      <Box
        sx={{
          borderBottom: "2px dashed #bdbdbd",
          my: 2,
        }}
      />

      <Typography
        variant="subtitle1"
        sx={{
          fontFamily: "'Courier New', monospace",
          color: "#455a64",
        }}
      >
        Ticket Nº {ticket.id}
      </Typography>

      <Typography
        sx={{
          color: "#78909c",
          fontSize: "0.9rem",
          mb: 2,
        }}
      >
        {ticket.date.toLocaleTimeString("es-UY", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </Typography>

      <Box
        sx={{
          borderBottom: "2px dashed #bdbdbd",
          my: 2,
        }}
      />

      {ticket.items.map((item) => (
        <Box
          key={item.id}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Courier New', monospace",
              fontWeight: 700,
              fontSize: "0.95rem",
              color: "#37474f",
              letterSpacing: "0.4px",
            }}
          >
            {item.product.toUpperCase()}
          </Typography>

          <Typography
            sx={{
              fontFamily: "'Courier New', monospace",
              fontWeight: 700,
              color: "#1b5e20",
              fontSize: "1rem",
            }}
          >
            ${item.price}
          </Typography>
        </Box>
      ))}

      <Box
        sx={{
          mt: 3,
          mb: 2,
          padding: 2,
          borderRadius: 2,
          backgroundColor: "#e8f5e9",
          border: "2px solid #2e7d32",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#1b5e20",
          }}
        >
          TOTAL
        </Typography>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "#1b5e20",
          }}
        >
          ${ticket.total}
        </Typography>
      </Box>

      <Box
        sx={{
          borderBottom: "2px dashed #bdbdbd",
          my: 2,
        }}
      />

      <Typography
        align="center"
        sx={{
          color: "#616161",
          fontWeight: 500,
        }}
      >
        😊 Muchas gracias por su compra
      </Typography>

      <Typography
        align="center"
        sx={{
          color: "#9e9e9e",
          fontSize: "0.85rem",
          mt: 1,
        }}
      >
        ¡Los esperamos nuevamente!
      </Typography>
    </Box>
  );
}
