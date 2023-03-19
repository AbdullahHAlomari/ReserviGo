import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { FormEvent, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import Swal from "sweetalert2";
const cookies = new Cookies();

export default function SignIn() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("Submitted!");

    try {
      const res = await axios.post("http://localhost:3000/login", {
        email: email,
        password: password,
      });

      if (res.status == 200) {
        console.log(res);
        cookies.set("ID", res.data.id, {
          path: "/",
        });
        cookies.set("fname", res.data.fname, {
          path: "/",
        });
        cookies.set("ROLE", res.data.role, {
          path: "/",
        });
        cookies.set("Email", res.data.email, {
          path: "/",
        });
        cookies.set("TOKEN", res.data.token, {
          path: "/",
        });

        navigate("/");
      } else {
        alert("Email Already Exists!");
      }
    } catch (err: any) {
      if (err.response.status == 401) {
        Swal.fire("Sorry!", "Wrong Password!", "error");
      } else {
        Swal.fire("Sorry!", "No User with this Email!", "error");
      }
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
            <Heading fontSize={"4xl"}>Sign in to your account</Heading>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <FormControl id="email">
                  <FormLabel>Email address</FormLabel>
                  <Input
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>
                <FormControl id="password" isRequired>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? "text" : "password"}
                      onChange={(e) => setPassword(e.target.value)}
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
                <Stack spacing={10}>
                  <Stack
                    direction={{ base: "column", sm: "row" }}
                    align={"start"}
                    justify={"space-between"}
                  >
                    <label>Don't have an account?</label>
                    <Link color={"blue.400"} href={"/signup"}>
                      Signup?
                    </Link>
                  </Stack>
                  <Button
                    bg={"blue.400"}
                    color={"white"}
                    _hover={{
                      bg: "blue.500",
                    }}
                    type="submit"
                  >
                    Sign in
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
