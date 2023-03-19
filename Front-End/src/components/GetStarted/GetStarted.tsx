import {
  Box,
  Button,
  chakra,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from "@chakra-ui/react";

interface StatsCardProps {
  title: string;
  stat: string;
}
function StatsCard(props: StatsCardProps) {
  const { title, stat } = props;
  return (
    <Stat
      px={{ base: 4, md: 8 }}
      py={"5"}
      shadow={"xl"}
      border={"1px solid"}
      borderColor={useColorModeValue("gray.800", "gray.500")}
      rounded={"lg"}
    >
      <StatLabel fontWeight={"medium"} isTruncated>
        {title}
      </StatLabel>
      <StatNumber fontSize={"2xl"} fontWeight={"medium"}>
        {stat}
      </StatNumber>
    </Stat>
  );
}

export default function BasicStatistics() {
  return (
    <Box maxW="7xl" mx={"auto"} p={12} px={{ base: 2, sm: 12, md: 17 }}>
      <SimpleGrid spacing={{ base: 5, lg: 8 }}>
        <Stat
          px={{ base: 4, md: "7rem" }}
          py={"5rem"}
          shadow={"xl"}
          border={"1px none"}
          borderColor={useColorModeValue("gray.800", "gray.500")}
          bgGradient="linear(to-l, #8EC5FC, #E0C3FC )"
          rounded={"lg"}
          color="white"
          textAlign={"center"}
        >
          <StatNumber fontSize={"3xl"} w="100%" fontWeight={"medium"}>
            Try ReserviGo for free and revolutionize your ticket sales with our
            innovative reservation management system. Say goodbye to virtual
            queues and provide a seamless experience for your attendees.
          </StatNumber>
          <Button
            rounded={"full"}
            size={"lg"}
            fontWeight={"normal"}
            p={8}
            colorScheme={"red"}
            bg={"purple.400"}
            _hover={{ bg: "purple.500" }}
            as="a"
            href="/tickets"
            mt="10"
          >
            Get started
          </Button>
        </Stat>
      </SimpleGrid>
    </Box>
  );
}
