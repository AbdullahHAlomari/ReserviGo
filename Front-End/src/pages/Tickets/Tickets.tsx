import axios from "axios";
import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import useSWR from "swr";
import { Box, SimpleGrid, SimpleGridProps } from "@chakra-ui/react";
import { Children, isValidElement, useMemo } from "react";
import { TicketsGrid } from "../../components/Tickets/TicketsGrid";
import { Ticket, TicketCard } from "../../components/Tickets/TicketCard";

function Tickets(props: SimpleGridProps) {
  const columns = useMemo(() => {
    const count = Children.toArray(props.children).filter(
      isValidElement
    ).length;
    return {
      base: Math.min(2, count),
      md: Math.min(3, count),
      lg: Math.min(4, count),
      xl: Math.min(5, count),
    };
  }, [props.children]);

  const fetcher = async () => {
    const res = await axios.get("http://localhost:3000/tickets");
    return res.data;
  };

  const { data, isLoading } = useSWR("tickets", fetcher);

  return (
    <>
      <Navbar />

      <Box
        maxW="7xl"
        mx="auto"
        px={{ base: "4", md: "8", lg: "12" }}
        py={{ base: "6", md: "8", lg: "12" }}
      >
        {isLoading && <h1>Loading....</h1>}
        {!isLoading && !data && <h1>No Tickets Yet...!</h1>}
        <TicketsGrid>
          {data &&
            data.map((ticket: any) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
        </TicketsGrid>
      </Box>
    </>
  );
}

export default Tickets;
