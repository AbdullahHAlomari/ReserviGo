import {
  Container,
  SimpleGrid,
  Image,
  Flex,
  Heading,
  Text,
  Stack,
  StackDivider,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  IoAnalyticsSharp,
  IoLogoBitcoin,
  IoSearchSharp,
} from "react-icons/io5";
import { ReactElement } from "react";

interface FeatureProps {
  text: string;
  iconBg: string;
  icon?: ReactElement;
}

const Feature = ({ text, icon, iconBg }: FeatureProps) => {
  return (
    <Stack direction={"row"} align={"center"}>
      <Flex
        w={8}
        h={8}
        align={"center"}
        justify={"center"}
        rounded={"full"}
        bg={iconBg}
      >
        {icon}
      </Flex>
      <Text fontWeight={600}>{text}</Text>
    </Stack>
  );
};

export default function Who() {
  return (
    <Container maxW={"7xl"} py={12}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        <Stack spacing={4}>
          {/* <Text
            textTransform={"uppercase"}
            color={"#000"}
            fontWeight={600}
            fontSize={"2xl"}
            // bgGradient="linear(to-l, #7928CA, #FF0080)"
            p={2}
            alignSelf={"flex-start"}
            rounded={"md"}
          >
            Built for managers
          </Text> */}
          <Heading>Built for management</Heading>
          <Text color={"gray.500"} fontSize={"lg"}>
            We start with the event management experience. Our non-queue system
            will help the Event managers. The platform provides a complete,
            easy-to-use reservation management system that is flexible and
            customizable to meet any event's needs. Our system is highly
            available and can handle high traffic loads with industry-leading
            low-latency response times, ensuring a seamless experience for
            ticket puchase.
          </Text>
          <Stack
            spacing={4}
            divider={
              <StackDivider
                borderColor={useColorModeValue("gray.100", "gray.700")}
              />
            }
          >
            <Feature
              icon={
                <Icon as={IoAnalyticsSharp} color={"yellow.500"} w={5} h={5} />
              }
              iconBg={useColorModeValue("yellow.100", "yellow.900")}
              text={"System management"}
            />
            <Feature
              icon={
                <Icon as={IoSearchSharp} color={"purple.500"} w={5} h={5} />
              }
              iconBg={useColorModeValue("purple.100", "purple.900")}
              text={"Find Solution"}
            />
          </Stack>
        </Stack>
        <Flex>
          <Image
            rounded={"md"}
            alt={"feature image"}
            src={
              "https://o.remove.bg/downloads/3a853dbc-87b6-4cc4-b974-6655c1c540cc/10798281_19362653-removebg-preview.png"
            }
            objectFit={"cover"}
          />
        </Flex>
      </SimpleGrid>
    </Container>
  );
}
