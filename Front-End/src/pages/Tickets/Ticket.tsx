import {
  Box,
  chakra,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  VStack,
  Button,
  Heading,
  SimpleGrid,
  StackDivider,
  useColorModeValue,
  VisuallyHidden,
  List,
  ListItem,
} from "@chakra-ui/react";
import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { MdLocalShipping } from "react-icons/md";
import Navbar from "../../components/Navbar/Navbar";
import useSWR, { useSWRConfig } from "swr";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "universal-cookie";
import Swal from "sweetalert2";
import { useCountdown } from "../../hooks/useCountdown";
const cookies = new Cookies();

export default function Ticket() {
  const navigate = useNavigate();
  const email = cookies.get("Email");
  const token = cookies.get("TOKEN");
  const { id } = useParams();
  const fetcher = async () => {
    const res = await axios.get(`http://localhost:3000/ticket/${id}`);
    return res.data;
  };
  const { data: ticket, isLoading } = useSWR("ticket", fetcher);
  const [days, hours, minutes, seconds] = useCountdown(ticket?.endDate);
  const handleReservation = async (id: string) => {
    if (!token) {
      navigate("/signin");
      return;
    }
    if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
      Swal.fire("Closed!", "Reservation is closed for this event.", "error");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:3000/reserve",
        {
          ticketId: id,
          email: email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res);
      if (res.status == 201) {
        Swal.fire(
          "Great!",
          "You have Successfully reserved this event!",
          "success"
        );
      } else {
        Swal.fire("Error!", "Something went wrong!", "error");
      }
    } catch (err) {
      Swal.fire("Sorry!", "You have Already reserved this ticket!", "error");
    }
  };

  const isClosed = days === 0 && hours === 0 && minutes === 0 && seconds === 0;
  return (
    <>
      <Navbar />
      <Container maxW={"7xl"}>
        {isLoading && <h1>Loading....</h1>}
        {ticket && (
          <>
            <Stack
              spacing={{ base: 6, md: 10 }}
              direction={"row"}
              justify={"center"}
              align={"center"}
              color={"grey"}
              py={2}
              my={{ base: 18, md: 24 }}
            >
              <Flex direction={"column"} align="center" fontSize={"xl"}>
                <Text>{days}</Text>
                <Text fontWeight={"bold"}>Days</Text>
              </Flex>
              <Text fontSize={"xl"} fontWeight={"bold"}>
                :
              </Text>
              <Flex direction={"column"} align="center" fontSize={"xl"}>
                <Text>{hours}</Text>
                <Text fontWeight={"bold"}>Hours</Text>
              </Flex>
              <Text fontSize={"xl"} fontWeight={"bold"}>
                :
              </Text>
              <Flex direction={"column"} align="center" fontSize={"xl"}>
                <Text>{minutes}</Text>
                <Text fontWeight={"bold"}>Minutes</Text>
              </Flex>
              <Text fontSize={"xl"} fontWeight={"bold"}>
                :
              </Text>
              <Flex direction={"column"} align="center" fontSize={"xl"}>
                <Text>{seconds}</Text>
                <Text fontWeight={"bold"}>Seconds</Text>
              </Flex>
            </Stack>
            <SimpleGrid
              columns={{ base: 1, lg: 2 }}
              spacing={{ base: 8, md: 10 }}
            >
              <Flex>
                <Image
                  rounded={"md"}
                  alt={"Event image"}
                  src={ticket.image}
                  fit={"cover"}
                  align={"center"}
                  w={"100%"}
                  h={{ base: "100%", sm: "400px", lg: "500px" }}
                />
              </Flex>
              <Stack spacing={{ base: 6, md: 10 }}>
                <Box as={"header"}>
                  <Heading
                    lineHeight={1.1}
                    fontWeight={600}
                    fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
                  >
                    {ticket.event}
                  </Heading>
                </Box>

                <Stack
                  spacing={{ base: 4, sm: 6 }}
                  direction={"column"}
                  divider={
                    <StackDivider
                      borderColor={useColorModeValue("gray.200", "gray.600")}
                    />
                  }
                >
                  <VStack spacing={{ base: 4, sm: 6 }}>
                    <Text
                      color={useColorModeValue("gray.500", "gray.400")}
                      fontSize={"2xl"}
                      fontWeight={"300"}
                    >
                      {ticket.description}
                    </Text>
                  </VStack>
                  <Box>
                    <Text
                      fontSize={{ base: "16px", lg: "18px" }}
                      color={useColorModeValue("yellow.500", "yellow.300")}
                      fontWeight={"500"}
                      textTransform={"uppercase"}
                      mb={"4"}
                    >
                      Event Details
                    </Text>

                    <List spacing={2}>
                      <ListItem>
                        <Text as={"span"} fontWeight={"bold"}>
                          Avilable Tickets:
                        </Text>{" "}
                        {ticket.availableQty}
                      </ListItem>
                      <ListItem>
                        <Text as={"span"} fontWeight={"bold"}>
                          Location:
                        </Text>{" "}
                        {ticket.location}
                      </ListItem>
                      <ListItem>
                        <Text as={"span"} fontWeight={"bold"}>
                          Price:
                        </Text>{" "}
                        {ticket.price} SAR
                      </ListItem>
                    </List>
                  </Box>
                </Stack>
                <Button
                  rounded={"none"}
                  w={"full"}
                  mt={8}
                  size={"lg"}
                  py={"7"}
                  bgColor={"#3E54AC"}
                  color={useColorModeValue("white", "gray.900")}
                  textTransform={"uppercase"}
                  _hover={{
                    transform: "translateY(2px)",
                    boxShadow: "lg",
                  }}
                  onClick={() => handleReservation(ticket.id)}
                >
                  Book This Event
                </Button>
              </Stack>
            </SimpleGrid>
          </>
        )}
      </Container>
    </>
  );
}
