import {
  Drawer,
  Box,
  Typography,
  IconButton,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import Ticket from "./Ticket";
import { SaleTicket } from "../models/SaleTicket";

interface TicketDrawerProps {
  open: boolean;
  ticket: SaleTicket;
  onClose: () => void;
}

export default function TicketDrawer({
  open,
  ticket,
  onClose,
}: TicketDrawerProps) {

  return (

    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
    >

      <Box
        sx={{
          width: 420,
          maxWidth: "95vw",
          padding: 2,
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb:2,
          }}
        >

          <Typography
            variant="h6"
            fontWeight="bold"
          >
            Ticket
          </Typography>

          <IconButton
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>

        </Box>

        <Ticket ticket={ticket}/>

      </Box>

    </Drawer>

  );

}