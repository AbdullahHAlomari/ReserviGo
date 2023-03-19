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
} from "@chakra-ui/react";
import { FormEvent, useEffect, useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useSWR, { useSWRConfig } from "swr";
import Swal from "sweetalert2";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export default function Profile() {
  const navigate = useNavigate();

  const role = cookies.get("ROLE");
  const token = cookies.get("TOKEN");
  const userID = cookies.get("ID");

  console.log(userID);
  const fetcher = async () => {
    const res = await axios.get(`http://localhost:3000/user/${userID}`);
    return res.data;
  };
  const { data: user, isLoading } = useSWR("user", fetcher);

  const [showPassword, setShowPassword] = useState(false);
  console.log(user);

  const [fName, setfName] = useState("");
  const [lName, setlName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  useEffect(() => {
    const getUserData = async () => {
      const res = await axios.get(`http://localhost:3000/user/${userID}`);
      setfName(res.data.firstname);
      setlName(res.data.lastname);
      setEmail(res.data.email);
      setPassword(res.data.password);
    };
    getUserData();
  }, []);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("Submitted!");
    try {
      const res = await axios.patch(
        `http://localhost:3000/updateUser/${userID}`,
        {
          email: email,
          firstname: fName,
          lastname: lName,
          password: password,
          newPassword: newPassword,
        }
      );
      if (res.status == 200) {
        Swal.fire(
          "Good job!",
          "You have Successfully Update your Info",
          "success"
        );
      }
    } catch (err) {
      Swal.fire("Sorry!", "An error happend!", "error");
    }
  };
  return (
    <>
      <Navbar />
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"} textAlign={"center"}>
              Update Your account
            </Heading>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <HStack>
                  <Box>
                    <FormControl id="firstName" isRequired>
                      <FormLabel>First Name</FormLabel>
                      <Input
                        type="text"
                        onChange={(e) => setfName(e.target.value)}
                        value={fName}
                      />
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl id="lastName">
                      <FormLabel>Last Name</FormLabel>
                      <Input
                        type="text"
                        onChange={(e) => setlName(e.target.value)}
                        value={lName}
                      />
                    </FormControl>
                  </Box>
                </HStack>
                <FormControl id="email" isRequired>
                  <FormLabel>Email address</FormLabel>
                  <Input
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </FormControl>
                <FormControl id="password">
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? "text" : "password"}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <InputRightElement h={"full"}>
                      <Button
                        variant={"ghost"}
                        onClick={() =>
                          setShowPassword((showPassword) => !showPassword)
                        }
                      >
                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <Stack spacing={10} pt={2}>
                  <Button
                    loadingText="Submitting"
                    size="lg"
                    bg={"blue.400"}
                    color={"white"}
                    _hover={{
                      bg: "blue.500",
                    }}
                    type="submit"
                  >
                    Update Account
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
