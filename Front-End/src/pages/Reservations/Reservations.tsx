import axios from "axios";
import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import useSWR, { useSWRConfig } from "swr";
import {
  SimpleGrid,
  Stack,
  Flex,
  chakra,
  Box,
  ButtonGroup,
  IconButton,
  HStack,
  Image,
  Text,
} from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/color-mode";
import { DeleteIcon } from "@chakra-ui/icons";
import { Ticket } from "../../components/Tickets/TicketCard";
import moment from "moment";
import Swal from "sweetalert2";
import Cookies from "universal-cookie";
const cookies = new Cookies();

function Reservations() {
  const { mutate } = useSWRConfig();
  const role = cookies.get("ROLE");
  const token = cookies.get("TOKEN");
  const userID = cookies.get("ID");

  const bg = useColorModeValue("white", "gray.800");
  const bg2 = useColorModeValue("white", "gray.800");
  const bg3 = useColorModeValue("gray.100", "gray.700");

  const fetcher = async () => {
    let res;
    if (role == "admin") {
      res = await axios.get("http://localhost:3000/getAllReservations");
    } else {
      res = await axios.get(
        `http://localhost:3000/getUserReservations/${userID}`
      );
    }
    return res.data;
  };

  const { data, isLoading } = useSWR("reservations", fetcher);

  const deleteReservation = async (id: string) => {
    try {
      const res = await axios.delete(
        `http://localhost:3000/deletereservation/${id}`
      );
      if (res.status == 200) {
        Swal.fire(
          "You have Successfully deleted this reservation!",
          "",
          "success"
        );
      } else {
        Swal.fire("Error!", "Something went wrong!", "error");
      }
      mutate("reservations");
    } catch (err: any) {
      console.log(err);
      Swal.fire("Error!", err.message, "error");
    }
  };
  return (
    <>
      <Navbar />
      <Stack bg="#fff" minHeight="90vh" py={10}>
        {!isLoading && data && data.length === 0 && (
          <Text fontSize="2xl" textAlign="center">
            You don't have any reservations yet.
          </Text>
        )}
        {data && data.length > 0 && (
          <Flex justifyContent="center" alignItems="center" px={5}>
            <Stack
              direction={{ base: "column" }}
              w="full"
              bg={{ md: "#edf3f8" }}
              shadow="lg"
              borderRadius={10}
              overflow="hidden"
            >
              {data.map((reservation) => (
                <Flex
                  key={reservation.id}
                  direction={{ base: "column", md: "row" }}
                  alignItems="center"
                  justifyContent="space-between"
                  bg="#edf3f8"
                  px={5}
                  py={3}
                  mb={3}
                >
                  <Box
                    w={{ base: "full", md: "20%" }}
                    h={{ base: "auto", md: "120px" }}
                    mr={{ base: 0, md: 5 }}
                  >
                    <Image
                      borderRadius="10px"
                      boxSize="full"
                      objectFit="cover"
                      src={reservation.ticket.image}
                      alt={`Event poster for ${reservation.ticket.event}`}
                    />
                  </Box>
                  <Box w={{ base: "full", md: "80%" }}>
                    <Text fontWeight="bold" mb={2}>
                      {reservation.ticket.event}
                    </Text>
                    <Flex alignItems="center" mb={2}>
                      <Box>
                        <Text fontWeight="bold">
                          {reservation.user.firstname}{" "}
                          {reservation.user.lastname}
                        </Text>
                        <Text fontSize="sm">{reservation.user.email}</Text>
                      </Box>
                    </Flex>
                    <Flex justifyContent={{ md: "space-between" }}>
                      <Text>
                        Reserved on{" "}
                        {moment(reservation.reservedAt).format("MMM Do YY")}
                      </Text>
                      <IconButton
                        colorScheme="red"
                        variant="outline"
                        size="sm"
                        aria-label="Delete reservation"
                        icon={<DeleteIcon />}
                        onClick={() => deleteReservation(reservation.id)}
                      />
                    </Flex>
                  </Box>
                </Flex>
              ))}
            </Stack>
          </Flex>
        )}
      </Stack>
    </>
  );
}

export default Reservations;
