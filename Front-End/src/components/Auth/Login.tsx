import React, { useState } from "react";
import { Box, Center } from "@chakra-ui/react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <Center>
      <Box bg="tomato" w="100%" p={4} color="white">
        This is the Box
      </Box>
    </Center>
  );
}

export default Login;
