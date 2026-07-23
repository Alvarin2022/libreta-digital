import { Modal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import Ticket from "./Ticket";
import { SaleTicket } from "../models/SaleTicket";

interface TicketModalProps {
  open: boolean;
  ticket: SaleTicket;
  onClose: () => void;
}

export default function TicketModal({
  open,
  ticket,
  onClose,
}: TicketModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          outline: "none",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: -10,
            right: -10,
            backgroundColor: "#fff",
            boxShadow: 2,
            zIndex: 2,
          }}
        >
          <CloseIcon />
        </IconButton>

        <Ticket ticket={ticket} />
      </Box>
    </Modal>
  );
}
