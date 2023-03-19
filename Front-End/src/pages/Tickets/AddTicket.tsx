import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  Textarea,
  InputLeftAddon,
} from "@chakra-ui/react";
import { FormEvent, useEffect, useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export default function AddTicket() {
  const navigate = useNavigate();
  const token = cookies.get("TOKEN");
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [endDate, setEndDate] = useState("");
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const difference = new Date(endDate).getTime() - new Date().getTime();
      if (difference <= 0) {
        clearInterval(interval);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setDays(days);
        setHours(hours);
        setMinutes(minutes);
        setSeconds(seconds);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("Submitted!");

    const res = await axios.post(
      "http://localhost:3000/ticket",
      {
        image: image,
        event: title,
        availableQty: quantity,
        location: location,
        description: description,
        price: price,
        endDate: new Date(endDate),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(res);
    if (res.status == 200) {
      navigate("/tickets");
    } else {
      alert("Something went wrong");
    }
  };
  return (
    <>
      <Navbar />
      <Flex
        bgColor={"#eee"}
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack
          textAlign={"center"}
          spacing={8}
          mx={"auto"}
          maxW={"60%"}
          py={12}
          px={6}
          width={"50%"}
        >
          <Stack align={""}>
            <Heading fontSize={"4xl"}>Add a Ticket</Heading>
            <Text fontSize={"lg"} color={"gray.600"}>
              Fill in the details of your ticket below.
            </Text>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <FormControl id="title">
                  <FormLabel>Title</FormLabel>
                  <Input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </FormControl>
                <FormControl id="image">
                  <FormLabel>Image URL</FormLabel>
                  <Input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    required
                  />
                </FormControl>
                <FormControl id="quantity">
                  <FormLabel>Quantity</FormLabel>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </FormControl>
                <FormControl id="location">
                  <FormLabel>Location</FormLabel>
                  <Input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </FormControl>
                <FormControl id="description">
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </FormControl>
                <FormControl id="price">
                  <FormLabel>Price</FormLabel>
                  <InputGroup>
                    <InputLeftAddon children="$" />
                    <Input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </InputGroup>
                </FormControl>
                <FormControl id="endDate">
                  <FormLabel>End Date</FormLabel>
                  <Input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </FormControl>
                <FormControl id="countdown" isReadOnly>
                  <FormLabel>Countdown</FormLabel>
                  <HStack>
                    <Box borderWidth="1px" borderRadius="lg" p="2">
                      <Text fontSize="2xl">{days}</Text>
                      <Text>Days</Text>
                    </Box>
                    <Box borderWidth="1px" borderRadius="lg" p="2">
                      <Text fontSize="2xl">{hours}</Text>
                      <Text>Hours</Text>
                    </Box>
                    <Box borderWidth="1px" borderRadius="lg" p="2">
                      <Text fontSize="2xl">{minutes}</Text>
                      <Text>Minutes</Text>
                    </Box>
                    <Box borderWidth="1px" borderRadius="lg" p="2">
                      <Text fontSize="2xl">{seconds}</Text>
                      <Text>Seconds</Text>
                    </Box>
                  </HStack>
                </FormControl>
                <Stack spacing={10}>
                  <Button
                    type="submit"
                    bg={"blue.400"}
                    color={"white"}
                    _hover={{
                      bg: "blue.500",
                    }}
                  >
                    Add Ticket
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Box>
        </Stack>
      </Flex>
    </>
  );
}
