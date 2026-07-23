import Ticket from "../components/Ticket";

export default function SaleTicket() {

  const ticket = {
    id: 1,
    date: new Date(),
    items: [],
    total: 350,
  };

  return (
    <Ticket ticket={ticket} />
  );
}