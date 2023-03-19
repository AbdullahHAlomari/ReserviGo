import React,{useState,useEffect} from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Center,
  Container,
  Wrap,
  WrapItem,
  Text,
  Image,
  VStack,
  SimpleGrid,
  Heading,
  Spacer,
  Stack,
  HStack,
} from "@chakra-ui/react";
import axios from "axios";
// icons from mui icon 
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';

interface HighlightType {
  icon: string;
  title: string;
  description: string;
}

const highlights: HighlightType[] = [
  {
    icon: "✨",
    title: "Simple design",
    description:"We designed our system in a way that makes it easy for users to interact with it"
      // "We are No-Code friendly. There is no coding required to get started. Launchman connects with Airtable and lets you generate a new page per row. It's just that easy!",
  },
  {
    icon: "🎉",
    title: "Beautiful events",
    description:
      "Make a good impression for events with attractive event designs and ticket details",
  },
  {
    icon: "😃",
    title: "Keep customers happy",
    description:
      "With simple and easy steps, the user can complete all operations",
  },
  {
    icon: "🚶🚶🚶🚶🚶🚶🚶",
    title: "No time to wait",
    description:"There is no need to wait for hours to book a ticket We will contact you when your ticket becomes available"
      // "You don't have to wait hours to update your hard-coded landing pages. Figure out what resonates with your customers the most and update the copy in seconds",
  },
];
const IMAGE =
'https://images.unsplash.com/photo-1518051870910-a46e30d9db16?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80';


  
function AboutUS() {
  // start api
  const api = "https://63e228b7109336b6cb00e695.mockapi.io/personal/-444"
const [data,setData] = useState<any>([]);
  useEffect(()=>{
    axios.get(api).then(res=>{console.log(res.data.data)
      setData(res.data.data)
      })
    },[])
  return (
    <div>
        
      <Box bg={"#edf3f8"}>
         <Box bg="#ffffff" w={"100%"} textAlign="center" pt="10">
            <Heading as={"h2"} pb={"5"} bg="#ffffff" >Why Us?</Heading>
            <Text >
              We offer you a ticketing system that saves visitors time in
              booking events With an easy and attractive user experience
            </Text>
            </Box>
          <Container maxW="container.lg" centerContent py={[8, 28]} >
          
            
            
          <SimpleGrid bg={"#edf3f8"}
           columns={{base:1,sm:2 }} spacingX={{base:0,sm:2,md:4,lg:6}} spacingY={{base:5,sm:7,md:10}} mt="20" mb={"20"}  >
            {highlights.map(({ title, description, icon }, i: number) => (
              <Box p={4} rounded="md" key={`highlight_${i}`}  >
                <Text fontSize="4xl">{icon}</Text>

                <Text fontWeight={500}>{title}</Text>

                <Text color="gray.500" mt={4} textAlign={"justify"}  >
                  {description}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
          
            {/* start team section */}
            <Box w={"200%"} bg="#ffffff" p="10" >
              <Heading textAlign={"center"}  h="50px">
                Our Teams
              </Heading ></Box>
              
            
            
          <SimpleGrid columns={{sm:1,md:2,lg:3}} spacingX={{base:2,sm:4,md:4,lg:6}} spacingY={{base:5,sm:7,md:10}} mt="20"   >
            {data.map((item:any)=>
      <Box
      bg={"gray.200"}
        role={'group'}
        p={6}
        maxW={'330px'}
        w={'full'}
        boxShadow={'md'}
        rounded={'md'}
        pos={'relative'}
        zIndex={1}>
          
        <Box
          rounded={'md'}
          mt={-4}
          pos={'relative'}
          height={'230px'}
          _after={{
            transition: 'all .3s ease',
            content: '""',
            w: '290px',
            h: 'full',
            pos: 'absolute',
            top: 1,
            left: -5,
            backgroundImage: `url(${item.image})`,
            filter: 'blur(10px)',
            zIndex: -1,
          }}
          _groupHover={{
            _after: {
              filter: 'blur(15px)',
            },
          }}>
          <Image
            rounded={'lg'}
            height={230}
            width={282}
            objectFit={'cover'}
            src={item.image}
          />
        </Box>
        <Stack  pt={4} align={'center'} spacing="1">
          <Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
          </Text>
          <Heading fontSize={'22'} fontFamily={'body'} fontWeight={500} >
            {item.name}
          </Heading>
          <Stack direction={'column'} align={'center'}>
          <Text  color={'gray.600'} fontSize={"15"} noOfLines={3} title={item.about}>
            {item.about}
            </Text>
            <Text fontWeight={800} fontSize={'xl'}>
              {item.price}
            </Text>
            
            <HStack spacing={"5"}  >
              
              <Link to={`mailto:${item.email}`} ><EmailIcon  /></Link>  
              
              <Link to={`${item.github}`}><GitHubIcon/></Link>
            </HStack>
            
          </Stack>
        </Stack>
      </Box> )}
      </SimpleGrid>
     

        </Container>
      </Box>
    </div>
    
  );
}

export default AboutUS;
